import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const RULES = [
  {
    name: "Before-and-after photos",
    body: "The FTC's 2023 Endorsement Guides revision (16 CFR Part 255) tightened what counts as a misleading result claim, and state boards often add their own consent rules on top. We don't publish before-and-after content without written authorization, and a disclaimer never substitutes for an honest, typical result.",
  },
  {
    name: "Outcome and \"medical grade\" claims",
    body: "A result claim needs to reflect what's typical, not the single best outcome on record. \"Medical grade\" has no fixed legal definition — we write around the specific device or credential instead.",
  },
  {
    name: "Reviews and testimonials",
    body: "The FTC's 2024 Rule on Consumer Reviews and Testimonials (16 CFR Part 465, effective October 21, 2024) bans buying fake reviews, undisclosed insider reviews, and AI-generated reviews posed as real patients. We build reputation the same way for every client: real reviews, replied to honestly, never purchased.",
  },
  {
    name: "Injector credentials",
    body: "Scope-of-practice rules vary by state and license type. We name your injectors' real credentials rather than a generic \"expert team\" claim.",
  },
];

export function MedSpaAdvertisingRules() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What You Can and Can&rsquo;t Say</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Aesthetic Marketing Sits on Regulated Ground</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Before-and-after photos, outcome claims, and injector credentials are watched closely by both state boards
          and the FTC. Most med spa marketing advice skips this. We don&apos;t.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}>
          {RULES.map((rule) => (
            <li key={rule.name} className="flex flex-col gap-2 py-7">
              <h3 className="font-display text-lg font-semibold text-white">{rule.name}</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-white/60">{rule.body}</p>
            </li>
          ))}
        </ul>

        <p className={cn(STACK.subToContent, "max-w-2xl border-l-2 border-accent/60 pl-5 text-sm text-white/60")}>
          This is not legal advice, and it doesn&apos;t replace your own state medical or cosmetology board&apos;s
          rules. Confirm your specific obligations with a licensed attorney before publishing outcome claims or
          before-and-after content.
        </p>
      </Container>
    </section>
  );
}
