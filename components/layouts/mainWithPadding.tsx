"use client";

import { usePathname } from "next/navigation";

export function MainWithPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <main className={`min-h-screen ${isHome ? "" : "pt-14 sm:pt-16"}`}>
      {children}
    </main>
  );
}
