import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function MwdWhoItsWorthItFor() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Who This Is Worth It For</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>By What&rsquo;s Actually Broken, Not by Age</h2>

        <div className={cn(STACK.headingToSub, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10")}>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">A site that measurably fails</h3>
            <p className="mt-2 text-white/70">
              Slow on mobile, a booking path with more than a few steps, or genuinely unusable with a keyboard or
              screen reader. These are checkable, not opinions, and each one costs patients directly.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">A site that just looks dated</h3>
            <p className="mt-2 text-white/70">
              If the site is fast, the booking path is short, and it works for every patient, an old-looking design
              is a preference, not a problem. A visual refresh can be scoped on its own, separately from a rebuild.
            </p>
          </div>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl font-semibold text-white")}>
          We check the first list before we ever discuss the second one.
        </p>
      </Container>
    </section>
  );
}
