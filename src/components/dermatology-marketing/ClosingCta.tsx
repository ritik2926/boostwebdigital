import Link from "next/link";
import { Container } from "@/components/Container";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function DermatologyClosingCta() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className={H2}>See What AI Says About Your Practice</h2>
          <p className="mt-6 max-w-2xl text-white/70">
            Fifteen questions, split across your medical query set and your cosmetic query set, one free report,
            free to run. Nothing gets averaged together, and nobody has to call you first.
          </p>
          <div className="mt-10">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="derm-closing">
              Get My Free Report
            </PrimaryCta>
          </div>
          <p className="mt-8 max-w-xl text-sm text-white/50">
            Also run a dental practice as part of a multi-specialty group? Swap medical/cosmetic for
            emergency/elective and the same logic holds. See our{" "}
            <Link href="/dental-marketing/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              dental marketing
            </Link>{" "}
            page.
          </p>
        </div>
      </Container>
    </section>
  );
}
