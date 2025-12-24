"use client"

import { motion } from "framer-motion";

export function CultureSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-[1fr_2fr]"
        >
          {/* Section Title */}
          <h2 className="text-3xl font-semibold tracking-tight">
            {title}
          </h2>

          {/* Section Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="leading-relaxed">{content}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
