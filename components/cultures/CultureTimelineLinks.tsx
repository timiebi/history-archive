import Link from "next/link";

export function CultureTimelineLinks({
  timelines,
}: {
  timelines: { id: string; year: string; title: string }[];
}) {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-2xl font-semibold mb-6">
          Appears in these historical periods
        </h2>

        <ul className="space-y-4">
          {timelines.map((t) => (
            <li key={t.id}>
              <Link
                href={`/timelines#${t.id}`}
                className="group flex items-start gap-4"
              >
                <span className="text-primary font-medium">
                  {t.year}
                </span>
                <span className="group-hover:underline">
                  {t.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
