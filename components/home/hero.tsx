"use client";

import { useTours } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Compass, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const HERO_IMG = "/hero-home.png";
const EMPIRES = ["Kingdom of Mali", "Aksumite Empire", "Kingdom of Kush", "Songhai Empire", "Great Zimbabwe"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 18,
    },
  },
} as const;

export function Hero() {
  const [empireIndex, setEmpireIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { data: tours = [], isPending: toursPending } = useTours({ limit: 20 });
  /** Featured card = first published tour from the Tourism API (no hardcoded fallbacks). */
  const featuredTour = useMemo(() => (tours.length ? tours[0] : null), [tours]);

  // Rotate empire names
  useEffect(() => {
    const timer = setInterval(() => {
      setEmpireIndex((prev) => (prev + 1) % EMPIRES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Soft mouse-tracking parallax on the featured tour card
  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotX = -(y / (rect.height / 2)) * 12;
      const rotY = (x / (rect.width / 2)) * 12;
      
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [featuredTour?.id]);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-stone-950 pt-24 lg:pt-0">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={HERO_IMG}
          alt="Ancient African landscape background"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 grayscale-[0.1]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/70 via-stone-900/10 to-[#fafaf9] dark:to-[#0c0a09] z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/20 to-stone-950/80 z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Editorial Header */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-orange-700/10 dark:bg-orange-500/5 border border-orange-500/20 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles size={11} className="text-orange-500 animate-pulse" />
              <span className="text-orange-500 font-mono text-[9px] font-black uppercase tracking-[0.25em]">
                Gesi. · Truth in Heritage
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="text-[11vw] sm:text-[9vw] lg:text-[5.5vw] font-black uppercase italic tracking-tighter leading-[0.85] text-white drop-shadow-sm"
            >
              Explore the <br />
              <span className="relative inline-block h-[1.1em] overflow-hidden text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-500 font-extrabold pr-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={empireIndex}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="absolute left-0 inline-block whitespace-nowrap"
                  >
                    {EMPIRES[empireIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-stone-300 dark:text-stone-400 font-serif text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed"
            >
              The digital gateway to Africa&apos;s sovereign records and heritage sites. Journey through verified histories, interactive timelines, and bookable guided excursions led by local custodians.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="pt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/stories"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[50px] px-8 bg-primary hover:bg-orange-800 text-white font-mono text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 rounded-lg shadow-lg shadow-orange-700/10 active:scale-98 cursor-pointer relative group overflow-hidden"
              >
                <span className="relative z-10">Explore Records</span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              </Link>
              
              <Link
                href="/visit"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[50px] px-8 bg-white/5 border border-white/15 hover:border-white/35 hover:bg-white/10 backdrop-blur-md text-white font-mono text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 rounded-lg active:scale-98 cursor-pointer relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Compass size={12} className="animate-spin-slow" />
                  <span>Explore heritage tours</span>
                </span>
                <span className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Heritage Destination Card Showcase */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="w-full max-w-sm"
          >
            {toursPending ? (
              <div className="relative w-full aspect-[4/5] rounded-2xl border border-white/10 bg-stone-900/60 animate-pulse" />
            ) : featuredTour ? (
              <div
                ref={cardRef}
                className="relative w-full aspect-[4/5] bg-stone-900/60 backdrop-blur-lg border border-white/10 p-5 rounded-2xl shadow-2xl transition-all duration-200 ease-out flex flex-col justify-between overflow-hidden group/card cursor-pointer"
              >
                <div className="absolute inset-0 z-0">
                  {featuredTour.img ? (
                    <Image
                      src={featuredTour.img}
                      alt={featuredTour.name}
                      fill
                      className="object-cover opacity-35 group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      unoptimized
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-orange-850 text-white text-[8px] font-mono font-black tracking-widest uppercase px-2.5 py-1 rounded-sm">
                    Recommended Tour
                  </span>
                  {featuredTour.rating ? (
                    <div className="flex items-center gap-1 text-amber-400 font-mono text-[9px] font-black">
                      <span>★</span> <span>{featuredTour.rating}</span>
                    </div>
                  ) : null}
                </div>

                <div className="relative z-10 space-y-4 pt-16">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-stone-300 text-[9px] font-mono uppercase tracking-wider">
                      <MapPin size={10} className="text-orange-500" />
                      <span>{featuredTour.dest}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black uppercase text-white leading-tight">
                      {featuredTour.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-serif italic line-clamp-2 leading-relaxed">
                      {featuredTour.desc}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
                      Duration: <span className="text-white">{featuredTour.duration}</span>
                    </div>
                    <div className="text-xs font-mono font-black text-white">
                      ${featuredTour.price.toLocaleString()}{" "}
                      <span className="text-[9px] font-normal text-stone-400">/ person</span>
                    </div>
                  </div>

                  <Link
                    href={`/visit/${featuredTour.slug}`}
                    className="w-full py-3 bg-linear-to-r from-amber-700 to-orange-800 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] transition-all cursor-pointer"
                  >
                    <span>View expedition</span>
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/visit"
                className="relative w-full aspect-[4/5] rounded-2xl border border-white/10 bg-stone-900/60 backdrop-blur-lg p-6 flex flex-col justify-end gap-3 hover:border-white/25 transition"
              >
                <span className="text-[8px] font-mono font-black tracking-widest uppercase text-orange-500">
                  Tours &amp; Travel
                </span>
                <h3 className="text-xl font-black uppercase text-white leading-tight">
                  Explore heritage expeditions
                </h3>
                <span className="inline-flex items-center gap-2 text-[9px] font-mono font-black uppercase tracking-widest text-white">
                  Browse tours <ArrowRight size={10} />
                </span>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
