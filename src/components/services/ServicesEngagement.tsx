import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Consistent with PricingExclusions.tsx's own "Website Rebuilds" line: "We
 * optimise what you have. A full rebuild is quoted separately." Checked
 * before writing this section — no conflict found.
 */
export function ServicesEngagement() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>How This Is Priced</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Two Kinds of Work, Priced Differently</h2>

        <div className={cn(STACK.headingToSub, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10")}>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Ongoing work: a monthly retainer</h3>
            <p className="mt-2 text-white/70">
              AI visibility, healthcare SEO, reputation management, and social media management are ongoing —
              measured and reported monthly, in three tiers: Visibility, Growth, and Market Leader.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Website builds: a fixed-scope project</h3>
            <p className="mt-2 text-white/70">
              Medical website design is not a monthly service. It has a defined scope and a defined end, so it is
              quoted on its own — not folded into any retainer tier.
            </p>
          </div>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          <Link
            href="/pricing/"
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
          >
            Full tier pricing for the ongoing services is on our pricing page
          </Link>
          . A website build gets quoted after we know what the current site can keep.
        </p>
      </Container>
    </section>
  );
}
