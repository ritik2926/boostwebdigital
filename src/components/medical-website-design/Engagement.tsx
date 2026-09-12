import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Consistent with PricingExclusions.tsx's own "Website Rebuilds" line: "We
 * optimise what you have. A full rebuild is quoted separately." A website
 * build is real project work, scoped and quoted on its own — it is
 * deliberately not folded into the Visibility/Growth/Market Leader monthly
 * tiers that cover the other services on this site.
 */
export function MwdEngagement() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>How This Is Priced</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Project Work, Not a Monthly Tier</h2>
        <div className={cn(STACK.headingToSub, "flex max-w-2xl flex-col gap-4 text-white/70")}>
          <p>
            The monthly retainer tiers on this site cover ongoing work: AI visibility, SEO, reputation, and social
            media. A website build is a fixed scope with a defined end, not an ongoing monthly service, so it is
            quoted separately.
          </p>
          <p className="font-semibold text-white">
            If you are already on a monthly tier, a website build sits alongside it. It does not replace it, and it
            is not included in it.
          </p>
          <p>
            The exact price depends on how much of the current site can be kept, how many page templates the
            practice needs, and how much of the accessibility and speed work above the current site already passes.
            <Link
              href="/pricing/"
              className="ml-1 text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
            >
              Full tier pricing for the ongoing services is on our pricing page
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
