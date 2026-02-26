import { StoryDetailClient } from "./StoryDetailClient";

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StoryDetailClient id={id} />;
}