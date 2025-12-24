import Image from "next/image";

export function ArtifactGallery({
  items,
}: {
  items: { src: string; title: string; caption: string }[];
}) {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-semibold mb-12">
          Cultural Artifacts
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure key={item.src} className="space-y-3">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <figcaption>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
