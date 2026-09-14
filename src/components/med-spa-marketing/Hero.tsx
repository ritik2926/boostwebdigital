import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Server Component — no "use client", no framer-motion, no GSAP. Same
 * framer-motion-free stand-ins as the dermatology and dental hero
 * components (StaticGlow/Sparkles/StaticCta).
 */
export function MedSpaHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden text-center", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Sparkles seedOffset={67} />
      <Container>
        <div className="flex flex-col items-center">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-white/80">
              Home
            </Link>
            <span aria-hidden>›</span>
            <Link href="/services/" className="transition-colors hover:text-white/80">
              Services
            </Link>
            <span aria-hidden>›</span>
            <span className="text-white/70">Med Spa Marketing</span>
          </nav>
          <Kicker className="mt-6">Med Spa Marketing</Kicker>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            Med Spa Marketing Built Around the Credibility Problem, Not Around It
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-white/70">
            A med spa is not a medical practice, and most patients can&apos;t tell the difference from a website
            alone. That gap is the actual marketing problem, before pricing or location.
          </p>
          <p className="mx-auto mt-4 max-w-[640px] text-white/70">
            We build the credibility case first, then run the same AI-visibility and search work checked against the
            med spas and dermatology practices you compete with locally.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="medspa-hero-primary">
              Check My Med Spa&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#credibility" className="inline-flex" dataCta="medspa-hero-secondary">
              See the credibility gap
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. All we need is your practice name.</p>
        </div>
      </Container>
    </section>
  );
}
