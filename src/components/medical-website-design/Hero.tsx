import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

export function MwdHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex flex-col justify-center overflow-hidden lg:max-h-[70vh]", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Sparkles seedOffset={52} />
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
            <span className="text-white/70">Medical Website Design</span>
          </nav>
          <Kicker className="mt-6">Website Design</Kicker>
          <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2rem,4.4vw,3.05rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            A New Look Does Not Fix a Slow, Unreadable Site
          </h1>
          <p className="mt-6 max-w-[58ch] text-white/70">
            Most practice website projects are sold as a redesign. What actually needs fixing is usually three
            specific things: load speed, whether someone can book from a phone in under a minute, and whether the
            page can legally be used by a patient with a disability. A new visual theme touches none of them by
            itself.
          </p>
          <p className="mt-4 max-w-[58ch] text-white/70">
            We build the site around those three problems first, then design it — not the other way around.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="mwd-hero-primary">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#what-changes" dataCta="mwd-hero-secondary">
              See what actually changes
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. No card. About 40 seconds.</p>
        </div>
      </Container>
    </section>
  );
}
