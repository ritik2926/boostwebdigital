import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const PHASES = [
  {
    name: "Month 1",
    body: "We run the full two-part scan first. Then we build your medical and cosmetic competitor maps. That includes naming the specific local med spas you're actually losing cosmetic patients to, not a generic list of nearby dermatologists.",
  },
  {
    name: "Months 2–3",
    body: "Content and entity fixes on both procedure sets. Your review response system goes live. Structured data gets corrected across your medical and cosmetic listings separately, not folded into one blended profile that hides which side needs the work.",
  },
  {
    name: "Ongoing",
    body: "Monthly rescans of both query sets, reported separately. You see whether the medical side or the cosmetic side needs attention this month. Neither number gets averaged into the other.",
  },
] as const;

export function DermatologyTimeline() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container>
        <Kicker>How It Runs</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>How the First Ninety Days Run</h2>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6")}>
          {PHASES.map((phase) => (
            <div key={phase.name} className="flex flex-col gap-2 border-t border-white/8 pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/45">{phase.name}</p>
              <p className="text-white/70">{phase.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
