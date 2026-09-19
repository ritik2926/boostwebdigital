import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-lg font-semibold text-white";

/**
 * STEP 1.5 (2026-09-19) — the four angles approved before this page was
 * built, plus one bonus. General professional PPC/healthcare-marketing
 * knowledge, not site-specific stats — no dollar figures or numbers stated
 * as fact anywhere in this file.
 */
const REASONS = [
  {
    name: "High per-patient value changes the bidding model",
    body: "A hair transplant is a high-ticket, often one-time purchase, not a repeat low-cost visit. That headroom supports far more aggressive cost-per-click and cost-per-lead bidding than a generic healthcare vertical could ever justify — the budget math is different, not just the ad copy.",
  },
  {
    name: "A private, months-long research window breaks single-touch attribution",
    body: "Nobody clicks a hair transplant ad and books same-day the way an emergency dental search converts. Campaigns have to be built around sustained remarketing and nurture sequences across months, not optimized for conversions this week.",
  },
  {
    name: "Before/after creative runs into real platform policy friction",
    body: "Ad platforms specifically scrutinize before/after body-transformation imagery — exactly the format this category relies on most to show results. Campaigns need policy-compliant creative and substantiation from day one, not a generic results gallery that risks disapproval.",
  },
  {
    name: "Patients travel for the procedure — targeting isn't local",
    body: "Unlike a dentist, where patients pick the closest option, hair restoration has a real medical-tourism dynamic: patients routinely travel regionally, statewide, or further for the right surgeon. Targeting radius, ad copy, and the landing page all need to address travel logistics a \"near me\" healthcare campaign never has to.",
  },
  {
    name: "Technique keywords carry different intent and competition",
    body: "FUE, FUT and DHI each attract a different searcher at a different stage, with different costs-per-click. Campaigns need technique-aware keyword structure and aggressive negative-keyword hygiene, or spend leaks into hair-loss and shampoo searches with zero surgical intent.",
  },
] as const;

export function HairRestorationGoogleAdsWhyDifferent() {
  return (
    <section id="why-different" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Why This Isn&rsquo;t Generic Healthcare PPC</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Five Ways This Category Is Different</h2>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-6 sm:grid-cols-2")}>
          {REASONS.map((reason) => (
            <div key={reason.name} className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
              <h3 className={H3}>{reason.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{reason.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
