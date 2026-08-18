"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gradientForCategory } from "@/components/blog/PostThumbnail";

/**
 * The archive's only client-side interaction: clicking a category toggles
 * visibility of matching `[data-category]` cells inside `children` (the
 * server-rendered PostGrid) via plain DOM class toggling, not React state
 * re-rendering the grid — so the grid itself stays a Server Component and
 * this file is genuinely "the category filter," not a client wrapper around
 * the whole page. No URL params, no new routes — filtering never leaves the
 * client, per the hard rule against duplicate-content filter URLs.
 */
export function CategoryStrip({
  categories,
  children,
}: {
  categories: Array<{ slug: string; name: string; count: number }>;
  children: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const categoryOrder = categories.map((c) => c.slug);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cells = grid.querySelectorAll<HTMLElement>("[data-category]");
    cells.forEach((cell) => {
      cell.style.display = !active || cell.dataset.category === active ? "" : "none";
    });
  }, [active]);

  return (
    <div>
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Browse by category</span>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => setActive(null)}
          className={cn(
            "flex min-h-11 items-center rounded-full border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
            active === null ? "border-accent/40 bg-accent/10 text-white" : "border-white/15 bg-white/5 text-white/70 hover:border-white/25"
          )}
        >
          All
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const { from, to } = gradientForCategory(category.slug, categoryOrder);
          const isActive = active === category.slug;
          return (
            <button
              key={category.slug}
              onClick={() => setActive((current) => (current === category.slug ? null : category.slug))}
              className={cn(
                "group relative flex h-45 flex-col justify-end overflow-hidden rounded-[20px] border p-6 text-left transition-all duration-300",
                isActive ? "border-white/50 ring-2 ring-white/40" : "border-white/10 hover:border-white/30"
              )}
              style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
            >
              <span aria-hidden className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
              <span className="relative font-display text-lg font-bold text-white">{category.name}</span>
              <span className="relative mt-1 text-sm text-white/80">
                {category.count} {category.count === 1 ? "post" : "posts"}
              </span>
            </button>
          );
        })}
      </div>

      <div ref={gridRef} className="mt-12">
        {children}
      </div>
    </div>
  );
}
