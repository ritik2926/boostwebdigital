import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Audit the current surface",
    body: "We check your review count, velocity, response rate, and consistency across Google Business Profile, Healthgrades, and the directories your specialty actually uses.",
  },
  {
    number: "02",
    name: "Fix the entity mismatches first",
    body: "Inconsistent name, address, or phone details get corrected everywhere they appear. A review strategy built on top of mismatched listings is building on sand.",
  },
  {
    number: "03",
    name: "Put a safe reply process in place",
    body: "Templates that thank the reviewer, avoid confirming a patient relationship, and move the conversation offline — checked against the four rules above every time.",
  },
  {
    number: "04",
    name: "Build response rate and recency deliberately",
    body: "Real reviews get real, timely replies. We do not buy, generate, or incentivize new ones — see what we will not do, below.",
  },
  {
    number: "05",
    name: "Track it monthly, alongside AI-answer citations",
    body: "Reputation and AI visibility get reported together, because we've observed they move together.",
  },
] as const;

export function HrmMethod() {
  return (
    <section id="method" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What Actually Happens, in Order</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The steps below run in this order for every practice, every month.{" "}
          <span className="font-semibold text-white">Later steps depend on the ones before them.</span>
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
