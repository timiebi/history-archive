"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { useLibrary } from "@/lib/api";

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEra, setFilterEra] = useState("All");
  const { data, isPending } = useLibrary();
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
          <span className="text-orange-700 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">
            Archive_Section_03
          </span>
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
            placeholder="Search by title, author, or keywords…"
            className="bg-transparent border-none outline-none text-base w-64 md:w-96 text-stone-900 placeholder:text-stone-400"
          />
        </div>
        <div className="flex gap-8 flex-wrap">
          {eraOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterEra(filter)}
              className={`text-xs font-semibold tracking-tight transition-colors ${filterEra === filter ? "text-orange-700" : "text-stone-500 hover:text-orange-700"}`}
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
            <p className="text-sm text-stone-500">Loading manuscripts…</p>
          </div>
        ) : filteredManuscripts.length === 0 ? (
          <div className="col-span-full bg-[#f4f1ea] p-20 text-center">
            <p className="text-sm text-stone-500">
              {manuscripts.length === 0 ? "No manuscripts in the library yet." : "No manuscripts match your search."}
            </p>
          </div>
        ) : (
          filteredManuscripts.map((doc) => (
            <Link key={doc.id} href={`/library/${doc.id}`}>
              <motion.div className="bg-[#f4f1ea] p-10 flex flex-col justify-between group cursor-pointer hover:bg-white transition-colors duration-500">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <div className="p-4 bg-stone-100 group-hover:bg-orange-50 transition-colors">
                    <BookOpen size={24} className="text-stone-400 group-hover:text-orange-700 transition-colors" />
                  </div>
                  <span className="text-[10px] text-stone-400 tabular-nums">
                    Ref. {doc.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-orange-800 mb-2 block">
                  {doc.timeline?.name ?? doc.era}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-300">
                  {doc.title}
                </h2>
                <p className="text-stone-600 text-base leading-relaxed mb-8 max-w-md line-clamp-4">
                  {doc.summary}
                </p>
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
        <p className="text-stone-500 text-xs">
          Descriptions and scans are added as Gesi Library grows. Always cite the original holding institution
          when you use this material elsewhere.
        </p>
      </footer>
    </main>
  );
}