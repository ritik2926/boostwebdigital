import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { ThreePillarsVenn } from "@/components/services/ThreePillarsVenn";
import { cn } from "@/lib/utils";

/**
 * "Why we only do three things" — docs/services-content.md, SECTION — WHY
 * THREE. No kicker on this section deliberately (the content doc doesn't
 * give one here) — one more way this section reads differently from the
 * sections around it (composition patterns rotate, never repeat back to
 * back). The Venn diagram stays (design kept, content swapped — see
 * ThreePillarsVenn.tsx) as this section's visual anchor.
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
              <span className="text-white">Why we only do </span>
              <span className="text-shimmer">three things</span>
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "flex flex-col gap-4 text-white/70")}>
            <p>
              Most agencies list nine services because nine services sell to more people. It also means nothing is
              anyone&apos;s specialty.
            </p>
            <p>
              Patients now find providers through a sequence: an AI answer names two or three practices, the patient
              checks the ones named, and reviews decide which gets the call. Three steps, three failure points. We
              work on those three and nothing else.
            </p>
            <p>
              If you need a brand identity or a photographer, we are not the right agency, and we will say so on the
              first call rather than the fourth month.
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
