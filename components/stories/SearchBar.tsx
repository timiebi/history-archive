"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); onSearch(e); }} className="max-w-md">
      <Input
        placeholder="Search African history..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
