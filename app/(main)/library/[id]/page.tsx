import { ManuscriptDetailClient } from "./ManuscriptDetailClient";

export default async function ManuscriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ManuscriptDetailClient id={id} />;
}
