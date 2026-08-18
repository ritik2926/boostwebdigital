import Link from "next/link";
import { PostThumbnail } from "@/components/blog/PostThumbnail";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate } from "@/lib/utils";

/** Full-width, 2-column feature card — the newest post, and the periodic
 * rhythm-breaks in the 9+ tier. Heading is h2 (feature cards outrank
 * standard h3 cards in the document outline, matching their visual weight). */
export function FeatureCard({ post, categoryOrder, priority = false }: { post: BlogPost; categoryOrder: string[]; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-white/20 hover:bg-white/4 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:grid-cols-[55%_1fr]"
    >
      <div className="overflow-hidden">
        <PostThumbnail
          post={post}
          categoryOrder={categoryOrder}
          priority={priority}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="aspect-4/3 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-3 py-1">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">
              {post.category.name}
            </span>
          </span>
          <time dateTime={post.publishedAt} className="text-xs text-white/40">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-white transition-colors group-hover:text-white/90 sm:text-[1.75rem]">
          {post.title}
        </h2>
        <p className="mt-4 text-white/60">{post.excerpt}</p>
        <span className="mt-6 text-xs font-medium text-white/40">{post.readingTime} min read</span>
      </div>
    </Link>
  );
}
