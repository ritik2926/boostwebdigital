import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Native <details>/<summary>, zero JS — same pattern as /dermatology-
 * marketing/'s Faq.tsx. Exported separately so the page's FAQPage JSON-LD
 * is built from this exact array.
 */
export const HAIR_RESTORATION_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Most of our patients already come from referrals. Why does this matter to us?",
    a: "Referrals still matter, but the research doesn't stop there — a referred patient still spends months privately comparing techniques, before-and-afters and reviews before booking. This work is what they find when they do that checking, not a replacement for the referral itself.",
  },
  {
    q: "How do you handle before-and-after content given advertising and platform rules?",
    a: "We build technique and results pages around credentials, process and safety framing rather than image-led comparison claims alone. Any before-and-after use follows your own state board's and platform's consent and disclosure rules — we don't set those rules ourselves, and you should confirm your specific obligations with your own counsel.",
  },
  {
    q: "We only offer FUE, not FUT. Does the method still apply?",
    a: "Yes — the query set is built around the techniques you actually offer, not a generic \"hair transplant\" list. A FUE-only clinic gets a FUE-specific comparison set, including the FUE-vs-FUT question itself, since patients ask it regardless of which one you perform.",
  },
  {
    q: "Can we see the real result you mention for Kaja Hair Studio?",
    a: "We'll walk through the specifics on a call, with the exact metric and timeframe. We don't publish another practice's numbers on a public page without a clear agreement to do so — the same standard we'd hold for yours.",
  },
  {
    q: "How long before this actually moves patient volume?",
    a: "AI citations can shift within weeks. Patient volume, on a six-to-twelve-month private research cycle, moves on a slower clock — expect to see citation movement before you see the call volume it eventually produces.",
  },
  {
    q: "What happens if we stop?",
    a: "The work is month to month. If the results stop moving, you can leave without a penalty or notice period. Specific terms are confirmed in writing before you start.",
  },
];

export function HairRestorationFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {HAIR_RESTORATION_FAQ_ITEMS.map((item, i) => (
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
