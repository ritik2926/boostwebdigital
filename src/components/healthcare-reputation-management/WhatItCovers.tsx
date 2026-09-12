import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function HrmWhatItCovers() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What It Actually Covers</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Four Things Move It, Not One</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Reputation management is not just star average. An angry owner rarely tracks any of the other three.
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-10")}>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Review velocity and recency</h3>
            <p className="mt-2 text-white/70">
              These carry more weight than the average itself. A 4.8 average built from reviews mostly over a year
              old reads as stale to a patient checking today, and increasingly to an AI system summarizing your
              practice too.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Response rate</h3>
            <p className="mt-2 text-white/70">
              This is a signal patients and AI systems both read. A practice that never replies reads as absent. One
              that replies to everything, generically, reads as automated. Neither builds trust.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Cross-platform consistency</h3>
            <p className="mt-2 text-white/70">
              Your name, address, phone number, and specialty need to match across Google Business Profile,
              Healthgrades, and every insurance-network directory a patient might check before booking.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">AI visibility</h3>
            <p className="mt-2 text-white/70">
              <span className="italic text-white/50">
                We&rsquo;re telling you what we&rsquo;ve observed, not what any vendor has confirmed:
              </span>{" "}
              AI answer engines appear to read this same reputation surface when deciding which practice to name.
              None of them publish how.
            </p>
          </div>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl font-semibold text-white")}>
          Practices with consistent, current, well-answered profiles get named more often in our own monthly checks.
        </p>
      </Container>
    </section>
  );
}
