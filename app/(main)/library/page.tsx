"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BookOpen, Search, Download, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

const MANUSCRIPTS = [
  {
    id: "tarikh-al-sudan",
    title: "Tarikh al-Sudan",
    author: "Abd al-Rahman al-Sa'di",
    era: "1655 AD",
    kingdom: "Songhai Empire",
    summary: "One of the most important primary sources for the history of the Middle Niger region, detailing the rise and fall of the Songhai Empire and the scholarly life of Timbuktu.",
    pages: 450,
    tags: ["History", "Governance", "Scholarly"]
  },
  {
    id: "kebra-nagast",
    title: "The Kebra Nagast",
    author: "Unknown (Ge'ez Liturgy)",
    era: "14th Century (Redacted)",
    kingdom: "Kingdom of Aksum / Ethiopia",
    summary: "The 'Glory of Kings', a 14th-century account of the Solomonic lineage of the Ethiopian emperors and the journey of the Ark of the Covenant to Aksum.",
    pages: 280,
    tags: ["Liturgy", "Lineage", "Epic"]
  },
  {
    id: "benin-court-records",
    title: "Oral Chronicles of the Oba",
    author: "Royal Guild of Historians",
    era: "16th Century Context",
    kingdom: "Kingdom of Benin",
    summary: "Transcribed oral traditions detailing the architectural expansion of Benin City and the diplomatic protocols of the Oba's court.",
    pages: 120,
    tags: ["Oral Tradition", "Court Life"]
  }
];

export default function LibraryPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-stone-900 selection:bg-orange-200">
      {/* Editorial Header */}
      <header className="p-8 md:p-12 border-b border-stone-300 flex justify-between items-end">
        <div>
          <span className="text-orange-700 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Archive_Section_03</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            Digital <span className="text-stone-400">Folios.</span>
          </h1>
        </div>
        <div className="hidden md:block text-right max-w-xs">
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 leading-relaxed">
            Collection of digitized primary sources, manuscripts, and oral transcriptions from the Sovereign Era.
          </p>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="px-8 md:px-12 py-6 border-b border-stone-300 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 text-stone-400 focus-within:text-orange-700 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search Manuscripts..." 
            className="bg-transparent border-none outline-none font-serif italic text-lg w-64 md:w-96"
          />
        </div>
        <div className="flex gap-8">
            {["All", "Chronicles", "Liturgical", "Technical"].map(filter => (
                <button key={filter} className="text-[10px] font-black uppercase tracking-widest hover:text-orange-700 transition-colors">
                    {filter}
                </button>
            ))}
        </div>
      </div>

      {/* Manuscript Grid */}
      <section className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone-300">
        {MANUSCRIPTS.map((doc) => (
          <motion.div 
            key={doc.id}
            onMouseEnter={() => setHoveredId(doc.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="bg-[#f4f1ea] p-10 flex flex-col justify-between group cursor-pointer hover:bg-white transition-colors duration-500"
          >
            <div>
                <div className="flex justify-between items-start mb-12">
                    <div className="p-4 bg-stone-100 group-hover:bg-orange-50 transition-colors">
                        <BookOpen size={24} className="text-stone-400 group-hover:text-orange-700 transition-colors" />
                    </div>
                    <span className="font-mono text-[10px] text-stone-400 tracking-tighter">REF_{doc.id.toUpperCase()}</span>
                </div>
                
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-700 mb-2 block">{doc.kingdom}</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 group-hover:translate-x-2 transition-transform duration-500">{doc.title}</h2>
                <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8 max-w-md">
                    "{doc.summary}"
                </p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-stone-200">
                <div className="flex gap-4">
                    {doc.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-stone-100 text-stone-500">{tag}</span>
                    ))}
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-orange-700 transition-colors">
                    Access Text <ChevronRight size={14} />
                </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Footer Meta */}
      <footer className="p-12 text-center border-t border-stone-300">
         <p className="text-stone-400 font-mono text-[9px] uppercase tracking-[0.5em]">
            Digital Preservation // Transcription Phase 04 complete
         </p>
      </footer>
    </main>
  );
}