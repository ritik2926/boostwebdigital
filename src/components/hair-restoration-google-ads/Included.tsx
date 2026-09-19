import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Deliberately NOT the sitewide Visibility/Growth/Market Leader tiers used
 * on every other specialty page's Included section — those price an
 * AI-visibility/SEO scan, not media spend + ad management, and reusing
 * them here would imply Google Ads management costs the same flat fee as
 * that scan, which isn't true and isn't confirmed. Ad management pricing
 * genuinely varies by market competitiveness and monthly spend in a way
 * SEO tiers don't — standard agency practice is a scoped quote, not a
 * fixed public rate card, for exactly that reason. No number is invented
 * here; this routes to a real conversation instead.
 */
export function HairRestorationGoogleAdsIncluded() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Pricing</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Scoped to Your Market, Not a Flat Rate Card</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Ad management pricing depends on your monthly media spend and how competitive your market is — publishing
          one flat number here would either overcharge a quiet market or undercharge a competitive one. We quote
          management fees after a real look at your market and goals, not before.
        </p>
        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Our AI-visibility and SEO work does run at published, flat tiers — see{" "}
          <Link href="/pricing/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            our pricing page
          </Link>{" "}
          for those. Paid ads is scoped separately, alongside that work or on its own.
        </p>
        <p className={cn(STACK.subToContent, "text-white/70")}>
          <Link href="/contact/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            Talk to us about your market
          </Link>{" "}
          and we&rsquo;ll scope it directly.
        </p>
      </Container>
    </section>
  );
}
