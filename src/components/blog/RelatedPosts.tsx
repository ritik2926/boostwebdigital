import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/blog/types";
import { cn } from "@/lib/utils";
import { STACK, GRID_GAP } from "@/lib/tokens";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    // pt-0 + explicit pb-only compact value, not `cn(SECTION_PADDING.compact,
    // "pt-0")`: tailwind-merge doesn't treat "pt-0" as conflicting with the
    // "py-16 lg:py-24" shorthand (verified directly — both survive the
    // merge), so which one's padding-top rule actually wins came down to
    // Tailwind's internal stylesheet order, not class-list order. That
    // resolved in the shorthand's favor, silently reintroducing the ~96px
    // top padding this was written to remove — confirmed by measurement,
    // not visible from the className alone. Longhand-only sidesteps the
    // ambiguity entirely.
    <section className="pt-0 pb-16 lg:pb-24">
      <Container>
        <Reveal>
          <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.25rem]">
            Keep reading
          </h2>
        </Reveal>

        <RevealGroup as="ul" className={cn(STACK.subToContent, "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", GRID_GAP.default)}>
          {posts.map((post) => (
            <RevealItem as="li" key={post.slug}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
