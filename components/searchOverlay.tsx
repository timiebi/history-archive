"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Book, Clock, Diamond, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// 1. Unified Search Logic: Combines all your hardcoded data
const ALL_RECORDS = [
  // From Artifacts
  { id: "benin-head", title: "Commemorative Head", type: "Object", category: "Artifact", href: "/artifacts/benin-head" },
  { id: "golden-rhino", title: "Golden Rhinoceros", type: "Object", category: "Artifact", href: "/artifacts/golden-rhino" },
  { id: "lydenburg-mask", title: "Lydenburg Head", type: "Object", category: "Artifact", href: "/artifacts/lydenburg-mask" },
  // From Kingdoms
  { id: "aksum", title: "Kingdom of Aksum", type: "Era", category: "Timeline", href: "/timeline#aksum" },
  { id: "mali", title: "Mali Empire", type: "Era", category: "Timeline", href: "/timeline#mali" },
  { id: "songhai", title: "Songhai Empire", type: "Era", category: "Timeline", href: "/timeline#songhai" },
  // From Library
  { id: "tarikh-al-sudan", title: "Tarikh al-Sudan", type: "Folio", category: "Library", href: "/library" },
  { id: "kebra-nagast", title: "The Kebra Nagast", type: "Folio", category: "Library", href: "/library" },
];

export function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter logic
  const filteredResults = useMemo(() => {
    if (!query) return ALL_RECORDS.slice(0, 4); // Default suggestions
    return ALL_RECORDS.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <>
      {/* Floating Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-orange-800 text-white p-4 shadow-2xl hover:bg-stone-900 transition-all flex items-center gap-3 group"
      >
        <Search size={18} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Command Search</span>
        <span className="text-[10px] opacity-40 ml-2 border border-white/20 px-1 rounded">⌘K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#0c0a09]/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 5 }}
              className="relative w-full max-w-2xl bg-[#fafaf9] dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              {/* Search Input Area */}
              <div className="flex items-center p-6 border-b border-stone-200 dark:border-stone-800">
                <Search className="text-orange-800 mr-4" size={22} />
                <input
                  autoFocus
                  placeholder="Query the Archive..."
                  className="w-full bg-transparent border-none outline-none text-2xl font-serif italic text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Dynamic Results Grid */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                <div className="grid grid-cols-1 gap-1">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item) => (
                      <Link 
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-stone-800/50 group transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 bg-stone-100 dark:bg-stone-900 flex items-center justify-center border border-stone-200 dark:border-stone-800 group-hover:border-orange-800 transition-colors">
                             {item.type === 'Object' && <Diamond size={16} className="text-stone-400 group-hover:text-orange-800" />}
                             {item.type === 'Era' && <Clock size={16} className="text-stone-400 group-hover:text-orange-800" />}
                             {item.type === 'Folio' && <Book size={16} className="text-stone-400 group-hover:text-orange-800" />}
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-800 block mb-0.5">{item.category}</span>
                            <span className="text-lg font-bold uppercase italic tracking-tighter text-stone-800 dark:text-stone-200">{item.title}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-stone-300 dark:text-stone-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                       <p className="font-serif italic text-stone-500">No records found for "{query}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Keyboard Legend */}
              <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#161412] flex justify-between items-center px-6">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
                  Secure_Database_Access // Port 443
                </span>
                <div className="flex gap-4 text-[9px] font-bold text-stone-500 uppercase">
                  <span><kbd className="border dark:border-stone-700 px-1.5 py-0.5 rounded">ESC</kbd> Close</span>
                  <span><kbd className="border dark:border-stone-700 px-1.5 py-0.5 rounded">↵</kbd> Explore</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* <DiscoveryButton/> */}
    </>
  );
}





// "use client";



// This function pulls from all the IDs we've created across the site
const DISCOVERY_POOL = [
  { path: "/artifacts/benin-head" },
  { path: "/artifacts/golden-rhino" },
  { path: "/artifacts/lydenburg-mask" },
  { path: "/timeline#aksum" },
  { path: "/timeline#mali" },
  { path: "/timeline#songhai" },
  { path: "/library" } // Could also deep link to specific manuscripts
];

export function DiscoveryButton() {
  const router = useRouter();

  const handleDiscovery = () => {
    const randomIndex = Math.floor(Math.random() * DISCOVERY_POOL.length);
    const destination = DISCOVERY_POOL[randomIndex].path;
    
    // Trigger the navigation
    router.push(destination);
  };

  return (
    <button 
      onClick={handleDiscovery}
      className="fixed bottom-8 left-8 z-40 bg-white dark:bg-stone-900 text-stone-900 dark:text-white p-4 border border-stone-200 dark:border-stone-800 shadow-xl hover:text-orange-700 transition-all flex items-center gap-3 group"
    >
      <Sparkles size={18} className="group-hover:rotate-12 transition-transform text-orange-700" />
      <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Random Discovery</span>
    </button>
  );
}