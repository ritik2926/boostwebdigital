import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

export function HsmmHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex flex-col justify-center overflow-hidden lg:max-h-[70vh]", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Sparkles seedOffset={47} />
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
            <span className="text-white/70">Healthcare Social Media Management</span>
          </nav>
          <Kicker className="mt-6">Social Media Management</Kicker>
          <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2rem,4.4vw,3.05rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Social Media Probably Won&rsquo;t Bring You New Patients
          </h1>
          <p className="mt-6 max-w-[58ch] text-white/70">
            For most practices, social media is not how new patients find you. It is where they check you out after
            they already have your name — from a referral, a search, or a friend. An account that looks abandoned
            answers that check badly.
          </p>
          <p className="mt-4 max-w-[58ch] text-white/70">
            This page covers what social actually does, what it does not, and a legal exposure most agencies never
            mention.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="hsmm-hero-primary">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#what-it-does" dataCta="hsmm-hero-secondary">
              See what social actually does
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/45">Free. No card. About 40 seconds.</p>
        </div>
      </Container>
    </section>
  );
}
