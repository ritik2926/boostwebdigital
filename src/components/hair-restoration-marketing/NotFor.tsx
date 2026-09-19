import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REASONS = [
  {
    name: "Fewer than 20 reviews",
    body: "A thin review profile undercuts this work before it starts — a long, private research window means patients read reviews closely. Fix reputation first.",
  },
  {
    name: "Need results in 30 days",
    body: "AI citations can move within weeks. Patient volume, on a six-to-twelve-month decision cycle, moves on a completely different clock.",
  },
  {
    name: "Won't change the website",
    body: "Rebuilding thin technique and before-and-after pages is most of this work. Take the pages off the table and there isn't much left to do.",
  },
  {
    name: "Looking for the cheapest option",
    body: "Plenty of agencies charge less to run one generic local-SEO scan. What they skip is exactly the entity and technique-specific work this category actually needs.",
  },
  {
    name: "No online booking or intake path at all",
    body: "A patient who researches for months and finally decides needs somewhere to act on that decision immediately. Without one, the visibility work we do gets you found and then loses you anyway.",
  },
] as const;

export function HairRestorationNotFor() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Who This Isn&rsquo;t For</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>We Turn Down More Clinics Than We Take On</h2>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
          {REASONS.map((reason, i) => (
            <li key={reason.name} className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
              <span aria-hidden className="font-display text-3xl font-extrabold tabular-nums text-white/25 sm:w-14 sm:shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">{reason.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{reason.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className={cn(STACK.subToContent, "max-w-2xl text-sm text-white/50")}>
          More on who we are and how we work is on{" "}
          <Link href="/about/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
            our about page
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
