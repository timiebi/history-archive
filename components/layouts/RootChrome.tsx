"use client";

import dynamic from "next/dynamic";

const SearchOverlay = dynamic(
  () => import("@/components/searchOverlay").then((m) => m.SearchOverlay),
  { ssr: false }
);

/** Client-only shell pieces so the root layout stays a Server Component. */
export function RootChrome() {
  return <SearchOverlay />;
}
