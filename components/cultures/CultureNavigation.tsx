import Link from "next/link";

export function CultureNavigation({
  prev,
  next,
}: {
  prev?: { slug: string; name: string };
  next?: { slug: string; name: string };
}) {
  return (
    <nav className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 sm:grid-cols-2">
        {prev && (
          <Link
            href={`/cultures/${prev.slug}`}
            className="group rounded-xl border p-6"
          >
            <span className="text-sm text-muted-foreground">
              Previous culture
            </span>
            <p className="mt-1 text-lg font-semibold group-hover:text-primary">
              {prev.name}
            </p>
          </Link>
        )}

        {next && (
          <Link
            href={`/cultures/${next.slug}`}
            className="group rounded-xl border p-6 text-right"
          >
            <span className="text-sm text-muted-foreground">
              Next culture
            </span>
            <p className="mt-1 text-lg font-semibold group-hover:text-primary">
              {next.name}
            </p>
          </Link>
        )}
      </div>
    </nav>
  );
}
