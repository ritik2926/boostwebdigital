import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Flat at root, breadcrumb parent Services — matching the now-locked
 * convention (see /hair-restoration-seo/'s own page.tsx comment for the
 * full precedent list). Same Server-Component-only, framer-motion-free
 * tree as every other specialty spoke.
 */
export function HairRestorationGoogleAdsHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden text-center", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Sparkles seedOffset={61} />
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
            <span className="text-white/70">Hair Restoration Google Ads</span>
          </nav>
          <Kicker className="mt-6">Hair Restoration Google Ads</Kicker>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            Google Ads for a High-Ticket, Six-Month Decision
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-white/70">
            A hair transplant is a high-value, considered purchase most patients research privately for months — not
            an emergency search a generic healthcare PPC playbook is built to convert. The budget math, the creative
            rules, and the targeting radius are all different.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="hair-restoration-google-ads-hero-primary">
              Check My Clinic&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#why-different" className="inline-flex" dataCta="hair-restoration-google-ads-hero-secondary">
              See what&rsquo;s different
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. All we need is your clinic name.</p>
        </div>
      </Container>
    </section>
  );
}
