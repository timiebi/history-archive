"use client";

import { useSignUp } from "@/lib/api";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AUTH_USER_KEY = "archive_user";
const AUTH_TOKEN_KEY = "archive_token";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get("role") === "contributor" ? "CONTRIBUTOR" : "READER";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"READER" | "CONTRIBUTOR">(roleFromUrl);

  useEffect(() => {
    setRole(roleFromUrl);
  }, [roleFromUrl]);

  const signUp = useSignUp({
    onSuccess: (res) => {
      if (res?.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_TOKEN_KEY, res.token);
          if (res.user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
        }
        router.push("/");
      }
    },
    onError: () => {},
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = [firstName, lastName].filter(Boolean).join(" ") || email;
    signUp.mutate({ name, email, password, role });
  };

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
      <form className="space-y-5" onSubmit={onSubmit}>
        {signUp.isError && (
          <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-2">
            {signUp.error?.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">First Name</label>
            <Input 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
              placeholder="e.g. Kofi" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Last Name</label>
            <Input 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
              placeholder="e.g. Mensah" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email Address</label>
          <Input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
            placeholder="name@example.com" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Password</label>
          <Input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono focus-visible:ring-orange-800" 
            placeholder="Create a strong password" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">I want to</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="role" checked={role === "READER"} onChange={() => setRole("READER")} className="accent-orange-700" />
              <span className="text-[10px] uppercase tracking-widest">Read & explore</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="role" checked={role === "CONTRIBUTOR"} onChange={() => setRole("CONTRIBUTOR")} className="accent-orange-700" />
              <span className="text-[10px] uppercase tracking-widest">Contribute stories</span>
            </label>
          </div>
          {role === "CONTRIBUTOR" && (
            <p className="text-[9px] text-orange-700 uppercase tracking-wider">Contributor accounts are reviewed before approval.</p>
          )}
        </div>

        <p className="text-[9px] text-stone-400 uppercase leading-relaxed tracking-wider">
          By joining, you agree to our <span className="text-stone-900 dark:text-white underline cursor-pointer">Terms of Service</span> and <span className="text-stone-900 dark:text-white underline cursor-pointer">Privacy Policy</span>.
        </p>

        <Button
          type="submit"
          disabled={signUp.isPending}
          className="w-full h-14 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-800 dark:hover:bg-orange-600 transition-colors disabled:opacity-60"
        >
          {signUp.isPending ? "Creating account…" : "Create My Account"}
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

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="space-y-8"><p className="text-stone-500 font-mono text-sm">Loading…</p></div>}>
      <SignUpForm />
    </Suspense>
  );
}