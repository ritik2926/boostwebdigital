import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Same three tiers, same prices, as every other page — see
 * src/components/pricing/PricingPlansCards.tsx and
 * src/components/healthcare-seo/Included.tsx. No break-even column here:
 * that figure depends on one specialty's average procedure value, and
 * reputation work isn't specialty-specific. Omitted rather than guessed.
 */
const TIERS = [
  {
    name: "Visibility",
    price: "$1,500/mo",
    forWho: "Single-location practices that need listings corrected and a safe reply process built for the first time.",
  },
  {
    name: "Growth",
    price: "$3,500/mo",
    forWho: "Practices with real review volume and no consistent process across Google, Healthgrades, and insurance directories yet.",
  },
  {
    name: "Market Leader",
    price: "$7,500/mo",
    forWho: "Multi-location or DSO-affiliated groups running the same reputation process across several practices at once.",
  },
] as const;

export function HrmTiers() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What&rsquo;s Included</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Same Three Tiers, Built for Reputation Work</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The engagement tiers do not change for reputation work specifically. What changes is how much of the audit,
          reply process, and monthly tracking your practice needs built from scratch.
        </p>

        <div className={cn(STACK.subToContent, "overflow-x-auto")}>
          <table className="w-full min-w-140 border-collapse text-left">
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

        <p className={cn(STACK.subToContent, "max-w-2xl text-lg")}>
          <span className="font-semibold text-white">
            Every tier includes the reply-process build and monthly consistency tracking described above.
          </span>{" "}
          <span className="text-white/70">
            Full feature lists and annual pricing live on{" "}
            <Link href="/pricing/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
              our pricing page
            </Link>
            .
          </span>
        </p>
      </Container>
    </section>
  );
}
