import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Native <details>/<summary>, zero JS — same pattern as /faq/
 * (src/app/faq/page.tsx), reused here rather than the "use client"
 * GeoFaqAccordion so this section stays part of the Server Component tree.
 * Exported separately so the page's FAQPage JSON-LD is built from this exact
 * array — single source of truth, matching the site's existing FAQPage
 * convention (see src/lib/faqs.ts's own comment on why this matters).
 */
export const DERMATOLOGY_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "We're primarily insurance-based. Does this even apply to us?",
    a: "Yes, on the medical side alone. The cosmetic-specific work only runs if you actually have a cosmetic line — a medical-only practice uses the medical query set and nothing else. You're not paying for a comparison problem you don't have.",
  },
  {
    q: "Our cosmetic patients already come from Instagram. Why does this matter?",
    a: "Instagram reaches people already following you. This addresses patients who haven't heard of you yet and are asking an AI tool or a search engine to name someone. Those are two different audiences, at two different points in the decision, and most practices only have a plan for one of them.",
  },
  {
    q: "How do you handle before-and-after content given advertising rules?",
    a: "We build cosmetic content around credentials and safety framing rather than image-led comparison claims. Any before-and-after use follows your own state board's and platform's consent and disclosure rules — we don't set those rules ourselves, and you should confirm your specific obligations with your own counsel.",
  },
  {
    q: "We compete with med spas that aren't run by a doctor at all. How is that a fair comparison?",
    a: "It isn't, which is exactly why we treat it as its own problem instead of folding it into generic dermatology marketing. A med spa's whole marketing budget is often built around exactly this comparison. Treating it as a footnote is how practices keep losing it.",
  },
  {
    q: "Do you work with medical-only practices with no cosmetic side?",
    a: "Yes — the medical query set and method described above run on their own, at the same three tiers.",
  },
  {
    q: "What happens if we stop?",
    a: "The work is month to month. If the results stop moving, you can leave without a penalty or notice period. Specific terms are confirmed in writing before you start.",
  },
];

export function DermatologyFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {DERMATOLOGY_FAQ_ITEMS.map((item, i) => (
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
