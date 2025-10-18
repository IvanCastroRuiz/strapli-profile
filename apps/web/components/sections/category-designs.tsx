"use client";

import { useMemo, useState } from "react";
import type { Design } from "@/types/strapi";
import { DesignCard } from "@/components/cards/design-card";
import { MasonryGrid } from "@/components/sections/masonry-grid";
import { cn } from "@/lib/utils";

export const CategoryDesigns = ({ designs }: { designs: Design[] }) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const unique = new Set<string>();
    designs.forEach((design) => {
      design.tags?.forEach((tag) => unique.add(tag.slug));
    });
    return Array.from(unique).sort();
  }, [designs]);

  const filteredDesigns = useMemo(() => {
    if (!activeTag) return designs;
    return designs.filter((design) => design.tags?.some((tag) => tag.slug === activeTag));
  }, [designs, activeTag]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className={cn(
            "rounded-full border border-line px-4 py-1 text-sm transition hover:border-accent",
            activeTag === null ? "bg-accent text-bg" : "bg-chip text-muted"
          )}
        >
          Todas
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
            className={cn(
              "rounded-full border border-line px-4 py-1 text-sm capitalize transition hover:border-accent",
              activeTag === tag ? "bg-accent text-bg" : "bg-chip text-muted"
            )}
          >
            #{tag}
          </button>
        ))}
      </div>
      <MasonryGrid>
        {filteredDesigns.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </MasonryGrid>
    </div>
  );
};
