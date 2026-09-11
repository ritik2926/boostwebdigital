import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REASONS = [
  {
    name: "Fewer than 20 reviews",
    body: "Visibility work on a thin review profile just points more people at a problem you haven't fixed yet.",
  },
  {
    name: "Need results in 30 days",
    body: "AI citations tend to move faster than patient volume does. Expect the two to shift on different clocks.",
  },
  {
    name: "Won't add a named medical reviewer",
    body: "Without one, the E-E-A-T gap stays open no matter what else changes on the page.",
  },
  {
    name: "Looking for the cheapest option",
    body: "Cheaper agencies rarely run reviewer-verified content or HIPAA-checked reputation work. The price gap is usually that missing work.",
  },
  {
    name: "Already at capacity",
    body: "More visibility just means more calls you can't answer. Fix capacity first, then come back.",
  },
] as const;

export function HealthcareSeoNotFor() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Who This Isn&rsquo;t For</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>We Turn Down More Practices Than We Take On</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl font-semibold text-white")}>
          We&rsquo;d rather tell you now than three months in.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
          {REASONS.map((reason) => (
            <li key={reason.name} className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25 sm:mt-2.5" />
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
