

export function CulturePillars() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <Pillar
          title="Language"
          text="The Yoruba language is rich in proverbs, tonal expression, and oral philosophy."
        />
        <Pillar
          title="Beliefs & Spirituality"
          text="Yoruba spirituality centers around Orishas, ancestors, and balance between worlds."
        />
        <Pillar
          title="Art & Symbolism"
          text="Renowned bronze heads, wood carvings, and symbolic beadwork."
        />
        <Pillar
          title="Social Structure"
          text="Organized into city-states with kings (Obas), councils, and guild systems."
        />
      </div>
    </section>
  );
}

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
