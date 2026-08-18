import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

export function AuthorCard({ author }: { author: BlogPost["author"] }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center">
      <Image
        src={author.avatar}
        alt={author.name}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover"
      />
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white/40">Written by</span>
        <h3 className="mt-1.5 font-display text-lg font-semibold text-white">{author.name}</h3>
        <p className="mt-1 text-sm text-white/60">{author.role}</p>
        {author.url && (
          <Link href={author.url} className="mt-2 inline-block text-sm text-accent underline-offset-4 hover:underline">
            More about {author.name.split(" ")[0]} →
          </Link>
        )}
      </div>
    </div>
  );
}
