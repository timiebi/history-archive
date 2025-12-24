"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Optional: Track mouse for a subtle parallax depth effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden bg-stone-900">
      {/* 1. BACKGROUND IMAGE WITH SCANNER OVERLAY */}
      <div className="absolute inset-0 z-0">
        <motion.img
          style={{ 
            scale: 1.1,
            x: mousePos.x * 20,
            y: mousePos.y * 20
          }}
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000" 
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
          alt="Hero Archive"
        />
        
        {/* THE SCANNING LINE */}
        <motion.div 
          animate={{ translateY: ["0vh", "95vh"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-0.5 bg-orange-700/50 z-10 shadow-[0_0_15px_rgba(194,65,12,0.8)]"
        />

        {/* VIGNETTE & GRAIN */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#fafaf9] dark:to-[#0c0a09] z-10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10" />
      </div>

      {/* 2. CORE CONTENT */}
      <div className="relative z-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-orange-700 font-black tracking-[0.8em] uppercase text-[10px] mb-6 block">
            Establishing_Link // Archive_Sovereign
          </span>
          <h1 className="text-[12vw] font-black uppercase italic tracking-tighter leading-[0.75] text-white mix-blend-difference">
            Heritage <br /> 
            <span className="text-transparent stroke-text">Unveiled.</span>
          </h1>
        </motion.div>

        {/* 3. LIVE METADATA (Floating near center) */}
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -right-20 top-1/2 hidden lg:block text-left border-l border-orange-700 pl-4"
        >
          <div className="font-mono text-[8px] text-orange-700 space-y-1 uppercase tracking-widest">
            <p>Lat: 12.5211° N</p>
            <p>Long: 4.8672° E</p>
            <p>Res: 8K_Omni_Scan</p>
            <p>Status: Authenticated</p>
          </div>
        </motion.div>
      </div>

      {/* CSS FOR THE OUTLINE TEXT */}
      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }
        :global(.dark) .stroke-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.1);
        }
      `}</style>
    </section>
  );
}