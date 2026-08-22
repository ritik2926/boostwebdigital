import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { REVEAL, SECTION_PADDING, STACK, GRID_GAP, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const EXCLUSIONS = [
  {
    name: "Ad Spend",
    body: "Paid budgets are paid directly to Google or Meta, never through us. We don't mark up media.",
  },
  {
    name: "Website Rebuilds",
    body: "We optimise what you have. A full rebuild is quoted separately.",
  },
  {
    name: "Photography and Video",
    body: "We'll tell you what you need and can recommend someone.",
  },
  {
    name: "Patient Data",
    body: "We work exclusively with public data — your site, listings and reviews. We never touch patient records, intake forms, call recordings or CRM data.",
  },
];

export function PricingExclusions() {
  return (
    <section className={cn("relative", SECTION_PADDING.compact)}>
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>Full transparency</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              What&apos;s Not Included
            </h2>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="text-white/70">Stated openly so nothing surprises you later.</p>
          </RevealItem>
        </RevealGroup>

        <RevealGroup
          as="ul"
          trigger="viewport"
          stagger={REVEAL.cardStagger}
          className={cn(STACK.subToContent, "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", GRID_GAP.default)}
        >
          {EXCLUSIONS.map((item) => (
            <RevealItem as="li" key={item.name}>
              <div className={cn("flex h-full min-h-42 flex-col border border-white/8 bg-white/[0.02]", CARD_RADIUS.feature, CARD_PADDING.feature)}>
                <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
