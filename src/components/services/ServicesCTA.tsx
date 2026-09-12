import Link from "next/link";
import { Container } from "@/components/Container";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Rewritten 2026-09-12. The previous version of this section said "Fifteen
 * questions, four AI engines" — inconsistent with the single-engine
 * checker described correctly everywhere else on the site (Hero/ClosingCta
 * copy on every other service hub), and with this task's own instruction
 * not to imply the free checker queries multiple named engines. Fixed here
 * to match the correct, sitewide copy.
 */
export function ServicesCTA() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className={H2}>See What AI Says About Your Practice</h2>
          <p className="mt-6 max-w-2xl text-white/70">
            We send three real patient questions to a live AI answer engine and show you the exact answers it gives
            back — who gets named, and who does not. No call required, and the report is yours either way.
          </p>
          <div className="mt-10">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="services-closing">
              Check My Practice&rsquo;s AI Visibility
            </PrimaryCta>
          </div>
          <p className="mt-4 text-sm text-white/45">Free. No card. About 40 seconds.</p>
          <p className="mt-8 max-w-xl text-sm text-white/45">
            Still not sure where to start?{" "}
            <Link href="#diagnostic" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              Go back to the diagnostic table
            </Link>
            , or read more on{" "}
            <Link href="/about/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              how we work
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
