import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { STACK, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Asymmetric split — a large anchor numeral on the left, copy on the right —
 * a different pattern again from the centred/full-width sections around it.
 * Bottom padding drops to the compact tier (top stays spacious): this
 * section's own content is short relative to its neighbours, and stacking
 * two full spacious paddings against Exclusions' own compact-top measured
 * out to a 300px+ dead zone at 1440px — DESIGN-CRAFT.md's own asymmetric-
 * tier allowance exists for exactly this case.
 */
export function PricingGuarantee() {
  return (
    <section className={cn("relative overflow-hidden pt-24 pb-16 lg:pt-40 lg:pb-24")}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-16">
          <RevealItem>
            <div className="flex flex-col items-start">
              <span className="font-display text-7xl font-extrabold tracking-[-0.02em] text-accent tabular-nums sm:text-8xl">90</span>
              <span className="mt-1 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-white/50">Days</span>
            </div>
          </RevealItem>

          <RevealGroup as="div">
            <RevealItem>
              <Kicker>Our guarantee</Kicker>
            </RevealItem>
            <RevealItem className={STACK.kickerToHeading}>
              <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
                Our Guarantee
              </h2>
            </RevealItem>
            <RevealItem className={cn(STACK.subToContent, "border-l-2 border-accent bg-white/[0.02]", CARD_PADDING.standard, CARD_RADIUS.feature)}>
              <p className="text-lg text-white/85">
                If your AI citation count hasn&apos;t increased after 90 days, the fourth month is free.
              </p>
            </RevealItem>
            <RevealItem className={cn(STACK.headingToSub, "space-y-4 text-white/70")}>
              <p>
                We can measure this precisely, because we run the same questions against the same engines every
                month from day one. There&apos;s no interpretation involved — the number went up or it didn&apos;t.
              </p>
              <p>
                We don&apos;t guarantee revenue, patient volume, or rankings. Any agency that does is guaranteeing
                something outside their control, and you should treat that as information about them.
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
