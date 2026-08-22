import Image from "next/image";
import Link from "next/link";
import { PostThumbnail } from "@/components/blog/PostThumbnail";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate, cn } from "@/lib/utils";

/**
 * The newest post, given real visual weight — the "start here" signal the
 * asymmetric split exists to create. Reuses PostThumbnail (so the
 * generated-SVG title-card fallback still triggers when a post has no
 * featured image) and the same category-pill markup BlogCard/FeatureCard
 * already use, rather than inventing a new pill style for this one spot.
 *
 * `solo` is the 1-post-total degradation: same content, centered and
 * width-capped, no split partner.
 */
export function FeaturedPost({ post, categoryOrder, solo = false }: { post: BlogPost; categoryOrder: string[]; solo?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}/`} className={cn("group block", solo && "mx-auto max-w-220")}>
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <PostThumbnail
          post={post}
          categoryOrder={categoryOrder}
          priority
          sizes="(min-width: 1024px) 780px, 100vw"
          className="aspect-16/9 h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <div className="mt-6">
        <h2 className="font-display text-2xl font-bold leading-snug text-white/90 line-clamp-2 transition-colors group-hover:text-white sm:text-[1.75rem] lg:text-[2rem]">
          {post.title}
        </h2>
        <p className="mt-3 text-white/60 line-clamp-2">{post.excerpt}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/55">
          <span className="flex items-center gap-2.5">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-white/8 object-cover"
            />
            <span className="text-white/80">{post.author.name}</span>
            <span className="text-white/40">{post.author.role}</span>
          </span>
          <span aria-hidden className="text-white/20">
            ·
          </span>
          <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-3 py-1">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">{post.category.name}</span>
          </span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden className="text-white/20">
            ·
          </span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
