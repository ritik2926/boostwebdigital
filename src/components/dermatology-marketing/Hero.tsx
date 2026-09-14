import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Server Component — no "use client", no framer-motion, no GSAP. Content
 * renders fully in the initial HTML; nothing here depends on JS to become
 * visible (Hard Rule 7). Sparkles is the one decorative element reused
 * as-is from src/components/services/Sparkles.tsx — it's already pure CSS
 * (`.particle-twinkle`, seeded deterministic positions, zero JS) so it needed
 * no replacement, unlike AmbientGlow/MagneticButton below it.
 */
export function DermatologyHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden text-center", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Sparkles seedOffset={31} />
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
            <span className="text-white/70">Dermatology Marketing</span>
          </nav>
          <Kicker className="mt-6">Dermatology Marketing</Kicker>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            Dermatology Marketing That Treats Medical and Cosmetic Patients as Two Different Audiences
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-white/70">
            A patient searching for melanoma screening decides differently than a patient comparing Botox against
            the med spa two blocks away. Most marketing plans treat &ldquo;dermatology&rdquo; as one audience and
            quietly serve neither half well.
          </p>
          <p className="mx-auto mt-4 max-w-[640px] text-white/70">
            We run two separate query sets — one built around your medical patients, one built around your
            cosmetic patients — because AI answer engines and search results already treat them as two different
            questions. Your marketing should too. One scan, two scorecards, run every month.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="derm-hero-primary">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#method" className="inline-flex" dataCta="derm-hero-secondary">
              See how the scan works
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/45">Free. All we need is your practice name.</p>
        </div>
      </Container>
    </section>
  );
}
