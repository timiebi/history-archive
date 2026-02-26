/**
 * Server-only fetch for prefetching home page data.
 * Uses NEXT_PUBLIC_API_URL so first load has data without waiting for client.
 */

const getBase = () => (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export async function fetchStoriesForHome(): Promise<{
  items?: unknown[];
  total?: number;
  [key: string]: unknown;
}> {
  const base = getBase();
  if (!base) return { items: [] };
  try {
    const res = await fetch(`${base}/stories?limit=6&page=1`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { items: [] };
    const data = (await res.json()) as { stories?: unknown[]; storyOfTheDay?: unknown; total?: number; [key: string]: unknown };
    const items = Array.isArray(data?.stories)
      ? (data.storyOfTheDay ? [data.storyOfTheDay, ...data.stories] : data.stories)
      : Array.isArray((data as { items?: unknown[] }).items)
        ? (data as { items: unknown[] }).items
        : [];
    return { ...data, items, total: data.total ?? items.length };
  } catch {
    return { items: [] };
  }
}

export async function fetchContributorsForHome(): Promise<{ items: { id: string; name: string; email?: string }[] }> {
  const base = getBase();
  if (!base) return { items: [] };
  try {
    const res = await fetch(`${base}/users/contributors`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { items: [] };
    const data = await res.json();
    const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    return { items };
  } catch {
    return { items: [] };
  }
}
