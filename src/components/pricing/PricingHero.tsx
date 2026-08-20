import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { STACK } from "@/lib/tokens";

/**
 * Centred composition — the one deliberate exception to the site's default
 * left-aligned editorial rule (DESIGN-STANDARDS §3), same allowance every
 * other Hero already gets. Tight bottom padding so it flows straight into
 * PricingPlans' toggle + cards directly below — no visual section break,
 * matching the reference's continuous hero-into-pricing composition.
 */
export function PricingHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8 text-center sm:pt-32 lg:pt-40 lg:pb-12">
      <Container className="mx-auto">
        <RevealGroup as="div" trigger="mount" stagger={0.1} className="flex flex-col items-center">
          <RevealItem>
            <Kicker>Healthcare marketing pricing</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h1 className="mx-auto max-w-3xl font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.5rem]">
              Healthcare Marketing Pricing
            </h1>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <div className="mx-auto max-w-2xl space-y-4 text-white/70">
              <p>Most agencies make you sit through a discovery call before they&apos;ll tell you a number. We publish ours.</p>
              <p>
                Every plan is month to month. No twelve-month contract, no setup fee, no cancellation penalty. If the
                numbers don&apos;t move, you leave.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
