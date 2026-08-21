import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { AmbientGlow } from "@/components/AmbientGlow";
import { ServicesCtaButton } from "@/components/services/ServicesCtaButton";
import { Sparkles } from "@/components/services/Sparkles";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Bespoke closing CTA (not the shared FinalCTA this round) — the spec calls
 * for a two-line heading with a shimmering second line and the same
 * redesigned button as the Hero, which FinalCTA's fixed copy/button
 * doesn't support. Corner glow (#5, AmbientGlow) + sparkle field (#3),
 * matching the reference's closing composition.
 */
export function ServicesCTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <AmbientGlow corner="top-right" duration={72} />
      <AmbientGlow corner="bottom-left" duration={85} />
      <Sparkles seedOffset={41} />
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>Let&apos;s connect</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] sm:text-[2.5rem]">
              <span className="text-white">Have a question or ready</span>
              <br />
              <span className="text-shimmer">to start your project?</span>
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "max-w-155 text-white/70")}>
            <p>
              Reach out to us, and we&apos;ll get back to you as soon as possible. We&apos;re here to help you take
              the next step toward success.
            </p>
          </RevealItem>
          <RevealItem className="mt-10">
            <ServicesCtaButton href="/contact/">Let&apos;s Contact</ServicesCtaButton>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
