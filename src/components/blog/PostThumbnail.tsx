import Image from "next/image";
import type { BlogPost } from "@/lib/blog/types";

/**
 * Same six gradient pairs already validated for Testimonials.tsx's avatar
 * tiles (src/components/Testimonials.tsx) — reused here instead of inventing
 * a new palette, cycled deterministically by category position so the same
 * category always renders the same pair.
 */
export const CATEGORY_GRADIENTS: Array<{ from: string; to: string }> = [
  { from: "#2563eb", to: "#38bdf8" },
  { from: "#f43f5e", to: "#e879f9" },
  { from: "#10b981", to: "#2dd4bf" },
  { from: "#a855f7", to: "#6366f1" },
  { from: "#f59e0b", to: "#fb923c" },
  { from: "#22d3ee", to: "#3b82f6" },
];

export function gradientForCategory(categorySlug: string, categoryOrder: string[]) {
  const index = categoryOrder.indexOf(categorySlug);
  return CATEGORY_GRADIENTS[(index < 0 ? 0 : index) % CATEGORY_GRADIENTS.length];
}

/**
 * Renders the real featured image when one exists. Otherwise generates a
 * title-as-artwork placeholder (the post title set large in Switzer over a
 * per-category gradient) instead of any stock photography — mirrors the
 * reference's thumbnail treatment at zero asset cost. `preserveAspectRatio="
 * xMidYMid slice"` lets one fixed viewBox fill any container aspect ratio
 * (4:3 feature cards, 16:9 standard cards) via ordinary CSS sizing.
 */
export function PostThumbnail({
  post,
  categoryOrder,
  sizes,
  priority,
  className,
}: {
  post: BlogPost;
  categoryOrder: string[];
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (post.featuredImage.src) {
    return (
      <Image
        src={post.featuredImage.src}
        alt={post.featuredImage.alt}
        width={post.featuredImage.width}
        height={post.featuredImage.height}
        sizes={sizes}
        priority={priority}
        unoptimized={post.featuredImage.src.endsWith(".svg")}
        className={className}
      />
    );
  }

  const { from, to } = gradientForCategory(post.category.slug, categoryOrder);
  const gradientId = `thumb-gradient-${post.slug}`;

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={post.featuredImage.alt} className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gradientId})`} />
      <rect width="400" height="300" fill="black" fillOpacity="0.15" />
      <foreignObject x="0" y="0" width="400" height="300">
        <div
          {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
          className="font-display flex h-full w-full items-center p-7 text-[1.65rem] font-extrabold leading-[1.05] tracking-[-0.01em] text-white"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
        >
          {post.title}
        </div>
      </foreignObject>
    </svg>
  );
}
