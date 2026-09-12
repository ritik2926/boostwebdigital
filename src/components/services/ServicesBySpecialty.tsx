import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

/**
 * The five services above stay identical in mechanism across specialties.
 * What actually changes is the buyer — who is searching, how urgently, and
 * what they compare before booking. This section points down without
 * re-explaining either specialty page's own content.
 */
export function ServicesBySpecialty() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>By Specialty</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Work Differs by Buyer, Not Just by Service</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The five services above stay the same. Who is searching, how urgently, and what they compare before
          booking does not.
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6")}>
          <div className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
            <h3 className={H3}>Dental</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              An emergency patient searches differently than one comparing Invisalign providers, and both differ from
              someone reading reviews before a first cleaning. All three need to find the same practice, through
              different content.
            </p>
            <Link
              href="/dental-marketing/"
              className="mt-4 inline-block text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
            >
              See our dental marketing approach
            </Link>
          </div>

          <div className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
            <h3 className={H3}>Dermatology</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              A medical dermatology visit is often insurance-driven and time-sensitive. A cosmetic visit involves
              more comparison, more spend, and a patient checking social proof first. The same five services get
              pointed at each buyer differently.
            </p>
            <Link
              href="/dermatology-marketing/"
              className="mt-4 inline-block text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
            >
              See our dermatology marketing approach
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
