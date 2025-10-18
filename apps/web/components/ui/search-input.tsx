"use client";

import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SearchInput = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(handler);
  }, [query]);

  const { data } = useSWR(
    debounced ? `/api/search?query=${encodeURIComponent(debounced)}` : null,
    fetcher
  );

  const results: { titulo: string; slug: string; categoria?: string }[] = useMemo(
    () => data?.results ?? [],
    [data]
  );

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-3">
        <Search className="h-4 w-4 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar diseños, categorías o tags"
          className="w-full bg-transparent text-sm text-text placeholder:text-muted focus:outline-none"
        />
      </div>
      {debounced && results.length > 0 ? (
        <div className="absolute z-10 mt-2 w-full rounded-md border border-line bg-surface/95 shadow-xl">
          <ul className="divide-y divide-line/70">
            {results.map((result) => (
              <li key={result.slug}>
                <Link
                  href={`/disenos/${result.slug}`}
                  className="flex flex-col gap-1 px-4 py-3 text-sm text-text hover:bg-chip"
                >
                  <span className="font-medium">{result.titulo}</span>
                  {result.categoria ? (
                    <span className="text-xs uppercase tracking-[0.3em] text-muted">{result.categoria}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
