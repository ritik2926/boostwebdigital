import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Service-spoke hero — flat at root, breadcrumb parent Services, matching
 * the site's locked convention (see /hair-restoration-seo/'s page.tsx
 * comment for the full precedent list). Copy is owner-facing throughout,
 * not patient-facing: this page sells a web-design service to a clinic
 * owner, so the subhead states what changes for THEIR bookings, not what
 * patients experience. See WhyDifferent.tsx for the reframe this was built
 * against.
 */
export function HairRestorationWebsiteDesignHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden text-center", SECTION_PADDING.default)}
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
            <span className="text-white/70">Hair Restoration Website Design</span>
          </nav>
          <Kicker className="mt-6">Hair Restoration Website Design</Kicker>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            A Website Built to Turn Your Six-Month Buyers Into Booked Consults
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-white/70">
            Most hair restoration sites get a style refresh that changes nothing about bookings. We rebuild the pages
            carrying your real legal risk and your real revenue — the before/after gallery, technique pages, and
            booking path — so the traffic you&rsquo;re already paying for converts into more consults, not more
            bounces.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="hair-restoration-website-design-hero-primary">
              Check My Clinic&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#why-different" className="inline-flex" dataCta="hair-restoration-website-design-hero-secondary">
              See what changes for you
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. All we need is your clinic name.</p>
        </div>
      </Container>
    </section>
  );
}
