import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { MethodDiagram } from "@/components/healthcare-seo/MethodDiagram";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Entity audit",
    body: "We check whether your practice is described the same way everywhere: your site, your listings, your insurance-directory profiles, and every other mention of you online. Mismatched details are the single most common reason a search engine, or an AI system, can't confidently name a practice.",
  },
  {
    number: "02",
    name: "Reviewer-verified content",
    body: "Every page we touch gets a byline and a named reviewer with credentials you can check. This closes the E-E-A-T gap most competitor pages leave wide open.",
  },
  {
    number: "03",
    name: "Technical foundation",
    body: "Schema that correctly marks you as a medical provider, Core Web Vitals inside Google's own limits, and a page structure crawlers can actually read.",
  },
  {
    number: "04",
    name: "Local and directory signals",
    body: "Your Google Business Profile and the insurance directories patients actually filter through, brought in line with the entity work from step one.",
  },
  {
    number: "05",
    name: "AI-answer tracking",
    body: "The same method behind our free visibility check: real patient questions, sent to a live AI engine once a month, counting how often you're actually named.",
  },
  {
    number: "06",
    name: "Reputation system, built HIPAA-safe",
    body: "Review-reply templates that never confirm a visit, name a condition, or invite a complaint, plus ongoing monitoring so a problem gets caught before it goes public.",
  },
] as const;

/*
 * scroll-margin-top on the section below: the hero's "See the method" link
 * jumps here, and the sitewide header is a ~96px sticky element (measured,
 * not assumed). Without this, the anchor lands with the section heading
 * hidden behind the header — a real WCAG 2.2 "focus not obscured" gap that
 * exists on every anchor-linked section sitewide (dental-marketing
 * included), not something new to this page. Fixed here, scoped to this
 * page only; flagged in the build report as a sitewide gap worth its own
 * pass.
 */
export function HealthcareSeoMethod() {
  return (
    <section id="method" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Method We Run Every Month</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The steps below run monthly, in this order, for every specialty we serve.{" "}
          <span className="font-semibold text-white">It is not a menu. Each step depends on the one before it.</span>
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-10")}>
          <MethodDiagram />
          <ul className="flex flex-col divide-y divide-white/8 border-t border-white/8">
            {STEPS.map((step) => (
              <li key={step.number} className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:gap-6">
                <span aria-hidden className="font-display text-3xl font-extrabold text-white/15 sm:col-span-2 sm:text-4xl">
                  {step.number}
                </span>
                <div className="sm:col-span-10">
                  <p className="text-base font-semibold text-white">{step.name}</p>
                  <p className="mt-1.5 text-sm text-white/60">{step.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
