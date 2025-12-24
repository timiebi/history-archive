import Image from "next/image";
import Link from "next/link";

interface Props {
  story: {
    id: string;
    title: string;
    image?: string;
    excerpt?: string;
    category?: string;
  };
}

export function StoryCard({ story }: Props) {
  return (
    <Link
      href={`/stories/${story.id}`}
      className="group block overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
    >
      <div className="relative aspect-4/3">
        <Image
          src={story.image || "/placeholder.jpg"}
          alt={story.title}
          fill
          className="object-cover transition group-hover:scale-105"
        />
      </div>

      <div className="p-5 space-y-2">
        {story.category && (
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {story.category}
          </span>
        )}

        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
          {story.title}
        </h3>

        {story.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {story.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
