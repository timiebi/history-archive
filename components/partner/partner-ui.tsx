"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/partner", label: "Overview", exact: true },
  { href: "/partner/organization", label: "Organization" },
  { href: "/partner/team", label: "Team" },
  { href: "/partner/tours", label: "Tours" },
  { href: "/partner/claims", label: "Claims" },
] as const;

export function PartnerWorkspaceNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-1 border-b border-stone-200 dark:border-stone-800 mb-8"
      aria-label="Partner workspace"
    >
      {LINKS.map(({ href, label, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-3 text-xs font-mono uppercase tracking-widest min-h-[44px] inline-flex items-center border-b-2 -mb-px transition-colors ${
              active
                ? "border-orange-700 text-orange-800 dark:border-orange-400 dark:text-orange-400"
                : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PartnerStatusBadge({ status }: { status: string }) {
  const tone =
    status === "VERIFIED"
      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
      : status === "PENDING_REVIEW"
        ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
        : status === "NEEDS_INFO"
          ? "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300"
          : status === "REJECTED"
            ? "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300"
            : status === "SUSPENDED"
              ? "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300"
              : "bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-300";

  return (
    <span className={`inline-flex px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest ${tone}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
