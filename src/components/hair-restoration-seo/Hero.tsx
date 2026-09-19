import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Service-spoke hero — lighter than the hub's (see docs/13-URL-
 * ARCHITECTURE.md: spoke pages describe what's offered, they don't re-run
 * the hub's full pitch). Breadcrumb parent is Services, not the hub — this
 * page is flat at /hair-restoration-seo/, matching the site's established
 * flat-at-root pattern for this exact page shape (see page.tsx's own
 * comment). The hub link two lines below still connects the two directly.
 */
export function HairRestorationSeoHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden text-center", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Sparkles seedOffset={53} />
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
            <span className="text-white/70">Hair Restoration SEO</span>
          </nav>
          <Kicker className="mt-6">Hair Restoration SEO</Kicker>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            SEO for a Search That Starts Privately, Months Before a Call
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-white/70">
            Generic medical SEO optimizes for symptoms and appointments. A hair transplant search runs on a
            different pattern entirely — technique comparisons, before-and-after evidence, and clinic reputation,
            researched for months before anyone reaches out.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="hair-restoration-seo-hero-primary">
              Check My Clinic&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#method" className="inline-flex" dataCta="hair-restoration-seo-hero-secondary">
              See the query set
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. All we need is your clinic name.</p>
        </div>
      </Container>
    </section>
  );
}
