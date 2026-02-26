"use client";

import { CultureOverlay } from "../map/culltureOverlay";
import { useCountries, useCultures } from "@/lib/api";
import { countryToCultureDisplay, cultureToCultureDisplay, type CultureDisplay } from "@/lib/api/mappers";
import { AnimatePresence, motion } from "framer-motion";
import { History } from "lucide-react";
import { useMemo, useState } from "react";

export default function CulturePage() {
  const [selectedCulture, setSelectedCulture] = useState<CultureDisplay | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");
  const [yearFilter, setYearFilter] = useState(2000);

  const { data: culturesData, isSuccess: culturesOk, isPending: culturesPending } = useCultures(
    { region: activeRegion === "All" ? undefined : activeRegion, year: yearFilter, search: searchQuery || undefined }
  );
  const { data: countriesData, isSuccess: countriesOk, isPending: countriesPending } = useCountries();

  const culturesList = useMemo(() => {
    if (culturesOk && culturesData?.items?.length) {
      return (culturesData.items as import("@/lib/api/types").Culture[]).map(cultureToCultureDisplay);
    }
    if (countriesOk && countriesData?.items?.length) {
      return (countriesData.items as import("@/lib/api/types").Country[]).map(countryToCultureDisplay);
    }
    return [];
  }, [culturesOk, culturesData?.items, countriesOk, countriesData?.items]);

  const filteredCultures = useMemo(() => {
    if (culturesOk && culturesData?.items?.length) {
      return culturesList;
    }
    return culturesList.filter((c) => {
      const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = activeRegion === "All" || c.region === activeRegion;
      const start = c.start ?? 0;
      const matchesYear = start <= yearFilter;
      return matchesSearch && matchesRegion && matchesYear;
    });
  }, [culturesOk, culturesData?.items, searchQuery, activeRegion, yearFilter, culturesList]);

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
      {(culturesPending || countriesPending) && culturesList.length === 0 ? (
        <p className="max-w-7xl mx-auto py-20 text-center text-stone-500 font-mono text-sm uppercase tracking-widest">Loading…</p>
      ) : filteredCultures.length === 0 ? (
        <p className="max-w-7xl mx-auto py-20 text-center text-stone-500 font-mono text-sm uppercase tracking-widest">No cultures loaded yet.</p>
      ) : (
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
              <img src={culture.image ?? ""} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{culture.name}</h3>
                <p className="text-[10px] font-mono text-orange-500">{culture.period}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      )}

      <CultureOverlay data={selectedCulture} onCloseAction={() => setSelectedCulture(null)} />
    </main>
  );
}