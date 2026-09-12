import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const MWD_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Can you keep our current site and just fix the problems?",
    a: "Sometimes. If the underlying code can meet Core Web Vitals and WCAG 2.1 AA with real work, we keep it. Most page-builder templates cannot, and a rebuild is the honest answer at that point.",
  },
  {
    q: "Do you guarantee an accessibility lawsuit will never happen?",
    a: "No one can guarantee that. We build to WCAG 2.1 AA as a working standard and can show you the audit. Whether that fully protects your specific practice is a question for your own counsel.",
  },
  {
    q: "Will this help us show up in AI answers like the AI visibility page describes?",
    a: "A correct technical foundation is necessary for that, but not sufficient by itself. The entity consistency, structured data, and citation-building work is covered on our AI visibility page, not repeated here.",
  },
  {
    q: "How long does a rebuild take?",
    a: "It depends on how many page templates the practice needs and how much of the current site can be kept. We give a specific timeline after the audit, not before it.",
  },
  {
    q: "What if we already have a marketing agency doing SEO?",
    a: "We can build the site on its own without touching your existing SEO or ad accounts. Tell us what's already in place before the audit so nothing gets duplicated or undone.",
  },
  {
    q: "What happens after launch?",
    a: "We re-run the same speed, booking-path, and accessibility checks and show you the before-and-after numbers. Ongoing monitoring is a separate, smaller engagement, not automatic.",
  },
];

export function MwdFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {MWD_FAQ_ITEMS.map((item, i) => (
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
