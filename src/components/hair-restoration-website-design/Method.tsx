import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Audit against what actually affects bookings, not just style",
    body: "We check real Core Web Vitals, how many taps your booking path takes, and whether your current gallery already meets FTC substantiation standards — so we know exactly what's costing you consults before we touch a single page.",
  },
  {
    number: "02",
    name: "Rebuild technique pages as their own indexable pages",
    body: "FUE, FUT, and DHI content gets split into three properly structured pages instead of staying folded into one generic services page, so each technique search can actually find you and convert on its own terms.",
  },
  {
    number: "03",
    name: "Rebuild the gallery with consent and substantiation built into the template",
    body: "Photo consent and FTC-compliant substantiation language get built into the gallery template itself, so every new before/after set you add later inherits the same protection without a developer touching it again.",
  },
  {
    number: "04",
    name: "Design the booking path around a multi-month, sometimes long-distance buyer",
    body: "The path gets built around the same six-to-twelve-month window and real travel behavior described on our hair restoration marketing and hair restoration Google Ads pages — not a \"book now\" button that assumes a local, same-week decision.",
  },
] as const;

export function HairRestorationWebsiteDesignMethod() {
  return (
    <section id="method" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>How the Rebuild Actually Gets Done</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          This runs alongside, not instead of, the organic and paid sides of the strategy — see our{" "}
          <Link
            href="/hair-restoration-marketing/"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
          >
            hair restoration marketing
          </Link>{" "}
          page for the full engagement,{" "}
          <Link href="/hair-restoration-seo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            hair restoration SEO
          </Link>{" "}
          for how search shapes the content, and{" "}
          <Link
            href="/hair-restoration-google-ads/"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
          >
            hair restoration Google Ads
          </Link>{" "}
          for how paid traffic to these same pages gets structured.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}>
          {STEPS.map((step) => (
            <li key={step.number} className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-6">
              <span aria-hidden className="font-display text-4xl font-extrabold text-white/15 sm:col-span-2 sm:text-5xl">
                {step.number}
              </span>
              <div className="sm:col-span-10">
                <p className="text-lg font-semibold text-white">{step.name}</p>
                <p className="mt-2 max-w-2xl text-white/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
