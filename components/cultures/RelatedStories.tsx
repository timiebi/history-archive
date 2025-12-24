import Link from "next/link";

export function RelatedStories() {
  const stories = [
    {
      id: "mali-empire",
      title: "The Rise of the Mali Empire",
      excerpt:
        "How wealth, scholarship, and power reshaped West Africa.",
    },
    {
      id: "ife-bronze",
      title: "The Bronze Heads of Ife",
      excerpt:
        "Art, realism, and sacred authority in Yoruba civilization.",
    },
    {
      id: "orisha-beliefs",
      title: "Orishas and the Spiritual World",
      excerpt:
        "Understanding Yoruba cosmology and divine forces.",
    },
  ];

  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Related Stories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Continue exploring themes connected to this culture.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="group rounded-2xl border bg-background p-6 transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold group-hover:text-primary">
                {story.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {story.excerpt}
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-primary">
                Read story →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
