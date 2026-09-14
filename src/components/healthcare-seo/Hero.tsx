import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * No hero photo, by design — the brief for this page is explicit that the
 * hero's visual weight is type, not an image, so next/image priority stays
 * unused entirely on this route (see /public/images/healthcare-seo/ for
 * where the page's two photos actually appear, both lazy-loaded, further
 * down the page).
 */
export function HealthcareSeoHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex flex-col justify-center overflow-hidden lg:max-h-[70vh]", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Sparkles seedOffset={17} />
      <Container>
        <div className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-white/80">
              Home
            </Link>
            <span aria-hidden>›</span>
            <Link href="/services/" className="transition-colors hover:text-white/80">
              Services
            </Link>
            <span aria-hidden>›</span>
            <span className="text-white/70">Healthcare SEO</span>
          </nav>
          <Kicker className="mt-6">Healthcare SEO</Kicker>
          <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2rem,4.4vw,3.05rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Healthcare SEO Follows Its Own Rules
          </h1>
          <p className="mt-6 max-w-[58ch] text-white/70">
            Healthcare SEO means the same technical and content work as regular SEO, run under stricter rules. Google
            treats medical pages as YMYL content — Your Money or Your Life — its highest-scrutiny tier. A tactic that
            works for an online store can get a medical page demoted instead of just ignored.
          </p>
          <p className="mt-4 max-w-[58ch] text-white/70">
            HIPAA adds a layer regular marketing never has to think about: what you can track, quote, or publish
            about a patient. This page covers exactly why that matters, and what we do about it every month.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="healthcare-seo-hero-primary">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#method" dataCta="healthcare-seo-hero-secondary">
              See the method
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. No card. About 40 seconds.</p>
        </div>
      </Container>
    </section>
  );
}
