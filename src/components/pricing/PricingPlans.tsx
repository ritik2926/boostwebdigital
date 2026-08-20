import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { PricingPlansCards } from "@/components/pricing/PricingPlansCards";
import { STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Sits directly under the Hero — top padding uses the compact tier (the
 * Hero itself keeps its own bespoke, non-tier bottom padding, same
 * exception every Hero sitewide already gets), bottom uses the spacious
 * tier matching every other section boundary on this page. Both values
 * still come from SECTION_PADDING's three tiers, just asymmetrically —
 * the locked allowance for exactly this case.
 */
export function PricingPlans() {
  return (
    <section id="plans" className="relative pt-16 pb-24 lg:pt-24 lg:pb-40">
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
