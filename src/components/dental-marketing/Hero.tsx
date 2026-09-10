import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

export function DentalHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden text-center", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Sparkles seedOffset={53} />
      <Container>
        <div className="flex flex-col items-center">
          <Kicker>Dental Marketing</Kicker>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            Dental Marketing for Practices Competing on Emergency and Elective Care
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-white/70">
            A patient searching for an emergency dentist decides in minutes, in pain, with almost no research. A
            patient comparing Invisalign against braces spends months deciding. Most dental marketing is built
            for one of these patients and quietly ignores the other.
          </p>
          <p className="mx-auto mt-4 max-w-[640px] text-white/70">
            We run separate query sets for emergency intent and elective intent, because they&apos;re not
            variations on one search — they&apos;re two different jobs your website has to do. One scan, two
            scorecards, run every month.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="dental-hero-primary">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#method" className="inline-flex" dataCta="dental-hero-secondary">
              See how the scan works
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/45">Free. All we need is your practice name.</p>
        </div>
      </Container>
    </section>
  );
}
