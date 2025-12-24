"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REGION_DATA = {
  West: {
    title: "The Gold Coast & Sahel",
    cultures: "Yoruba, Ashanti, Mandinka, Wolof",
    fact: "Home to the historic Mali and Songhai Empires.",
    color: "fill-orange-800",
  },
  East: {
    title: "The Horn & Swahili Coast",
    cultures: "Amhara, Oromo, Swahili, Maasai",
    fact: "The gateway of ancient trade between Africa and Asia.",
    color: "fill-stone-600",
  },
  North: {
    title: "The Maghreb & Nile",
    cultures: "Amazigh, Egyptian, Nubian",
    fact: "Cradle of the Pharaohs and the Great Library of Alexandria.",
    color: "fill-stone-400",
  },
  Central: {
    title: "The Congo Basin",
    cultures: "Kongo, Luba, Fang, Mongo",
    fact: "The heart of the continent’s rainforests and iron-age migrations.",
    color: "fill-orange-900",
  },
  South: {
    title: "The Stone Citadels",
    cultures: "Zulu, Shona, Xhosa, San",
    fact: "Site of Great Zimbabwe and the Mapungubwe Kingdom.",
    color: "fill-stone-800",
  },
};

export function InteractiveCultureMap() {
  const [activeRegion, setActiveRegion] = useState<keyof typeof REGION_DATA | null>(null);

  return (
    <section className="py-32 bg-stone-100 dark:bg-[#080707] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: THE INTERACTIVE SVG MAP */}
          <div className="relative group">
            <svg
              viewBox="0 0 800 1000"
              className="w-full h-auto drop-shadow-2xl"
              style={{ filter: "drop-shadow(0px 20px 50px rgba(0,0,0,0.2))" }}
            >
              {/* This is a simplified path representation - in production, use a full GeoJSON SVG */}
              <g className="cursor-pointer transition-all duration-500">
                {/* North Region */}
                <path
                  onMouseEnter={() => setActiveRegion("North")}
                  className={`transition-colors duration-300 ${activeRegion === "North" ? "fill-orange-800" : "fill-stone-300 dark:fill-stone-800"}`}
                  d="M200 100 L600 100 L550 300 L250 300 Z" // Placeholder Path
                />
                {/* West Region */}
                <path
                  onMouseEnter={() => setActiveRegion("West")}
                  className={`transition-colors duration-300 ${activeRegion === "West" ? "fill-orange-800" : "fill-stone-300 dark:fill-stone-800"}`}
                  d="M100 300 L300 300 L350 500 L150 600 Z" // Placeholder Path
                />
                {/* Central Region */}
                <path
                  onMouseEnter={() => setActiveRegion("Central")}
                  className={`transition-colors duration-300 ${activeRegion === "Central" ? "fill-orange-800" : "fill-stone-300 dark:fill-stone-800"}`}
                  d="M300 300 L500 300 L500 600 L300 600 Z" // Placeholder Path
                />
              </g>
            </svg>
            
            {/* Visual Hint */}
            <div className="absolute top-0 left-0 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 rotate-90 origin-top-left translate-x-4">
              Explore Geographic Heritage
            </div>
          </div>

          {/* RIGHT: DYNAMIC CONTENT PANEL */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {activeRegion ? (
                <motion.div
                  key={activeRegion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <span className="text-orange-800 font-black tracking-widest uppercase text-xs">
                    Region: {activeRegion} Africa
                  </span>
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-stone-100">
                    {REGION_DATA[activeRegion].title}
                  </h2>
                  <p className="text-xl font-serif italic text-stone-600 dark:text-stone-400">
                    {REGION_DATA[activeRegion].fact}
                  </p>
                  <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Key Ethnic Groups</p>
                    <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {REGION_DATA[activeRegion].cultures}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col justify-center space-y-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-stone-300">
                    Hover over the <br /> continent to begin
                  </h2>
                  <p className="text-stone-400 font-serif italic">
                    Map out the lineages, migrations, and locations of Africa's great civilizations.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}