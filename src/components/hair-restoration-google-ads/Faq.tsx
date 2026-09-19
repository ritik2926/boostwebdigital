import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const HAIR_RESTORATION_GOOGLE_ADS_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "How is this different from just running Google Ads ourselves?",
    a: "The mechanics of the platform are the same; the strategy underneath it isn't. Generic PPC setup treats every click the same way. This runs separate campaigns by research stage, builds creative that survives platform review for before/after content, and sustains remarketing across a much longer window than most healthcare categories need.",
  },
  {
    q: "Will our before/after ads get flagged or disapproved?",
    a: "That risk is exactly why creative gets built against the platform's health-content and personalized-advertising policies from the first draft, not after a disapproval. We can't guarantee a platform's own review outcome, but non-compliant creative is the single most common reason hair-restoration ad accounts stall, and it's addressed upfront.",
  },
  {
    q: "How far should we be targeting? We're not sure patients travel for this.",
    a: "Many hair restoration patients do travel further than a typical local healthcare search — regionally or statewide, sometimes further, for the right surgeon. We set targeting radius against your own real patient geography, not a default local ring, once we understand where your current patients are actually coming from.",
  },
  {
    q: "Do we need this and the SEO work, or just one?",
    a: "They compound each other rather than compete — paid search covers the immediate, high-intent searches while SEO builds the organic presence a months-long research window keeps returning to. See our hair restoration SEO page for that side of it.",
  },
  {
    q: "What happens if we stop?",
    a: "Ad management is month to month, tied to active spend — stopping spend stops the engagement, with no penalty or notice period. Specific terms are confirmed in writing before you start.",
  },
];

export function HairRestorationGoogleAdsFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {HAIR_RESTORATION_GOOGLE_ADS_FAQ_ITEMS.map((item, i) => (
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
