import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { PrimaryCta } from "@/components/StaticCta";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * SECTION 4 — the observation disclaimer is a direct sentence, not buried
 * in a footnote. "9-18 months" carries [SOURCE NEEDED] and must not be
 * silently resolved — see this task's report.
 */
export function DentalHonest() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container size="prose">
        <Kicker>Read This First</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>You Won&rsquo;t Outrank the Map Pack This Quarter</h2>
        <p className={cn(STACK.headingToSub, "text-white/70")}>
          If a competitor has years of reviews and citations behind &ldquo;dentist near me&rdquo; in your metro, that
          position doesn&apos;t move fast. Ranking organically for a competitive local term can take 9&ndash;18
          months [SOURCE NEEDED]. Anyone promising to win that term this quarter is selling you a feeling, not a
          result.
        </p>

        <p className={cn(STACK.subToContent, "text-white/70")}>
          What moves faster is narrower: &ldquo;emergency dentist open now near [your area],&rdquo; &ldquo;single-tooth
          implant cost,&rdquo; &ldquo;Invisalign vs braces for adults.&rdquo; These terms have less competition. They
          map directly onto the two tracks above. They&apos;re also the kind of question an AI answer engine gets
          asked, well before the broad term ever moves.
        </p>

        <p className="mt-8 max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
          We&apos;re telling you what we&apos;ve observed, not what any vendor has confirmed. Every claim here about
          how an AI system decides who to name is an observation, not a guarantee from OpenAI, Google, Anthropic, or
          anyone else.
        </p>

        <p className={cn(STACK.subToContent, "text-lg font-semibold text-white")}>
          The broad term is a long game. The specific questions are winnable now.
        </p>

        <div className="mt-8">
          <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="dental-midpage">
            Check My Practice&rsquo;s AI Visibility
          </PrimaryCta>
          <p className="mt-4 text-sm text-white/50">Free. No card. About 40 seconds.</p>
        </div>
      </Container>
    </section>
  );
}
