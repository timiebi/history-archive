import { TourDetailPageClient } from "./TourDetailPageClient";

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function TourDetailPage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  return <TourDetailPageClient id={resolved.id} />;
}
