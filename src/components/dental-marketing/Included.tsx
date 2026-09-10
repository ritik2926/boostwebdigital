import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Same three tiers, same prices, as every specialty this agency works with
 * — see src/components/pricing/PricingPlansCards.tsx. What differs by
 * specialty is the query set (Method section above), not the package. See
 * src/components/dermatology-marketing/Included.tsx for the identical
 * pattern applied to that specialty — the shared parts here are the offer
 * itself (real, from the repo), not borrowed prose.
 */
const TIERS = [
  {
    name: "Visibility",
    price: "$1,500/mo",
    forWho: "Solo or single-location practices finding out where they stand on both emergency and elective searches.",
  },
  {
    name: "Growth",
    price: "$3,500/mo",
    forWho: "Practices with real competition on elective procedures and an emergency page that doesn't exist yet.",
  },
  {
    name: "Market Leader",
    price: "$7,500/mo",
    forWho: "Multi-location or DSO-affiliated groups running both emergency and elective care across several locations at once.",
  },
] as const;

export function DentalIncluded() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What&rsquo;s Included</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Same Three Tiers. A Different Query Set.</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The engagement tiers don&apos;t change by specialty. The price and the structure are the same ones we
          run everywhere. What changes is the input. Your scan runs the emergency and elective questions from the
          Method section above, and every deliverable below is applied to both sides of your practice — not just
          whichever one is easier to market.
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
                <th scope="col" className="pb-3 text-sm font-semibold text-white">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier) => (
                <tr key={tier.name} className="border-b border-white/8">
                  <td className="py-4 pr-4 font-semibold text-white">{tier.name}</td>
                  <td className="py-4 pr-4 tabular-nums text-white/85">{tier.price}</td>
                  <td className="py-4 text-white/70">{tier.forWho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Full feature breakdown and annual pricing are on{" "}
          <Link href="/pricing/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            our pricing page
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
