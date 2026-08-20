import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SECTION_PADDING, STACK, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const ROWS: Array<{ label: string; visibility: string; growth: string; marketLeader: string }> = [
  { label: "Outcome", visibility: "You appear", growth: "You get chosen", marketLeader: "You're the default" },
  { label: "Patient questions", visibility: "15", growth: "40", marketLeader: "Full treatment lines" },
  { label: "Locations", visibility: "1", growth: "1", marketLeader: "Up to 5" },
  { label: "Reputation", visibility: "Every review answered", growth: "Answered + actively grown", marketLeader: "Answered, grown, managed" },
  { label: "Content", visibility: "Existing pages fixed", growth: "AI extraction content", marketLeader: "Original research" },
  { label: "Third-party authority", visibility: "—", growth: "Mention building", marketLeader: "Digital PR + industry placement" },
  { label: "Competitor intelligence", visibility: "—", growth: "Monthly", marketLeader: "Strategic response" },
  { label: "Paid search", visibility: "—", growth: "—", marketLeader: "Managed" },
  { label: "Contact", visibility: "Monthly report", growth: "Fortnightly call", marketLeader: "Weekly + quarterly strategy" },
  { label: "Break-even", visibility: "2 procedures/year", growth: "5 procedures/year", marketLeader: "9 procedures/year" },
];

/**
 * A real `<table>` (semantic, screen-reader-navigable, natively responsive
 * via the horizontal-scroll wrapper), styled well past browser defaults —
 * not the un-styled default table the brief asks to avoid. Growth's column
 * carries a subtle tinted background the full row-height to read as the
 * highlighted destination without a second competing accent treatment.
 */
export function PricingComparison() {
  return (
    <section className={cn("relative", SECTION_PADDING.spacious)}>
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>Side by side</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              What Changes at Each Level
            </h2>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="text-white/70">Compare destinations, not checklists.</p>
          </RevealItem>
        </RevealGroup>

        <Reveal className={STACK.subToContent}>
          <div className={cn("overflow-x-auto border border-white/8", CARD_RADIUS.feature)}>
            <table className="w-full min-w-175 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="w-1/4 px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white/40">&nbsp;</th>
                  <th className="px-6 py-4 font-display text-base font-semibold text-white/70">Visibility</th>
                  <th className="relative bg-accent/[0.07] px-6 py-4 font-display text-base font-semibold text-white">
                    Growth
                  </th>
                  <th className="px-6 py-4 font-display text-base font-semibold text-white/70">Market Leader</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={row.label} className={i !== ROWS.length - 1 ? "border-b border-white/8" : ""}>
                    <th scope="row" className="px-6 py-4 text-left font-medium text-white/50">
                      {row.label}
                    </th>
                    <td className="px-6 py-4 text-white/70">{row.visibility}</td>
                    <td className="bg-accent/[0.07] px-6 py-4 font-medium text-white">{row.growth}</td>
                    <td className="px-6 py-4 text-white/70">{row.marketLeader}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
