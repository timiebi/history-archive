"use client";

import { TimelineEvent } from "../data/timelines";
import { TimelineItem } from "./TimelineItem";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) {
    return (
      <p className="text-muted-foreground text-center py-20">
        No events found for this era.
      </p>
    );
  }

  return (
    <div className="relative border-l space-y-10">
      {events.map((event) => (
        <TimelineItem key={event.id} event={event} />
      ))}
    </div>
  );
}
