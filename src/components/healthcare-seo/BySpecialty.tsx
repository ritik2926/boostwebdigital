import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

/**
 * Two short blocks, 120 words max each — a pointer down to the specialty
 * hub, never a full re-explanation of it. Full detail lives on the
 * specialty page itself; repeating it here would cannibalise that page,
 * per this task's own brief.
 */
export function HealthcareSeoBySpecialty() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>By Specialty</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Built Differently by Specialty</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The method above stays the same. What changes is which two decisions your patients are actually splitting
          between.
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6")}>
          <div className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
            <h3 className={H3}>Dental</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Dental patients split into two decisions on two different clocks. An emergency search — a cracked tooth
              at 9pm — gets answered in minutes, usually by whoever shows the clearest hours and phone number first.
              An elective search — comparing Invisalign against braces — gets researched for months. We run a
              separate query set for each, every month.
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
              Dermatology carries the same split in a different shape: medical patients and cosmetic patients. A
              medical search — a changing mole, a rash that won&rsquo;t clear — needs speed and a calm, clear answer.
              A cosmetic search — filler, laser, a specific brand name — needs real procedure detail, handled
              carefully under the same YMYL rules.
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
