import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STAGES = [
  {
    stage: "Early research",
    queries: ["FUE vs FUT hair transplant", "is a hair transplant permanent", "hair transplant recovery time"],
    fix: "Technique-specific pages that answer the comparison directly, instead of one blended \"our services\" page.",
  },
  {
    stage: "Mid research",
    queries: ["hair transplant cost [city]", "best hair transplant clinic near me", "hair transplant before and after"],
    fix: "Consistent, structured entity data across every listing, and documented, policy-compliant before-and-after evidence.",
  },
  {
    stage: "Late research",
    queries: ["[clinic name] reviews", "hair transplant clinic near me open now", "book hair transplant consultation"],
    fix: "A review response system, matching NAP data everywhere it's cited, and a booking path that doesn't lose the patient at the last step.",
  },
] as const;

export function HairRestorationSeoMethod() {
  return (
    <section id="method" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Query Set</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Three Stages, One Patient</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The same patient asks different questions at different points in a six-to-twelve-month decision. We scan,
          score and fix each stage separately — see the full method, including how the monthly rescan works, on our{" "}
          <Link
            href="/hair-restoration-marketing/"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
          >
            hair restoration marketing
          </Link>{" "}
          page.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}>
          {STAGES.map((s) => (
            <li key={s.stage} className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/50">{s.stage}</p>
              </div>
              <div className="lg:col-span-5">
                <ul className="flex flex-col gap-1.5 text-sm text-white/70">
                  {s.queries.map((q) => (
                    <li key={q}>&ldquo;{q}&rdquo;</li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-4">
                <p className="text-sm text-white/60">{s.fix}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
