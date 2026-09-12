import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const SERVICES_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Two rows in the diagnostic table both seem to apply. What do we do?",
    a: "Take the one your patients would notice first. A slow site and a thin review profile are both real, but a patient decides from reviews before they ever load the site. Start there.",
  },
  {
    q: "Can we run more than one service at the same time?",
    a: "Yes, and most practices on our Growth or Market Leader tier do. The diagnostic table is about what to start with, not a limit on what runs concurrently once you're underway.",
  },
  {
    q: "Do we need a new website before AI visibility or SEO work can start?",
    a: "Usually no. AI visibility and SEO work on the site you already have unless it's genuinely broken — see the diagnostic table above. A website rebuild is a separate, fixed-scope project, not a prerequisite.",
  },
  {
    q: "We don't know what's wrong, only that something is. What then?",
    a: "Run the free AI visibility check below. It won't diagnose your website speed or your review count, but it tells you exactly how you show up in a live AI answer today, which rules out or confirms one row on the table.",
  },
  {
    q: "What if we're not ready to hire anyone yet?",
    a: "Then use the diagnostic table and the free checker and fix what you can yourself. A reader who leaves this page knowing what to fix first is a win for us even if it isn't a client today.",
  },
  {
    q: "How is choosing a service different from just picking the cheapest one?",
    a: "The cheapest option treats every practice the same. We turn down work that doesn't match what a practice actually needs — see who this isn't for, above — because the wrong service for your situation doesn't get cheaper by being first.",
  },
];

export function ServicesFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Choosing and Sequencing, Answered</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {SERVICES_FAQ_ITEMS.map((item, i) => (
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
