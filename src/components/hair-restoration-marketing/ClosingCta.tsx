import Link from "next/link";
import { Container } from "@/components/Container";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta } from "@/components/StaticCta";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function HairRestorationClosingCta() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
      <StaticGlow corner="top-right" />
      <StaticGlow corner="bottom-left" />
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className={H2}>See What AI Says About Your Clinic</h2>
          <p className="mt-6 max-w-2xl text-white/70">
            Fifteen questions built around the same research window covered above, one free report, free to run.
            Nobody has to call you first.
          </p>
          <div className="mt-10">
            <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="hair-restoration-closing">
              Get My Free Report
            </PrimaryCta>
          </div>
          <p className="mt-8 max-w-xl text-sm text-white/50">
            Want the technical breakdown first? See our{" "}
            <Link href="/hair-restoration-seo/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              hair restoration SEO
            </Link>{" "}
            page, or our{" "}
            <Link href="/hair-restoration-google-ads/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              hair restoration Google Ads
            </Link>{" "}
            approach. Run a dermatology or dental practice instead? See{" "}
            <Link href="/dermatology-marketing/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              dermatology marketing
            </Link>{" "}
            or{" "}
            <Link href="/dental-marketing/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
              dental marketing
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
