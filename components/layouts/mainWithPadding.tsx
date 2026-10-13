"use client";

import { usePathname } from "next/navigation";

export function MainWithPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExploreHome = pathname === "/explore";
  return (
    <main className={`min-h-screen ${isExploreHome ? "" : "pt-14 sm:pt-16"}`}>
      {children}
    </main>
  );
}
