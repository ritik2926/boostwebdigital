import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const DENTAL_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "We already rank for \"dentist near me\" in the map pack. Isn't that enough?",
    a: "Map-pack ranking covers one query type. It says nothing about whether you're found for \"same-day root canal\" at 9pm or \"Invisalign vs braces\" during a months-long comparison.",
  },
  {
    q: "Half our new patients already come from emergency walk-ins. Does this still help?",
    a: "Yes — that's exactly the split we build around, and emergency-specific work is often the faster half to move. It also usually means your elective side has been getting less attention than it should. That's the half most practices in your position are actually leaving on the table.",
  },
  {
    q: "We're part of a DSO. Who do you actually talk to?",
    a: "Whoever your organization designates — typically a regional or clinical director for day-to-day work. We'll provide whatever documentation a corporate approver needs to sign off. The person evaluating this and the person approving it are often not the same one, and we plan for that from the start.",
  },
  {
    q: "How is this different from what our current SEO company already does?",
    a: "Ask them for your emergency-query citation count separately from your elective-query citation count. Most agencies report one blended number, which hides which half of your practice actually needs the work. If they can't split it, they probably aren't tracking it that way at all.",
  },
  {
    q: "Do you work with orthodontist-only or single-procedure practices?",
    a: "Yes — the query set narrows to match what you actually offer, at the same three tiers.",
  },
  {
    q: "What happens if we stop?",
    a: "Nothing locks you in — the engagement runs month to month, and you can walk away if the numbers stop moving. We put the exact terms in writing before anything starts, not after.",
  },
];

export function DentalFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {DENTAL_FAQ_ITEMS.map((item, i) => (
            <details key={item.q} open={i === 0} className="faq-row group border-b border-white/8 py-5 first:pt-0 last:border-b-0">
              <summary className="flex w-full cursor-pointer items-center justify-between gap-4 text-left">
                <h3 className="text-[15px] font-medium text-white/85 transition-colors group-hover:text-white group-open:text-accent sm:text-base">
                  {item.q}
                </h3>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="faq-chevron shrink-0 text-white/50 transition-colors group-hover:text-white/80 group-open:text-accent"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
