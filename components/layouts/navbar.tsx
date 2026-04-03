"use client";

import { Button } from "@/components/ui/button";
import { useMe, useNotifications } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, CircleUser, LayoutDashboard, PenLine, Archive, Sun, Moon, LogIn, LogOut, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AppContainer } from "./appContainer";

const AUTH_USER_KEY = "archive_user";
const AUTH_TOKEN_KEY = "archive_token";

const NAV_LINKS = [
  { name: "Stories", href: "/stories" },
  { name: "Ask Archive", href: "/ask" },
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
            <span className={`text-lg sm:text-xl font-black uppercase italic tracking-tighter transition-colors duration-200 ${onTransparentOverHero ? "text-white group-hover:text-orange-300" : "text-stone-900 dark:text-white group-hover:text-orange-800"}`}>
              African<span className={onTransparentOverHero ? "text-orange-400" : "text-orange-800 dark:text-orange-600"}>History</span>
            </span>
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.35em] hidden sm:block ${onTransparentOverHero ? "text-stone-400" : "text-stone-500"}`}>
              The Living Archive
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

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className={`xl:hidden p-2 rounded-md transition-colors duration-200 ${onTransparentOverHero ? "text-stone-300 hover:bg-white/10" : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"}`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </AppContainer>

      {/* Mobile nav overlay */}
      <div
        className={`xl:hidden fixed inset-0 top-16 z-40 bg-[#fafaf9] dark:bg-[#0c0a09] transition-[opacity,visibility] duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col p-6 gap-1 overflow-auto max-h-[calc(100vh-4rem)]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`py-3 px-4 text-sm font-black uppercase tracking-widest rounded-md transition-colors duration-200 ${
                pathname === link.href
                  ? "text-orange-800 dark:text-orange-500 bg-orange-100/50 dark:bg-orange-900/20"
                  : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-stone-200 dark:border-stone-800 my-4" />
          {mounted && user && (
            <Link href="/notifications" className="py-3 px-4 text-sm font-black uppercase tracking-widest text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md">
              Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Link>
          )}
          {mounted && (user?.role === "ADMIN" || user?.role === "CONTRIBUTOR") && (
            <Link href="/dashboard" className="py-3 px-4 text-sm font-black uppercase tracking-widest text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md">
              Dashboard
            </Link>
          )}
          {mounted && (user?.role === "ADMIN" || (user?.role === "CONTRIBUTOR" && user?.status === "APPROVED")) && (
            <Link href="/contribute" className="py-3 px-4 text-sm font-black uppercase tracking-widest text-orange-700 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-md">
              Submit story
            </Link>
          )}
          <Link href="/artifacts" className="py-3 px-4 text-sm font-black uppercase tracking-widest text-stone-900 dark:text-white bg-stone-900 dark:bg-stone-100 rounded-md hover:bg-orange-800 dark:hover:bg-orange-600 transition-colors duration-200">
            Enter Archive
          </Link>
          {mounted && user && (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem(AUTH_TOKEN_KEY);
                  localStorage.removeItem(AUTH_USER_KEY);
                  setUser(null);
                  window.location.href = "/";
                }
              }}
              className="py-3 px-4 text-left text-sm font-black uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors duration-200"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
