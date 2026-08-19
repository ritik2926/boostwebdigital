import Link from "next/link";
import { PostThumbnail } from "@/components/blog/PostThumbnail";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate, cn } from "@/lib/utils";
import { CARD_PADDING, CARD_RADIUS, STACK } from "@/lib/tokens";

/** Full-width, 2-column feature card — the newest post, and the periodic
 * rhythm-breaks in the 9+ tier. Heading is h2 (feature cards outrank
 * standard h3 cards in the document outline, matching their visual weight). */
export function FeatureCard({ post, categoryOrder, priority = false }: { post: BlogPost; categoryOrder: string[]; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className={cn(
        "group grid grid-cols-1 overflow-hidden border border-white/8 bg-white/[0.02] transition-all duration-300 hover:border-white/20 hover:bg-white/4 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:grid-cols-[55%_1fr]",
        CARD_RADIUS.feature
      )}
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
      <div className={cn("flex flex-col justify-center", CARD_PADDING.feature)}>
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
        <h2 className={cn(STACK.kickerToHeading, "font-display text-2xl font-bold leading-snug text-white transition-colors group-hover:text-white/90 sm:text-[1.75rem]")}>
          {post.title}
        </h2>
        <p className={cn(STACK.headingToSub, "text-white/60")}>{post.excerpt}</p>
        <span className="mt-6 block text-xs font-medium text-white/40">{post.readingTime} min read</span>
      </div>
    </Link>
  );
}
