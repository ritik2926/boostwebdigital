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
    example: "For example: a practice scores well on elective terms and zero on emergency terms. Blended, that reads as an average score. Split, it reads as a missing page.",
  },
  {
    number: "02",
    name: "Diagnose against the right competitor for each",
    body: "Emergency queries get compared against directories and chains built to capture that exact moment. The fastest result often wins there, no matter the clinical quality. Elective queries get compared against practices that put real work into procedure content and reviews instead.",
    example: "For example: an emergency search often surfaces a directory listing above any individual practice. That's the actual competitor for that query, not the practice down the street.",
  },
  {
    number: "03",
    name: "Fix what's missing",
    body: "Emergency pages get rebuilt around speed and availability: current hours, same-day language, a phone number that's the first thing on the page. Elective pages get rebuilt around the specific procedure, written for a patient who's still deciding, not one who's already chosen. Two pages, two jobs, built separately.",
    example: "For example: an emergency page leads with hours and a tap-to-call number, above any text. A single-tooth-implant page leads with cost ranges and the decision, not a general services paragraph.",
  },
  {
    number: "04",
    name: "Rescan monthly, both intents tracked separately",
    body: "You see which side moved this month — emergency or elective — instead of one blended number that hides the answer.",
    example: "For example: a flat month on emergency terms and a clear gain on elective terms shows up as two numbers, not one average that hides both.",
  },
] as const;

export function DentalMethod() {
  return (
    <section id="method" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What We Actually Do</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          This is the same work described in our approach to{" "}
          <Link href="/ai-visibility-geo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            AI search visibility
          </Link>
          : entity consistency, structured data, extractable content. We just run it twice — once for emergency
          searches, once for elective ones.
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
                <p className="mt-3 max-w-2xl text-sm text-white/50">{step.example}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className={cn(STACK.subToContent, "max-w-2xl border-l-2 border-accent/60 pl-5 text-white/70")}>
          [FIRSTHAND: A real before/after example belongs here — one emergency-page rebuild, one
          elective-procedure-page rebuild, and what actually changed on each.]
        </p>

        <p className={cn(STACK.subToContent, "max-w-2xl text-lg font-semibold text-white")}>
          Two query sets, tracked separately, all the way through — never averaged back into one number.
        </p>
      </Container>
    </section>
  );
}
