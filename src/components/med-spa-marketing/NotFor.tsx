import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REASONS = [
  {
    name: "You want us to imply a credential you don't have",
    body: "We name your real injectors and real licenses. If that story isn't strong yet, we'll say so directly.",
  },
  {
    name: "You need results this month",
    body: "The credibility rebuild and visibility scan both take longer than 30 days to move.",
  },
  {
    name: "Fewer than 20 reviews",
    body: "A thin review profile undercuts the credibility case before it starts.",
  },
  {
    name: "Won't change the website",
    body: "Rebuilding procedure pages around named treatments and credentials is most of this work.",
  },
  {
    name: "Looking for the cheapest option",
    body: "Plenty of agencies charge less to skip the compliance work entirely.",
  },
];

export function MedSpaNotFor() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Who This Isn&rsquo;t For</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>We Turn Down More Med Spas Than We Take On</h2>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
          {REASONS.map((reason) => (
            <li key={reason.name} className="flex flex-col gap-2 py-6">
              <h3 className="font-display text-lg font-semibold text-white">{reason.name}</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-white/60">{reason.body}</p>
            </li>
          ))}
        </ul>

        <p className={cn(STACK.subToContent, "max-w-2xl text-sm text-white/50")}>
          More on how we work is on{" "}
          <Link href="/about/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
            our about page
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
