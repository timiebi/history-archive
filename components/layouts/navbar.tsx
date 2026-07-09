"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe, useNotifications } from "@/lib/api";
import { Archive, Bell, CircleUser, LayoutDashboard, LogIn, LogOut, Menu, Moon, PenLine, Sun, X, BookOpen, Bot, Compass, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AppContainer } from "./appContainer";

const AUTH_USER_KEY = "archive_user";
const AUTH_TOKEN_KEY = "archive_token";

const NAV_LINKS = [
  { name: "Stories", href: "/stories" },
  { name: "Ask Gesi", href: "/ask" },
  { name: "Tours & Travel", href: "/visit" },
  { name: "Timelines", href: "/timelines" },
  { name: "Cultures", href: "/cultures" },
  { name: "Artifacts", href: "/artifacts" },
  { name: "Library", href: "/library" },
  { name: "Map", href: "/map" },
  { name: "Manifesto", href: "/manifesto" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string; status?: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: notifications } = useNotifications(20, {
    enabled: mounted && !!user,
  });
  const unreadCount = notifications?.unreadCount ?? 0;
  const canContribute = mounted && user && (user.role === "ADMIN" || (user.role === "CONTRIBUTOR" && user?.status === "APPROVED"));
  const showDashboardLink = mounted && user && (user.role === "ADMIN" || user.role === "CONTRIBUTOR");

  const isContributor = user?.role === "CONTRIBUTOR";
  const { data: me, isSuccess: meOk } = useMe({
    enabled: mounted && hasToken && !!isContributor,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setMounted(true);
      if (typeof window !== "undefined") {
        setHasToken(!!localStorage.getItem(AUTH_TOKEN_KEY));
        const u = localStorage.getItem(AUTH_USER_KEY);
        if (u) {
          try {
            setUser(JSON.parse(u));
          } catch {
            setUser(null);
          }
        } else setUser(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (!meOk || !me || typeof window === "undefined") return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setUser((prev) => {
        if (!prev || prev.role !== "CONTRIBUTOR") return prev;
        const next = { ...prev, status: me.status, name: me.name };
        try {
          const raw = localStorage.getItem(AUTH_USER_KEY);
          if (raw) {
            const p = JSON.parse(raw) as Record<string, unknown>;
            localStorage.setItem(
              AUTH_USER_KEY,
              JSON.stringify({
                ...p,
                status: me.status,
                name: me.name,
                email: me.email ?? p.email,
              })
            );
          }
        } catch {
          // ignore
        }
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [meOk, me]);

  const contributorBadge =
    user?.role === "CONTRIBUTOR" && (user.status === "PENDING" || user.status === "APPROVED")
      ? user.status === "APPROVED"
        ? { className: "bg-emerald-500", label: "Verified contributor" }
        : { className: "bg-amber-400", label: "Contributor — pending approval" }
      : null;

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setMobileOpen(false);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const isHome = pathname === "/";
  const onTransparentOverHero = isHome && !isScrolled;
  const linkClass = (href: string) =>
    pathname === href
      ? onTransparentOverHero ? "text-orange-400" : "text-orange-800 dark:text-orange-500"
      : onTransparentOverHero
        ? "text-stone-300 hover:text-white"
        : "text-stone-600 dark:text-stone-400";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 overflow-x-hidden ${
        isScrolled
          ? "bg-[#fafaf9]/95 dark:bg-[#0c0a09]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-0"
          : "bg-transparent py-2 sm:py-2.5"
      }`}
    >
      <AppContainer>
        <div
          className={`flex min-w-0 items-center justify-between gap-2 sm:gap-4 transition-[height] duration-300 ${
            isScrolled ? "h-12 sm:h-14" : "h-12 sm:h-14"
          }`}
        >
          <Link href="/" className="group flex flex-col leading-none shrink-0">
            <span className={`text-lg sm:text-2xl font-black uppercase italic tracking-tighter transition-colors duration-200 ${onTransparentOverHero ? "text-white group-hover:text-orange-350" : "text-stone-900 dark:text-white group-hover:text-orange-800"}`}>
              Gesi<span className={onTransparentOverHero ? "text-orange-400" : "text-orange-800 dark:text-orange-600"}>.</span>
            </span>
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] hidden sm:block ${onTransparentOverHero ? "text-stone-400" : "text-stone-500"}`}>
              Truth in Heritage
            </span>
          </Link>

          <nav className="hidden xl:flex items-center min-w-0 flex-1 justify-center gap-4 2xl:gap-6 overflow-hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] hover:text-orange-800 transition-colors duration-200 relative group ${linkClass(link.href)}`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-px transition-[width] duration-200 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  } ${onTransparentOverHero ? "bg-orange-400" : "bg-orange-800"}`}
                />
              </Link>
            ))}
          </nav>

          <div className={`flex items-center shrink-0 gap-2 sm:gap-3 ${onTransparentOverHero ? "text-stone-200" : ""}`}>
            {/* Desktop: single icon opens menu with Dashboard, Enter Archive, Theme, Sign in/out */}
            {mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`hidden sm:flex rounded-none cursor-pointer relative ${onTransparentOverHero ? "text-stone-300 hover:bg-white/10 hover:text-white" : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"}`}
                    aria-label={contributorBadge ? `Open menu (${contributorBadge.label})` : "Open menu"}
                  >
                    <span className="relative inline-flex items-center justify-center">
                      <CircleUser size={22} aria-hidden />
                      {contributorBadge && (
                        <span
                          className={`absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full ring-1 ${contributorBadge.className} ${
                            onTransparentOverHero ? "ring-stone-900/90" : "ring-[#fafaf9] dark:ring-[#0c0a09]"
                          }`}
                          title={contributorBadge.label}
                          aria-hidden
                        />
                      )}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48 rounded-none border-stone-200 dark:border-stone-800 font-mono text-xs">
                  {user && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/notifications" className="flex items-center gap-2 cursor-pointer">
                          <Bell size={16} /> Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/artifacts" className="flex items-center gap-2 cursor-pointer">
                      <Archive size={16} /> Enter Archive
                    </Link>
                  </DropdownMenuItem>
                  {showDashboardLink && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {canContribute && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/contribute" className="flex items-center gap-2 cursor-pointer">
                          <PenLine size={16} /> Submit story
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user ? (
                    <DropdownMenuItem
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.removeItem(AUTH_TOKEN_KEY);
                          localStorage.removeItem(AUTH_USER_KEY);
                          setUser(null);
                          window.location.href = "/";
                        }
                      }}
                      className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400"
                    >
                      <LogOut size={16} /> Sign out
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="flex items-center gap-2 cursor-pointer">
                        <LogIn size={16} /> Sign in
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={`hidden sm:flex rounded-none cursor-pointer ${onTransparentOverHero ? "text-stone-300 hover:bg-white/10 hover:text-white" : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"}`}
                aria-label="Open menu"
                disabled
              >
                <CircleUser size={22} aria-hidden />
              </Button>
            )}

          </div>
        </div>
      </AppContainer>

      {/* Mobile Bottom Navigation (Floating App Bar) */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#fafaf9]/85 dark:bg-[#0c0a09]/85 backdrop-blur-xl border border-stone-200/50 dark:border-stone-850/60 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-2xl pb-safe pointer-events-auto">
        <div className="h-16 flex items-center justify-around px-2">
          {[
            { name: "Stories", href: "/stories", icon: BookOpen },
            { name: "Ask Gesi", href: "/ask", icon: Bot },
            { name: "Map", href: "/map", icon: Globe },
            { name: "Library", href: "/library", icon: Compass },
          ].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 active:scale-95 ${
                  active ? "text-orange-700 dark:text-orange-400" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                }`}
              >
                <Icon size={18} className={active ? "scale-110" : "scale-100"} />
                <span className="text-[8.5px] font-mono font-bold mt-1 tracking-tighter uppercase">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 active:scale-95 cursor-pointer ${
              mobileOpen ? "text-orange-700 dark:text-orange-400" : "text-stone-600 dark:text-stone-400"
            }`}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="text-[8.5px] font-mono font-bold mt-1 tracking-tighter uppercase">More</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Bottom Sheet) */}
      <div
        className={`xl:hidden fixed inset-0 z-35 transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" />
        
        <div
          className={`absolute bottom-24 left-4 right-4 bg-[#fafaf9]/95 dark:bg-[#0c0a09]/95 backdrop-blur-xl border border-stone-200/50 dark:border-stone-850/60 p-6 rounded-2xl shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-y-0 scale-100" : "translate-y-24 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1 bg-stone-300 dark:bg-stone-800 rounded-full mx-auto mb-6" />
          
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.25em] text-orange-850 dark:text-orange-400 mb-4 block px-2">
            Gesi Sections
          </span>
          
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { name: "Timelines", href: "/timelines" },
              { name: "Cultures", href: "/cultures" },
              { name: "Artifacts", href: "/artifacts" },
              { name: "Manifesto", href: "/manifesto" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3.5 px-4 text-xs font-mono font-black uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  pathname === link.href
                    ? "text-orange-700 dark:text-orange-400 bg-orange-100/40 dark:bg-orange-950/20 border-orange-500/30"
                    : "text-stone-700 dark:text-stone-300 bg-stone-100/30 dark:bg-stone-900/30 border-stone-200/30 dark:border-stone-850/20 hover:bg-stone-100/60 dark:hover:bg-stone-900/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-200/50 dark:border-stone-850/40 my-5" />
          
          <div className="flex flex-col gap-2">
            {mounted && user && (
              <Link
                href="/notifications"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 text-xs font-mono font-black uppercase tracking-widest text-stone-700 dark:text-stone-300 hover:bg-stone-100/50 dark:hover:bg-stone-900/50 rounded-lg flex justify-between"
              >
                <span>Notifications</span>
                {unreadCount > 0 && <span className="bg-orange-800 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}
              </Link>
            )}
            
            {showDashboardLink && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 text-xs font-mono font-black uppercase tracking-widest text-stone-700 dark:text-stone-300 hover:bg-stone-100/50 dark:hover:bg-stone-900/50 rounded-lg"
              >
                Dashboard
              </Link>
            )}

            {canContribute && (
              <Link
                href="/contribute"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 text-xs font-mono font-black uppercase tracking-widest text-orange-800 dark:text-orange-500 hover:bg-orange-100/30 dark:hover:bg-orange-950/20 rounded-lg"
              >
                Submit Story
              </Link>
            )}
            
            <button
              type="button"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setMobileOpen(false);
              }}
              className="py-3 px-4 text-left text-xs font-mono font-black uppercase tracking-widest text-stone-700 dark:text-stone-300 hover:bg-stone-100/50 dark:hover:bg-stone-900/50 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Toggle theme: {theme === "dark" ? "Light" : "Dark"}
            </button>

            {mounted && user ? (
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                    localStorage.removeItem(AUTH_USER_KEY);
                    setUser(null);
                    setMobileOpen(false);
                    window.location.href = "/";
                  }
                }}
                className="py-3 px-4 text-left text-xs font-mono font-black uppercase tracking-widest text-red-650 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="py-3.5 px-4 text-center text-xs font-mono font-black uppercase tracking-widest text-white bg-stone-950 dark:bg-stone-100 dark:text-stone-950 rounded-lg hover:bg-orange-850 transition-colors duration-200"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
