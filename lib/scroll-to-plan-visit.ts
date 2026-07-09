export const PLAN_YOUR_VISIT_SECTION_ID = "plan-your-visit";

export function scrollToPlanYourVisitSection(): void {
  document.getElementById(PLAN_YOUR_VISIT_SECTION_ID)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
