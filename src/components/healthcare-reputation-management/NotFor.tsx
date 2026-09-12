import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REASONS = [
  {
    name: "Already has a written review-reply policy staff follow correctly",
    body: "You don't need us to build what you already have.",
  },
  {
    name: "Wants us to write replies under the practice's name",
    body: "See what we will not do, above — this is the one line we do not cross.",
  },
  {
    name: "Looking to buy or incentivize reviews",
    body: "We will turn this down every time, not just say so on this page.",
  },
  {
    name: "Fewer than 10 reviews total",
    body: "Reputation work needs a real surface to manage. Fix intake and ask real patients first.",
  },
  {
    name: "Needs a crisis handled today",
    body: "We build the ongoing process. For an active HIPAA exposure, call your own counsel first.",
  },
] as const;

export function HrmNotFor() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Who This Isn&rsquo;t For</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>We Turn Down More Practices Than We Take On</h2>

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
