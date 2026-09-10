import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

export function DentalProblem() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Problem</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Two Different Patients Land on the Same Page</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          One website, two opposite buying behaviors. An emergency patient decides in minutes. An elective
          patient compares providers for months. A homepage built to serve one usually fails the other silently
          — you never see the patient who left, only the ones who stayed.
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16")}>
          <div>
            <h3 className={H3}>Emergency intent has no patience for a slow site</h3>
            <p className="mt-3 text-white/70">
              A patient searching for an emergency dentist or same-day root canal relief is often in pain. They&apos;re
              usually searching on a phone. They&apos;ll call whichever result answers fastest — current hours, an
              easy-to-find phone number, same-day language, not a paragraph explaining your philosophy of care.
            </p>
            <p className="mt-3 text-white/70">
              If that information is buried inside a generic homepage instead of standing on its own clearly
              structured page, you lose a patient who was ready to call in the next ten minutes. They call
              whichever practice made the decision easier, not whichever practice is actually better.
            </p>
          </div>
          <div>
            <h3 className={H3}>Elective intent is a long comparison, not a moment</h3>
            <p className="mt-3 text-white/70">
              A patient researching a single-tooth implant or comparing Invisalign against braces is nowhere near
              ready to book. They&apos;re comparing providers and options. Increasingly, they&apos;re asking an AI
              tool to summarize the tradeoffs before ever visiting a website directly.
            </p>
            <p className="mt-3 text-white/70">
              A generic &ldquo;our services&rdquo; page doesn&apos;t answer that comparison. It can&apos;t, because
              it wasn&apos;t written to. A page built around the specific procedure, at the depth an undecided
              patient actually needs, does the job the generic page never could.
            </p>
          </div>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Neither problem is solved by treating &ldquo;dental marketing&rdquo; as one keyword category. They&apos;re
          solved by treating them as the two separate marketing problems they actually are, with two separate
          answers. Most practices only ever get one of those answers, and usually don&apos;t know which one is
          missing.
        </p>
      </Container>
    </section>
  );
}
