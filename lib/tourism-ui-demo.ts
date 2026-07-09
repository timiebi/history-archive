import type { TourismPartner } from "@/lib/api/types";

/** Placeholder partners for UI review when the tourism API is not connected. */
export function getTourismDemoPartners(): TourismPartner[] {
  return [
    {
      id: "demo-heritage-visitor-centre",
      name: "Regional heritage visitor centre (demo)",
      description: "Museum hours, guides, site access.",
      websiteUrl: "https://example.org/heritage-demo",
      bookingUrl: "https://example.org/heritage-demo/book",
      logoUrl: undefined,
    },
    {
      id: "demo-licensed-operator",
      name: "Licensed field operator (demo)",
      description: "Small-group routes and local guides.",
      websiteUrl: "https://example.org/operator-demo",
    },
  ];
}

export function shouldBypassTourismApi(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_TOURISM_UI_DEMO === "true"
  );
}
