"use client"


import { motion } from "framer-motion";

export function CultureHero({
  name,
  region,
  overview,
}: {
  name: string;
  region: string;
  overview: string;
}) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-6"
        >
          <span className="text-sm uppercase tracking-wider text-muted-foreground">
            {region}
          </span>

          <h1 className="text-6xl font-bold tracking-tight">
            {name}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {overview}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
