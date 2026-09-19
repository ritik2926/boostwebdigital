import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Structure campaigns by research stage, not one funnel",
    body: "Early-stage technique searches (FUE vs FUT, is a hair transplant permanent) get their own campaign, scored on engagement and remarketing-list growth, not last-click conversions. Late-stage searches (consultation booking, clinic comparison, reviews) get a separate, conversion-optimized campaign. Blending the two into one funnel is what makes generic healthcare PPC underperform here.",
  },
  {
    number: "02",
    name: "Build creative that survives platform review",
    body: "Before/after and results-led creative gets built against the platform's own personalized-advertising and health-content policies from the first draft — substantiated claims, no body-image-targeting language — so campaigns don't stall on disapprovals mid-flight.",
  },
  {
    number: "03",
    name: "Set targeting radius around real travel behavior",
    body: "Radius and geo-targeting get set against how far this specific clinic's patients are actually willing to travel — regional or statewide, not a tight \"near me\" ring — with landing-page content that addresses travel logistics directly instead of assuming a local-only audience.",
  },
  {
    number: "04",
    name: "Sustain remarketing across the full research window",
    body: "A visitor who doesn't convert on the first visit stays in a remarketing audience for months, not days, matched to the same six-to-twelve-month window described on our hair restoration marketing page. Reporting tracks movement through that window, not a single conversion event.",
  },
] as const;

export function HairRestorationGoogleAdsMethod() {
  return (
    <section id="method" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>How Campaigns Are Actually Structured</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          This runs alongside, not instead of, the organic side of the strategy — see our{" "}
          <Link
            href="/hair-restoration-marketing/"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
          >
            hair restoration marketing
          </Link>{" "}
          page for the full engagement, and{" "}
          <Link href="/hair-restoration-seo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            hair restoration SEO
          </Link>{" "}
          for how the same research window shapes organic search.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}>
          {STEPS.map((step) => (
            <li key={step.number} className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-6">
              <span aria-hidden className="font-display text-4xl font-extrabold text-white/15 sm:col-span-2 sm:text-5xl">
                {step.number}
              </span>
              <div className="sm:col-span-10">
                <p className="text-lg font-semibold text-white">{step.name}</p>
                <p className="mt-2 max-w-2xl text-white/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
