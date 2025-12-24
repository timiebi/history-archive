"use client";

import { ArchiveModuleGrid } from "@/components/home/archiveModularGrid";
import { ContributionSection } from "@/components/home/contributionSection";
import { Hero } from "@/components/home/hero";
import { RegionNav } from "@/components/home/regionNav";
import { FeaturedSpotlight } from "@/components/home/stories";
import { StoryGrid } from "@/components/stories/StoryGrid";
import { motion } from "framer-motion";
// "use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
 
const stories = [
  {
    id: "mali-empire",
    title: "The Golden Age of the Mali Empire",
    year: "1230 - 1670",
    region: "West Africa",
    category: "Kingdoms",
    image: "https://images.unsplash.com/photo-1590076215667-873d6f3731ad?q=80&w=800",
  },
  {
    id: "great-zimbabwe",
    title: "Great Zimbabwe: The Stone Citadel",
    year: "11th - 15th Century",
    region: "Southern Africa",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1520156177413-fec42bc833e1?q=80&w=800",
  },
  {
    id: "kingdom-of-aksum",
    title: "Aksum: The Empire of the Obelisks",
    year: "100 - 940 AD",
    region: "East Africa",
    category: "Civilizations",
    image: "https://images.unsplash.com/photo-1543160732-2d159b2612d1?q=80&w=800",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#fafaf9] dark:bg-[#0c0a09] transition-colors duration-700">
      
      {/* PHASE 00: THE HOOK */}
      <section className="relative">
        <Hero />
        {/* Subtle Scroll Indicator for the Dashboard */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-linear-to-b from-orange-800 to-transparent"
          />
        </div>
      </section>

      {/* PHASE 01: SYSTEM ACCESS (The Upgraded Dashboard Grid) */}
      <section className="relative z-10 -mt-12">
         <div className="max-w-400] mx-auto px-4">
            <ArchiveModuleGrid />
         </div>
      </section>

      {/* PHASE 02: GEOGRAPHIC COMPASS */}
      <div className="py-20 border-b border-stone-100 dark:border-stone-900">
        <RegionNav />
      </div>

      {/* PHASE 03: THE NARRATIVE SPOTLIGHT */}
      <FeaturedSpotlight />

      {/* PHASE 04: THE ARCHIVE BROWSER */}
      <section id="stories" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-700 animate-pulse" />
                <span className="text-orange-800 dark:text-orange-500 font-black tracking-[0.4em] uppercase text-[10px]">
                  Database_Access // Port_80
                </span>
              </div>
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
                Explore <br />
                <span className="text-stone-300 dark:text-stone-800">The Records.</span>
              </h2>
            </div>
            <div className="max-w-xs border-l border-stone-200 dark:border-stone-800 pl-8">
              <p className="text-stone-500 font-serif italic text-lg leading-relaxed">
                Filtered access to the Sovereign archives. Selecting historical nodes from across the continent.
              </p>
            </div>
          </div>
        </div>
        
        <StoryGrid stories={stories} />
      </section>

      {/* PHASE 05: COMMUNITY */}
      <div className="bg-stone-100 dark:bg-stone-950/50">
        <ContributionSection />
      </div>

    </main>
  );
}









export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-200 bg-[#0c0a09] flex flex-col items-center justify-center p-6"
        >
          {/* BACKGROUND DECOR */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-orange-900/30 rounded-full animate-pulse" />
          </div>

          <div className="relative w-full max-w-sm">
            <div className="flex justify-between items-end mb-4">
              <div className="space-y-1">
                <span className="text-orange-700 font-black tracking-[0.4em] uppercase text-[10px] block">
                  Project_Sovereign
                </span>
                <h2 className="text-white font-mono text-xs uppercase tracking-widest">
                  Decrypting_History...
                </h2>
              </div>
              <span className="text-orange-700 font-mono text-xs">
                {Math.round(progress)}%
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-0.5 w-full bg-stone-900 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-orange-700 shadow-[0_0_10px_#c2410c]"
              />
            </div>

            {/* LIVE DATA FEED */}
            <div className="mt-6 flex flex-col gap-1">
              {[
                "Establishing secure connection...",
                "Scanning cultural artifacts...",
                "Reconstructing temporal nodes...",
                "Finalizing archive protocol..."
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: progress > (i * 25) ? 0.4 : 0 }}
                  className="text-[8px] font-mono text-stone-500 uppercase tracking-tighter"
                >
                  {`> ${text}`}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}






















// import { ContributionSection } from "@/components/home/contributionSection";
// import { Hero } from "@/components/home/hero";
// import { RegionNav } from "@/components/home/regionNav";
// import { FeaturedSpotlight } from "@/components/home/stories";
// import { CategoryFilter } from "@/components/stories/CategoryFilter";
// import { StoryGrid } from "@/components/stories/StoryGrid";


// const stories = [
//   {
//     id: "mali-empire",
//     title: "The Golden Age of the Mali Empire",
//     year: "1230 - 1670",
//     region: "West Africa",
//     category: "Kingdoms",
//     image: "https://images.unsplash.com/photo-1590076215667-873d6f3731ad?q=80&w=800",
//   },
//   {
//     id: "great-zimbabwe",
//     title: "Great Zimbabwe: The Stone Citadel",
//     year: "11th - 15th Century",
//     region: "Southern Africa",
//     category: "Architecture",
//     image: "https://images.unsplash.com/photo-1520156177413-fec42bc833e1?q=80&w=800",
//   },
//   {
//     id: "kingdom-of-aksum",
//     title: "Aksum: The Empire of the Obelisks",
//     year: "100 - 940 AD",
//     region: "East Africa",
//     category: "Civilizations",
//     image: "https://images.unsplash.com/photo-1543160732-2d159b2612d1?q=80&w=800",
//   },
// ];

// export default function HomePage() {
//   return (
//     <main className="bg-[#fafaf9] dark:bg-[#0c0a09]">
      
//       <Hero />
      
//       {/* 1. Regional Compass */}
//       <RegionNav />

//       {/* 2. Monthly Focus */}
//       <FeaturedSpotlight />

//       {/* 3. The Digital Library */}
//       <section id="stories" className="py-20 relative">
//         <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
//           <span className="text-orange-800 dark:text-orange-500 font-black tracking-[0.4em] uppercase text-[10px]">
//             The Archives
//           </span>
//           <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mt-4">
//             Browse the <span className="text-stone-400">Records</span>
//           </h2>
//         </div>
        
//         <CategoryFilter />
//         <StoryGrid stories={stories} />
//       </section>

//       {/* 4. Community CTA */}
//       <ContributionSection />

//     </main>
//   );
// }



