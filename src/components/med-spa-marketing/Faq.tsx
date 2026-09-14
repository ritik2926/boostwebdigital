import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Native <details>/<summary>, zero JS — same pattern as /faq/ and the
 * dermatology hub. Exported separately so the page's FAQPage JSON-LD is
 * built from this exact array.
 */
export const MED_SPA_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "We're a licensed medical spa with a physician owner. Does the credibility angle still apply?",
    a: "Less, but yes. You still compete against unaffiliated med spas in the same search results and AI answers, and patients can't tell the difference unless your site names your ownership and credentials directly.",
  },
  {
    q: "Our injectors are RNs delegated by a medical director. Is that a problem?",
    a: "Not on its own — that's a normal, legal structure in most states. It's a marketing gap, not a legal one: most sites never explain who the medical director is, and patients read that silence as something to worry about.",
  },
  {
    q: "How do you handle before-and-after photos given the advertising rules?",
    a: "We don't publish them without your written marketing consent on file, and any result claim gets reviewed by a qualified injector first. Your state board may add further rules — confirm your own obligations with counsel.",
  },
  {
    q: "We already run Instagram and get bookings from it. Why does search or AI visibility matter?",
    a: "Instagram reaches people already following you. Search and AI answers reach the larger group who haven't found you yet and are comparing options by procedure and price — a different funnel most med spas have no plan for.",
  },
  {
    q: "Do you write or manage our reviews for us?",
    a: "We build the reply and request process. We don't write, buy, or incentivize reviews — the exact practice the FTC's 2024 rule on consumer reviews was built to stop.",
  },
  {
    q: "What happens if we stop?",
    a: "The work is month to month. If results stop moving, you can leave without penalty. Terms are confirmed in writing before you start.",
  },
];

export function MedSpaFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {MED_SPA_FAQ_ITEMS.map((item, i) => (
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
