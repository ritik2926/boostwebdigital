import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REASONS = [
  { name: "Fewer than 20 reviews", body: "You aren't ready unless you're willing to fix reputation first. Visibility work on a thin review profile just points more people at a problem you haven't solved yet." },
  { name: "Need results in 30 days", body: "AI citations tend to move faster than patient volume does. Expect the two to shift on different timelines, not together." },
  { name: "Won't change the website", body: "Some of this work requires changing your pages, not just your listings. If the pages are off the table, so is most of the fix." },
  { name: "Looking for the cheapest option", body: "There are agencies charging far less. They aren't running two separate query sets, and the price difference is usually exactly that missing work." },
  {
    name: "Already at capacity",
    body: "If your practice isn't taking new patients right now, more visibility just means more calls you can't answer. Fix capacity first. There's no version of this work that helps a practice that can't book the patients it already gets — come back when that changes.",
  },
] as const;

export function DentalNotFor() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Who This Isn&rsquo;t For</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>We Turn Down More Practices Than We Take On</h2>

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
