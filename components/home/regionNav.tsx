"use client";

import Link from "next/link";

/** Short labels users scan; subtitles describe geography without marketing slogans. */
const regions = [
  {
    name: "West",
    subtitle: "Sahel, forest states & Atlantic coasts",
    storiesQuery: "West Africa",
  },
  {
    name: "North",
    subtitle: "Maghreb, Sahara crossings & the northern Nile",
    storiesQuery: "North Africa",
  },
  {
    name: "East",
    subtitle: "Horn, Swahili coast & the eastern interior",
    storiesQuery: "East Africa",
  },
  {
    name: "Central",
    subtitle: "Congo basin & the continental heartland",
    storiesQuery: "Central Africa",
  },
  {
    name: "Southern",
    subtitle: "Zambezi lands to the Cape",
    storiesQuery: "Southern Africa",
  },
] as const;

export function RegionNav() {
  return (
    <section
      className="py-14 md:py-16 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800"
      aria-labelledby="region-nav-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-8 md:mb-10 max-w-2xl">
          <h2
            id="region-nav-heading"
            className="text-lg md:text-xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight"
          >
            Explore by region
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            These are broad areas — use them as a compass, then refine with search and filters on
            stories.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-px md:bg-stone-200 md:dark:bg-stone-800 rounded-sm overflow-hidden border border-stone-200 dark:border-stone-800">
          {regions.map((region) => (
            <Link
              key={region.name}
              href={`/stories?q=${encodeURIComponent(region.storiesQuery)}`}
              className="group relative bg-[#fcfaf7] dark:bg-[#0c0a09] p-5 md:p-6 text-left transition-colors hover:bg-stone-100 dark:hover:bg-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 min-h-22 md:min-h-0 flex flex-col"
            >
              <span className="text-xs font-semibold text-orange-800 dark:text-orange-500 block mb-1.5">
                {region.name}
              </span>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-snug font-normal">
                {region.subtitle}
              </p>
              <span className="sr-only">Opens stories filtered by search: {region.storiesQuery}</span>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange-700 dark:bg-orange-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
