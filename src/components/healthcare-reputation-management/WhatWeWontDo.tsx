import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REFUSALS = [
  {
    name: "We do not write replies as your practice.",
    body: "A reply that confirms someone is a patient is your exposure, not ours. Putting our name behind it does not change whose license is on the line.",
  },
  {
    name: "We do not buy, generate, or incentivize reviews.",
    body: "The FTC's final rule against fake and incentivized reviews took effect October 21, 2024, and it carries real civil penalties. We would rather have forty real reviews than four hundred purchased ones.",
  },
  {
    name: "We do not review-gate.",
    body: "Asking happy patients for a public review while routing unhappy ones to a private form is a direct violation of Google's Business Profile policies, and Google's own systems are built to detect the pattern.",
  },
] as const;

export function HrmWhatWeWontDo() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Where We Draw the Line</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What We Will Not Do</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl font-semibold text-white")}>
          Naming what we refuse is the cheapest real credibility a new agency can buy.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
          {REFUSALS.map((item) => (
            <li key={item.name} className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25 sm:mt-2.5" />
              <div>
                <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
