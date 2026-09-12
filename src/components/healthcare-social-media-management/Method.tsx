import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Audit the current accounts",
    body: "We check post date, consistency with your actual name and specialty, and whether anything already posted creates HIPAA exposure.",
  },
  {
    number: "02",
    name: "Build the consent process first",
    body: "Before any before-and-after or patient-adjacent content goes up, the written sign-off for that specific use exists on file.",
  },
  {
    number: "03",
    name: "Set a posting cadence built for verification, not volume",
    body: "Enough that the account reads as current, not so much that quality drops to hit a number.",
  },
  {
    number: "04",
    name: "Handle replies and comments against the four rules",
    body: "Every time, not just when something feels sensitive.",
  },
  {
    number: "05",
    name: "Track it monthly, alongside AI-answer citations and reviews",
    body: "We've observed the three move together.",
  },
] as const;

export function HsmmMethod() {
  return (
    <section id="method" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What Actually Happens, in Order</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The steps below run in this order for every practice, every month.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}>
          {STEPS.map((step) => (
            <li key={step.number} className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-6">
              <span aria-hidden className="font-display text-4xl font-extrabold text-white/15 sm:col-span-2 sm:text-5xl">
                {step.number}
              </span>
              <div className="sm:col-span-10">
                <p className="text-lg font-semibold text-white">{step.name}</p>
                <p className="mt-2 max-w-2xl text-white/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
