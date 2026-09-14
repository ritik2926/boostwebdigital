import Link from "next/link";
import { Container } from "@/components/Container";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function HealthcareSeoClosingCta() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className={H2}>See What AI Says About Your Practice</h2>
          <p className="mt-6 max-w-2xl text-white/70">
            We send three real patient questions to a live AI answer engine and show you the exact answers it gives
            back — who gets named, and who doesn&rsquo;t. No call required, and the report is yours either way. It&rsquo;s
            the fastest way to see whether your practice already has the entity data and reviewer credentials this
            page is about, or whether that work is still ahead of you.
          </p>
          <div className="mt-10">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="healthcare-seo-closing">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
          </div>
          <p className="mt-4 text-sm text-white/50">Free. No card. About 40 seconds.</p>
          <p className="mt-8 max-w-xl text-sm text-white/50">
            Run a dental or dermatology practice specifically? See how the method above applies to{" "}
            <Link href="/dental-marketing/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              dental marketing
            </Link>{" "}
            or{" "}
            <Link href="/dermatology-marketing/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              dermatology marketing
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
