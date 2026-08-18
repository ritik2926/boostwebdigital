import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/4 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
    >
      <div className="overflow-hidden">
        <Image
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          width={post.featuredImage.width}
          height={post.featuredImage.height}
          sizes="(min-width: 1024px) 400px, 100vw"
          unoptimized={post.featuredImage.src.endsWith(".svg")}
          className="aspect-16/9 h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-8">
        <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-3 py-1">
          <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">
            {post.category.name}
          </span>
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-white/90">
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/55 line-clamp-2">{post.excerpt}</p>
        <span className="mt-5 text-xs font-medium text-white/40">{post.readingTime} min read</span>
      </div>
    </Link>
  );
}
