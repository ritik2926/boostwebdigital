import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export const HAIR_RESTORATION_WEBSITE_DESIGN_FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "We already have a website. Why rebuild instead of just refreshing the look?",
    a: "A visual refresh changes colors and photography. It doesn't change your page speed, your booking path, or whether your gallery meets FTC substantiation standards — the three things that actually affect how many visitors turn into consults. If those are already fine, a refresh is the right call. If they're not, a refresh just delays the actual fix.",
  },
  {
    q: "Is our current before/after gallery actually a legal risk?",
    a: "This isn't legal advice — whether your specific gallery creates exposure is a question for your own counsel. What we can tell you is that FTC Endorsement Guide substantiation and documented patient consent are the two things most hair restoration galleries skip, and they're the two things we build in by default.",
  },
  {
    q: "Do we really need separate pages for FUE, FUT, and DHI?",
    a: "If you only ever get asked about one technique, no. Most clinics we talk to get real search volume on at least two, and one collapsed page rarely ranks or converts well for either. Separate pages are a real fix, not padding for its own sake — we'd tell you if your case didn't need it.",
  },
  {
    q: "How does this relate to the SEO and Google Ads work?",
    a: "They compound each other. The SEO work drives search traffic, the Google Ads work drives paid traffic, and this is what happens to both once they land on your site. A rebuilt gallery and booking path make every dollar spent on the other two go further, not just the visitors who found you directly.",
  },
  {
    q: "What if we only want the gallery and booking path fixed, not a full rebuild?",
    a: "That's a real, smaller scope, and often the highest-leverage one. We quote it based on what your current site actually needs, not a fixed package. Talk to us about your site and we'll tell you honestly whether a full rebuild or a targeted fix is the better call.",
  },
];

export function HairRestorationWebsiteDesignFaq() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container size="prose">
        <Kicker>Questions</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Before You Ask</h2>

        <div className={cn(STACK.subToContent, "flex flex-col")}>
          {HAIR_RESTORATION_WEBSITE_DESIGN_FAQ_ITEMS.map((item, i) => (
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
