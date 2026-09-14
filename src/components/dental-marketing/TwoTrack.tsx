import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-xl font-semibold text-white";

/**
 * SECTION 3, the page's centerpiece — two decision tracks, differentiated
 * by weight and density (bar fill, border weight, text size), never by a
 * new colour. Both bars use the one existing accent token. The two
 * percentages are an illustrative proportion of this specific design
 * element, not a measured statistic, so they're labelled as such rather
 * than presented as sourced data.
 */
function TrackBar({ label, percent, weight }: { label: string; percent: number; weight: "bold" | "faint" }) {
  return (
    <div className="mt-6">
      <div className={cn("h-2 w-full overflow-hidden rounded-full bg-white/8", weight === "bold" ? "border border-white/15" : "")}>
        <div
          className={cn("h-full rounded-full bg-accent", weight === "bold" ? "opacity-90" : "opacity-50")}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-white/40">{label}</p>
    </div>
  );
}

export function DentalTwoTrack() {
  return (
    <section id="two-track" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Centerpiece</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Two Patients, Two Timelines, One Website</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          A patient with a cracked tooth at 9pm and a patient comparing Invisalign against braces are not the same
          buyer. One decides in minutes. The other decides over months. Most dental websites are built for whichever
          one the practice thinks about first, and quietly lose the other.
        </p>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8")}>
          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/50">Track One</p>
            <h3 className={cn(H3, "mt-2")}>Emergency</h3>
            <p className="mt-3 text-white/70">
              A patient searching for an emergency dentist, a same-day root canal, or an emergency extraction is
              usually in pain and on a phone. They call whichever result answers fastest: current hours, a visible
              phone number, same-day language. They rarely compare more than two or three results before calling.
            </p>
            <TrackBar label="Illustrative — time from search to call, not measured data" percent={7} weight="bold" />
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/40">Track Two</p>
            <h3 className={cn(H3, "mt-2 text-white/85")}>Elective</h3>
            <p className="mt-3 text-white/60">
              A patient researching a single-tooth implant or comparing veneers against whitening isn&apos;t close to
              booking. They read procedure pages, check reviews, and now often ask an AI tool to weigh the options
              before they ever visit a site.
            </p>
            <TrackBar label="Illustrative — how much research is already done before contact, not measured data" percent={88} weight="faint" />
          </div>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl text-lg font-semibold text-white")}>
          A homepage that tries to serve both moments usually serves neither one well.
        </p>
      </Container>
    </section>
  );
}
