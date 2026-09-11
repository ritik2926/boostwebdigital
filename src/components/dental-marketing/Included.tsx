import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

/**
 * SECTION 6 — tiers, what's not included, who this isn't for (the last of
 * the three lives in NotFor.tsx, rendered immediately after this section
 * in page.tsx so the three read as one block). Same three tiers, same
 * prices, as every specialty — see src/components/pricing/
 * PricingPlansCards.tsx. The break-even column reuses that page's own
 * $10,000-average-procedure assumption (src/components/pricing/
 * PricingMath.tsx) but carries [CONFIRM] on every row: that figure was
 * never validated against real dental procedure values specifically, and
 * this task's brief is explicit that it must not be silently resolved.
 */
const TIERS = [
  {
    name: "Visibility",
    price: "$1,500/mo",
    forWho: "Solo or single-location practices finding out where they stand on both emergency and elective searches.",
    breakEven: "2 cases/yr [CONFIRM]",
  },
  {
    name: "Growth",
    price: "$3,500/mo",
    forWho: "Practices with real competition on elective procedures and an emergency page that doesn't exist yet.",
    breakEven: "5 cases/yr [CONFIRM]",
  },
  {
    name: "Market Leader",
    price: "$7,500/mo",
    forWho: "Multi-location or DSO-affiliated groups running both emergency and elective care across several locations at once.",
    breakEven: "9 cases/yr [CONFIRM]",
  },
] as const;

/**
 * Real content from src/components/pricing/PricingExclusions.tsx, not
 * paraphrased — the same four exclusions apply here, unmodified.
 */
const NOT_INCLUDED = [
  { name: "Ad spend", body: "Paid budgets are paid directly to Google or Meta, never through us. We don't mark up media." },
  { name: "Website rebuilds", body: "We optimise what you have. A full rebuild is quoted separately." },
  { name: "Photography and video", body: "We'll tell you what you need and can recommend someone." },
  {
    name: "Patient data",
    body: "We work exclusively with public data — your site, listings and reviews. We never touch patient records, intake forms, call recordings or CRM data.",
  },
] as const;

export function DentalIncluded() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What&rsquo;s Included</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Same Three Tiers. A Different Query Set.</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The engagement tiers don&apos;t change by specialty. The price and the structure are the same ones we run
          everywhere. What changes is the input. Your scan runs the emergency and elective questions from the Method
          section above, and every deliverable below covers both sides of your practice.
        </p>

        <div className={cn(STACK.subToContent, "overflow-x-auto")}>
          <table className="w-full min-w-160 border-collapse text-left">
            <thead>
              <tr className="border-b border-white/8">
                <th scope="col" className="pb-3 pr-4 text-sm font-semibold text-white/50">
                  Tier
                </th>
                <th scope="col" className="pb-3 pr-4 text-sm font-semibold text-white/50">
                  Price
                </th>
                <th scope="col" className="pb-3 pr-4 text-sm font-semibold text-white">
                  Best for
                </th>
                <th scope="col" className="pb-3 text-sm font-semibold text-white/50">
                  Break-even*
                </th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier) => (
                <tr key={tier.name} className="border-b border-white/8">
                  <td className="py-4 pr-4 font-semibold text-white">{tier.name}</td>
                  <td className="py-4 pr-4 tabular-nums text-white/85">{tier.price}</td>
                  <td className="py-4 pr-4 text-white/70">{tier.forWho}</td>
                  <td className="py-4 tabular-nums text-white/70">{tier.breakEven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-2xl text-xs text-white/40">
          * Based on a $10,000 average procedure value, the same assumption used on our pricing page. Treat this
          column as a starting estimate, not your number.
        </p>

        <p className={cn(STACK.subToContent, "max-w-2xl text-lg font-semibold text-white")}>
          Full feature breakdown and annual pricing are on{" "}
          <Link href="/pricing/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            our pricing page
          </Link>
          .
        </p>

        <div className={cn(STACK.subToContent, "border-t border-white/8 pt-10")}>
          <h3 className={H3}>What&rsquo;s Not Included</h3>
          <ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {NOT_INCLUDED.map((item) => (
              <li key={item.name}>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1.5 text-sm text-white/60">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
