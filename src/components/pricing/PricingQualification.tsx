import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { STACK, SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const REASONS = [
  {
    name: "Fewer Than 20 Reviews",
    body: "You aren't ready unless you're willing to fix reputation first.",
  },
  {
    name: "Need Results in 30 Days",
    body: "AI citations can move in 30–60 days, but meaningful patient-volume change takes a quarter.",
  },
  {
    name: "Won't Change the Website",
    body: "Some of this work requires changing your pages.",
  },
  {
    name: "Looking for the Cheapest Option",
    body: "There are agencies at $500 a month. They aren't doing this work.",
  },
];

/**
 * A divided full-width row list rather than a card grid — the same
 * composition category the Exclusions section right above it used, so this
 * one deliberately rotates to an "Offset" list pattern instead, per
 * DESIGN-CRAFT.md's "never repeat back to back" rule. Numerals carry the
 * visual anchor in place of icons/cards.
 */
export function PricingQualification() {
  return (
    <section className={cn("relative", SECTION_PADDING.spacious)}>
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>Who this isn&apos;t for</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Who This Isn&apos;t For
            </h2>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="text-white/70">We turn down more practices than we take on.</p>
          </RevealItem>
        </RevealGroup>

        <RevealGroup as="ul" trigger="viewport" className={cn(STACK.subToContent, "mx-auto max-w-3xl divide-y divide-white/8 border-y border-white/8")}>
          {REASONS.map((reason, i) => (
            <RevealItem as="li" key={reason.name}>
              <div className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="font-display text-3xl font-extrabold tabular-nums text-white/25 sm:w-14 sm:shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{reason.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{reason.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
