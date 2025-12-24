"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { TimelineEvent } from "../data/timelines";
import { Button } from "@/components/ui/button";

export function TimelineItem({ event }: { event: TimelineEvent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative grid grid-cols-[60px_1fr] gap-8"
    >
      {/* Timeline Axis */}
      <div className="relative flex justify-center">
        <span className="absolute top-6 h-full w-px bg-border" />

        <div className="relative z-10 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-background ring-2 ring-primary">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="pb-16 max-w-3xl space-y-4">
        <div className="space-y-1">
          <span className="text-sm font-medium tracking-wide text-primary">
            {event.year}
          </span>

          <h3 className="text-xl font-semibold leading-snug">
            {event.title}
          </h3>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="inline-flex rounded-full border px-3 py-1 text-xs font-medium">
            {event.era}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Learn more"}
          </Button>
        </div>

        {/* Expandable content */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="prose prose-neutral dark:prose-invert max-w-none"
          >
            <p>
              This period marked a significant transformation in African
              political, economic, and cultural systems, influencing regional
              and global history.
            </p>
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}
