"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function CategoryFilter({ onChangeAction }: { onChangeAction?: (c: string) => void }) {
  const [selected, setSelected] = useState("All");
  const categories = ["All", "Kingdoms", "Ancient Africa", "Egypt", "Civilizations"];

  return (
    <div className="border-y border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0a09] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-10 py-6 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelected(category);
                onChangeAction?.(category);
              }}
              className={`relative cursor-pointer text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                selected === category ? "text-orange-700" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              {category}
              {selected === category && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-6.25 left-0 right-0 h-1 bg-orange-700" 
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}