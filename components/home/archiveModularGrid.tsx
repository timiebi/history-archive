"use client";

import Link from "next/link";
import { Box, Clock, Book, Compass, Shield, ArrowUpRight } from "lucide-react";

const MODULES = [
  {
    name: "Artifacts",
    desc: "Objects, images, and records from the collection.",
    icon: Box,
    href: "/artifacts",
  },
  {
    name: "Timelines",
    desc: "See how events connect across time and place.",
    icon: Clock,
    href: "/timelines",
  },
  {
    name: "Library",
    desc: "Manuscripts, texts, and curated readings.",
    icon: Book,
    href: "/library",
  },
  {
    name: "Tours & Trips",
    desc: "Request guided heritage expeditions and safaris.",
    icon: Compass,
    href: "/visit",
  },
  {
    name: "Our mission",
    desc: "Why Gesi exists and how we work with communities.",
    icon: Shield,
    href: "/manifesto",
  },
];

export function ArchiveModuleGrid() {
  return (
    <div className="py-12">
      <header className="mb-10 max-w-2xl">
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-orange-800 dark:text-orange-500 block mb-2">
          Gesi Records Directory
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight uppercase italic">
          Where to next
        </h2>
        <p className="mt-2 text-stone-600 dark:text-stone-400 font-serif italic text-sm sm:text-base leading-relaxed">
          Select a starting point — each portal explores a unique layer of continental heritage.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {MODULES.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            aria-label={`${module.name}: ${module.desc}`}
            className="group relative flex flex-col justify-between bg-white/70 dark:bg-stone-900/40 backdrop-blur-md p-6 border border-stone-200/50 dark:border-stone-850/60 rounded-xl shadow-xs hover:shadow-xl hover:shadow-orange-700/5 hover:-translate-y-1.5 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-8">
                <div
                  className="p-3.5 rounded-lg bg-orange-700/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-105"
                  aria-hidden
                >
                  <module.icon size={20} strokeWidth={1.75} />
                </div>
                <div className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-450 group-hover:text-primary dark:group-hover:text-orange-400 group-hover:border-orange-500/30 transition-all duration-300">
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-stone-900 dark:text-white group-hover:text-primary dark:group-hover:text-orange-400 transition-colors">
                  {module.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif italic">{module.desc}</p>
              </div>
            </div>

            <div className="mt-8 h-0.5 w-full bg-stone-200/50 dark:bg-stone-850/50 overflow-hidden rounded-full">
              <div className="h-full w-full bg-linear-to-r from-amber-600 to-orange-750 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}