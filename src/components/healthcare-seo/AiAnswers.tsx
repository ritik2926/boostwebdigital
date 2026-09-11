import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

export function HealthcareSeoAiAnswers() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container size="prose">
        <Kicker>What We&rsquo;ve Observed</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>What&rsquo;s Changed With AI Answers</h2>
        <p className={cn(STACK.headingToSub, "text-sm italic text-white/45")}>
          We&rsquo;re telling you what we&rsquo;ve observed, not what any vendor has confirmed.
        </p>

        <div className={cn(STACK.subToContent, "flex flex-col gap-5 text-white/70")}>
          <p>
            AI answer engines seem to reward the same signals that already matter for E-E-A-T — a named author, a
            checkable reviewer, and matching entity data across the web. We can&rsquo;t confirm that from any AI
            company&rsquo;s own rules, because none of them publish how their answers get built. What we can say is
            this: in our own monthly checks, practices with that structure in place get named more often than
            practices without it.
          </p>
          <p className="font-semibold text-white">
            A page can hold a strong spot and still never show up in the answer a patient reads.
          </p>
          <p>
            That&rsquo;s why our{" "}
            <Link href="/tools/ai-visibility-checker/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
              free visibility check
            </Link>{" "}
            counts citations, not rankings, and why we track both scans apart every month. Read more about the method
            behind that on our{" "}
            <Link href="/ai-visibility-geo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
              AI search visibility
            </Link>{" "}
            page.
          </p>
        </div>
      </Container>
    </section>
  );
}
