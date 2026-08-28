"use client";

import { PartnerTourEditor } from "@/components/partner/PartnerTourEditor";
import {
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import Link from "next/link";

export default function PartnerNewTourPage() {
  const { mounted, hasToken } = usePartnerAuthGate();
  const { org, isPending } = usePartnerWorkspace(mounted && hasToken);

  if (!mounted || !hasToken || isPending) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
    );
  }
  if (!org || org.status !== "VERIFIED") {
    return (
      <p className="text-sm text-stone-600">
        Only verified partners can create tours.{" "}
        <Link href="/partner/tours" className="underline text-orange-800">
          Back to tours
        </Link>
      </p>
    );
  }

  return <PartnerTourEditor />;
}
