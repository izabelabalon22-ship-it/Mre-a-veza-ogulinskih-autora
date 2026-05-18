/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Info, 
  Plus, 
  Search, 
  ChevronRight, 
  BookOpen, 
  History, 
  Globe,
  X,
  Sparkles
} from 'lucide-react';
import NetworkGraph from './components/NetworkGraph';
import { 
  AUTHORS as INITIAL_AUTHORS, 
  CONNECTIONS as INITIAL_CONNECTIONS,
  LEGENDS as INITIAL_LEGENDS,
  AUTHOR_LEGEND_LINKS as INITIAL_LEGEND_LINKS
} from './constants';
import { Author, Connection, Legend } from './types';
import { suggestConnections } from './services/geminiService';

export default function App() {
  const [authors, setAuthors] = useState<Author[]>(INITIAL_AUTHORS);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [legends, setLegends] = useState<Legend[]>(INITIAL_LEGENDS);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedLegend, setSelectedLegend] = useState<Legend | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // New author form state
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorMotives, setNewAuthorMotives] = useState('');

  const filteredAuthors = useMemo(() => {
    return authors.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.motives.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [authors, searchTerm]);

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName) return;

    setIsGenerating(true);
    const id = newAuthorName.toLowerCase().replace(/\s+/g, '-');
    const motives = newAuthorMotives.split(',').map(m => m.trim());
    
    const newAuthor: Author = {
      id,
      name: newAuthorName,
      bio: 'Novi autor dodan u mrežu.',
      period: 'Nepoznato',
      roles: ['Autor'],
      motives: motives,
      works: [],
    };

    const suggested = await suggestConnections(newAuthor, authors);
    
    setAuthors([...authors, newAuthor]);
    setConnections([...connections, ...suggested]);
    setIsAddingAuthor(false);
    setIsGenerating(false);
    setNewAuthorName('');
    setNewAuthorMotives('');
    setSelectedAuthor(newAuthor);
  };

  return (
    <div className="flex h-screen bg-editorial-bg text-editorial-ink font-serif overflow-hidden p-6 md:p-10 border-[12px] md:border-[20px] border-editorial-ink">
      {/* Sidebar / Table of Contents */}
      <aside className="w-80 border-r border-editorial-ink flex flex-col z-20 overflow-hidden pr-8">
        <div className="mb-12">
          <p className="text-[10px] font-sans tracking-[0.2em] uppercase mb-4 opacity-60">Zavičajna Istraživanja / Vol. 01</p>
          <h1 className="text-5xl font-black tracking-tighter leading-[0.85] mb-6">
            OGULIN:<br />
            MREŽA<br />
            UTJECAJA
          </h1>
          <p className="text-xs font-sans italic opacity-80 leading-relaxed max-w-[200px]">
            Kartografija intelektualnog zavičajnog identiteta kroz analizu utjecaja i motiva.
          </p>
        </div>

        <div className="mb-8 relative font-sans">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-editorial-ink opacity-40" size={14} />
          <input 
            type="text" 
            placeholder="PRETRAŽI ARHIV..."
            className="w-full pl-6 pr-4 py-2 border-b border-editorial-ink/20 text-[10px] font-bold tracking-widest focus:outline-none focus:border-editorial-ink transition-colors bg-transparent uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pb-8 custom-scrollbar">
          <div className="flex items-center justify-between sticky top-0 bg-editorial-bg py-2 z-10">
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.2em]">01 / Katalog Autora</h2>
            <button 
              onClick={() => setIsAddingAuthor(true)}
              className="p-1 hover:bg-editorial-accent hover:text-white transition-colors border border-editorial-ink"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            {filteredAuthors.map(author => (
              <motion.button
                key={author.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedAuthor(author)}
                className={`w-full group text-left transition-all pb-2 border-b border-transparent hover:border-editorial-ink ${
                  selectedAuthor?.id === author.id ? 'border-editorial-ink' : ''
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[9px] font-sans opacity-40 font-bold">
                    {authors.indexOf(author) + 1 < 10 ? `0${authors.indexOf(author) + 1}` : authors.indexOf(author) + 1}
                  </span>
                  <h3 className={`text-xl font-bold leading-none ${selectedAuthor?.id === author.id ? 'underline underline-offset-4' : 'group-hover:underline group-hover:underline-offset-4'}`}>
                    {author.name}
                  </h3>
                </div>
                <p className="text-[9px] font-sans uppercase tracking-widest mt-1 opacity-50 ml-5 truncate">
                  {author.roles[0]} / {author.period}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Visualization Area */}
      <main className="flex-1 relative flex flex-col ml-8 border border-editorial-ink bg-white overflow-hidden shadow-[8px_8px_0px_#1A1A1A]">
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
          <div className="pointer-events-auto bg-editorial-ink text-editorial-bg px-3 py-1 font-sans text-[10px] font-black uppercase tracking-widest">
            02 / Vizualizacija Mapom
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-1 opacity-40 font-sans text-[9px] font-bold uppercase tracking-tighter text-right">
            <span>Ogulinski Intelektualni Krug</span>
            <span>Relacijska Baza Podataka</span>
          </div>
        </header>

        <div className="flex-1">
          <NetworkGraph 
            authors={authors} 
            connections={connections} 
            legends={legends}
            authorLegendLinks={INITIAL_LEGEND_LINKS}
            onAuthorSelect={setSelectedAuthor}
            onSearchThemes={(term) => setSearchTerm(term)}
            selectedAuthorId={selectedAuthor?.id}
          />
        </div>

        {/* Selected Author Overlay */}
        <AnimatePresence>
          {selectedAuthor && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] bg-editorial-bg shadow-[-12px_0px_30px_rgba(0,0,0,0.1)] border-l-2 border-editorial-ink z-30 flex flex-col"
            >
              <div className="p-8 border-b border-editorial-ink/10 flex items-center justify-between bg-white/50">
                <span className="text-[10px] font-sans font-black uppercase tracking-widest bg-editorial-ink text-editorial-bg px-2 py-1">
                  Dosje Autora
                </span>
                <button onClick={() => setSelectedAuthor(null)} className="p-1 hover:bg-editorial-ink hover:text-white transition-colors border border-editorial-ink">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-10 border-b border-editorial-ink relative overflow-hidden bg-white">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black select-none leading-none">
                    {selectedAuthor.name.charAt(0)}
                  </div>
                  
                  <div className="w-32 h-32 rounded-none border-2 border-editorial-ink p-1 mb-8 bg-white relative z-10 grayscale contrast-125">
                    {selectedAuthor.imageUrl ? (
                      <img src={selectedAuthor.imageUrl} alt={selectedAuthor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Users size={40} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-4xl font-black leading-[0.9] mb-2 relative z-10">{selectedAuthor.name}</h2>
                  <p className="text-sm font-sans font-bold uppercase tracking-[0.2em] opacity-40 mb-6 relative z-10">{selectedAuthor.period}</p>
                  
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {selectedAuthor.roles.map(role => (
                      <span key={role} className="px-2 py-1 border border-editorial-ink text-[10px] font-black uppercase tracking-widest">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-10 space-y-10">
                  <section>
                    <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-editorial-ink/20">Biografski Zapis</h4>
                    <p className="text-lg leading-snug font-serif italic text-editorial-ink/90 first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
                      {selectedAuthor.bio}
                    </p>
                  </section>

                  <section className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-editorial-ink/20">Motivi</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAuthor.motives.map(motive => (
                          <span key={motive} className="text-[10px] font-sans font-bold uppercase underline decoration-editorial-accent decoration-2 underline-offset-2">
                            {motive}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedAuthor.works.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-editorial-ink/20">Bibliografija</h4>
                        <ul className="space-y-1">
                          {selectedAuthor.works.map(work => (
                            <li key={work} className="text-[11px] font-serif italic leading-tight border-l border-editorial-ink/20 pl-2">
                              {work}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>

                  <section>
                    <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-editorial-ink/20">Intelektualne Relacije</h4>
                    <div className="space-y-4">
                      {connections
                        .filter(c => c.source === selectedAuthor.id || c.target === selectedAuthor.id)
                        .map((c, i) => {
                          const otherId = c.source === selectedAuthor.id ? c.target : c.source;
                          const other = authors.find(a => a.id === otherId);
                          return (
                            <div key={i} className="p-4 border border-editorial-ink bg-white shadow-[4px_4px_0px_rgba(26,26,26,0.1)]">
                              <p className="text-[10px] font-sans font-black uppercase tracking-widest text-editorial-accent mb-2">
                                {c.type === 'influence' ? 'Utjecaj' : c.type === 'theme' ? 'Korespondencija' : 'Kolaboracija'}
                              </p>
                              <p className="text-sm font-bold mb-2 underline">{other?.name}</p>
                              <p className="text-[11px] font-serif leading-tight opacity-70 italic">"{c.description}"</p>
                            </div>
                          );
                        })}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Author Modal */}
        <AnimatePresence>
          {isAddingAuthor && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-editorial-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 border-[20px] border-editorial-ink/20"
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-editorial-bg border-4 border-editorial-ink p-10 w-full max-w-lg shadow-[16px_16px_0px_#1A1A1A]"
              >
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-[10px] font-sans font-black uppercase tracking-[0.3em] bg-editorial-accent text-white px-2 py-1 mb-4 inline-block">
                      Arhivska Protokolacija
                    </span>
                    <h2 className="text-4xl font-black tracking-tighter leading-none mt-2">DODAJ NOVOG<br />ISTRAŽIVAČA</h2>
                  </div>
                  <button onClick={() => setIsAddingAuthor(false)} className="p-2 border-2 border-editorial-ink hover:bg-editorial-ink hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddAuthor} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-sans font-black uppercase tracking-widest mb-2">Identitet Autora</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ime i prezime..."
                      className="w-full px-4 py-4 bg-white border-2 border-editorial-ink text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_#1A1A1A] transition-all placeholder:opacity-30"
                      value={newAuthorName}
                      onChange={e => setNewAuthorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-black uppercase tracking-widest mb-2">Klaster Tematskih Motiva</label>
                    <textarea 
                      className="w-full px-4 py-4 bg-white border-2 border-editorial-ink text-sm font-serif h-32 resize-none focus:outline-none focus:shadow-[4px_4px_0px_#1A1A1A] transition-all placeholder:opacity-30"
                      placeholder="npr. Klek, Povijest, Frankopani, Narodni govor..."
                      value={newAuthorMotives}
                      onChange={e => setNewAuthorMotives(e.target.value)}
                    />
                    <p className="mt-2 text-[9px] font-sans font-bold uppercase opacity-40">Odvojite motive zarezom za preciznije mapiranje.</p>
                  </div>

                  <button 
                    disabled={isGenerating}
                    type="submit"
                    className="w-full py-5 bg-editorial-ink text-editorial-bg hover:bg-editorial-accent transition-colors text-xs font-sans font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>PROCESIRANJE...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>INTEGRIRAJ U MREŽU</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
