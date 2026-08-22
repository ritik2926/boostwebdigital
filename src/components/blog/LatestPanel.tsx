import Link from "next/link";
import { PostThumbnail } from "@/components/blog/PostThumbnail";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate } from "@/lib/utils";

/**
 * Named "Latest" — not "Trending"/"Popular"/"Most read", per the honesty
 * rule (CLAUDE.md): this site doesn't measure post traffic, so any of those
 * labels would be a fabricated engagement claim. Shows 1-3 posts (2B's own
 * degradation — the parent, FeaturedSplit, decides how many it's handed).
 *
 * The corner glow is NOT the shared `AmbientGlow` component, despite the
 * brief asking to reuse an existing gradient treatment — tried it first,
 * but AmbientGlow's size is hardcoded much larger than this ~176px-tall
 * panel (560px at desktop), so only its faint outermost edge ever showed
 * inside the clip, confirmed near-invisible by screenshot. This reuses the
 * exact same recipe instead (single radial-gradient stop, accent hue,
 * ~0.2 peak alpha, feathers to transparent by ~65% of its own radius, §4
 * Lighting System) at a size that actually fits the panel.
 */
export function LatestPanel({ posts, categoryOrder }: { posts: BlogPost[]; categoryOrder: string[] }) {
  return (
    <div className="flex h-full flex-col">
      <div
        className="relative flex h-44 items-center overflow-hidden rounded-2xl border border-white/8 px-8"
        style={{ background: "linear-gradient(135deg, rgba(var(--accent-rgb),0.16), #0b0b0f 68%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.2), transparent 65%)" }}
        />
        <span className="relative font-display text-3xl font-extrabold uppercase tracking-tight text-white">Latest</span>
      </div>

      <div className="mt-1 flex flex-1 flex-col divide-y divide-white/8">
        {posts.map((post) => (
          <LatestPostRow key={post.slug} post={post} categoryOrder={categoryOrder} />
        ))}
      </div>
    </div>
  );
}

function LatestPostRow({ post, categoryOrder }: { post: BlogPost; categoryOrder: string[] }) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="group -mx-3 flex gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-white/[0.03]"
    >
      <div className="w-28 shrink-0 overflow-hidden rounded-xl">
        <PostThumbnail
          post={post}
          categoryOrder={categoryOrder}
          sizes="112px"
          className="aspect-16/10 h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="font-display text-[0.9375rem] font-semibold leading-snug text-white/90 line-clamp-2 transition-colors group-hover:text-white">
          {post.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-white/45">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <span className="mt-2 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5">
          <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/60">{post.category.name}</span>
        </span>
      </div>
    </Link>
  );
}
