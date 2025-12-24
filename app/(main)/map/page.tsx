"use client";

import { Compass, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CultureOverlay } from "./culltureOverlay";
import { AfricaMap } from "./map";

export default function MapPage() {
  const [hoveredEmpire, setHoveredEmpire] = useState<string | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const EMPIRES = [
    { id: "mali", name: "Mali Empire", region: "West Africa", period: "1230 – 1670", capital: "Niani", language: "Mandinka", desc: "The wealthiest empire in West African history." },
    { id: "aksum", name: "Kingdom of Aksum", region: "East Africa", period: "100 – 940 AD", capital: "Aksum", language: "Ge'ez", desc: "A major naval and trading power linking Rome and India." },
    { id: "zimbabwe", name: "Great Zimbabwe", region: "Southern Africa", period: "11th – 15th Century", capital: "Great Zimbabwe", language: "Shona", desc: "A sophisticated stone city capital of a vast trading empire." }
  ];

  const filteredEmpires = useMemo(() => {
    return EMPIRES.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedData = EMPIRES.find(e => e.id === selectedEmpire);

  return (
    /* Change 1: Dynamic Background and Text */
    <main className="h-screen bg-stone-50 dark:bg-[#0c0a09] text-stone-900 dark:text-white overflow-hidden flex flex-col pt-24 transition-colors duration-500">
      
      {/* HEADER HUD */}
      <header className="px-8 py-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white/50 dark:bg-[#0c0a09]/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-orange-800 dark:text-orange-600 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Geospatial_Interface</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" />
            <span className="text-[8px] font-mono text-stone-500 uppercase">Archive_Link_Active</span>
          </div>
        </div>
      </header>

      <div className="flex-1 relative flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 border-r border-stone-200 dark:border-stone-800 flex flex-col bg-white dark:bg-[#0c0a09] z-10">
          <div className="p-8 pb-4">
            <h2 className="text-stone-900 dark:text-white font-black uppercase italic tracking-tighter text-2xl mb-6 leading-none">Historical <br/> Nodes</h2>
            
            {/* SEARCH INPUT */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-600 group-focus-within:text-orange-700 transition-colors" size={14} />
              <input 
                type="text"
                placeholder="Search Archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 py-3 pl-10 pr-4 text-[10px] font-mono text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:outline-none focus:border-orange-800 transition-all uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-10">
            {filteredEmpires.map((emp) => (
              <div 
                key={emp.id}
                onMouseEnter={() => setHoveredEmpire(emp.id)}
                onMouseLeave={() => setHoveredEmpire(null)}
                onClick={() => setSelectedEmpire(emp.id)}
                className={`group cursor-pointer transition-all ${hoveredEmpire === emp.id ? 'translate-x-2' : ''}`}
              >
                <span className={`text-[9px] font-mono mb-2 block ${hoveredEmpire === emp.id || selectedEmpire === emp.id ? 'text-orange-700' : 'text-stone-400 dark:text-stone-600'}`}>
                  {emp.period}
                </span>
                <h3 className={`text-lg font-black uppercase italic tracking-tighter transition-colors ${hoveredEmpire === emp.id || selectedEmpire === emp.id ? 'text-stone-900 dark:text-white' : 'text-stone-300 dark:text-stone-700'}`}>
                  {emp.name}
                </h3>
                <div className={`h-px mt-2 transition-all duration-500 ${selectedEmpire === emp.id ? 'w-full bg-orange-700' : 'w-0 group-hover:w-1/2 bg-stone-200 dark:bg-stone-800'}`} />
              </div>
            ))}
          </div>
        </aside>

        {/* MAP STAGE */}
        <section className="flex-1 relative flex items-center justify-center bg-stone-100 dark:bg-[#12100e]">
          <div className="w-full h-full p-12">
             <AfricaMap 
                activeNode={hoveredEmpire || selectedEmpire} 
                onHover={setHoveredEmpire} 
                onClick={(id) => setSelectedEmpire(id)} 
             />
          </div>

          <CultureOverlay 
            data={selectedData} 
            onCloseAction={() => setSelectedEmpire(null)} 
          />
        </section>
      </div>
    </main>
  );
}