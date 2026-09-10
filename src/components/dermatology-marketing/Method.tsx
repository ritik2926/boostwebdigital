import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Scan, in two parts",
    body: "One query set built around your medical patients — Mohs surgeon near me, best melanoma screening, acne specialist. A separate query set built around your cosmetic patients — Botox vs med spa, laser, filler. These are different questions with different competitors, so we never blend them into one score.",
  },
  {
    number: "02",
    name: "Diagnose against the right competitor for each",
    body: "Medical queries get compared against other dermatology practices and dermatologic surgery programs. Cosmetic queries get compared against the specific local med spas you actually lose cash-pay patients to, not a generic industry benchmark. Two scorecards, two competitor sets, named by name.",
  },
  {
    number: "03",
    name: "Fix what's actually thin",
    body: "Medical procedure pages get rebuilt around the specific condition. A referring physician and a worried patient both need clinical clarity, not a marketing summary. Cosmetic pages get rebuilt to make a specific, honest case for a medical practice over a med spa: real credentials, real safety framing, nothing invented.",
  },
  {
    number: "04",
    name: "Rescan monthly, both sets separately",
    body: "You see your medical citation count and your cosmetic citation count move independently, because they're independent problems with independent fixes.",
  },
] as const;

export function DermatologyMethod() {
  return (
    <section id="method" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What We Actually Do</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          This is the same entity-consistency, structured-data and extractable-content work described in our
          approach to{" "}
          <Link href="/ai-visibility-geo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            AI search visibility
          </Link>
          , run separately for your medical and cosmetic patients instead of as one undifferentiated pass.
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

        <p className={cn(STACK.subToContent, "max-w-2xl border-l-2 border-accent/60 pl-5 text-white/70")}>
          [FIRSTHAND: A real before/after example belongs here — one medical page rewrite, one
          cosmetic-vs-med-spa page rewrite, and what actually changed on each.]
        </p>
      </Container>
    </section>
  );
}
