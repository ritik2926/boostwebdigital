import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const PROCEDURES = [
  "Botox and other neuromodulators",
  "Dermal filler",
  "Laser hair removal",
  "Microneedling",
  "Chemical peels",
  "CoolSculpting and other body-contouring devices",
];

export function MedSpaWhatPatientsSearch() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What Patients Actually Search</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Patients Search by Procedure, Then by Price</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Almost nobody searches for &ldquo;med spa near me&rdquo; first. They search for the procedure, then they
          compare who offers it and what it costs.
        </p>

        <ul className={cn(STACK.subToContent, "grid grid-cols-1 gap-3 sm:grid-cols-2")}>
          {PROCEDURES.map((item) => (
            <li key={item} className="flex items-start gap-3 border border-white/8 bg-white/[0.02] px-5 py-4">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
              <span className="text-sm text-white/75">{item}</span>
            </li>
          ))}
        </ul>

        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Cost is the question most med spa sites refuse to answer. A page naming a real price range per unit or
          syringe keeps a comparison-shopping patient reading. A page that hides pricing behind &ldquo;contact us
          for a consultation&rdquo; loses that patient to whoever answered first.
        </p>

        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Increasingly, that comparison happens inside an AI answer first. 36% of patients now use an AI tool to
          help choose a provider. We&apos;re telling you what we&apos;ve observed, not what any AI vendor has
          confirmed: asked &ldquo;botox near me,&rdquo; an AI system tends to name whoever has the clearest, most
          consistent public information — not necessarily the best result.
        </p>
      </Container>
    </section>
  );
}
