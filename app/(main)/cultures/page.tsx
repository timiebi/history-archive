"use client";

import { CultureOverlay } from "../map/culltureOverlay";
import { useCultures } from "@/lib/api";
import { cultureToCultureDisplay, type CultureDisplay } from "@/lib/api/mappers";
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

  const culturesList = useMemo(() => {
    if (culturesOk && culturesData?.items?.length) {
      return (culturesData.items as import("@/lib/api/types").Culture[]).map(cultureToCultureDisplay);
    }
    return [];
  }, [culturesOk, culturesData?.items]);

  const filteredCultures = useMemo(() => {
    if (culturesOk && culturesData?.items?.length) {
      return culturesList.filter((c) => {
        const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = activeRegion === "All" || c.region === activeRegion;
        const start = c.start ?? 0;
        const matchesYear = start <= yearFilter;
        return matchesSearch && matchesRegion && matchesYear;
      });
    }
    return culturesList;
  }, [culturesOk, culturesData?.items, searchQuery, activeRegion, yearFilter, culturesList]);

  const regionOptions = useMemo(() => {
    const s = new Set<string>();
    culturesList.forEach((c) => {
      if (c.region?.trim()) s.add(c.region.trim());
    });
    return ["All", ...Array.from(s).sort()];
  }, [culturesList]);

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] pt-28 pb-44 px-6 md:px-8 transition-colors duration-500">
      <header className="max-w-7xl mx-auto mb-12 md:mb-16">
        <span className="text-orange-800 dark:text-orange-600 font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">
          Cultures · Index
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-tight mb-4">
          Peoples <span className="text-stone-400 dark:text-stone-600">& Polities</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 font-serif italic max-w-2xl text-sm md:text-base leading-relaxed mb-8">
          Browse cultures in the archive. Use the year slider at the bottom to highlight entries that begin on
          or before the selected year; search and region narrow the list.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center max-w-2xl">
          <label className="sr-only" htmlFor="cultures-search">
            Search cultures
          </label>
          <input
            id="cultures-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name…"
            className="flex-1 px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-700/40"
          />
          <label className="sr-only" htmlFor="cultures-region">
            Filter by region
          </label>
          <select
            id="cultures-region"
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
            className="px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm min-w-40 focus:outline-none focus:ring-2 focus:ring-orange-700/40"
          >
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All regions" : r}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#0c0a09]/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 z-40 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-start">
            <div className="p-3 bg-orange-700 text-white rounded-sm" aria-hidden>
              <History size={20} />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Showing period</p>
              <p className="text-xl md:text-2xl font-semibold tracking-tight dark:text-white">
                {yearFilter < 0 ? `${Math.abs(yearFilter)} BCE` : `${yearFilter} CE`}
              </p>
            </div>
          </div>

          <div className="flex-1 w-full">
            <input
              type="range"
              min="-1100"
              max="1900"
              step="10"
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value, 10))}
              aria-label="Filter cultures by start year"
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full appearance-none cursor-pointer accent-orange-700"
            />
            <div className="flex justify-between mt-2 text-[10px] text-stone-500 tabular-nums">
              <span>1100 BCE</span>
              <span>1 CE</span>
              <span>1000 CE</span>
              <span>1900 CE</span>
            </div>
          </div>

          <p className="hidden lg:block text-right text-xs text-stone-500 dark:text-stone-400 max-w-56 shrink-0 leading-snug">
            Entries whose start year is on or before the slider value stay visible.
          </p>
        </div>
      </div>

      {culturesPending && culturesList.length === 0 ? (
        <p className="max-w-7xl mx-auto py-20 text-center text-stone-500 text-sm">Loading cultures…</p>
      ) : filteredCultures.length === 0 ? (
        <p className="max-w-7xl mx-auto py-20 text-center text-stone-500 text-sm">
          {culturesList.length === 0
            ? "No cultures in the archive yet."
            : "No cultures match your filters. Try another year, region, or search."}
        </p>
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
                <h3 className="text-xl font-bold tracking-tight text-white">{culture.name}</h3>
                <p className="text-xs text-orange-400">{culture.period}</p>
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