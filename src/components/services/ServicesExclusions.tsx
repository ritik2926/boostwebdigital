import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Same real data as PricingExclusions.tsx and PricingQualification.tsx,
 * verbatim — reimplemented without RevealGroup/RevealItem (framer-motion)
 * since this page is framer-motion-free end to end. Checked both source
 * files before writing this; no conflict, no invented copy.
 */
const EXCLUSIONS = [
  {
    name: "Ad Spend",
    body: "Paid budgets are paid directly to Google or Meta, never through us. We don't mark up media.",
  },
  {
    name: "Website Rebuilds",
    body: "We optimise what you have. A full rebuild is quoted separately.",
  },
  {
    name: "Photography and Video",
    body: "We'll tell you what you need and can recommend someone.",
  },
  {
    name: "Patient Data",
    body: "We work exclusively with public data — your site, listings and reviews. We never touch patient records, intake forms, call recordings or CRM data.",
  },
] as const;

const REASONS = [
  {
    name: "Fewer Than 20 Reviews",
    body: "You aren't ready unless you're willing to fix reputation first.",
  },
  {
    name: "Need Results in 30 Days",
    body: "AI citations can move in 30–60 days, but meaningful patient-volume change takes a quarter.",
  },
  {
    name: "Won't Change the Website",
    body: "Some of this work requires changing your pages.",
  },
  {
    name: "Looking for the Cheapest Option",
    body: "There are agencies at $500 a month. They aren't doing this work.",
  },
] as const;

export function ServicesExclusions() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Full Transparency</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What We Will Not Do</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl font-semibold text-white")}>
          Naming what we refuse is the cheapest real credibility a new agency can buy.
        </p>

        <ul className={cn(STACK.subToContent, "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4")}>
          {EXCLUSIONS.map((item) => (
            <li key={item.name}>
              <div className={cn("flex h-full flex-col border border-white/8 bg-white/[0.02]", CARD_RADIUS.feature, CARD_PADDING.feature)}>
                <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div id="who-this-isnt-for" className={cn(STACK.subToContent, "scroll-mt-28")}>
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">Who This Isn&rsquo;t For</h3>
          <p className="mt-2 text-white/70">We turn down more practices than we take on.</p>

          <ul className={cn(STACK.headingToSub, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
            {REASONS.map((reason, i) => (
              <li key={reason.name} className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="font-display text-3xl font-extrabold tabular-nums text-white/25 sm:w-14 sm:shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="font-display text-lg font-semibold text-white">{reason.name}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{reason.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
