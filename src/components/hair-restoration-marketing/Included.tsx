import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Same three tiers, same prices, as every specialty this agency works with
 * — see src/components/pricing/PricingPlansCards.tsx for the source of
 * truth. What differs is the query set the scan runs (Method section
 * above), not the package.
 */
const TIERS = [
  {
    name: "Visibility",
    price: "$1,500/mo",
    forWho: "Single-location clinics finding out where they actually stand in AI-generated answers today.",
  },
  {
    name: "Growth",
    price: "$3,500/mo",
    forWho: "Clinics ready to compete directly against the specific practices being named for their highest-value searches.",
  },
  {
    name: "Market Leader",
    price: "$7,500/mo",
    forWho: "Multi-location groups running hair restoration marketing across several markets at once.",
  },
] as const;

export function HairRestorationIncluded() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What&rsquo;s Included</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Same Three Tiers. A Different Query Set.</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          We run the same engagement tiers for every specialty. The price and the structure don&apos;t change. What
          changes is the input — your scan runs the hair restoration questions from the Method section above, built
          around a six-to-twelve-month research window, not a generic local-service template.
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
