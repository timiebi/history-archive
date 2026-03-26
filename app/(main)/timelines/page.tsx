"use client";

import { useCountries, useTimelines } from "@/lib/api";
import type { Country, Timeline } from "@/lib/api/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type KingdomRowData = {
  id: string;
  name: string;
  period: string;
  fullPeriod: string;
  region: string;
  description: string;
  coordinates: string;
  mapUrl: string;
};

function timelineToKingdom(t: Timeline): KingdomRowData {
  const start = t.startYear != null ? (t.startYear < 0 ? `${Math.abs(t.startYear)} BC` : `${t.startYear} AD`) : "—";
  const end = t.endYear != null ? (t.endYear < 0 ? `${Math.abs(t.endYear)} BC` : `${t.endYear} AD`) : "—";
  const fullPeriod = `${start} – ${end}`;
  return {
    id: t.id,
    name: t.name,
    period: fullPeriod,
    fullPeriod,
    region: "—",
    description: (t.description as string) ?? "No description.",
    coordinates: "—",
    mapUrl: "",
  };
}

function countryToKingdom(c: Country): KingdomRowData {
  const start = c.startYear != null ? `${c.startYear} AD` : "—";
  const end = c.endYear != null ? `${c.endYear} AD` : "—";
  const fullPeriod = `${start} – ${end}`;
  return {
    id: c.id,
    name: c.name,
    period: fullPeriod,
    fullPeriod,
    region: c.region ?? "—",
    description: (c.description as string) ?? "No description.",
    coordinates: "—",
    mapUrl: (c.image as string) ?? "",
  };
}

function TimelineCard({
  kingdom,
  onOpenMap,
}: {
  kingdom: KingdomRowData;
  onOpenMap: (k: KingdomRowData) => void;
}) {
  return (
    <article className="group relative border border-stone-200 dark:border-stone-800 bg-[#fafaf9] dark:bg-[#0c0a09] p-6 sm:p-8 flex flex-col gap-4 hover:border-orange-700/60 hover:bg-white dark:hover:bg-stone-950 transition-colors">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-xs font-medium text-orange-800 dark:text-orange-600">
          {kingdom.fullPeriod}
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {kingdom.region || "Africa"}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
        {kingdom.name}
      </h2>
      <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed line-clamp-3">
        {kingdom.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link
          href={`/timelines/${kingdom.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800 dark:hover:text-orange-400 transition-colors cursor-pointer"
        >
          Open timeline <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden />
        </Link>
        {kingdom.mapUrl && (
          <button
            type="button"
            onClick={() => onOpenMap(kingdom)}
            className="inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Globe size={14} aria-hidden /> View map
          </button>
        )}
      </div>
    </article>
  );
}

export default function TimelinePage() {
  const { data: timelinesData, isSuccess: timelinesOk, isPending: timelinesPending } = useTimelines();
  const { data: countriesData, isSuccess: countriesOk, isPending: countriesPending } = useCountries();

  const kingdoms = useMemo(() => {
    if (timelinesOk && timelinesData?.items?.length) return (timelinesData.items as Timeline[]).map(timelineToKingdom);
    if (countriesOk && countriesData?.items?.length) return (countriesData.items as Country[]).map(countryToKingdom);
    return [];
  }, [timelinesOk, timelinesData?.items, countriesOk, countriesData?.items]);

  const pending = timelinesPending || countriesPending;
  const [selectedMap, setSelectedMap] = useState<KingdomRowData | null>(null);

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] transition-colors duration-700">
      {/* Header */}
      <section className="border-b border-stone-200 dark:border-stone-900 bg-[#fafaf9] dark:bg-[#0c0a09]">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 flex flex-col md:flex-row md:items-end gap-10">
          <div className="space-y-4 flex-1">
            <span className="text-orange-700 dark:text-orange-600 font-mono text-[10px] uppercase tracking-[0.4em]">
              African History Timelines
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-tight">
              African Timelines
            </h1>
            <p className="text-stone-500 dark:text-stone-400 font-serif italic max-w-xl text-sm sm:text-base leading-relaxed">
              Traverse dynasties, empires, and eras. Each timeline stitches together stories, manuscripts, and
              artifacts from the Sovereign Archive.
            </p>
          </div>
          {kingdoms.length > 0 && (
            <div className="flex-1 md:max-w-xs border-l border-stone-200 dark:border-stone-800 pl-6 space-y-2 text-[10px] font-mono uppercase tracking-widest text-stone-500">
              <p>
                Timelines indexed:{" "}
                <span className="text-stone-900 dark:text-stone-100">{kingdoms.length}</span>
              </p>
              <p>
                Primary sources:{" "}
                <span className="text-stone-900 dark:text-stone-100">Stories · Manuscripts · Artifacts</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-10 sm:py-16">
        {pending && kingdoms.length === 0 ? (
          <div className="py-24 flex items-center justify-center">
            <p className="text-sm text-stone-500">Loading timelines…</p>
          </div>
        ) : kingdoms.length === 0 ? (
          <div className="py-24 flex items-center justify-center">
            <p className="text-sm text-stone-500">No timelines yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {kingdoms.map((k) => (
              <TimelineCard key={k.id} kingdom={k} onOpenMap={setSelectedMap} />
            ))}
          </div>
        )}
      </section>

      {/* Map overlay modal */}
      <AnimatePresence>
        {selectedMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            <button
              type="button"
              onClick={() => setSelectedMap(null)}
              className="absolute top-6 right-4 sm:top-8 sm:right-8 text-stone-400 hover:text-orange-700 transition-colors cursor-pointer"
              aria-label="Close map view"
            >
              <X size={28} />
            </button>
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full items-center">
              <div className="relative aspect-square border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 p-4">
                {selectedMap.mapUrl ? (
                  <img
                    src={selectedMap.mapUrl}
                    alt="Historical map"
                    className="w-full h-full object-cover grayscale brightness-50"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-200 dark:bg-stone-800" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-orange-400 text-xs font-medium mb-2">Location</p>
                    <p className="text-white text-2xl sm:text-3xl font-semibold tracking-tight">
                      {selectedMap.coordinates}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <span className="text-orange-700 dark:text-orange-500 text-xs font-medium">
                  Map preview
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight dark:text-white leading-tight">
                  {selectedMap.name}
                </h2>
                <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
                  {selectedMap.region || "Region not listed yet."}
                </p>
                <div className="p-4 border-l-2 border-orange-700 bg-stone-50 dark:bg-stone-900/50">
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {selectedMap.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
