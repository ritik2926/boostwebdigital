import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, GRID_GAP, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const EXCLUSIONS = [
  {
    name: "Before-and-After Images Without Authorization",
    body: "We don't publish a patient's photos without their specific written marketing consent, on file.",
  },
  {
    name: "Outcome Claims Nobody Signed Off On",
    body: "A claim about a result gets reviewed by a qualified injector before it ships, not written by a marketer alone.",
  },
  {
    name: "Bought or Incentivized Reviews",
    body: "No purchased reviews, no review-for-discount arrangements, no AI-generated testimonials presented as real patients.",
  },
  {
    name: "Vague Credential Language",
    body: "\"Expert team\" and \"medical grade\" get replaced with the actual license and the actual device name.",
  },
];

export function MedSpaWhatWeWontDo() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>What We Will Not Do</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Four Lines We Don&rsquo;t Cross</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Aesthetic marketing has an easy way to look good fast: stretch a result, buy reviews, borrow a credential
          that isn&apos;t quite accurate. We don&apos;t.
        </p>

        <ul className={cn(STACK.subToContent, "grid grid-cols-1 sm:grid-cols-2", GRID_GAP.default)}>
          {EXCLUSIONS.map((item) => (
            <li key={item.name}>
              <div className={cn("flex h-full min-h-36 flex-col border border-white/8 bg-white/[0.02]", CARD_RADIUS.feature, CARD_PADDING.feature)}>
                <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
