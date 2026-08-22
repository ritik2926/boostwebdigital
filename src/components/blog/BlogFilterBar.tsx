"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { PostGrid } from "@/components/blog/PostGrid";
import { Container } from "@/components/Container";
import { usePrefersReducedMotion } from "@/components/Reveal";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog/types";

/**
 * The one client island for this page: category pills + search, and the
 * grid they filter, in a single component so all of that state lives in
 * one place. Filtering is client-side only, by design (docs/13-URL-
 * ARCHITECTURE.md): no ?category=/?q= query params, no new routes — those
 * create duplicate-content URLs and would cannibalize the money pages that
 * share these category names. `posts` here is already the slice
 * blogs/page.tsx computed as "not already shown in the featured split" —
 * every count and hide-rule below is measured against that same slice, not
 * the site's total post count, so the bar never promises more than this
 * grid actually has to filter through.
 */
export function BlogFilterBar({ posts, categoryOrder }: { posts: BlogPost[]; categoryOrder: string[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(id);
  }, [query]);

  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const post of posts) {
      const existing = map.get(post.category.slug);
      map.set(post.category.slug, { slug: post.category.slug, name: post.category.name, count: (existing?.count ?? 0) + 1 });
    }
    return Array.from(map.values());
  }, [posts]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeCategory && post.category.slug !== activeCategory) return false;
      if (q && !post.title.toLowerCase().includes(q) && !post.excerpt.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, activeCategory, debouncedQuery]);

  // Hide rules — a control with nothing to do doesn't render, per the brief
  // ("a search box over two posts looks unfinished").
  const showBar = posts.length >= 3;
  const showSearch = posts.length >= 6;
  const showPills = categories.length > 1;

  // With today's post count, `posts` here (everything not already shown in
  // the featured split above) is often empty — an empty PostGrid returns
  // null, but a *section wrapper* still applying full top+bottom padding
  // around that nothing produced a ~450px dead gap before the marquee
  // below, confirmed by screenshot. No posts to show means no section at
  // all, not a padded empty one.
  if (posts.length === 0) return null;

  if (!showBar) {
    return (
      <section className={SECTION_PADDING.default}>
        <Container>
          <PostGrid posts={posts} categoryOrder={categoryOrder} />
        </Container>
      </section>
    );
  }

  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name;

  function clearFilters() {
    setActiveCategory(null);
    setQuery("");
  }

  return (
    <section>
      <div className="sticky top-20 z-(--z-raised) border-b border-white/8 bg-[#08080a]/85 backdrop-blur-xl">
        <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          {showPills ? (
            <div
              className="-mx-1 flex gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
              }}
            >
              <CategoryPill
                label="All"
                count={posts.length}
                active={activeCategory === null}
                onClick={() => setActiveCategory(null)}
                reducedMotion={reducedMotion}
              />
              {categories.map((category) => (
                <CategoryPill
                  key={category.slug}
                  label={category.name}
                  count={category.count}
                  active={activeCategory === category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          ) : (
            <span aria-hidden />
          )}

          {showSearch && (
            <div className="relative w-full sm:w-64 sm:shrink-0">
              <label htmlFor="blog-search" className="sr-only">
                Search posts
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
              <input
                id="blog-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="h-11 w-full rounded-full border border-white/15 bg-white/5 pl-10 pr-10 text-sm text-white placeholder:text-white/40 transition-colors focus-visible:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent/60"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/40 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          )}
        </Container>
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
      </p>

      <div className={SECTION_PADDING.default}>
        <Container>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-16 text-center">
              <p className="text-white/60">
                No posts found
                {debouncedQuery && <> for &ldquo;{debouncedQuery}&rdquo;</>}
                {activeCategoryName && <> in {activeCategoryName}</>}.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="chip border border-white/15 bg-white/5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-white/30 hover:bg-white/8"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <PostGrid posts={filtered} categoryOrder={categoryOrder} />
          )}
        </Container>
      </div>
    </section>
  );
}

function CategoryPill({
  label,
  count,
  active,
  onClick,
  reducedMotion,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  reducedMotion: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "chip relative shrink-0 border font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        active ? "border-transparent text-white" : "border-white/15 bg-white/5 text-white/70 hover:border-white/25"
      )}
    >
      {active && (
        <motion.span
          layoutId="blog-category-highlight"
          className="absolute inset-0 -z-10 rounded-full bg-accent"
          transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative">
        {label} <span className={active ? "text-white/70" : "text-white/40"}>{count}</span>
      </span>
    </button>
  );
}
