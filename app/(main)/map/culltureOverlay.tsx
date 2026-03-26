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
          <button
            type="button"
            onClick={onCloseAction}
            className="self-end text-stone-500 hover:text-white transition-colors mb-12 p-1 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
            aria-label="Close panel"
          >
            <X size={20} aria-hidden />
          </button>

          <span className="text-xs font-semibold text-orange-500 mb-3 block">Overview</span>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-10 leading-tight">
            {data.name}
          </h2>

          <div className="space-y-10 flex-1">
            <div className="flex gap-4">
              <Landmark size={18} className="text-orange-700 shrink-0" />
              <div>
                <h4 className="text-xs font-medium text-stone-500 mb-1">Capital or center</h4>
                <p className="text-white text-base leading-snug">{data.capital}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Languages size={18} className="text-orange-700 shrink-0" />
              <div>
                <h4 className="text-xs font-medium text-stone-500 mb-1">Languages</h4>
                <p className="text-white text-base leading-snug">{data.language}</p>
              </div>
            </div>

            <div className="pt-10 border-t border-stone-900">
               <div className="flex items-center gap-2 mb-4">
                 <Info size={14} className="text-stone-600" />
                 <span className="text-xs font-semibold text-stone-500">About</span>
               </div>
               <p className="text-stone-300 leading-relaxed text-sm md:text-base">
                 {data.desc ?? (data as { description?: string }).description ?? ""}
               </p>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}