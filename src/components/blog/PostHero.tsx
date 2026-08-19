import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { PostMeta } from "@/components/blog/PostMeta";
import { STACK } from "@/lib/tokens";
import type { BlogPost } from "@/lib/blog/types";

// Matches the exact grid definition the article body section below uses
// (page.tsx) — the text content sits in the same 720px middle column via
// xl:col-start-2, rather than the full container width the featured image
// keeps. Previously the H1 sat at the page's own left edge (x=84 @1440px)
// while the article column started at x=320 — a 236px mismatch between this
// page's own hero and its own body copy.
const ARTICLE_GRID = "mx-auto grid max-w-(--container-page) grid-cols-1 xl:grid-cols-[160px_minmax(0,720px)_240px] xl:justify-center xl:gap-14";

export function PostHero({ post }: { post: BlogPost }) {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24">
      <Container>
        <div className={ARTICLE_GRID}>
          <div className="xl:col-start-2">
            <RevealGroup as="div" trigger="mount" stagger={0.08}>
              <RevealItem>
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
                  <Link href="/" className="transition-colors hover:text-white/80">
                    Home
                  </Link>
                  <span aria-hidden>›</span>
                  <Link href="/blogs/" className="transition-colors hover:text-white/80">
                    Blog
                  </Link>
                  <span aria-hidden>›</span>
                  <span className="text-white/70">{post.category.name}</span>
                </nav>
              </RevealItem>

              <RevealItem className={STACK.kickerToHeading}>
                <Link
                  href="/blogs/"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 transition-colors hover:border-white/25 hover:bg-white/8"
                >
                  <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85">
                    {post.category.name}
                  </span>
                </Link>
              </RevealItem>

              <RevealItem className={STACK.headingToSub}>
                <h1 className="font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.25rem]">
                  {post.title}
                </h1>
              </RevealItem>

              <RevealItem className={STACK.subToContent}>
                <p className="text-lg leading-relaxed text-white/65">{post.excerpt}</p>
              </RevealItem>

              <RevealItem className="mt-8">
                <PostMeta post={post} />
              </RevealItem>
            </RevealGroup>
          </div>
        </div>

        <Reveal trigger="mount" delay={0.32} className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-white/8">
            <Image
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              width={post.featuredImage.width}
              height={post.featuredImage.height}
              priority
              unoptimized={post.featuredImage.src.endsWith(".svg")}
              sizes="(min-width: 1280px) 1400px, 100vw"
              className="aspect-21/9 h-auto w-full object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
