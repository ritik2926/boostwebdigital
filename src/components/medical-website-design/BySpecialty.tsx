import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

export function MwdBySpecialty() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>By Specialty</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Booking Path Differs by Buyer, Not Just by Service</h2>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6")}>
          <div className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
            <h3 className={H3}>Dental</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              An emergency patient in pain needs a phone number and an office address in two taps, nothing more. An
              elective patient comparing an Invisalign timeline wants pricing context and a longer read before they
              book. The same homepage cannot serve both without a deliberate split in the booking path.
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
              A medical dermatology visit is often insurance-driven and time-sensitive — the booking path should be
              short. A cosmetic visit involves more comparison and higher spend, and the patient expects to see
              pricing ranges and real detail before requesting a consultation. We build both paths into the same
              site, not one path for both patients.
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
