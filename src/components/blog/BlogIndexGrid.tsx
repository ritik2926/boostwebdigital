"use client";

import { useMemo, useState } from "react";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { BlogCard } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog/types";

export function BlogIndexGrid({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const post of posts) seen.set(post.category.slug, post.category.name);
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [posts]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? posts.filter((post) => post.category.slug === activeCategory) : posts;

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "flex min-h-11 items-center rounded-full border px-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors",
            activeCategory === null ? "border-accent/40 bg-accent/10 text-white" : "border-white/15 bg-white/5 text-white/70 hover:border-white/25"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              "flex min-h-11 items-center rounded-full border px-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors",
              activeCategory === cat.slug ? "border-accent/40 bg-accent/10 text-white" : "border-white/15 bg-white/5 text-white/70 hover:border-white/25"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <RevealGroup as="ul" className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <RevealItem as="li" key={post.slug}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      ) : (
        <div className="mt-16 flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center">
          <p className="text-white/60">No posts in this category yet.</p>
        </div>
      )}
    </>
  );
}
