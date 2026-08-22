import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { PricingPlansCards } from "@/components/pricing/PricingPlansCards";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Sits directly under the Hero (which keeps its own bespoke, tight bottom
 * padding so the two flow together with no visual break) — uses the
 * compact tier on both edges, matching the Home page's own between-section
 * rhythm and every other section boundary on this page (2026-08-23 spacing
 * correction; previously an untokenized pt-16/pb-24/lg:pt-24/lg:pb-40 mix).
 */
export function PricingPlans() {
  return (
    <section id="plans" className={cn("relative", SECTION_PADDING.compact)}>
      <Container>
        <RevealGroup as="div" className="flex flex-col items-center text-center">
          <RevealItem>
            <Kicker>Three plans</Kicker>
          </RevealItem>
          <RevealItem className={cn(STACK.kickerToHeading, "max-w-2xl")}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Three Plans
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "max-w-2xl")}>
            <p className="text-white/70">Compare destinations, not checklists.</p>
          </RevealItem>

          <PricingPlansCards />
        </RevealGroup>
      </Container>
    </section>
  );
}
