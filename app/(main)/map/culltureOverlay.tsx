"use client";

// import { PlanYourVisit } from "@/components/PlanYourVisit";
import type { CultureDisplay } from "@/lib/api/mappers";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Landmark, Languages, X } from "lucide-react";

export function CultureOverlay({
  data,
  onCloseAction,
}: {
  data: CultureDisplay | null | undefined;
  onCloseAction: () => void;
}) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-full md:w-96 bg-[#0c0a09]/95 backdrop-blur-xl border-l border-stone-800 z-50 flex flex-col min-h-0 shadow-2xl"
        >
          <div className="shrink-0 flex flex-col px-8 pt-8 pb-0 md:px-10 md:pt-10">
            <button
              type="button"
              onClick={onCloseAction}
              className="self-end text-stone-500 hover:text-white transition-colors mb-8 p-1 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
              aria-label="Close panel"
            >
              <X size={20} aria-hidden />
            </button>

            <span className="text-xs font-semibold text-orange-500 mb-3 block">Overview</span>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
              {data.name}
            </h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-8 pb-10 md:px-10">
            <div className="space-y-10">
              <div className="flex gap-4">
                <Landmark size={18} className="text-orange-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-medium text-stone-500 mb-1">Capital or center</h4>
                  <p className="text-white text-base leading-snug">{data.capital ?? "—"}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Languages size={18} className="text-orange-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-medium text-stone-500 mb-1">Languages</h4>
                  <p className="text-white text-base leading-snug">{data.language ?? "—"}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-900">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={14} className="text-stone-600" />
                  <span className="text-xs font-semibold text-stone-500">About</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-sm md:text-base">
                  {data.desc ?? ""}
                </p>
              </div>

              {/* <PlanYourVisit cultureId={data.id} surface="panel" className="mt-2" /> */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}