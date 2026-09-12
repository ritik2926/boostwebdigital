import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Rebuilt 2026-09-12 — the previous version used RevealGroup/RevealItem
 * (framer-motion) throughout. This page is now framer-motion-free end to
 * end, matching the healthcare-seo / healthcare-reputation-management /
 * healthcare-social-media-management / medical-website-design hubs.
 */
export function ServicesHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex flex-col justify-center overflow-hidden lg:max-h-[70vh]", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Sparkles seedOffset={7} />
      <Container>
        <div className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-white/80">
              Home
            </Link>
            <span aria-hidden>›</span>
            <span className="text-white/70">Services</span>
          </nav>
          <Kicker className="mt-6">Services</Kicker>
          <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2rem,4.4vw,3.05rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            You Probably Don&rsquo;t Need All Five of These
          </h1>
          <p className="mt-6 max-w-[58ch] text-white/70">
            Three agencies have probably told you that you need a full digital strategy. Most practices need one of
            the five services below, not all of them. The table under this section takes about two minutes and
            points at the one to start with, before you talk to anyone, including us.
          </p>
          <p className="mt-4 max-w-[58ch] text-white/70">
            A reader who leaves this page knowing what to fix first is a win, even if that answer is not us.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="services-hero-primary">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#diagnostic" dataCta="services-hero-secondary">
              Find out what I need first
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/45">Free. No card. About 40 seconds.</p>
        </div>
      </Container>
    </section>
  );
}
