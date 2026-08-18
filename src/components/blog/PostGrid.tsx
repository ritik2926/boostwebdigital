import { FeatureCard } from "@/components/blog/FeatureCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { InlineCtaCard } from "@/components/blog/InlineCtaCard";
import type { BlogPost } from "@/lib/blog/types";

/**
 * Graceful-degradation grid — three explicit, count-keyed branches rather
 * than one generalized formula, per the brief ("simple conditional
 * rendering on posts.length, no abstraction layer"). `data-category` on
 * every real-post cell is what CategoryStrip's client-side filter toggles;
 * CTA cells carry no category and always stay visible.
 */
export function PostGrid({ posts, categoryOrder }: { posts: BlogPost[]; categoryOrder: string[] }) {
  if (posts.length === 0) return null;

  // 1-2 posts: every post is a full-width feature card. No grid, no CTA card
  // — a grid rhythm needs more than one or two items to read as a rhythm.
  if (posts.length <= 2) {
    return (
      <div className="flex flex-col gap-8">
        {posts.map((post, i) => (
          <div key={post.slug} data-category={post.category.slug}>
            <FeatureCard post={post} categoryOrder={categoryOrder} priority={i === 0} />
          </div>
        ))}
      </div>
    );
  }

  const [newest, ...rest] = posts;

  // 3-8 posts: newest as the opening feature card, remainder in a 3-up grid
  // with exactly one inline CTA card inserted after the second row.
  if (posts.length <= 8) {
    const cells: Array<{ type: "post" | "cta"; post?: BlogPost }> = rest.map((post) => ({ type: "post", post }));
    cells.splice(Math.min(6, cells.length), 0, { type: "cta" });

    return (
      <div className="flex flex-col gap-8">
        <div data-category={newest.category.slug}>
          <FeatureCard post={newest} categoryOrder={categoryOrder} priority />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell, i) =>
            cell.type === "cta" ? (
              <div key={`cta-${i}`}>
                <InlineCtaCard />
              </div>
            ) : (
              <div key={cell.post!.slug} data-category={cell.post!.category.slug}>
                <BlogCard post={cell.post!} showDate categoryOrder={categoryOrder} />
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // 9+ posts: full reference rhythm — a post breaks the grid as a feature
  // card roughly every 7 posts, and a CTA card lands roughly every 8. Both
  // only fire at an actual row boundary (colCursor === 0 in the 3-up grid)
  // — breaking mid-row would strand the rest of that row as dead space.
  const cells: Array<{ type: "feature" | "standard" | "cta"; post?: BlogPost }> = [];
  let colCursor = 0;
  let postsSinceFeature = 0;
  let postsSinceCta = 0;
  for (const post of rest) {
    postsSinceFeature++;
    postsSinceCta++;

    if (colCursor === 0 && postsSinceFeature >= 7) {
      cells.push({ type: "feature", post });
      postsSinceFeature = 0;
      continue; // feature card owns a full row on its own; colCursor stays 0
    }

    cells.push({ type: "standard", post });
    colCursor = (colCursor + 1) % 3;

    if (colCursor === 0 && postsSinceCta >= 8) {
      cells.push({ type: "cta" });
      postsSinceCta = 0;
      colCursor = 1; // cta takes the first slot of the next row
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div data-category={newest.category.slug}>
        <FeatureCard post={newest} categoryOrder={categoryOrder} priority />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cells.map((cell, i) => {
          if (cell.type === "cta") {
            return (
              <div key={`cta-${i}`}>
                <InlineCtaCard />
              </div>
            );
          }
          if (cell.type === "feature") {
            return (
              <div key={cell.post!.slug} className="sm:col-span-2 lg:col-span-3" data-category={cell.post!.category.slug}>
                <FeatureCard post={cell.post!} categoryOrder={categoryOrder} />
              </div>
            );
          }
          return (
            <div key={cell.post!.slug} data-category={cell.post!.category.slug}>
              <BlogCard post={cell.post!} showDate categoryOrder={categoryOrder} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
