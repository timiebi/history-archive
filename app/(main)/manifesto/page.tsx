"use client";

import { motion } from "framer-motion";
import { Fingerprint, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function ManifestoPage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-900 dark:bg-[#0c0a09] dark:text-white transition-colors duration-700 selection:bg-orange-700 selection:text-white">
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center border-b border-stone-200 dark:border-stone-900 py-20">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-orange-700 dark:text-orange-500 font-black tracking-[0.6em] uppercase text-[10px] mb-8"
        >
          Why we built this
        </motion.span>
        <h1 className="text-7xl md:text-[12rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-12 max-w-[min(100%,1200px)]">
          Reclaim <br />
          <span className="text-stone-300 dark:text-stone-800 transition-colors">The Legacy.</span>
        </h1>
        <p className="max-w-2xl text-stone-500 dark:text-stone-400 font-serif italic text-xl md:text-2xl leading-relaxed">
          We are building a shared home for African history - stories, objects, and texts that people can
          read, study, and contribute to without barriers.
        </p>
      </section>

      <section className="grid md:grid-cols-3 border-b border-stone-200 dark:border-stone-900">
        {[
          {
            title: "Preservation",
            icon: ShieldCheck,
            desc: "We document fragile materials carefully so they remain available for future generations, even when originals are difficult to access.",
          },
          {
            title: "Access",
            icon: Zap,
            desc: "Students, teachers, researchers, and communities should be able to use this records library freely and clearly.",
          },
          {
            title: "Sovereignty",
            icon: Fingerprint,
            desc: "Communities connected to this history should help shape how it is described, interpreted, and shared.",
          },
        ].map((pillar, i) => (
          <div
            key={i}
            className="p-10 md:p-16 border-r last:border-r-0 border-stone-200 dark:border-stone-900 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors group"
          >
            <pillar.icon size={32} className="text-orange-700 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{pillar.title}</h3>
            <p className="text-stone-500 dark:text-stone-500 font-serif leading-relaxed text-lg italic">{pillar.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto py-24 md:py-32 px-6">
        <div className="space-y-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic sticky top-32">
              The Digital <br /> Repatriation <br /> <span className="text-orange-700">Protocol.</span>
            </h2>
            <div className="text-stone-600 dark:text-stone-400 font-serif text-xl leading-relaxed space-y-8 italic">
              <p>
                Many African records and objects are still held far from the people and places they come from.
                Physical return often moves slowly.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-200 not-italic">Digital repatriation</strong>{" "}
                helps now: we publish high-quality records, context, and sources so knowledge is visible, usable,
                and not locked away.
              </p>
            </div>
          </div>

          <div className="p-12 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30 backdrop-blur-md">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-700 mb-6 text-center">
              Data Ethics & Provenance
            </h4>
            <div className="grid md:grid-cols-2 gap-12 text-[11px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-loose">
              <p>
                We cite sources, partner institutions, and contributors. We do not claim ownership of these
                histories; we maintain and connect records responsibly.
              </p>
              <p>
                Open access is our default where permissions allow, so people can learn, teach, and create with
                this material.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center border-t border-stone-200 dark:border-stone-900 px-6 py-24">
        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-center mb-12">
          Help grow <br /> <span className="text-stone-300 dark:text-stone-700">Gesi.</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/contribute"
            className="inline-flex items-center justify-center px-10 py-4 bg-orange-700 text-white hover:bg-stone-900 dark:hover:bg-white dark:hover:text-black transition-all font-black uppercase text-xs tracking-widest"
          >
            Contribute
          </Link>
          <Link
            href="/stories"
            className="inline-flex items-center justify-center px-10 py-4 border border-stone-300 dark:border-stone-800 hover:border-orange-700 transition-all font-black uppercase text-xs tracking-widest"
          >
            Explore stories
          </Link>
        </div>
      </section>
    </main>
  );
}
