"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Box, Clock, Book, Shield, ArrowUpRight } from "lucide-react";

const MODULES = [
  { id: "01", name: "Artifact Vault", desc: "HD Object Scanner", icon: Box, href: "/artifacts" },
  { id: "02", name: "Chronicle Flow", desc: "Temporal Timeline", icon: Clock, href: "/timelines" },
  { id: "03", name: "Digital Folios", desc: "Manuscript Library", icon: Book, href: "/library" },
  { id: "04", name: "The Protocol", desc: "Mission Manifesto", icon: Shield, href: "/manifesto" },
];

export function ArchiveModuleGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 dark:bg-stone-900 border border-stone-200 dark:border-stone-900 shadow-2xl">
      {MODULES.map((module) => (
        <Link 
          key={module.id} 
          href={module.href}
          className="group relative bg-[#fafaf9] dark:bg-[#0c0a09] p-10 hover:bg-white dark:hover:bg-stone-950 transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-12">
            <div className="p-3 bg-stone-100 dark:bg-stone-900 group-hover:bg-orange-800 group-hover:text-white transition-all duration-500">
              <module.icon size={20} />
            </div>
            <span className="text-[10px] font-mono text-stone-400">STATUS: READY</span>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-orange-700">Section_{module.id}</span>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white flex items-center gap-2">
              {module.name}
              <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-stone-500 text-xs font-serif italic">{module.desc}</p>
          </div>

          <div className="mt-8 h-px w-full bg-stone-100 dark:bg-stone-900 overflow-hidden">
             <motion.div 
               initial={{ x: "-100%" }}
               whileHover={{ x: "0%" }}
               transition={{ duration: 0.5 }}
               className="h-full w-full bg-orange-800"
             />
          </div>
        </Link>
      ))}
    </div>
  );
}