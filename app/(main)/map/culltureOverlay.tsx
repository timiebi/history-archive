"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Landmark, Languages, Info } from "lucide-react";

export function CultureOverlay({ data, onCloseAction }: { data: any; onCloseAction: () => void }) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-full md:w-96 bg-[#0c0a09]/95 backdrop-blur-xl border-l border-stone-800 z-50 p-12 flex flex-col shadow-2xl"
        >
          <button onClick={onCloseAction} className="self-end text-stone-500 hover:text-white transition-colors mb-16">
            <X size={20} />
          </button>

          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-700 mb-4 block">
            System_Analysis // Data_Node
          </span>
          
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-12 leading-[0.8]">
            {data.name}
          </h2>

          <div className="space-y-10 flex-1">
            <div className="flex gap-4">
              <Landmark size={18} className="text-orange-700 shrink-0" />
              <div>
                <h4 className="text-[9px] font-mono text-stone-600 uppercase tracking-widest mb-1">Political Center</h4>
                <p className="text-white font-serif italic text-lg">{data.capital}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Languages size={18} className="text-orange-700 shrink-0" />
              <div>
                <h4 className="text-[9px] font-mono text-stone-600 uppercase tracking-widest mb-1">Primary Tongue</h4>
                <p className="text-white font-serif italic text-lg">{data.language}</p>
              </div>
            </div>

            <div className="pt-10 border-t border-stone-900">
               <div className="flex items-center gap-2 mb-4">
                 <Info size={14} className="text-stone-600" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-stone-600">Briefing</span>
               </div>
               <p className="text-stone-400 font-serif italic leading-relaxed text-lg">
                 {data.desc}
               </p>
            </div>
          </div>

          <button className="w-full py-4 bg-orange-800 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-700 transition-colors">
            Access Full Chronicle
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}