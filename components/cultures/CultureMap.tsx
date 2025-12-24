import Image from "next/image";

export function CultureMap({
  title,
  image,
  description,
}: {
  title: string;
  image: string;
  description: string;
}) {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-24 grid gap-16 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            Geographic Presence
          </h2>
          <p className="text-muted-foreground max-w-prose">
            {description}
          </p>
        </div>

        <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
