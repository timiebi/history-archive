"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
      <p className="text-orange-800 dark:text-orange-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
        Something went wrong
      </p>
      <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white text-center mb-4">
        Error
      </h1>
      <p className="text-stone-500 font-serif text-lg text-center max-w-md mb-8">
        We hit an unexpected error. You can try again or go back home.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={reset}
          variant="outline"
          className="rounded-none font-black uppercase tracking-widest"
        >
          Try again
        </Button>
        <Button asChild className="rounded-none font-black uppercase tracking-widest">
          <a href="/">Back to home</a>
        </Button>
      </div>
    </main>
  );
}
