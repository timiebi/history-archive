"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

const regions = [
  {
    name: "West",
    subtitle: "Sahel, forest states & Atlantic coasts",
    storiesQuery: "West Africa",
    toursCount: "5 tours",
  },
  {
    name: "North",
    subtitle: "Maghreb, Sahara crossings & northern Nile",
    storiesQuery: "North Africa",
    toursCount: "3 tours",
  },
  {
    name: "East",
    subtitle: "Horn, Swahili coast & eastern interior",
    storiesQuery: "East Africa",
    toursCount: "4 tours",
  },
  {
    name: "Central",
    subtitle: "Congo basin & continental heartland",
    storiesQuery: "Central Africa",
    toursCount: "2 tours",
  },
  {
    name: "Southern",
    subtitle: "Zambezi lands to the Cape",
    storiesQuery: "Southern Africa",
    toursCount: "3 tours",
  },
] as const;

export function RegionNav() {
  return (
    <section
      className="py-20 bg-stone-50/20 dark:bg-stone-950/10 border-b border-stone-200/50 dark:border-stone-850/60"
      aria-labelledby="region-nav-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 max-w-2xl">
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-orange-850 dark:text-orange-500 block mb-2">
            Regional Atlas
          </span>
          <h2
            id="region-nav-heading"
            className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight uppercase italic"
          >
            Explore by Region
          </h2>
          <p className="mt-2 text-stone-600 dark:text-stone-400 font-serif italic text-sm sm:text-base leading-relaxed">
            Navigate the continent's distinct heritage spheres. Each region contains verified records, physical maps, and guided cultural safaris.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {regions.map((region) => (
            <Link
              key={region.name}
              href={`/visit?region=${encodeURIComponent(region.storiesQuery)}`}
              className="group relative bg-white/40 dark:bg-stone-900/30 hover:bg-white dark:hover:bg-stone-950 p-6 text-left transition-all duration-300 hover:-translate-y-1.5 border border-stone-200/50 dark:border-stone-850/60 rounded-xl shadow-xs hover:shadow-xl hover:shadow-orange-700/5 focus-visible:outline-2 focus-visible:outline-orange-750 flex flex-col justify-between min-h-[160px]"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-primary">
                    {region.name}
                  </span>
                  
                  {/* Local Tour Count Badge */}
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/5 text-amber-800 dark:text-orange-400 font-mono text-[8px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Compass size={8} className="animate-spin-slow text-amber-600" />
                    <span>{region.toursCount}</span>
                  </span>
                </div>

                <p className="text-stone-700 dark:text-stone-300 text-xs md:text-sm font-serif italic leading-relaxed group-hover:text-stone-950 dark:group-hover:text-white transition-colors">
                  {region.subtitle}
                </p>
              </div>
              
              <div className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-400 group-hover:text-primary dark:group-hover:text-orange-400 transition-colors pt-4 flex items-center gap-1.5">
                <span>View Expeditions</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>

              <span className="sr-only">Opens tours filtered by region: {region.storiesQuery}</span>
              
              {/* Animated Bottom Highlight Border */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.75 w-0 bg-primary transition-all duration-300 group-hover:w-11/12 rounded-t-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
