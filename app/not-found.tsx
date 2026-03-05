import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
      <p className="text-orange-800 dark:text-orange-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
        Error 404
      </p>
      <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white text-center mb-4">
        Page not found
      </h1>
      <p className="text-stone-500 font-serif text-lg text-center max-w-md mb-8">
        This page doesn’t exist or has been moved. Head back to the archive.
      </p>
      <Link href="/">
        <Button className="rounded-none font-black uppercase tracking-widest">
          Back to home
        </Button>
      </Link>
    </main>
  );
}
