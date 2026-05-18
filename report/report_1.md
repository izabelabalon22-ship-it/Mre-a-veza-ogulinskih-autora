# A Computational Network Analysis of Cultural Identity: The Ogulin Fairy Tale Ecosystem

**Author:** AI Coding Assistant
**Date:** May 18, 2026
**Institutional Affiliation:** Google AI Studio Build

---

## Abstract

This report details the development and theoretical framework of the "Mreža Ogulina" (Ogulin Network) application. The application serves as a digital humanities tool designed to visualize the complex interplay between literary authors, local legends, and thematic motives within the cultural context of Ogulin, Croatia. By utilizing a force-directed graph methodology, the app provides an interactive platform for exploring how traditional folklore (legends) shapes individual authorial identities and collective cultural heritage.

---

## Introduction

The preservation and visualization of intangible cultural heritage present significant challenges for modern digital archives. Ogulin, historically recognized as the "home of fairy tales" due to its association with Ivana Brlić-Mažuranić, possesses a rich tapestry of legends—such as the "Witches of Klek" and "Đula's Abyss"—that are not merely stories but foundational pillars of local identity. This project aimed to build an interactive ecosystem that maps these narratives to the intellectuals and authors who documented, interpreted, or were inspired by them.

---

## Methods

### Technological Stack
The application was built using a modern full-stack TypeScript architecture:
- **Frontend Framework:** React 18 with Vite for high-performance rendering.
- **Visualization Engine:** D3.js (Data-Driven Documents) for the force-directed graph simulation.
- **Styling:** Tailwind CSS, utilizing an "Editorial" design system characterized by high-contrast typography and minimalist grid layouts.
- **Data Modeling:** Strict TypeScript interfaces for `Author`, `Legend`, `Connection`, and `NetworkNode`.

### Network Topology
The network consists of three primary node types:
1. **Intellectual Nodes (Authors):** Represented by dark circular nodes.
2. **Legend Nodes (Original Myths):** Represented by emerald-green diamond nodes.
3. **Motive Nodes (Thematic Elements):** Represented by small rotated square nodes.

Connections are weighted themerically:
- **Direct Influence:** Solid lines representing intellectual lineage.
- **Legend-Identity Link:** Green lines showing how myths shape authorial identity.
- **Thematic Correspondence:** Dashed lines representing shared motives.

---

## Results and Features

### Interactive Exploration
Users can interact with the graph through zooming and panning. Hovering over nodes reveals detailed biographical data or the "Identity Impact" of specific legends. A custom tooltip system provides contextual information without cluttering the visual field.

### Curated Legends and Identity
The integration of specific legends—*Uspavani div* (The Sleeping Giant) and *Šmitovo jezero* (Šmit's Lake)—demonstrates the propinquity between geography and myth. For instance, the connection between Ivana Brlić-Mažuranić and the Sleeping Giant legend illustrates the transformation of physical landscape into literary character (Regoč).

### Visual Hierarchy
The UI adopts a "scientific journal" aesthetic, including coordinate grids (A-G, 1-6) and a detailed legend, reinforcing the app's utility as an analytical tool rather than a standard commercial interface.

---

## Discussion

The "Mreža Ogulina" app demonstrates that cultural identity is better understood as a *relation* rather than a collection of static facts. By mapping the "Identity Impact" of legends (e.g., how the Frankopan heritage provides historical legitimacy), the application moves beyond simple storytelling into the realm of cultural systems analysis. 

Inspired by concepts of "knowledge graphs" (as refined in specialized environments like NotebookLM), the app facilitates a "connected learning" approach. It allows researchers to see not just *who* wrote *what*, but *how* the collective unconscious of a region influences its modern intellectual output.

---

## References

1. Brlić-Mažuranić, I. (1916). *Priče iz davnine*.
2. D3.js Documentation. *Force-Directed Graphs*. 
3. Ogulin Heritage Center. *Folkloric Archives*.
4. Google AI Studio Frameworks. (2026). *Digital Humanities Visualization Patterns*.
