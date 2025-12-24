"use client";

import { Button } from "@/components/ui/button";
import { TimelineEra } from "../data/timelines";

const ERAS: TimelineEra[] = ["Ancient", "Medieval", "Colonial", "Modern"];

export function TimelineFilter({
  active,
  onChangeAction,
}: {
  active: TimelineEra | "All";
  onChangeAction: (era: TimelineEra | "All") => void;
}) {
  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur border-b py-4">
      <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto px-4">
        <Button
          variant={active === "All" ? "default" : "outline"}
          onClick={() => onChangeAction("All")}
        >
          All
        </Button>

        {ERAS.map((era) => (
          <Button
            key={era}
            variant={active === era ? "default" : "outline"}
            onClick={() => onChangeAction(era)}
          >
            {era}
          </Button>
        ))}
      </div>
    </div>
  );
}
