"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { History } from "lucide-react";
import { CultureOverlay } from "../map/culltureOverlay";

// Updated data with numeric start/end dates for the timeline
const CULTURES = [
  { id: "mali", name: "Mali Empire", region: "West Africa", start: 1230, end: 1670, period: "1230 – 1670", capital: "Niani", language: "Mandinka", desc: "Wealthiest empire in history.", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23" },
  { id: "aksum", name: "Kingdom of Aksum", region: "East Africa", start: 100, end: 940, period: "100 – 940 AD", capital: "Aksum", language: "Ge'ez", desc: "Naval power bridge to India.", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e" },
  { id: "zimbabwe", name: "Great Zimbabwe", region: "Southern Africa", start: 1000, end: 1500, period: "11th – 15th Century", capital: "Great Zimbabwe", language: "Shona", desc: "Stone city trade hub.", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5" },
  { id: "kush", name: "Kingdom of Kush", region: "North Africa", start: -1070, end: 350, period: "1070 BC – 350 AD", capital: "Meroë", language: "Meroitic", desc: "The Black Pharaohs of the Nile.", image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368" }
];

export default function CulturePage() {
  const [selectedCulture, setSelectedCulture] = useState<typeof CULTURES[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");
  const [yearFilter, setYearFilter] = useState(2000); // Default to "modern" to show all, or adjust

  // FILTER LOGIC
  const filteredCultures = useMemo(() => {
    return CULTURES.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = activeRegion === "All" || c.region === activeRegion;
      // Show culture if it existed on or before the selected year on the timeline
      const matchesYear = c.start <= yearFilter; 
      
      return matchesSearch && matchesRegion && matchesYear;
    });
  }, [searchQuery, activeRegion, yearFilter]);

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] pt-32 pb-40 px-8 transition-colors duration-500">
      
      {/* ... Previous Stats HUD and Search Bar ... */}

      {/* 2. THE TIMELINE HUD (Fixed at Bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-[#0c0a09]/80 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 z-40 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3 bg-orange-700 text-white">
              <History size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Temporal_Focus</p>
              <p className="text-2xl font-black italic tracking-tighter dark:text-white">
                {yearFilter < 0 ? `${Math.abs(yearFilter)} BC` : `${yearFilter} AD`}
              </p>
            </div>
          </div>

          <div className="flex-1 w-full group">
            <input 
              type="range"
              min="-1100"
              max="1900"
              step="10"
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              className="w-full h-1 bg-stone-200 dark:bg-stone-800 appearance-none cursor-pointer accent-orange-700"
            />
            <div className="flex justify-between mt-2 font-mono text-[8px] text-stone-500 uppercase tracking-widest">
              <span>-1100 BC</span>
              <span>0 AD</span>
              <span>1000 AD</span>
              <span>1900 AD</span>
            </div>
          </div>

          <div className="hidden lg:block text-right shrink-0">
             <p className="text-[9px] font-mono text-stone-500 uppercase italic">
               Displaying nodes active during <br/> selected epoch.
             </p>
          </div>
        </div>
      </div>

      {/* 3. GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCultures.map((culture) => (
            <motion.div 
              layout
              key={culture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedCulture(culture)}
              className="group relative h-100 bg-stone-900 overflow-hidden border border-stone-800"
            >
              <img src={culture.image} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{culture.name}</h3>
                <p className="text-[10px] font-mono text-orange-500">{culture.period}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CultureOverlay data={selectedCulture} onCloseAction={() => setSelectedCulture(null)} />
    </main>
  );
}