/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Author, Connection, Legend } from '../types';

interface AuthorLegendLink {
  authorId: string;
  legendId: string;
  description: string;
}

interface NetworkGraphProps {
  authors: Author[];
  connections: Connection[];
  legends?: Legend[];
  authorLegendLinks?: AuthorLegendLink[];
  onAuthorSelect: (author: Author) => void;
  onSearchThemes?: (term: string) => void;
  selectedAuthorId?: string;
}

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'author' | 'motive' | 'legend';
  authorData?: Author;
  legendData?: Legend;
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  type: string;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  authors, 
  connections, 
  legends = [],
  authorLegendLinks = [],
  onAuthorSelect,
  onSearchThemes,
  selectedAuthorId 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Tooltip element
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .attr('class', 'absolute hidden z-50 bg-editorial-ink text-editorial-bg p-3 border border-editorial-ink shadow-[4px_4px_0px_rgba(0,0,0,0.1)] pointer-events-none max-w-[240px] font-sans')
      .style('font-size', '10px')
      .style('line-height', '1.4');

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // --- DATA PREPARATION ---
    const nodes: NetworkNode[] = [];
    const links: NetworkLink[] = [];

    // Add Author Nodes
    authors.forEach(author => {
      nodes.push({
        id: author.id,
        name: author.name,
        type: 'author',
        authorData: author
      });
    });

    // Extract Motives and create Motive Nodes
    const uniqueMotives = Array.from(new Set(authors.flatMap(a => a.motives))) as string[];
    uniqueMotives.forEach(motive => {
      nodes.push({
        id: `motive-${motive.toLowerCase().replace(/\s+/g, '-')}`,
        name: motive,
        type: 'motive'
      });
    });

    // Add Legend Nodes
    legends.forEach(legend => {
      nodes.push({
        id: legend.id,
        name: legend.name,
        type: 'legend',
        legendData: legend
      });
    });

    // Author-to-Author Links
    connections.forEach(conn => {
      const source = nodes.find(n => n.id === conn.source);
      const target = nodes.find(n => n.id === conn.target);
      if (source && target) {
        links.push({
          source,
          target,
          type: conn.type
        });
      }
    });

    // Author-to-Legend Links
    authorLegendLinks.forEach(link => {
      const authorNode = nodes.find(n => n.id === link.authorId);
      const legendNode = nodes.find(n => n.id === link.legendId);
      if (authorNode && legendNode) {
        links.push({
          source: authorNode,
          target: legendNode,
          type: 'author-legend'
        });
      }
    });

    // Author-to-Motive Links
    authors.forEach(author => {
      const authorNode = nodes.find(n => n.id === author.id);
      author.motives.forEach(motive => {
        const motiveNode = nodes.find(n => n.name === motive);
        if (authorNode && motiveNode) {
          links.push({
            source: authorNode,
            target: motiveNode,
            type: 'author-motive'
          });
        }
      });
    });

    const simulation = d3.forceSimulation<NetworkNode>(nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(links).id(d => d.id).distance(d => {
        if (d.type === 'author-motive') return 100;
        if (d.type === 'author-legend') return 150;
        return 200;
      }))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<NetworkNode>().radius(x => {
        if (x.type === 'author') return 60;
        if (x.type === 'legend') return 50;
        return 30;
      }));

    // Identify connected nodes
    const connectedNodeIds = new Set<string>();
    if (selectedAuthorId) {
      links.forEach(l => {
        const sId = (l.source as NetworkNode).id;
        const tId = (l.target as NetworkNode).id;
        if (sId === selectedAuthorId) connectedNodeIds.add(tId);
        if (tId === selectedAuthorId) connectedNodeIds.add(sId);
      });
    }

    // Links
    const link = g.append('g')
      .selectAll<SVGLineElement, NetworkLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        if (d.type === 'author-motive') return '#e2e8f0';
        if (d.type === 'author-legend') return '#059669'; // Emerald 600
        if (!selectedAuthorId) return '#1A1A1A';
        const isConnected = (d.source as NetworkNode).id === selectedAuthorId || (d.target as NetworkNode).id === selectedAuthorId;
        return isConnected ? '#E84E36' : '#e2e8f0';
      })
      .attr('stroke-opacity', d => {
        if (d.type === 'author-motive') return 0.2;
        if (d.type === 'author-legend') return 0.6;
        if (!selectedAuthorId) return 0.4;
        const isConnected = (d.source as NetworkNode).id === selectedAuthorId || (d.target as NetworkNode).id === selectedAuthorId;
        return isConnected ? 1 : 0.1;
      })
      .attr('stroke-width', d => {
        if (d.type === 'author-motive') return 0.5;
        if (d.type === 'author-legend') return 2;
        const baseWidth = d.type === 'influence' ? 2 : 1;
        const isConnected = selectedAuthorId && ((d.source as NetworkNode).id === selectedAuthorId || (d.target as NetworkNode).id === selectedAuthorId);
        return isConnected ? baseWidth + 1 : baseWidth;
      })
      .attr('stroke-dasharray', d => d.type === 'theme' || d.type === 'author-motive' ? '4,4' : 'none')
      .attr('class', 'cursor-help pointer-events-auto')
      .on('mouseenter', (event, d) => {
        if (d.type === 'author-motive') return;
        
        let header = '';
        let content = '';

        if (d.type === 'author-legend') {
          const authorNode = d.source as NetworkNode;
          const legendNode = d.target as NetworkNode;
          const link = authorLegendLinks.find(l => l.authorId === authorNode.id && l.legendId === legendNode.id);
          header = `Veza: ${authorNode.name} ↔ ${legendNode.name}`;
          content = link?.description || 'Doprinos oblikovanju identiteta kroz legendu.';
        } else {
          const conn = connections.find(c => 
            (c.source === (d.source as NetworkNode).id && c.target === (d.target as NetworkNode).id) ||
            (c.target === (d.source as NetworkNode).id && c.source === (d.target as NetworkNode).id)
          );
          header = `Relacija: ${d.type === 'influence' ? 'Utjecaj' : d.type === 'theme' ? 'Korespondencija' : 'Kolaboracija'}`;
          content = conn?.description || 'Nema dostupnog opisa.';
        }

        tooltip
          .classed('hidden', false)
          .html(`
            <div class="font-black uppercase tracking-widest mb-1 pb-1 border-b border-editorial-bg/20">${header}</div>
            <div class="italic opacity-80">${content}</div>
          `);
        
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', (d.type === 'influence' || d.type === 'author-legend' ? 4 : 2) + 2);
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        tooltip
          .style('left', (mx + 15) + 'px')
          .style('top', (my + 15) + 'px');
      })
      .on('mouseleave', (event, d) => {
        tooltip.classed('hidden', true);
        const isConnected = selectedAuthorId && ((d.source as NetworkNode).id === selectedAuthorId || (d.target as NetworkNode).id === selectedAuthorId);
        const baseWidth = d.type === 'influence' ? 2 : 1;
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr('stroke-opacity', selectedAuthorId ? (isConnected ? 1 : 0.1) : 0.4)
          .attr('stroke-width', isConnected ? baseWidth + 1 : baseWidth);
      });

    // Node groups
    const node = g.append('g')
      .selectAll<SVGGElement, NetworkNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'cursor-pointer')
      .style('opacity', d => {
        if (!selectedAuthorId) return 1;
        return (d.id === selectedAuthorId || connectedNodeIds.has(d.id)) ? 1 : 0.3;
      })
      .on('click', (event, d) => {
        if (d.type === 'author' && d.authorData) {
          onAuthorSelect(d.authorData);
        } else if (d.type === 'motive' && onSearchThemes) {
          onSearchThemes(d.name);
        }
      })
      .on('mouseenter', (event, d) => {
        tooltip
          .classed('hidden', false);
        
        if (d.type === 'author') {
          tooltip.html(`
            <div class="font-black uppercase tracking-widest mb-1 pb-1 border-b border-editorial-bg/20">${d.name}</div>
            <div class="italic opacity-80">${d.authorData?.bio ? (d.authorData.bio.length > 100 ? d.authorData.bio.substring(0, 100) + '...' : d.authorData.bio) : ''}</div>
          `);
        } else if (d.type === 'legend') {
          tooltip.html(`
            <div class="font-black uppercase tracking-widest mb-1 pb-1 border-b border-editorial-bg/20">Legenda: ${d.name}</div>
            <div class="italic opacity-80 font-serif leading-tight mb-2">${d.legendData?.description}</div>
            <div class="border-t border-editorial-bg/20 pt-1 mt-1 font-sans text-[8px] uppercase font-black text-editorial-accent">Utjecaj na identitet:</div>
            <div class="text-[9px] opacity-70 italic">${d.legendData?.identityImpact}</div>
          `);
        } else {
          tooltip.html(`
            <div class="font-black uppercase tracking-widest mb-1 pb-1 border-b border-editorial-bg/20">Motiv: ${d.name}</div>
            <div class="italic opacity-80 font-sans">Kliknite za istraživanje ovog motiva.</div>
          `);
        }
        
        d3.select(event.currentTarget).select('circle, rect, path')
          .transition().duration(200)
          .attr('r', 14)
          .attr('transform', d.type === 'motive' ? 'scale(1.4) rotate(45)' : 'scale(1.2)');

        if (d.type === 'author') {
          d3.select(event.currentTarget).select('.node-actions')
            .transition().duration(200)
            .style('opacity', 1);
        }
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        tooltip
          .style('left', (x + 15) + 'px')
          .style('top', (y + 15) + 'px');
      })
      .on('mouseleave', (event, d) => {
        tooltip.classed('hidden', true);
        d3.select(event.currentTarget).select('circle, rect, path')
          .transition().duration(200)
          .attr('r', d.id === selectedAuthorId ? 10 : 8)
          .attr('transform', d.type === 'motive' ? 'scale(1) rotate(45)' : 'scale(1)');

        if (d.type === 'author' && d.id !== selectedAuthorId) {
          d3.select(event.currentTarget).select('.node-actions')
            .transition().duration(200)
            .style('opacity', 0);
        }
      })
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Shapes
    node.each(function(d) {
      const el = d3.select(this);
      if (d.type === 'author') {
        el.append('circle')
          .attr('r', d.id === selectedAuthorId ? 10 : 8)
          .attr('fill', d.id === selectedAuthorId ? '#E84E36' : (connectedNodeIds.has(d.id) ? '#E84E36' : '#1A1A1A'))
          .attr('stroke', '#F9F7F2')
          .attr('stroke-width', 2);
      } else if (d.type === 'legend') {
        // Hexagon/Diamond for Legends
        el.append('path')
          .attr('d', d3.symbol().type(d3.symbolDiamond).size(150)())
          .attr('fill', '#059669') // Emerald 600
          .attr('stroke', '#1A1A1A')
          .attr('stroke-width', 1.5);
      } else {
        el.append('rect')
          .attr('width', 8)
          .attr('height', 8)
          .attr('x', -4)
          .attr('y', -4)
          .attr('transform', 'rotate(45)')
          .attr('fill', '#fff')
          .attr('stroke', '#1A1A1A')
          .attr('stroke-width', 1);
      }
    });

    // Labels
    node.append('text')
      .text(d => d.name)
      .attr('x', d => {
        if (d.type === 'author') return 14;
        if (d.type === 'legend') return 16;
        return 10;
      })
      .attr('y', 4)
      .attr('class', d => {
        if (d.type === 'author') return 'text-[10px] font-bold font-sans uppercase tracking-tight fill-editorial-ink';
        if (d.type === 'legend') return 'text-[10px] font-black font-sans uppercase tracking-widest fill-[#059669] italic';
        return 'text-[9px] font-sans italic opacity-40 fill-editorial-ink';
      })
      .style('pointer-events', 'none');

    // Action Buttons Container (only for authors)
    const authorNodes = node.filter(d => d.type === 'author');
    const buttons = authorNodes.append('g')
      .attr('class', 'node-actions')
      .style('opacity', d => d.id === selectedAuthorId ? 1 : 0);

    // Bio Button
    buttons.append('circle')
      .attr('cx', 14)
      .attr('cy', 14)
      .attr('r', 6)
      .attr('fill', '#1A1A1A')
      .attr('class', 'hover:fill-editorial-accent transition-colors')
      .on('click', (event, d) => {
        event.stopPropagation();
        onAuthorSelect(d.authorData!);
      });

    buttons.append('text')
      .text('i')
      .attr('x', 14)
      .attr('y', 17)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-white text-[8px] font-black pointer-events-none');

    // Search Button
    buttons.append('circle')
      .attr('cx', 28)
      .attr('cy', 14)
      .attr('r', 6)
      .attr('fill', '#1A1A1A')
      .attr('class', 'hover:fill-editorial-accent transition-colors')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onSearchThemes) onSearchThemes(d.name);
      });

    buttons.append('text')
      .text('s')
      .attr('x', 28)
      .attr('y', 17)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-white text-[8px] font-black pointer-events-none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as NetworkNode).x!)
        .attr('y1', d => (d.source as NetworkNode).y!)
        .attr('x2', d => (d.target as NetworkNode).x!)
        .attr('y2', d => (d.target as NetworkNode).y!);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [authors, connections, selectedAuthorId, onAuthorSelect]);

  return (
    <div ref={containerRef} className="w-full h-full bg-editorial-bg relative overflow-hidden border border-editorial-ink/10 shadow-inner">
      {/* Editorial Grid Accents */}
      <div className="absolute top-0 left-0 w-full h-4 border-b border-editorial-ink/5 flex justify-between px-4 items-center pointer-events-none">
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => <span key={l} className="text-[8px] font-mono opacity-30">{l}</span>)}
      </div>
      <div className="absolute top-0 right-0 w-4 h-full border-l border-editorial-ink/5 flex flex-col justify-between py-8 items-center pointer-events-none">
        {[1, 2, 3, 4, 5, 6].map(n => <span key={n} className="text-[8px] font-mono opacity-30">{n}</span>)}
      </div>
      
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />
      <div className="absolute bottom-6 left-6 bg-white/90 p-4 border border-editorial-ink text-[10px] text-editorial-ink font-sans uppercase tracking-widest backdrop-blur-sm pointer-events-none z-20">
        <p className="font-black mb-3 border-b border-editorial-ink pb-1">Mreža Ogulina</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-4 rounded-full bg-editorial-ink"></div>
          <span>Intelektualni čvor (Autor)</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-4 bg-[#059669] rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <span className="text-[#059669] font-black">Izvorna Legenda</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 border border-editorial-ink bg-white rotate-45"></div>
          <span>Tematski motiv</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-0.5 bg-[#059669]"></div>
          <span className="text-[#059669]">Veza s legendom</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-0.5 border-t border-dashed border-editorial-ink opacity-40"></div>
          <span>Pripadnost tematskom krugu</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
