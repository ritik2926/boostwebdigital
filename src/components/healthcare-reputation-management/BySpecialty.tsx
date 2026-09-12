import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

/**
 * Two short blocks, 120 words max each — a pointer down to the specialty
 * hub, never a full re-explanation of it (that would cannibalise those
 * pages, per this task's own brief).
 */
export function HrmBySpecialty() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>By Specialty</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Handled Differently by Specialty</h2>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6")}>
          <div className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
            <h3 className={H3}>Dental</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Dental reviews split the same way patient searches do. An emergency patient who waited too long in your
              lobby leaves a different kind of review than an elective patient unhappy with an Invisalign timeline.
              Both need a reply that never confirms treatment details, but the tone that calms one rarely calms the
              other. We track dental reviews inside the same emergency-versus-elective split our dental marketing
              work already runs on.
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
              Dermatology carries an extra risk most practices miss: a photo. A reviewer who posts a picture of a
              rash or a cosmetic result and tags your practice has already made a disclosure you did not make.
              Replying with any clinical detail about that photo still becomes yours. We handle this inside the same
              medical-versus-cosmetic split our dermatology marketing work runs on.
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
