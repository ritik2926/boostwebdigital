import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { ThreePillarsVenn } from "@/components/services/ThreePillarsVenn";
import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER copy — lifted verbatim from the reference layout per explicit
 * instruction, not invented. No kicker on this section deliberately (the
 * reference's own spec omits one here) — one more way this section reads
 * differently from the sections around it (composition patterns rotate,
 * never repeat back to back).
 */
export function ServicesApproach() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(var(--accent-rgb),0.12), transparent 70%)" }}
      />
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] sm:text-[2.5rem]">
              <span className="text-white">Three pillars of </span>
              <span className="text-shimmer">success</span>
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "text-white/70")}>
            <p>
              At the core of our approach are three key areas of expertise that drive impactful results. Explore how
              our strategy, creativity, and technology work together to fuel your growth.
            </p>
          </RevealItem>
        </RevealGroup>

        <div className={STACK.subToContent}>
          <ThreePillarsVenn />
        </div>
      </Container>
    </section>
  );
}
