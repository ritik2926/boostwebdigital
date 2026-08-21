import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SECTION_PADDING } from "@/lib/tokens";
import { AmbientGlow } from "@/components/AmbientGlow";
import { StatCounter } from "@/components/services/StatCounter";
import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER NUMBERS — lifted from the reference layout per explicit
 * instruction ("S4 numbers/awards are generic — flag them for
 * replacement"). These are NOT real Boost Web Digital figures. Replace
 * with real numbers (or the honest 8+/6/4 set used in the previous build —
 * see git history) before this page goes live.
 */
const STATS = [
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: 150, suffix: "+", label: "Website Delivered" },
  { value: 3, suffix: "", label: "Industry Awards" },
] as const;

export function ServicesStats() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="top-left" duration={70} />
      <Container>
        <Reveal className="flex justify-center">
          <Kicker>Track Record</Kicker>
        </Reveal>

        <RevealGroup
          as="ul"
          trigger="viewport"
          className={cn("mt-10 grid grid-cols-3 divide-x divide-white/8 border-y border-white/8 py-10")}
        >
          {STATS.map((stat) => (
            <RevealItem as="li" key={stat.label}>
              <div className="flex flex-col items-center gap-2 text-center">
                <StatCounter value={stat.value} suffix={stat.suffix} />
                <span className="max-w-32 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/50 sm:max-w-none sm:text-xs sm:tracking-[0.14em]">
                  {stat.label}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
