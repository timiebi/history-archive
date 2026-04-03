"use client";

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { ExternalLink, LayoutDashboard, LogOut, Menu, Settings, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ role?: string; status?: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const t = localStorage.getItem(AUTH_TOKEN_KEY);
    const u = localStorage.getItem(AUTH_USER_KEY);
    if (!t || !u) {
      router.replace("/auth/login?redirect=" + encodeURIComponent(pathname ?? "/dashboard"));
      return;
    }
    try {
      setUser(JSON.parse(u));
    } catch {
      setUser(null);
    }
  }, [pathname, router]);

  const canAccess = user?.role === "ADMIN" || user?.role === "CONTRIBUTOR";

  useEffect(() => {
    if (!mounted || !user) return;
    if (!canAccess) {
      router.replace("/");
      return;
    }
  }, [mounted, user, canAccess, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    router.replace("/");
    window.location.reload();
  };

  if (!mounted || !user || !canAccess) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center safe-area-inset">
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
      </div>
    );
  }

  const navContent = (
    <>
      <div className="p-4 md:p-6 border-b border-stone-200 dark:border-stone-800">
        <Link
          href="/dashboard"
          className="text-lg font-black uppercase italic tracking-tighter text-stone-900 dark:text-white hover:text-orange-700"
          onClick={() => setMobileOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          href="/"
          className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-orange-700 dark:hover:text-orange-400"
          onClick={() => setMobileOpen(false)}
        >
          <ExternalLink size={12} aria-hidden /> Back to site
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-none font-mono text-[10px] uppercase tracking-widest transition-colors ${
                isActive
                  ? "bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-400"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={16} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-stone-200 dark:border-stone-800">
        <Link
          href="/contribute"
          onClick={() => setMobileOpen(false)}
          className="flex items-center mb-2 px-4 py-3 min-h-[44px] rounded-none font-mono text-[10px] uppercase tracking-widest text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30"
        >
          Submit story
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 min-h-[44px] rounded-none font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900"
          aria-label="Sign out"
        >
          <LogOut size={16} aria-hidden />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09]">
      {/* Dashboard-only header (mobile) — no main app Navbar here */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 z-40 flex items-center justify-between px-4 safe-area-inset-top">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-none"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/dashboard" className="text-sm font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
          Dashboard
        </Link>
        <Link
          href="/"
          className="text-stone-500 font-mono text-[10px] uppercase tracking-widest hover:text-orange-700 flex items-center gap-1"
        >
          <ExternalLink size={14} aria-hidden /> Site
        </Link>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar: drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 max-w-[85vw] border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 z-30 flex flex-col transition-transform duration-200 ease-out
          md:translate-x-0 md:w-56
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Dashboard navigation"
      >
        <div className="pt-14 md:pt-0 md:flex md:flex-col md:flex-1">
          {navContent}
        </div>
      </aside>

      {/* Main content */}
      <div className="pt-14 md:pt-0 md:pl-56 min-h-screen">{children}</div>
    </div>
  );
}
