import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { LatestPanel } from "@/components/blog/LatestPanel";
import type { BlogPost } from "@/lib/blog/types";

/**
 * Section 2 of /blogs/ — asymmetric split (newest post large + a "Latest"
 * panel of up to 3 more) with an explicit degradation for low post counts:
 *   1 post   -> no split, no Latest panel, just the featured post, centered
 *   2-3 posts-> split renders, Latest panel shows however many remain
 *   4+ posts -> full layout, Latest panel shows exactly 3
 * `latest` naturally has 0-3 items from `posts.slice(1, 4)` — its own
 * length is what decides which of the three states above renders; the
 * caller (blogs/page.tsx) is responsible for not re-showing these same
 * posts in the grid below.
 */
export function FeaturedSplit({ posts, categoryOrder }: { posts: BlogPost[]; categoryOrder: string[] }) {
  if (posts.length === 0) return null;

  const featured = posts[0];
  const latest = posts.slice(1, 4);

  if (latest.length === 0) {
    return (
      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <FeaturedPost post={featured} categoryOrder={categoryOrder} solo />
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className="pb-16 lg:pb-24">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
            <FeaturedPost post={featured} categoryOrder={categoryOrder} />
            <LatestPanel posts={latest} categoryOrder={categoryOrder} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
