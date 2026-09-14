import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const SCENARIOS = [
  {
    name: "A screen reader cannot use your intake form",
    body: "The Americans with Disabilities Act's Title III has been applied to business websites, including medical practice sites, in a large and growing volume of real lawsuits. WCAG 2.1 Level AA is the standard most often cited in the settlements. Most template-based practice sites do not meet it.",
  },
  {
    name: "A form asks for symptoms before anyone has agreed to anything",
    body: "A \"tell us what's bothering you\" field on a public contact form collects health information before any treatment relationship, consent, or secure handling exists. That data usually lands in a plain inbox, not a system built for it.",
  },
  {
    name: "The site cannot be operated by keyboard alone",
    body: "Booking a visit should not require a mouse. A patient tabbing through the page should reach every link and form field in a visible, logical order — most page builders do not guarantee this by default.",
  },
  {
    name: "Color is the only way information is shown",
    body: "A red outline on a form field means nothing to a patient who cannot see red. Every state needs a second signal — text, an icon, a pattern — not color alone.",
  },
] as const;

export function MwdCompliance() {
  return (
    <section id="compliance" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container size="prose">
        <Kicker>The Other Angle</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>Accessibility Is a Legal Question, Not a Style Choice</h2>
        <p className={cn(STACK.headingToSub, "text-white/70")}>
          Most web design agencies treat accessibility as a nice-to-have. For a healthcare practice, it is closer to
          a compliance requirement, and it shows up in real litigation. Four situations come up constantly.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
          {SCENARIOS.map((item) => (
            <li key={item.name} className="flex flex-col gap-2 py-7">
              <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
              <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className={cn(STACK.subToContent, "text-sm text-white/50")}>
          This is not legal advice. Whether your current site creates real exposure is a question for your own
          counsel. We build to WCAG 2.1 AA as a working standard because it is the one most consistently referenced
          in actual settlements, not because any single law names it for every practice.
        </p>
      </Container>
    </section>
  );
}
