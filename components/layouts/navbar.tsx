"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AppContainer } from "./appContainer";
import { ThemeToggle } from "./themeToggle";
import { Menu, X } from "lucide-react";

const AUTH_USER_KEY = "archive_user";
const AUTH_TOKEN_KEY = "archive_token";

const NAV_LINKS = [
  { name: "Stories", href: "/stories" },
  { name: "Timelines", href: "/timelines" },
  { name: "Cultures", href: "/cultures" },
  { name: "Artifacts", href: "/artifacts" },
  { name: "Library", href: "/library" },
  { name: "Map", href: "/map" },
  { name: "Manifesto", href: "/manifesto" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string; status?: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const u = localStorage.getItem(AUTH_USER_KEY);
      if (u) {
        try {
          setUser(JSON.parse(u));
        } catch {
          setUser(null);
        }
      } else setUser(null);
    }
  }, [pathname]);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkClass = (href: string) =>
    pathname === href
      ? "text-orange-800 dark:text-orange-500"
      : isScrolled
        ? "text-stone-600 dark:text-stone-400"
        : "text-gray-400 dark:text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 ${
        isScrolled
          ? "bg-[#fafaf9]/90 dark:bg-[#0c0a09]/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-0"
          : "bg-transparent py-3 sm:py-4"
      }`}
    >
      <AppContainer>
        <div
          className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${
            isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-24"
          }`}
        >
          <Link href="/" className="group flex flex-col leading-none shrink-0">
            <span className="text-lg sm:text-xl font-black uppercase italic tracking-tighter group-hover:text-orange-800 transition-colors duration-200">
              African<span className="text-orange-800 dark:text-orange-600">History</span>
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.35em] text-stone-500 hidden sm:block">
              The Living Archive
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] hover:text-orange-800 transition-colors duration-200 relative group ${linkClass(link.href)}`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-orange-800 transition-[width] duration-200 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {mounted && user ? (
              <>
                {(user.role === "ADMIN" || (user.role === "CONTRIBUTOR" && user.status === "APPROVED")) && (
                  <Link href="/contribute" className="hidden sm:block">
                    <Button
                      variant="outline"
                      className="text-[10px] cursor-pointer font-black uppercase tracking-widest rounded-none border-orange-800 text-orange-800 hover:bg-orange-800 hover:text-white transition-colors duration-200"
                    >
                      Submit story
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="text-[10px] cursor-pointer font-black uppercase tracking-widest hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors duration-200 hidden sm:inline-flex"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.removeItem(AUTH_TOKEN_KEY);
                      localStorage.removeItem(AUTH_USER_KEY);
                      setUser(null);
                      window.location.href = "/";
                    }
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/auth/login" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="text-[10px] cursor-pointer font-black uppercase tracking-widest hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors duration-200"
                >
                  Sign in
                </Button>
              </Link>
            )}
            <Link href="/artifacts" className="hidden sm:block">
              <Button className="bg-stone-900 cursor-pointer dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-[10px] font-black uppercase tracking-widest rounded-none px-4 sm:px-6 hover:bg-orange-800 dark:hover:bg-orange-600 transition-colors duration-200">
                Enter Archive
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-md text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-200"
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
        className={`md:hidden fixed inset-0 top-18 z-40 bg-[#fafaf9] dark:bg-[#0c0a09] transition-[opacity,visibility] duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col p-6 gap-1 overflow-auto max-h-[calc(100vh-4.5rem)]">
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
