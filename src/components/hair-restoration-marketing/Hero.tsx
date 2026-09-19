import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Server Component — no "use client", no framer-motion. Same
 * StaticGlow/Sparkles pattern as /dermatology-marketing/ and
 * /dental-marketing/ (see those pages' own comments) — this is the
 * flagship specialty page, so it gets the same performance discipline as
 * every other specialty hub, not less.
 */
export function HairRestorationHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden text-center", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Sparkles seedOffset={47} />
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
            <span className="text-white/70">Hair Restoration Marketing</span>
          </nav>
          <Kicker className="mt-6">Hair Restoration Marketing</Kicker>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            Marketing for a Decision Patients Research for Months Before They Ever Call
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-white/70">
            A hair transplant patient rarely asks a friend. Most research this privately, for six to twelve months,
            almost entirely through search engines and AI — long before a consultation is ever booked.
          </p>
          <p className="mx-auto mt-4 max-w-[640px] text-white/70">
            This is our deepest specialty and the one vertical where we have a real, live client behind the claims —
            not a hypothetical. See how the method works below.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="hair-restoration-hero-primary">
              Check My Clinic&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#proof" className="inline-flex" dataCta="hair-restoration-hero-secondary">
              See the real result
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. All we need is your clinic name.</p>
        </div>
      </Container>
    </section>
  );
}
