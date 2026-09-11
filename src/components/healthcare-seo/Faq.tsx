import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const HEALTHCARE_SEO_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "We already rank on page one for our city and specialty. Isn't that enough?",
    a: "Ranking answers \"can they find the page.\" It says nothing about whether an AI answer engine names you, or whether your reviewer credentials pass Google's own YMYL bar. Both sit outside a normal ranking report.",
  },
  {
    q: "Do you handle the HIPAA side, or is that on us?",
    a: "We build every template and reply process to avoid the exposures described above: no confirmed visits, no named conditions, no treatment details in a public reply. Your own compliance officer or counsel still signs off. We are not a legal substitute.",
  },
  {
    q: "How is this different from what our current SEO company already does?",
    a: "Ask them who your named medical reviewer is, and whether that person's credentials show up on the page. Most agencies skip this because it's slower work, not because it doesn't matter.",
  },
  {
    q: "We're part of a multi-location group or DSO. Who do you actually talk to?",
    a: "Whoever your organization designates, usually a regional or clinical director for day-to-day work. We provide whatever paperwork your approver needs.",
  },
  {
    q: "Do you guarantee we get named in AI answers?",
    a: "No. We report what we measure: real questions, sent monthly, to one real AI engine, with the citation count shown either way. Anyone who guarantees a specific AI outcome is guessing.",
  },
  {
    q: "What happens if we stop?",
    a: "Nothing locks you in. The engagement runs month to month, and we put the terms in writing before anything starts.",
  },
];

export function HealthcareSeoFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {HEALTHCARE_SEO_FAQ_ITEMS.map((item, i) => (
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
