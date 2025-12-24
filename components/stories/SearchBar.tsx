"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${query}`);
  };

  return (
    <form onSubmit={onSearch} className="max-w-md">
      <Input
        placeholder="Search African history..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
