import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Scan, split by intent",
    body: "One query set built around emergency searches — emergency dentist near me, same-day root canal, dental emergency after hours. A separate query set built around elective searches — single-tooth implant cost, Invisalign vs braces for adults, veneers. Blending these into one score hides which half of your practice is actually being found.",
  },
  {
    number: "02",
    name: "Diagnose against the right competitor for each",
    body: "Emergency queries get compared against directories and chains built specifically to capture that moment. The fastest-answering result often wins there, regardless of clinical quality. Elective queries get compared against practices that have invested heavily in procedure-specific content and reviews instead.",
  },
  {
    number: "03",
    name: "Fix what's structurally missing",
    body: "Emergency pages get rebuilt around speed and availability: current hours, same-day language, a phone number that's the first thing on the page. Elective pages get rebuilt around the specific procedure, written for a patient who's still deciding, not one who's already chosen. Two pages, two jobs, built separately.",
  },
  {
    number: "04",
    name: "Rescan monthly, both intents tracked separately",
    body: "You see whether your emergency visibility or your elective visibility is the one that moved this month, instead of one blended number that hides which half needs attention.",
  },
] as const;

export function DentalMethod() {
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
          , run separately for emergency and elective searches instead of as one undifferentiated pass.
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
          [FIRSTHAND: A real before/after example belongs here — one emergency-page rebuild, one
          elective-procedure-page rebuild, and what actually changed on each.]
        </p>
      </Container>
    </section>
  );
}
