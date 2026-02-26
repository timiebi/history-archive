import { ExternalStoryDetailClient } from "./ExternalStoryDetailClient";

export default async function ExternalStoryDetailPage({
  params,
}: {
  params: Promise<{ source: string; externalId: string }>;
}) {
  const { source, externalId } = await params;
  return <ExternalStoryDetailClient source={source} externalId={decodeURIComponent(externalId)} />;
}
