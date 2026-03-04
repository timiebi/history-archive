"use client";

import { useContributorOverview } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Clock, Plus, Settings, User } from "lucide-react";

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ role?: string; status?: string; name?: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const t = localStorage.getItem(AUTH_TOKEN_KEY);
      const u = localStorage.getItem(AUTH_USER_KEY);
      if (t && u) {
        try {
          setUser(JSON.parse(u));
        } catch {
          setUser(null);
        }
      } else setUser(null);
    }
  }, []);

  const canAccess =
    user?.role === "ADMIN" || (user?.role === "CONTRIBUTOR" && user?.status === "APPROVED");
  const { data: overview, isPending, isError } = useContributorOverview({
    enabled: mounted && !!canAccess && !!localStorage.getItem(AUTH_TOKEN_KEY),
  });

  if (!mounted || !user || !canAccess) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Loading…</p>
      </main>
    );
  }

  const myStories = overview?.myStories ?? [];
  const myTimelines = overview?.myTimelines ?? [];
  const isApproved =
    user.role === "ADMIN" || (user.role === "CONTRIBUTOR" && user.status === "APPROVED");

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] py-8 sm:py-12 md:py-16 px-4 sm:px-6 safe-area-inset">
      <div className="max-w-4xl mx-auto">
        {/* Hero / welcome */}
        <div className="flex flex-col gap-6 mb-10 sm:mb-12">
          <div>
            <p className="flex items-center gap-2 mb-2 text-orange-700 dark:text-orange-400 font-mono text-[10px] uppercase tracking-[0.3em]">
              <LayoutDashboard size={16} aria-hidden />
              Contributor dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
              Welcome{user.name ? `, ${user.name}` : ""}
            </h1>
            <p className="text-stone-500 mt-2 font-mono text-xs max-w-xl">
              {isApproved
                ? "Your stories and timelines appear below."
                : "Your account is pending review."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <Link href="/contribute" className="inline-flex">
              <Button className="rounded-none font-black uppercase tracking-widest text-[10px] gap-2 h-11 min-h-[44px] w-full sm:w-auto">
                <Plus size={14} aria-hidden /> Start a new story
              </Button>
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest">
              <Link href="/dashboard/settings" className="text-stone-500 hover:text-orange-700 dark:hover:text-orange-400 py-2 min-h-[44px] flex items-center">
                <Settings size={14} className="mr-2" aria-hidden /> Settings
              </Link>
              <Link href="/dashboard/profile" className="text-stone-500 hover:text-orange-700 dark:hover:text-orange-400 py-2 min-h-[44px] flex items-center">
                <User size={14} className="mr-2" aria-hidden /> Profile
              </Link>
            </div>
          </div>
        </div>

        {isPending && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500 py-8">
            Loading your content…
          </p>
        )}
        {isError && (
          <p className="font-mono text-[10px] uppercase text-red-600 dark:text-red-400 py-4">
            Could not load dashboard. Check your connection and try again.
          </p>
        )}

        {!isPending && !isError && (
          <div className="space-y-10 sm:space-y-14">
            {/* My Stories */}
            <section>
              <h2 className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-black uppercase tracking-widest text-xs mb-4">
                <FileText size={16} aria-hidden /> My stories
              </h2>
              {myStories.length === 0 ? (
                <div className="border border-stone-200 dark:border-stone-800 rounded-none p-6 sm:p-8 text-center">
                  <p className="text-stone-500 font-mono text-sm mb-4">No stories yet.</p>
                  <Link href="/contribute">
                    <Button variant="outline" className="rounded-none font-mono text-[10px] uppercase min-h-[44px]">
                      Submit your first story
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2 sm:space-y-3">
                  {myStories.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/stories/${s.id}`}
                        className="block border border-stone-200 dark:border-stone-800 rounded-none p-4 sm:p-4 min-h-[44px] hover:border-orange-400 dark:hover:border-orange-600 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2">
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {s.title}
                          </span>
                          <span className="text-stone-400 font-mono text-[10px] shrink-0">
                            {formatDate(s.createdAt)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-stone-500 font-mono text-[10px] uppercase tracking-wider">
                          {s.timelineName && <span>{s.timelineName}</span>}
                          {s.countryName && <span>{s.countryName}</span>}
                          <span>{s.categoryName}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* My Timelines */}
            <section>
              <h2 className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-black uppercase tracking-widest text-xs mb-4">
                <Clock size={16} aria-hidden /> My timelines
              </h2>
              {myTimelines.length === 0 ? (
                <div className="border border-stone-200 dark:border-stone-800 rounded-none p-6 sm:p-8 text-center">
                  <p className="text-stone-500 font-mono text-sm">
                    No timelines yet. Attach a story to a timeline or create one when submitting — it will appear here.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  {myTimelines.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/timelines/${t.id}`}
                        className="block border border-stone-200 dark:border-stone-800 rounded-none p-4 sm:p-5 min-h-[44px] hover:border-orange-400 dark:hover:border-orange-600 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                      >
                        <h3 className="font-semibold text-stone-900 dark:text-white">{t.name}</h3>
                        <p className="text-stone-500 font-mono text-[10px] mt-1 uppercase tracking-wider">
                          {formatYear(t.startYear)}
                          {t.endYear != null ? ` – ${formatYear(t.endYear)}` : ""}
                        </p>
                        <p className="text-stone-400 text-xs mt-2">
                          {t.storyCount} story{t.storyCount !== 1 ? "ies" : ""}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
