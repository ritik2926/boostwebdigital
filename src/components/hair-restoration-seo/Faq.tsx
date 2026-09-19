import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const HAIR_RESTORATION_SEO_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "How is this different from the hair restoration marketing page?",
    a: "This page is the search and content method in detail — the query set, the entity fixes, the schema. The marketing page covers the full engagement, including strategy, reporting and the real result behind our approach.",
  },
  {
    q: "Do you write the before-and-after content, or just the technical SEO?",
    a: "Both. Technical fixes without real, compliant evidence content rarely move a category this trust-dependent, so content and technical work run together, not as separate line items.",
  },
  {
    q: "We only see a handful of searches a month for our clinic name. Is this still worth it?",
    a: "Branded search volume undercounts this category badly — most of the research happens on unbranded technique and comparison terms, and increasingly inside an AI answer a patient never turns into a Google search at all.",
  },
  {
    q: "How long until we see movement?",
    a: "AI citations and early-stage technique pages can move within weeks. Late-stage, high-intent terms tied to reviews and reputation typically take longer, in line with how long real trust signals take to build.",
  },
];

export function HairRestorationSeoFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {HAIR_RESTORATION_SEO_FAQ_ITEMS.map((item, i) => (
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
