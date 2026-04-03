"use client";

import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { motion } from "framer-motion";
import { BookOpen, LayoutDashboard, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ContributorWelcomeInner() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const t = localStorage.getItem(AUTH_TOKEN_KEY);
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!t || !raw) {
      router.replace("/auth/signup?role=contributor");
      return;
    }
    try {
      const u = JSON.parse(raw) as { role?: string; status?: string };
      if (u.role !== "CONTRIBUTOR") {
        router.replace("/");
        return;
      }
      if (u.status === "APPROVED") {
        router.replace("/dashboard");
        return;
      }
      Promise.resolve().then(() => {
        if (cancelled) return;
        setShow(true);
        setReady(true);
      });
    } catch {
      router.replace("/auth/login");
      return;
    }
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready || !show) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center px-6">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
          <UserPlus size={32} className="text-green-700 dark:text-green-400" aria-hidden />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
            Thank you — application received
          </h1>
          <p className="text-stone-500 font-serif text-lg leading-relaxed">
            Contributor access requires approval. Your account is in the review queue; we&apos;ll email you when you&apos;re verified (typically
            within a few business days). Until then, browse the archive and complete your profile from the dashboard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="inline-flex">
            <Button className="w-full sm:w-auto rounded-none font-black uppercase tracking-widest h-12 px-6">
              <LayoutDashboard size={16} className="mr-2 shrink-0" aria-hidden />
              Go to my dashboard
            </Button>
          </Link>
          <Link href="/stories" className="inline-flex">
            <Button variant="outline" className="w-full sm:w-auto rounded-none font-black uppercase tracking-widest h-12 px-6">
              <BookOpen size={16} className="mr-2 shrink-0" aria-hidden />
              Browse stories
            </Button>
          </Link>
        </div>
        <Link
          href="/"
          className="inline-block font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-orange-700 dark:hover:text-orange-400"
        >
          Continue to home
        </Link>
      </motion.div>
    </main>
  );
}

export default function ContributorWelcomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center px-6">
          <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Loading…</p>
        </main>
      }
    >
      <ContributorWelcomeInner />
    </Suspense>
  );
}
