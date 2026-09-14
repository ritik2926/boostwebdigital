import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Establish credibility first",
    body: "We check whether your site names your medical director, your injectors' real credentials, and your state's disclosure requirements. Most med spa sites skip straight to the price list instead.",
  },
  {
    number: "02",
    name: "Scan for AI and search visibility",
    body: "Real patient-intent questions, run against a live AI engine and against search, scored on whether your practice gets named at all.",
  },
  {
    number: "03",
    name: "Diagnose against your real local competitors",
    body: "Your scorecard is built against the specific med spas and dermatology practices you lose cash-pay patients to, not a national benchmark.",
  },
  {
    number: "04",
    name: "Fix what's thin, procedure by procedure",
    body: "Procedure pages get rebuilt around the searches above — named procedure, named price range, named credential — instead of one generic services page.",
  },
  {
    number: "05",
    name: "Rescan monthly",
    body: "Same questions, same engines, every month, so you see whether the work actually moved the number.",
  },
] as const;

export function MedSpaMethod() {
  return (
    <section id="method" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Five Steps, Credibility First</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The same entity-consistency work described in our approach to{" "}
          <Link href="/ai-visibility-geo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            AI search visibility
          </Link>
          , with one step added at the front most specialties skip.
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
          [FIRSTHAND: A real before/after example belongs here — one med spa's procedure-page rewrite and what
          actually changed in its citation count.]
        </p>
      </Container>
    </section>
  );
}
