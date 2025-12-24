"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function SignUpPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      {/* 1. HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
           <UserPlus size={14} className="text-orange-700" />
           <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em]">New Researcher</span>
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-none">
          Create <br /> Account.
        </h1>
        <p className="text-stone-500 font-serif italic text-sm">Join the global network of historical preservation.</p>
      </div>

      {/* 2. FORM */}
      <form className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">First Name</label>
            <Input 
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
              placeholder="e.g. Kofi" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Last Name</label>
            <Input 
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
              placeholder="e.g. Mensah" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email Address</label>
          <Input 
            type="email"
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
            placeholder="name@example.com" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Password</label>
          <Input 
            type="password"
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono focus-visible:ring-orange-800" 
            placeholder="Create a strong password" 
          />
        </div>

        <p className="text-[9px] text-stone-400 uppercase leading-relaxed tracking-wider">
          By joining, you agree to our <span className="text-stone-900 dark:text-white underline cursor-pointer">Terms of Service</span> and <span className="text-stone-900 dark:text-white underline cursor-pointer">Privacy Policy</span>.
        </p>

        <Button className="w-full h-14 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-800 dark:hover:bg-orange-600 transition-colors">
          Create My Account
        </Button>
      </form>

      {/* 3. FOOTER */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
        <span className="text-[10px] text-stone-400 uppercase tracking-widest italic">Already have an account?</span>
        <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-widest text-orange-800 hover:underline transition-all">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}