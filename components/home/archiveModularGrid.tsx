"use client";

import Link from "next/link";
import { Box, Clock, Book, Shield, ArrowUpRight } from "lucide-react";

const MODULES = [
  {
    name: "Artifacts",
    desc: "Objects, images, and records from the collection.",
    icon: Box,
    href: "/artifacts",
  },
  {
    name: "Timelines",
    desc: "See how people and events connect across time and place.",
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
    name: "Our mission",
    desc: "Why Afri Archive exists and how we work with communities.",
    icon: Shield,
    href: "/manifesto",
  },
];

export function ArchiveModuleGrid() {
  return (
    <div>
      <header className="mb-8 md:mb-10 max-w-2xl">
        <h2 className="text-lg md:text-xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Where to next
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Pick a starting point — each area opens a different part of the archive.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 dark:bg-stone-900 border border-stone-200 dark:border-stone-900 shadow-xl rounded-sm overflow-hidden">
        {MODULES.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            aria-label={`${module.name}: ${module.desc}`}
            className="group relative bg-[#fafaf9] dark:bg-[#0c0a09] p-8 md:p-10 hover:bg-white dark:hover:bg-stone-950 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <div className="flex justify-between items-start gap-4 mb-8">
              <div
                className="p-3 rounded-sm bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 group-hover:bg-orange-800 group-hover:text-white transition-colors duration-300"
                aria-hidden
              >
                <module.icon size={20} strokeWidth={1.75} />
              </div>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-stone-400 group-hover:text-orange-700 dark:group-hover:text-orange-500 transition-colors mt-1"
                aria-hidden
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                {module.name}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-snug">{module.desc}</p>
            </div>

            <div className="mt-8 h-px w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
              <div className="h-full w-full bg-orange-700 dark:bg-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}