"use client";

import { useTourismPartners } from "@/lib/api";
import { shouldBypassTourismApi } from "@/lib/tourism-ui-demo";

/** True when the bottom “Plan your visit” block will render (demo mode or API returned partners). */
export function useShowPlanVisitCta(storyId: string | null | undefined): boolean {
  const id = typeof storyId === "string" ? storyId.trim() : "";
  const bypass = shouldBypassTourismApi();
  const { data = [], isSuccess } = useTourismPartners(
    { storyId: id || null },
    { enabled: Boolean(id) && !bypass }
  );
  return bypass || (isSuccess && data.length > 0);
}
