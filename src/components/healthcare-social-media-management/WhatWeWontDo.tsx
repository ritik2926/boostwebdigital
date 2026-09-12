import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const REFUSALS = [
  {
    name: "We do not post clinical content a clinician has not reviewed.",
    body: "A caption written by a marketer and never checked by the person who treats patients is how factual mistakes end up public.",
  },
  {
    name: "We do not publish before-and-after images without written marketing authorization on file.",
    body: "A signature for the procedure is not a signature for the post.",
  },
  {
    name: "We do not buy followers or engagement.",
    body: "An account that looks active because of purchased numbers is a different kind of dishonest, and it is easy to spot.",
  },
  {
    name: "We do not reply to a comment in a way that confirms someone is a patient.",
    body: "See the four scenarios above — this is the rule we check every single reply against.",
  },
] as const;

export function HsmmWhatWeWontDo() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Where We Draw the Line</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What We Will Not Do</h2>

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
