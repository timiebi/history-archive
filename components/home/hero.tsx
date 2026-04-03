"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HERO_IMG = "/hero-home.png";

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let ticking = false;
    const handleMove = (e: MouseEvent) => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 12,
            y: (e.clientY / window.innerHeight - 0.5) * 12,
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative h-[85vh] sm:h-[95vh] w-full flex items-center justify-center overflow-hidden bg-stone-900">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 w-full h-full scale-110"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        >
          <Image
            src={HERO_IMG}
            alt="Dryland rural landscape with footpath, trees, and open sky — Afri Archive"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-[0.72] grayscale-[0.2]"
            priority
          />
        </div>

        <div
          className="absolute top-0 left-0 w-full h-0.5 bg-orange-700/50 z-10 shadow-[0_0_15px_rgba(194,65,12,0.8)] animate-scan-line"
          aria-hidden
        />

        <div className="absolute inset-0 bg-linear-to-b from-stone-950/50 via-stone-900/20 to-[#fafaf9] dark:to-[#0c0a09] z-10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10" />
      </div>

      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-orange-400 sm:text-orange-500 font-black tracking-[0.35em] sm:tracking-[0.5em] uppercase text-[9px] sm:text-[10px] mb-4 sm:mb-5 block">
            Afri Archive · African history
          </span>
          <p className="text-stone-200/95 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            The living archive — digital repatriation, open access, and stories from kingdoms, villages, and
            descendant communities across the continent.
          </p>
          <h1 className="text-[11vw] sm:text-[10vw] md:text-[8vw] font-black uppercase italic tracking-tighter leading-[0.75] text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.55)]">
            Heritage <br />
            <span className="text-transparent stroke-text">Unveiled.</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/stories"
              className="inline-flex items-center justify-center min-h-[48px] px-8 bg-orange-700 text-white font-mono text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-800 transition-colors border border-orange-600/80"
            >
              Explore stories
            </Link>
            <Link
              href="/ask"
              className="inline-flex items-center justify-center min-h-[48px] px-8 bg-white/10 text-white font-mono text-[10px] font-black uppercase tracking-[0.2em] border border-white/30 hover:bg-white/15 backdrop-blur-sm transition-colors"
            >
              Ask the archive
            </Link>
            <Link
              href="/contribute"
              className="inline-flex items-center justify-center min-h-[48px] px-6 text-stone-200 font-mono text-[10px] font-black uppercase tracking-[0.2em] underline-offset-4 hover:text-white hover:underline"
            >
              Contribute
            </Link>
          </motion.div>
        </motion.div>

        {/* <div className="absolute -right-16 xl:-right-24 top-1/2 -translate-y-1/2 hidden lg:block text-left border-l border-orange-600/70 pl-4 opacity-90 max-w-44">
          <div className="font-mono text-[8px] text-orange-400 space-y-1.5 uppercase tracking-widest">
            <p>Focus: Continent-wide</p>
            <p>Mission: Open access</p>
            <p>Voices: Communities</p>
            <p>Archive: Living</p>
          </div>
        </div> */}
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.35);
        }
        :global(.dark) .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}
