import Image from "next/image";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate } from "@/lib/utils";

export function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
      <div className="flex items-center gap-3">
        <Image
          src={post.author.avatar}
          alt={post.author.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border border-white/8 object-cover"
        />
        <span>
          <span className="block font-medium text-white/85">{post.author.name}</span>
          <span className="block text-xs text-white/50">{post.author.role}</span>
        </span>
      </div>
      <span aria-hidden className="text-white/20">
        ·
      </span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden className="text-white/20">
        ·
      </span>
      <span>{post.readingTime} min read</span>
    </div>
  );
}
