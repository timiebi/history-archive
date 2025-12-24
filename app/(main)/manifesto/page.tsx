"use client";

import { motion } from "framer-motion";
import { Fingerprint, ShieldCheck, Zap } from "lucide-react";

export default function ManifestoPage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-900 dark:bg-[#0c0a09] dark:text-white transition-colors duration-700 selection:bg-orange-700 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="h-[90vh] flex flex-col items-center justify-center px-6 text-center border-b border-stone-200 dark:border-stone-900">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-orange-700 font-black tracking-[0.6em] uppercase text-[10px] mb-8"
        >
          Project_Sovereign // Mission_Statement
        </motion.span>
        <h1 className="text-7xl md:text-[12rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-12">
          Reclaim <br /> 
          <span className="text-stone-300 dark:text-stone-800 transition-colors">The Legacy.</span>
        </h1>
        <p className="max-w-2xl text-stone-500 dark:text-stone-400 font-serif italic text-xl md:text-2xl leading-relaxed">
          "History is not just what happened in the past; it is the foundation upon which we build our future. Digital repatriation is the act of bringing home what was never meant to be lost."
        </p>
      </section>

      {/* THE THREE PILLARS */}
      <section className="grid md:grid-cols-3 border-b border-stone-200 dark:border-stone-900">
        {[
          {
            title: "Preservation",
            icon: ShieldCheck,
            desc: "Using high-fidelity 3D scanning and archival imaging to ensure that every bronze, terracotta, and gold leaf is preserved in digital perpetuity."
          },
          {
            title: "Access",
            icon: Zap,
            desc: "Breaking the walls of traditional institutions to provide universal, open-source access to the intellectual and artistic wealth of African kingdoms."
          },
          {
            title: "Sovereignty",
            icon: Fingerprint,
            desc: "Returning the narrative power to the descendant communities, allowing history to be told by the bloodlines that created it."
          }
        ].map((pillar, i) => (
          <div key={i} className="p-12 md:p-20 border-r last:border-r-0 border-stone-200 dark:border-stone-900 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors group">
            <pillar.icon size={32} className="text-orange-700 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{pillar.title}</h3>
            <p className="text-stone-500 dark:text-stone-500 font-serif leading-relaxed text-lg italic">{pillar.desc}</p>
          </div>
        ))}
      </section>

      {/* THE MANIFESTO TEXT */}
      <section className="max-w-5xl mx-auto py-32 px-6">
        <div className="space-y-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic sticky top-32">
              The Digital <br /> Repatriation <br /> <span className="text-orange-700">Protocol.</span>
            </h2>
            <div className="text-stone-600 dark:text-stone-400 font-serif text-xl leading-relaxed space-y-8 italic">
              <p>
                For centuries, the physical remnants of Africa's great empires—from the Ivory of Benin to the gold of Mapungubwe—have sat in foreign vaults, thousands of miles from their soil of origin.
              </p>
              <p>
                While physical return is a complex geopolitical struggle, <strong>Digital Repatriation</strong> is an immediate act of defiance. We create high-resolution digital twins that cannot be stolen, cannot be hidden, and cannot be erased.
              </p>
            </div>
          </div>

          {/* ETHICS BLOCK */}
          <div className="p-12 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30 backdrop-blur-md">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-700 mb-6 text-center">Data Ethics & Provenance</h4>
             <div className="grid md:grid-cols-2 gap-12 text-[11px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-loose">
                <p>
                   All data points are verified by hereditary historians and contemporary archaeologists. We do not claim ownership of these records; we act only as temporary stewards of the digital signal.
                </p>
                <p>
                   Open Access is our default state. This archive is free for researchers, students, and artists worldwide, ensuring the "Great Library" is never truly closed again.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="h-screen flex flex-col items-center justify-center border-t border-stone-200 dark:border-stone-900">
         <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-center mb-12">
            The past is <br /> <span className="text-stone-300 dark:text-stone-700">loading...</span>
         </h2>
         <div className="flex gap-6">
            <button className="px-10 py-4 bg-orange-700 text-white hover:bg-stone-900 dark:hover:bg-white dark:hover:text-black transition-all font-black uppercase text-xs tracking-widest">
                Support the Archive
            </button>
            <button className="px-10 py-4 border border-stone-300 dark:border-stone-800 hover:border-orange-700 transition-all font-black uppercase text-xs tracking-widest">
                Contribute Research
            </button>
         </div>
      </section>
    </main>
  );
}