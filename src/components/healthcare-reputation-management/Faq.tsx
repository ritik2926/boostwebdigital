import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const HRM_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Someone already saw our bad reply. Can anything be done?",
    a: "Delete or edit it immediately, and stop making it worse. Whether it needs to be reported further depends on what was disclosed and to whom — that is a question for your own counsel, not something we can answer generally.",
  },
  {
    q: "Do you handle the HIPAA side, or is that on us?",
    a: "We build the reply process and templates to avoid the exposures on this page. Your own compliance officer or counsel signs off on anything specific to your practice. We are not a legal substitute.",
  },
  {
    q: "How is this different from a general reputation management company?",
    a: "Ask a general agency whether their reply templates are checked against the HIPAA Privacy Rule specifically. Most are not, because most of their clients are not covered entities.",
  },
  {
    q: "Do you guarantee our star rating goes up?",
    a: "No. We report what we measure: response rate, velocity, and consistency, tracked monthly. A star average is an outcome of real care and real replies, not something an agency can guarantee.",
  },
  {
    q: "What if a review is fake or from someone who was never a patient?",
    a: "Flag it through Google's own review-reporting process first. We can advise on wording, but we do not file disputes on your behalf without your sign-off — the practice's name is what's on record.",
  },
  {
    q: "What happens if we stop?",
    a: "Nothing locks you in. The engagement runs month to month, and we put the terms in writing before anything starts.",
  },
];

export function HrmFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {HRM_FAQ_ITEMS.map((item, i) => (
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
