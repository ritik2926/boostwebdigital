import Link from "next/link";
import { Container } from "@/components/Container";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function DentalClosingCta() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
      <StaticGlow corner="top-left" />
      <StaticGlow corner="bottom-right" />
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className={H2}>See What AI Says About Your Practice</h2>
          <p className="mt-6 max-w-2xl text-white/70">
            Fifteen questions, run against your emergency query set and your elective query set separately, one
            free report. No call required. You&apos;ll see both sides of your practice, not one blended score
            that hides which one needs the work.
          </p>
          <div className="mt-10">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="dental-closing">
              Get My Free Report
            </PrimaryCta>
          </div>
          <p className="mt-8 max-w-xl text-sm text-white/45">
            Run a multi-specialty group that also includes a dermatology practice? The same split-query logic
            applies there — different domain, same reason it works. Medical and cosmetic instead of emergency and
            elective, but the underlying problem is identical. See our{" "}
            <Link href="/dermatology-marketing/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              dermatology marketing
            </Link>{" "}
            page.
          </p>
        </div>
      </Container>
    </section>
  );
}
