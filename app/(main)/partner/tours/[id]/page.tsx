"use client";

import { PartnerTourEditor } from "@/components/partner/PartnerTourEditor";
import {
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import { usePartnerTour } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PartnerEditTourPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { mounted, hasToken } = usePartnerAuthGate();
  const { org, isPending: orgPending } = usePartnerWorkspace(mounted && hasToken);
  const verified = org?.status === "VERIFIED";
  const tourQuery = usePartnerTour(id, {
    enabled: mounted && hasToken && verified && !!id,
  });

  if (!mounted || !hasToken || orgPending) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
    );
  }
  if (!org || !verified) {
    return (
      <p className="text-sm text-stone-600">
        Only verified partners can edit tours.{" "}
        <Link href="/partner" className="underline text-orange-800">
          Back
        </Link>
      </p>
    );
  }
  if (tourQuery.isPending) {
    return <p className="text-sm text-stone-500">Loading tour…</p>;
  }
  if (tourQuery.isError || !tourQuery.data) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-700">
          {tourQuery.error?.message ?? "Tour not found for your organization."}
        </p>
        <Link href="/partner/tours" className="text-sm underline text-orange-800">
          Back to tours
        </Link>
      </div>
    );
  }

  return <PartnerTourEditor tourId={id} initial={tourQuery.data} />;
}
