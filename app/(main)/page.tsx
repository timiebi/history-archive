import { fetchContributorsForHome, fetchStoriesForHome } from "@/lib/api/server-fetch";
import { HomePageClient } from "./HomePageClient";

export default async function HomePage() {
  const [storiesRes, contributorsRes] = await Promise.all([
    fetchStoriesForHome(),
    fetchContributorsForHome(),
  ]);
  const initialStories = {
    items: storiesRes?.items ?? [],
    total: (storiesRes as { total?: number })?.total,
  };
  const initialContributors = { items: contributorsRes?.items ?? [] };

  return (
    <HomePageClient
      initialStories={initialStories}
      initialContributors={initialContributors}
    />
  );
}
