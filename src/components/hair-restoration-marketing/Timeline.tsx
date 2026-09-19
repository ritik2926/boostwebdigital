import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const PHASES = [
  {
    name: "Month 1",
    body: "We run the full scan across every stage of the research window — early comparison questions, technique questions, and late-stage \"near me\" and review questions. Then we map exactly which competing clinics get named for each.",
  },
  {
    name: "Months 2–3",
    body: "Technique and before-and-after pages get rebuilt around the specific questions patients ask. Entity data and structured markup get corrected across every listing. Your review response system goes live.",
  },
  {
    name: "Ongoing",
    body: "Monthly rescans of the same query set, reported the same way every time — which questions you're named for now that you weren't before, and which competitor you took the spot from.",
  },
] as const;

export function HairRestorationTimeline() {
  return (
    <section className={SECTION_PADDING.default}>
      <Container>
        <Kicker>How It Runs</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>How the First Ninety Days Run</h2>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6")}>
          {PHASES.map((phase) => (
            <div key={phase.name} className="flex flex-col gap-2 border-t border-white/8 pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/50">{phase.name}</p>
              <p className="text-white/70">{phase.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
