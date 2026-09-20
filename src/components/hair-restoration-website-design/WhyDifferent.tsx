import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-lg font-semibold text-white";

/**
 * Angles reframed 2026-09-20 per explicit instruction: this page sells a
 * web-design SERVICE to a CLINIC OWNER, not to a patient. The original four
 * angles (gallery/compliance, six-month research window, technique pages,
 * speed/mobile) are the same underlying facts as the /hair-restoration-seo/
 * and /hair-restoration-google-ads/ spokes reference, but every line here
 * closes on what the OWNER gets — less legal exposure, more booked
 * consults, a bigger pipeline, less wasted ad spend — never a patient-
 * experience fact stated for its own sake. The real specifics (FTC
 * Endorsement Guides, Core Web Vitals) stay in, but only to build the
 * owner's trust that we know the field, not to educate them about patients.
 * A fifth angle (patient travel/medical tourism, covered on the Google Ads
 * spoke) was deliberately left out of this set — instructed as "same four
 * angles," not five.
 */
const REASONS = [
  {
    name: "Less legal exposure on your highest-traffic page",
    body: "Most web design agencies treat your before/after gallery as a portfolio section. Built without FTC Endorsement Guide substantiation or documented patient consent, that gallery is real legal exposure sitting on the one page every visitor looks at first. We build both into the template itself, so your best conversion asset stops being your biggest liability.",
  },
  {
    name: "More of your six-month research window ends in a booked consult",
    body: "A hair transplant patient researches privately for six to twelve months before calling anyone. A template site built for a single-visit decision loses that buyer to whichever clinic's site is still useful the fifth time they come back. We build the site to hold that same visitor's attention across months, so more of that window closes on your calendar, not a competitor's.",
  },
  {
    name: "Structure that ranks and converts, instead of one page that does neither",
    body: "FUE, FUT, and DHI searches are three different buyers asking three different questions. Collapsed into one generic services page, none of them rank well and none of them convert well. Built as three separate, properly structured pages, each one earns its own traffic and its own consult request — growing your pipeline instead of splitting it three ways.",
  },
  {
    name: "Fewer of the bookings you already paid for get lost to a slow load",
    body: "Most of this research happens alone, on a phone, with your site open in one tab and a competitor's in the next. Your gallery — the heaviest asset on the page — is exactly where a slow load loses that comparison. If you're running paid traffic to that page, a slow gallery is spend you already paid for, walking straight to a competitor's site.",
  },
] as const;

export function HairRestorationWebsiteDesignWhyDifferent() {
  return (
    <section id="why-different" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Why This Isn&rsquo;t a Generic Website Refresh</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What This Actually Changes for Your Clinic</h2>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-6 sm:grid-cols-2")}>
          {REASONS.map((reason) => (
            <div key={reason.name} className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
              <h3 className={H3}>{reason.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{reason.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
