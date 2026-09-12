import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const HSMM_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Will this bring us new patients?",
    a: "Rarely, and we would rather tell you that now. Social media mostly does a verification job — a patient who already has your name checks whether you look real and current. See what social media actually does, above.",
  },
  {
    q: "Do you handle the HIPAA side, or is that on us?",
    a: "We build the posting and reply process around the four scenarios on this page. We require written authorization on file before anything patient-adjacent goes up. Your own counsel signs off on anything specific to your practice.",
  },
  {
    q: "We already have a staff member posting. What changes?",
    a: "Usually the consent process and the reply discipline, not the posting itself. Ask your staff member whether a written authorization file exists for every before-and-after currently live.",
  },
  {
    q: "How is this different from a general social media agency?",
    a: "Ask a general agency whether they require written marketing authorization before posting a before-and-after. Ask if they'd reply to a review the same way they'd reply to a comment. Most have not thought about either question.",
  },
  {
    q: "Do you write the actual posts?",
    a: "We build the process, the cadence, and the consent system. Who writes and shoots the content is part of the engagement conversation, not something this page can answer generally.",
  },
  {
    q: "What happens if we stop?",
    a: "Nothing locks you in. The engagement runs month to month, and we put the terms in writing before anything starts.",
  },
];

export function HsmmFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {HSMM_FAQ_ITEMS.map((item, i) => (
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
