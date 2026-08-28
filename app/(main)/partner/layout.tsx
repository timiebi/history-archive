"use client";

import { PartnerWorkspaceNav } from "@/components/partner/partner-ui";
import {
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mounted, hasToken } = usePartnerAuthGate();
  const { org, isPending, isError } = usePartnerWorkspace(mounted && hasToken);

  useEffect(() => {
    if (!mounted) return;
    if (!hasToken) {
      router.replace("/auth/login?redirect=" + encodeURIComponent(pathname || "/partner"));
    }
  }, [mounted, hasToken, router, pathname]);

  const showNav = !!org && !isPending && !isError;

  if (!mounted || !hasToken) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {showNav && <PartnerWorkspaceNav />}
      {children}
    </div>
  );
}
