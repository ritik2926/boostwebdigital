import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Audit speed, booking path, and accessibility",
    body: "We measure your current site against Core Web Vitals, count the steps to request an appointment on a phone, and run it against WCAG 2.1 AA. Three scores, not an opinion.",
  },
  {
    number: "02",
    name: "Fix the technical foundation first",
    body: "Page structure, schema markup, and load performance get rebuilt before any visual design starts. A fast page with the wrong layout is still a fast page. A beautiful page that fails Core Web Vitals is not.",
  },
  {
    number: "03",
    name: "Design the booking path deliberately",
    body: "The shortest real path from landing on the page to a submitted appointment request, tested on an actual phone, not a desktop preview.",
  },
  {
    number: "04",
    name: "Build in accessibility, not layer it on after",
    body: "Keyboard navigation, screen-reader labels, and color-independent states are part of the build from the first template, not a fix applied after launch.",
  },
  {
    number: "05",
    name: "Launch, then measure again",
    body: "Same three scores, checked again after launch. If a number did not move, we say so.",
  },
] as const;

export function MwdMethod() {
  return (
    <section id="method" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What Actually Happens, in Order</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The steps below run in this order for every build.{" "}
          <span className="font-semibold text-white">Design starts after the foundation is fixed, not before.</span>
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
