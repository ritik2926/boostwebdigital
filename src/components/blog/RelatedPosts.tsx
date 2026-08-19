import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/blog/types";
import { cn } from "@/lib/utils";
import { SECTION_PADDING, STACK, GRID_GAP } from "@/lib/tokens";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <section className={cn("pt-0", SECTION_PADDING.compact)}>
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
