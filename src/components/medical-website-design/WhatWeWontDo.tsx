import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REFUSALS = [
  {
    name: "We do not collect health information through a contact form.",
    body: "A form field is not a secure system. If your practice needs patients to submit clinical details online, that belongs in a system built and configured for it, not a website contact form we design.",
  },
  {
    name: "We do not ship a site that fails Core Web Vitals to hit a launch date.",
    body: "A slow launch is not a finished launch. If the choice is ship late or ship slow, we tell you before either happens.",
  },
  {
    name: "We do not treat accessibility as a post-launch fix.",
    body: "Bolting a screen-reader patch onto a finished site after a complaint is worse and more expensive than building it in from the first template.",
  },
] as const;

export function MwdWhatWeWontDo() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Where We Draw the Line</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What We Will Not Do</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl font-semibold text-white")}>
          Naming what we refuse is the cheapest real credibility a new agency can buy.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
          {REFUSALS.map((item) => (
            <li key={item.name} className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25 sm:mt-2.5" />
              <div>
                <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
