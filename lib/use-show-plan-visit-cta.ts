"use client";

import { useTourismPartners } from "@/lib/api";

/** True when the bottom “Plan your visit” block will render (API returned partners). */
export function useShowPlanVisitCta(storyId: string | null | undefined): boolean {
  const id = typeof storyId === "string" ? storyId.trim() : "";
  const { data = [], isSuccess } = useTourismPartners(
    { storyId: id || null },
    { enabled: Boolean(id) }
  );
  return isSuccess && data.length > 0;
}
