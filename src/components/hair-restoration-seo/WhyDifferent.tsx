import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";
const H3 = "font-display text-lg font-semibold text-white";

const REASONS = [
  {
    name: "The research window is longer than almost any other specialty",
    body: "Six to twelve months, mostly private. A page built to answer a same-week decision misses every stage of that window except the very last one.",
  },
  {
    name: "Technique terminology has to be exact",
    body: "FUE, FUT and DHI are genuinely different procedures with genuinely different questions attached to each. Content that blurs them reads as generic to both a patient and an AI answer engine.",
  },
  {
    name: "Before-and-after evidence carries most of the trust",
    body: "This category is decided on visible results more than almost any other medical specialty — which makes documentation, consent and platform compliance part of the SEO work, not a separate concern.",
  },
  {
    name: "AI answer engines are already a primary research tool here",
    body: "A private, sensitive decision is exactly the kind of question patients now ask an AI system directly instead of a search engine or a friend — see our approach to AI search visibility for why that changes what \"ranking\" actually means.",
  },
] as const;

export function HairRestorationSeoWhyDifferent() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Why This Isn&rsquo;t Generic Medical SEO</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Four Ways This Category Is Different</h2>

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-6 sm:grid-cols-2")}>
          {REASONS.map((reason) => (
            <div key={reason.name} className={cn("rounded-2xl border border-white/8 bg-white/[0.02]", CARD_PADDING.standard)}>
              <h3 className={H3}>{reason.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{reason.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
