import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const TIERS = [
  { name: "Visibility", price: "$1,500/mo", forWho: "Single-location clinics finding out where they stand today." },
  { name: "Growth", price: "$3,500/mo", forWho: "Clinics ready to compete directly against named local competitors." },
  { name: "Market Leader", price: "$7,500/mo", forWho: "Multi-location groups running this across several markets." },
] as const;

export function HairRestorationSeoIncluded() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What&rsquo;s Included</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Same Three Tiers as Every Specialty</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The price and structure are the same across this agency. What changes is the query set above.
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
