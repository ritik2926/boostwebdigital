import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * The signature moment for this specialty — see docs/00-PROJECT-BLUEPRINT.md
 * ("Honest proof spotlight... presented with full confidence, not
 * apologetically") and docs/12-DESIGN-STANDARDS.md §2.4's note that glow/
 * glass treatment is reserved exactly for a real, cited result like this
 * one. Two honest facts anchor this section: the market-size stat already
 * published on the homepage (src/components/HomePage.tsx's Why Choose Us
 * section — reused verbatim, not a new number), and Kaja Hair Studio named
 * as the one real, live client. The specific case-study metric is
 * deliberately bracketed rather than invented — see dental-marketing/
 * Method.tsx's [FIRSTHAND] convention for the same pattern used elsewhere
 * on this site. Swap the bracket for the real number as soon as it exists;
 * do not resolve it with a guess.
 */
export function HairRestorationProof() {
  return (
    <section id="proof" className={cn("relative border-y border-white/8", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Real Results</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The One Specialty Where We Can Show You, Not Just Tell You</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Every other specialty page on this site describes what we&rsquo;d do for you. This is the one where we can
          point to what we&rsquo;ve already done.
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8")}>
          <div className="flex flex-col justify-center gap-3">
            <span className="font-display text-5xl font-extrabold text-white sm:text-6xl">$10.7B</span>
            <p className="max-w-sm text-white/70">
              The size of the hair transplant and restoration market, growing at roughly 21% a year — one of the
              fastest-moving categories we work in, and one where patients decide almost entirely through what they
              find online.
            </p>
          </div>

          <div className={cn("rounded-2xl border border-accent/30 bg-accent/[0.06]", CARD_PADDING.feature)}>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent">Kaja Hair Studio — real client</p>
            <p className="mt-4 text-white/80">
              Kaja Hair Studio is a real, live hair transplant and restoration client — not a hypothetical case
              study, and not one of the placeholder names elsewhere on this site while we wait on permission to
              publish real quotes.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              [FIRSTHAND: the specific, cited result belongs here — the actual metric, dated, with a source. Nothing
              is invented in its place.]
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
