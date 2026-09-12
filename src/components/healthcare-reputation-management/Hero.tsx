import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Sparkles } from "@/components/services/Sparkles";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta, SecondaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

export function HrmHero() {
  return (
    <section
      id="hero"
      className={cn("relative flex flex-col justify-center overflow-hidden lg:max-h-[70vh]", SECTION_PADDING.default)}
    >
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Sparkles seedOffset={31} />
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
            <span className="text-white/70">Healthcare Reputation Management</span>
          </nav>
          <Kicker className="mt-6">Reputation Management</Kicker>
          <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2rem,4.4vw,3.05rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Your Reputation&rsquo;s Real Risk Is the Reply
          </h1>
          <p className="mt-6 max-w-[58ch] text-white/70">
            A one-star review is not, by itself, a HIPAA problem. Your reply can be. If it confirms someone was a
            patient, names their treatment, or restates their complaint in detail, you have likely disclosed
            protected health information in public — and that exposure is real and enforced.
          </p>
          <p className="mt-4 max-w-[58ch] text-white/70">
            Read the next section before you answer the review that brought you here.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="hrm-hero-primary">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
            <SecondaryCta href="#the-reply" dataCta="hrm-hero-secondary">
              Read this before you reply
            </SecondaryCta>
          </div>
          <p className="mt-4 text-sm text-white/45">Free. No card. About 40 seconds.</p>
        </div>
      </Container>
    </section>
  );
}
