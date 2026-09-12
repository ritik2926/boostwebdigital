import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function HsmmWhoItsWorthItFor() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Who This Is Worth It For</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>By Practice Type, Not by Trend</h2>

        <div className={cn(STACK.headingToSub, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10")}>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Cosmetic and elective practices</h3>
            <p className="mt-2 text-white/70">
              Dermatology, med spa, cosmetic dentistry, and plastic surgery patients are actively comparison-shopping.
              A current account with real, properly authorized results reads as credibility exactly where they are
              looking for it.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Insurance-driven, referral-fed practices</h3>
            <p className="mt-2 text-white/70">
              Their patients arrive through an insurance panel or a physician referral. That patient rarely stops to
              browse social media first. The verification check still matters, but the investment beyond a current,
              accurate profile rarely pays for itself.
            </p>
          </div>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl font-semibold text-white")}>
          If your patients pick you off an insurance list, more posting will not change that. If your patients
          compare three practices before choosing, it will.
        </p>
      </Container>
    </section>
  );
}
