import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { REVEAL, SECTION_PADDING, STACK, GRID_GAP, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const VALUE_CARDS = [
  { name: "Visibility", monthly: "$1,500/mo", annual: "$18,000/yr", breakEven: "2" },
  { name: "Growth", monthly: "$3,500/mo", annual: "$42,000/yr", breakEven: "5" },
  { name: "Market Leader", monthly: "$7,500/mo", annual: "$90,000/yr", breakEven: "9" },
];

/**
 * Split composition, left-aligned intro + full-width value-card row below —
 * a different pattern from the centred Hero above it, per DESIGN-CRAFT.md's
 * "rotate composition patterns" rule.
 */
export function PricingMath() {
  return (
    <section className={cn("relative", SECTION_PADDING.spacious)}>
      <Container>
        <RevealGroup as="div" className="max-w-2xl">
          <RevealItem>
            <Kicker>Break-even, not price tags</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Start With the Maths, Not the Price
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "space-y-4 text-white/70")}>
            <p>
              A single hair restoration procedure is worth $6,000 to $15,000. A full-arch implant case is worth
              $20,000 to $40,000. A med spa patient on a treatment plan is worth $3,000 to $8,000 a year.
            </p>
            <p>
              Against numbers like those, marketing spend isn&apos;t a cost line — it&apos;s a question of how many
              additional patients it takes to pay for itself.
            </p>
          </RevealItem>
        </RevealGroup>

        <RevealGroup
          as="ul"
          trigger="viewport"
          stagger={REVEAL.cardStagger}
          className={cn(STACK.subToContent, "grid grid-cols-1 sm:grid-cols-3", GRID_GAP.default)}
        >
          {VALUE_CARDS.map((card) => (
            <RevealItem as="li" key={card.name}>
              <div
                className={cn(
                  "flex h-full min-h-70 flex-col justify-between border border-white/8 bg-white/[0.03]",
                  CARD_RADIUS.feature,
                  CARD_PADDING.feature
                )}
              >
                <div>
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{card.name}</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-xl font-bold tabular-nums text-white">{card.monthly}</span>
                    <span className="text-sm text-white/40">· {card.annual}</span>
                  </div>
                </div>
                <div>
                  <div className="font-display text-6xl font-extrabold tabular-nums leading-none text-accent">{card.breakEven}</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">additional procedures needed per year*</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className={cn(STACK.contentToCta, "max-w-2xl")}>
          <p className="text-xs text-white/40">
            * Based on a $10,000 average procedure value. Adjust to your own numbers — that&apos;s the only
            calculation that matters, and it&apos;s the first one we&apos;ll run with you.
          </p>
        </Reveal>

        <Reveal className="mt-8 max-w-2xl">
          <div className={cn("border-l-2 border-accent bg-white/[0.02]", CARD_PADDING.standard)}>
            <p className="text-white/80">
              If we can&apos;t credibly get you past that break-even number, we&apos;ll tell you on the first call and
              we won&apos;t take you on.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
