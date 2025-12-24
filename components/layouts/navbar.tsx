"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppContainer } from "./appContainer";
import { ThemeToggle } from "./themeToggle";

export function Navbar() {
   const pathname = usePathname();
   const [isScrolled, setIsScrolled] = useState(false);

   // Background appearance functionality: triggers after 50px of scroll
   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <header
         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled
               ? "bg-[#fafaf9]/80 dark:bg-[#0c0a09]/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 py-0"
               : "bg-transparent py-4"
         }`}
      >
         <AppContainer>
            <div
               className={`mx-auto flex items-center justify-between px-4 transition-all duration-500 ${
                  isScrolled ? "h-18" : "h-24"
               }`}
            >
               {/* 1. UPGRADED LOGO */}
               <Link href="/" className="group flex flex-col leading-none">
                  <span className="text-xl font-black uppercase italic tracking-tighter group-hover:text-orange-800 transition-colors">
                     African<span className="text-orange-800 dark:text-orange-600">History</span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-500">
                     The Living Archive
                  </span>
               </Link>

               {/* 2. EDITORIAL NAV LINKS */}
               <nav className="hidden md:flex items-center gap-10">
                  {[
                     { name: "Stories", href: "/stories" },
                     { name: "Timelines", href: "/timelines" },
                     { name: "Cultures", href: "/cultures" },
                     { name: "Artifacts", href: "/artifacts" },
                     { name: "Library", href: "/library" },
                     { name: "Map", href: "/map" },
                     { name: "Manifesto", href: "/manifesto" },
                  ].map((link) => (
                     <Link
                        key={link.name}
                        href={link.href}
                        className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-orange-800 relative group ${
                           pathname === link.href
                              ? "text-orange-800"
                              :isScrolled? "text-stone-600 dark:text-stone-400":"text-gray-400 dark:text-white"
                        }`}
                     >
                        {link.name}
                        <span
                           className={`absolute -bottom-1 left-0 h-px bg-orange-800 transition-all duration-300 ${
                              pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                           }`}
                        />
                     </Link>
                  ))}
               </nav>

               {/* 3. ACTIONS (Preserving functionality) */}
               <div className="flex items-center gap-4">
                  <ThemeToggle />

                  <Link href="/auth/signup" className="hidden sm:block">
                     <Button
                        variant="ghost"
                        className="text-[10px] cursor-pointer font-black uppercase tracking-widest hover:bg-stone-100 dark:hover:bg-stone-900"
                     >
                        Sign in
                     </Button>
                  </Link>
                  <Link href="/artifacts" className="hidden sm:block">
                     <Button className="bg-stone-900 cursor-pointer dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-[10px] font-black uppercase tracking-widest rounded-none px-6 hover:bg-orange-800 dark:hover:bg-orange-600 transition-colors">
                        Enter Archive
                     </Button>
                  </Link>
               </div>
            </div>
         </AppContainer>
      </header>
   );
}
