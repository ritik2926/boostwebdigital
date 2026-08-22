import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { ServicesCtaButton } from "@/components/services/ServicesCtaButton";
import { Sparkles } from "@/components/services/Sparkles";
import { HeroKeywordPills } from "@/components/services/HeroKeywordPills";
import { HeroCursorGlow } from "@/components/services/HeroCursorGlow";
import { STACK } from "@/lib/tokens";

/**
 * "Moon on the horizon" focal element — a large circle pushed mostly below
 * the hero via `translate-y`, so only its top arc rises into view. The
 * rotating stroke is a filled conic-gradient circle carved into a ring by
 * `mask-image` (not `filter: blur()` — a previous version of this file hit
 * a real Chromium rendering bug combining `blur()` with `transform:
 * rotate()`; `mask-image` doesn't share that interaction, verified by
 * screenshot before relying on it here too). The glow behind it IS blurred,
 * but that layer never rotates, so it's unaffected. Pure CSS — no JS, so
 * this stays a Server Component; `prefers-reduced-motion` freezes the
 * rotation via `.services-hero-ring`'s own media query (globals.css).
 */
function HeroRing() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute bottom-0 left-1/2 h-160 w-160 -translate-x-1/2 translate-y-[45%] rounded-full sm:h-220 sm:w-220"
        style={{
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.28), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="services-hero-ring absolute bottom-0 left-1/2 h-175 w-175 -translate-x-1/2 translate-y-[55%] rounded-full sm:h-[90vw] sm:w-[90vw]"
        style={{
          background: "conic-gradient(rgba(var(--accent-rgb),0.7), transparent 45%, transparent 55%, rgba(var(--accent-rgb),0.7))",
          maskImage:
            "radial-gradient(circle, transparent calc(50% - 3px), black calc(50% - 2px), black 50%, transparent calc(50% + 1px))",
          WebkitMaskImage:
            "radial-gradient(circle, transparent calc(50% - 3px), black calc(50% - 2px), black 50%, transparent calc(50% + 1px))",
        }}
      />
      <div className="absolute bottom-0 left-1/2 h-140 w-140 -translate-x-1/2 translate-y-[55%] rounded-full border border-white/8 sm:h-[70vw] sm:w-[70vw]" />
    </div>
  );
}

export function ServicesHero() {
  return (
    <section
      id="services-hero"
      className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center overflow-hidden pt-24 pb-16 text-center lg:pt-40 lg:pb-24"
    >
      <HeroRing />
      <Sparkles seedOffset={0} />
      <HeroKeywordPills />
      <HeroCursorGlow />
      <Container className="mx-auto">
        <RevealGroup as="div" trigger="mount" stagger={0.1} className="flex flex-col items-center">
          <RevealItem>
            <Kicker>What we do</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h1 className="mx-auto max-w-3xl font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.5rem]">
              Your success
              <br />
              is our <span className="text-shimmer">priority</span>
            </h1>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="mx-auto max-w-2xl text-white/70">Get in touch to see how we can help your business thrive.</p>
          </RevealItem>
          <RevealItem className="mt-10">
            <ServicesCtaButton href="/contact/">Let&apos;s Contact</ServicesCtaButton>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
