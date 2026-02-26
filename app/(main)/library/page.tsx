"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { useLibrary } from "@/lib/api";

export default function LibraryPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEra, setFilterEra] = useState("All");
  const { data, isPending, isSuccess } = useLibrary();
  const manuscripts = data?.items ?? [];
  const filteredManuscripts = useMemo(() => {
    if (!manuscripts.length) return [];
    return manuscripts.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.summary && doc.summary.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesEra = filterEra === "All" || doc.era === filterEra;
      return matchesSearch && matchesEra;
    });
  }, [manuscripts, searchQuery, filterEra]);
  const eraOptions = useMemo(() => {
    const eras = new Set(manuscripts.map((d) => d.era).filter(Boolean));
    return ["All", ...Array.from(eras).sort()];
  }, [manuscripts]);

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Manuscripts..."
            className="bg-transparent border-none outline-none font-serif italic text-lg w-64 md:w-96"
          />
        </div>
        <div className="flex gap-8 flex-wrap">
          {eraOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterEra(filter)}
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${filterEra === filter ? "text-orange-700" : "hover:text-orange-700"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Manuscript Grid */}
      <section className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone-300">
        {isPending ? (
          <div className="col-span-full bg-[#f4f1ea] p-20 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-stone-500">Loading manuscripts…</p>
          </div>
        ) : filteredManuscripts.length === 0 ? (
          <div className="col-span-full bg-[#f4f1ea] p-20 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-stone-500">
              {manuscripts.length === 0 ? "No manuscripts in the library yet." : "No manuscripts match your search."}
            </p>
          </div>
        ) : (
          filteredManuscripts.map((doc) => (
            <Link key={doc.id} href={`/library/${doc.id}`}>
              <motion.div
                onMouseEnter={() => setHoveredId(doc.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="bg-[#f4f1ea] p-10 flex flex-col justify-between group cursor-pointer hover:bg-white transition-colors duration-500"
              >
              <div>
                <div className="flex justify-between items-start mb-12">
                  <div className="p-4 bg-stone-100 group-hover:bg-orange-50 transition-colors">
                    <BookOpen size={24} className="text-stone-400 group-hover:text-orange-700 transition-colors" />
                  </div>
                  <span className="font-mono text-[10px] text-stone-400 tracking-tighter">REF_{doc.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-700 mb-2 block">{doc.timeline?.name ?? doc.era}</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 group-hover:translate-x-2 transition-transform duration-500">{doc.title}</h2>
                <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8 max-w-md">"{doc.summary}"</p>
              </div>
              <div className="flex items-center justify-between pt-8 border-t border-stone-200">
                <div className="flex gap-4 flex-wrap">
                  {(Array.isArray(doc.tags) ? doc.tags : []).map((tag: string) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-stone-100 text-stone-500">{tag}</span>
                  ))}
                </div>
              </div>
              </motion.div>
            </Link>
          ))
        )}
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