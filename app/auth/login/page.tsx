"use client";

import { useLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

/** Allow only same-origin paths: starts with / and not // or protocol-relative. */
function isSafeRedirect(path: string | null): path is string {
  if (!path || typeof path !== "string") return false;
  const trimmed = path.trim();
  return trimmed.startsWith("/") && !trimmed.startsWith("//") && !/^https?:\/\//i.test(trimmed);
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const redirectParam = searchParams.get("redirect");
  const sessionExpired = reason === "session_expired";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin({
    onSuccess: (res) => {
      if (res?.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_TOKEN_KEY, res.token);
          if (res.user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
        }
        const target = isSafeRedirect(redirectParam) ? redirectParam : "/";
        router.push(target);
      }
    },
    onError: () => {},
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    login.mutate({ email, password });
  };

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
      {sessionExpired && (
        <p className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-2 border border-amber-200 dark:border-amber-800">
          Your session expired. Please sign in again.
        </p>
      )}
      <form className="space-y-5" method="post" onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} noValidate>
        {login.isError && (
          <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-2">
            {login.error?.message}
          </p>
        )}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email Address</label>
          <Input 
            type="email" 
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 text-[11px] font-mono focus-visible:ring-orange-800" 
            placeholder="e.g. name@domain.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Password</label>
            <Link href="/auth/forgot-password" title="Reset your password" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-orange-800 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono focus-visible:ring-orange-800 pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input type="checkbox" id="persist" className="w-4 h-4 border-stone-300 dark:border-stone-800 accent-orange-700 rounded-none" />
          <label htmlFor="persist" className="text-[10px] font-black uppercase tracking-widest text-stone-500 cursor-pointer select-none">
            Remember me
          </label>
        </div>

        <Button
          type="submit"
          disabled={login.isPending}
          className="group w-full h-14 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-800 dark:hover:bg-orange-600 transition-all disabled:opacity-60 cursor-pointer"
        >
          {login.isPending ? "Signing in…" : "Sign In"}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="space-y-8"><p className="text-stone-500 font-mono text-sm">Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}