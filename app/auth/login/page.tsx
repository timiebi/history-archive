"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-8"
    >
      {/* 1. HEADER SECTION */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
           <ShieldCheck size={14} className="text-orange-700" />
           <span className="text-orange-700 font-mono text-[9px] uppercase tracking-[0.4em]">Secure Login</span>
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-none">
          Researcher <br /> Sign In.
        </h1>
        <p className="text-stone-500 font-serif italic text-sm">Welcome back to the Sovereign Archive.</p>
      </div>

      {/* 2. FORM SECTION */}
      <form className="space-y-5">
        <div className="space-y-1.5">
          {/* Label changed to standard "Email Address" */}
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email Address</label>
          <Input 
            type="email" 
            autoComplete="email"
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
            placeholder="e.g. name@domain.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            {/* Label changed to standard "Password" */}
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Password</label>
            <Link href="/auth/forgot-password" title="Reset your password" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-orange-800 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <Input 
            type="password" 
            autoComplete="current-password"
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono focus-visible:ring-orange-800" 
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input type="checkbox" id="persist" className="w-4 h-4 border-stone-300 dark:border-stone-800 accent-orange-700 rounded-none" />
          {/* Label changed to standard "Remember me" */}
          <label htmlFor="persist" className="text-[10px] font-black uppercase tracking-widest text-stone-500 cursor-pointer select-none">
            Remember me
          </label>
        </div>

        <Button className="group w-full h-14 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-800 dark:hover:bg-orange-600 transition-all">
          Sign In
          <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* 3. FOOTER SECTION */}
      <div className="pt-8 border-t border-stone-200 dark:border-stone-900 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-[10px] text-stone-400 uppercase tracking-widest italic">Don't have an account?</span>
        <Link href="/auth/signup">
           <Button variant="outline" className="rounded-none border-stone-200 dark:border-stone-800 text-[9px] font-black uppercase tracking-widest hover:bg-stone-100 dark:hover:bg-stone-900">
             Create Account
           </Button>
        </Link>
      </div>
    </motion.div>
  );
}