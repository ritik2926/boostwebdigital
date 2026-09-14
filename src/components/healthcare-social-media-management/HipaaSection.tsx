import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const SCENARIOS = [
  {
    name: "Replying to a comment",
    body: "“Thanks for coming in for your filling!” confirms, in public, that the commenter is a patient. That confirmation is the disclosure, regardless of whether you name a condition.",
  },
  {
    name: "Before-and-after photos",
    body: "These need written marketing authorization specific to that use. A general consent-to-treat form, signed for the procedure itself, does not cover posting the result on social media.",
  },
  {
    name: "Reposting a patient's own post",
    body: "A patient posting about their own visit is their choice to disclose. Your practice reposting, quoting, or tagging that post is a separate disclosure, and it is yours, not theirs.",
  },
  {
    name: "Posting from the operatory or treatment room",
    body: "Other patients, charts, and screens can end up in the background of a staff video. Nobody intends it, and it happens anyway.",
  },
] as const;

export function HsmmHipaaSection() {
  return (
    <section id="hipaa" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container size="prose">
        <Kicker>The Other Angle</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading)}>HIPAA Applies to Social Media Too</h2>
        <p className={cn(STACK.headingToSub, "text-white/70")}>
          HIPAA applies to what a practice posts and how it replies. Most social media agencies do not build for it.
          Four situations come up constantly.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-y border-white/8")}>
          {SCENARIOS.map((item) => (
            <li key={item.name} className="flex flex-col gap-2 py-7">
              <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
              <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className={cn(STACK.subToContent, "text-sm text-white/50")}>
          This is not legal advice. Confirm anything specific to your practice with your own counsel. Check your
          state medical board&rsquo;s advertising rules too — some restrict before-and-after claims further than
          HIPAA alone does.
        </p>
      </Container>
    </section>
  );
}
