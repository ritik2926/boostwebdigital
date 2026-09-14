import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * A plain markup mock of the AI Visibility Checker's real verdict/answer
 * shape (src/lib/checker/reportCopy.ts's own "named in N of the three
 * answers we checked" phrasing) — no bytes, no image, unique to us. Every
 * value here is fictional and labelled as such on screen; nothing here is
 * a real practice, a real query result, or a real score.
 */
function CheckerMock() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">AI Visibility Report</p>
      <p className="mt-3 font-display text-lg font-bold leading-snug text-white">
        Example Dental Group was named in 1 of the three answers we checked.
      </p>
      <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">best dentist in [City]</span>
          <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white/50">Not named</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">emergency dentist near me</span>
          <span className="rounded-full border border-accent/40 px-2.5 py-0.5 text-xs font-semibold text-accent">Named</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Invisalign vs braces cost</span>
          <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white/50">Not named</span>
        </div>
      </div>
      <p className="mt-5 border-t border-white/8 pt-4 text-xs text-white/40">Illustrative example, not a real practice.</p>
    </div>
  );
}

export function DentalHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex flex-col justify-center overflow-hidden lg:max-h-[70vh]", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Sparkles seedOffset={53} />
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-white/80">
                Home
              </Link>
              <span aria-hidden>›</span>
              <Link href="/services/" className="transition-colors hover:text-white/80">
                Services
              </Link>
              <span aria-hidden>›</span>
              <span className="text-white/70">Dental Marketing</span>
            </nav>
            <Kicker className="mt-6">Dental Marketing</Kicker>
            <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2rem,4.4vw,3.05rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
              Dental Marketing Split by How Patients Actually Decide
            </h1>
            <p className="mt-6 max-w-[52ch] text-white/70">
              Patients now ask AI tools for a recommendation before they ever open your website. We check whether
              yours gets named — separately for the patient calling in an emergency and the patient still comparing
              Invisalign against braces.
            </p>
            <p className="mt-4 max-w-[52ch] text-white/70">
              Most dental marketing treats those as one search. They&apos;re not. One decides in minutes; the other
              takes months. We run separate query sets for each, every month.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="dental-hero-primary">
                Check My Practice&rsquo;s AI Visibility
              </PrimaryCta>
              <SecondaryCta href="#method" dataCta="dental-hero-secondary">
                See how the scan works
              </SecondaryCta>
            </div>
            <p className="mt-4 text-sm text-white/50">Free. No card. About 40 seconds.</p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <CheckerMock />
          </div>
        </div>
      </Container>
    </section>
  );
}
