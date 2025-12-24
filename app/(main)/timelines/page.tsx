"use client";

import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Map as MapIcon, Globe, X } from "lucide-react";

const KINGDOMS = [
  {
    id: "aksum",
    name: "Kingdom of Aksum",
    period: "100 AD",
    fullPeriod: "100 AD – 940 AD",
    region: "Ethiopia / Eritrea",
    description: "A major naval and trading power, Aksum served as a link between the Roman Empire and ancient India. They were among the first to adopt Christianity and develop their own coinage.",
    coordinates: "14.12° N, 38.72° E",
    mapUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200", // Representative landscape
  },
  {
    id: "mali",
    name: "Mali Empire",
    period: "1230 AD",
    fullPeriod: "1230 AD – 1670 AD",
    region: "West Africa",
    description: "Famous for its immense wealth in gold and the legendary Mansa Musa. Timbuktu became a global center of Islamic learning and scholarship.",
    coordinates: "12.63° N, 8.00° W",
    mapUrl: "https://images.unsplash.com/photo-1508248467877-926872220b4a?q=80&w=1200",
  },
  {
    id: "benin",
    name: "Kingdom of Benin",
    period: "1440 AD",
    fullPeriod: "1180 AD – 1897 AD",
    region: "Southern Nigeria",
    description: "Renowned for its sophisticated political system and world-famous bronze and ivory artworks produced by royal guilds.",
    coordinates: "6.33° N, 5.62° E",
    mapUrl: "https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?q=80&w=1200",
  },
  {
    id: "songhai",
    name: "Songhai Empire",
    period: "1464 AD",
    fullPeriod: "1464 AD – 1591 AD",
    region: "Sahel Region",
    description: "At its peak, it was one of the largest states in African history. Known for its administrative efficiency and control of the trans-Saharan trade routes.",
    coordinates: "16.27° N, 0.04° E",
    mapUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200",
  }
];

function KingdomRow({ kingdom, index, setActive, showMap }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (isInView) setActive(kingdom.id);
  }, [isInView, kingdom.id, setActive]);
  
  return (
    <div ref={ref} id={kingdom.id} className="relative h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full max-w-6xl flex flex-col md:flex-row items-center gap-24 px-6 ${isEven ? "" : "md:flex-row-reverse"}`}
      >
        <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
          <span className="text-orange-700 font-mono text-[10px] tracking-[0.5em] uppercase block mb-4">
            {kingdom.fullPeriod}
          </span>
          <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] dark:text-white">
            {kingdom.name.split(' ').map((word: string, i: number) => (
              <span key={i} className={i === 0 ? "" : "text-stone-300 dark:text-stone-800"}>
                {word}<br />
              </span>
            ))}
          </h2>
        </div>
        
        <div className="flex-1 space-y-8">
          <p className="text-stone-500 dark:text-stone-400 font-serif italic text-xl leading-relaxed max-w-sm">
            "{kingdom.description}"
          </p>
          
          <div className="flex items-center gap-6">
             <button 
               onClick={() => showMap(kingdom)}
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-700 hover:text-stone-900 dark:hover:text-white transition-colors group"
             >
                <Globe size={14} className="group-hover:rotate-12 transition-transform" /> 
                Open Cartographic View
             </button>
             <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TimelinePage() {
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState(KINGDOMS[0].id);
  const [selectedMap, setSelectedMap] = useState<any>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <main ref={containerRef} className="relative bg-[#fafaf9] dark:bg-[#0c0a09] transition-colors duration-700 overflow-x-hidden">
      
      {/* CENTRAL PROGRESS LINE */}
      <div className="fixed left-1/2 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-900 -translate-x-1/2 z-0" />
      <motion.div style={{ scaleY, originY: 0 }} className="fixed left-1/2 top-0 bottom-0 w-0.5 bg-orange-700 -translate-x-1/2 z-10" />

      {/* MAP OVERLAY MODAL */}
      <AnimatePresence>
        {selectedMap && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-white/90 dark:bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-20"
          >
            <button onClick={() => setSelectedMap(null)} className="absolute top-10 right-10 text-stone-400 hover:text-orange-700 transition-colors">
              <X size={32} />
            </button>
            <div className="grid md:grid-cols-2 gap-12 max-w-7xl items-center">
              <div className="relative aspect-square border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 p-4">
                 <img src={selectedMap.mapUrl} alt="Historical Map" className="w-full h-full object-cover grayscale brightness-50" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-orange-700 font-mono text-xs tracking-widest mb-2">TARGET_COORDINATES</p>
                      <p className="text-white text-3xl font-black uppercase tracking-tighter italic">{selectedMap.coordinates}</p>
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                <span className="text-orange-700 font-black tracking-widest text-xs uppercase">Cartographic Data // {selectedMap.id}</span>
                <h2 className="text-6xl font-black uppercase italic tracking-tighter dark:text-white leading-none">{selectedMap.name}</h2>
                <p className="text-stone-500 dark:text-stone-400 text-lg font-serif italic leading-relaxed">{selectedMap.region}</p>
                <div className="p-6 border-l-2 border-orange-700 bg-stone-50 dark:bg-stone-900/50">
                   <p className="text-xs uppercase font-mono text-stone-500 leading-loose">
                     Site remains significant in the 21st century. Archeological evidence suggests a footprint spanning over {selectedMap.id === 'songhai' ? '1.4 million' : '800,000'} square kilometers.
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT SIDE NAVIGATOR */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-8 border-l border-stone-200 dark:border-stone-800 pl-6 py-10">
        {KINGDOMS.map((k) => (
          <button key={k.id} onClick={() => document.getElementById(k.id)?.scrollIntoView({ behavior: "smooth" })} className="group flex flex-col items-start text-left transition-all">
            <span className={`text-[9px] font-mono tracking-tighter transition-colors ${activeId === k.id ? "text-orange-700" : "text-stone-400"}`}>{k.period}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeId === k.id ? "text-stone-900 dark:text-white translate-x-2" : "text-stone-300 dark:text-stone-700"}`}>{k.id}</span>
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <section className="relative z-20">
        <div className="h-screen flex flex-col items-center justify-center text-center">
          <span className="text-orange-700 font-black tracking-[0.5em] uppercase text-[10px] mb-8">The Epoch Sequence</span>
          <h1 className="text-[10rem] md:text-[18rem] font-black uppercase italic tracking-tighter leading-[0.7] text-stone-900 dark:text-white">
            Time<br /><span className="text-stone-200 dark:text-stone-900">Flow.</span>
          </h1>
        </div>

        {KINGDOMS.map((kingdom, i) => (
          <KingdomRow key={kingdom.id} kingdom={kingdom} index={i} setActive={setActiveId} showMap={setSelectedMap} />
        ))}
      </section>
    </main>
  );
}

// // app/timelines/page.tsx
// "use client";

// import { AppContainer } from "@/components/layouts/appContainer";
// import { useMemo, useState } from "react";
// import { Timeline } from "./components/Timeline";
// import { TimelineFilter } from "./components/TimelineFilter";
// import { TIMELINE_EVENTS, TimelineEra } from "./data/timelines";

// export default function TimelinesPage() {
//    const [era, setEra] = useState<TimelineEra | "All">("All");

//    const filteredEvents = useMemo(() => {
//       if (era === "All") return TIMELINE_EVENTS;
//       return TIMELINE_EVENTS.filter((e) => e.era === era);
//    }, [era]);

//    return (
//       <main className="min-h-screen">
//          {/* Decorative background */}
//         {/* Full-screen decorative background */}
// {/* Real background canvas */}
// <div className="pointer-events-none fixed inset-0 -z-10">
//   <div className="absolute inset-0 flex justify-center">
//     <img
//       src="/stories/africamap.svg"
//       alt=""
//       className="
//         w-275
//         max-w-[90vw]
//         mt-45
//         opacity-[0.035]
//         dark:opacity-[0.025]
//         blur-[0.4px]
//         mask-africa-fade
//       "
//     />
//   </div>
// </div>

//          {/* Header */}
//          <header className="border-b">
//             <AppContainer className="py-12">
//                <div className="mx-auto max-w-7xl px-4 space-y-4">
//                   <h1 className="text-4xl font-bold tracking-tight">African Timelines</h1>
//                   <p className="text-muted-foreground max-w-2xl">
//                      A chronological exploration of Africa’s civilizations, empires, revolutions,
//                      and defining moments across history.
//                   </p>
//                </div>
//             </AppContainer>
//          </header>

//          {/* Filters */}
//          <TimelineFilter active={era} onChange={setEra} />

//          {/* Content */}
//          <AppContainer className="py-12">
//             <section className="mx-auto max-w-7xl px-4">
//                <Timeline events={filteredEvents} />
//             </section>
//          </AppContainer>
//       </main>
//    );
// }
