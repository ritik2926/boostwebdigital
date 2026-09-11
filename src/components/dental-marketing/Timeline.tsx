import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const PHASES = [
  {
    name: "Month 1",
    body: "The full split scan runs across emergency and elective queries. We also audit whether your site even has a distinct emergency-intent page today. Most don't — the emergency patient and the elective patient land on the exact same homepage.",
  },
  {
    name: "Months 2–3",
    body: "The emergency page gets rebuilt around speed and open hours. Elective procedure pages get rebuilt for depth instead of a generic services list. Your review response system goes live in the same window.",
  },
  {
    name: "Ongoing",
    body: "Monthly rescans, emergency and elective reported separately. You always know which half of your practice moved this month, and which one still needs the work. Neither number gets averaged into the other, so neither can quietly hide behind the one that's doing fine.",
  },
] as const;

export function DentalTimeline() {
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
