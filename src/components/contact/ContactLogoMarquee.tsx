import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

// PLACEHOLDER — replace with real client logos before this page goes
// live. Square-bracket text is intentional and greppable.
const PLACEHOLDER_LOGOS = Array.from({ length: 12 }, (_, i) => `[LOGO ${i + 1}]`);

/** Same zero-seam double-row `marquee` keyframe technique as LogoMarquee in
 * HomePage.tsx (two identical adjacent rows, each translated by exactly its
 * own width) — reused directly rather than rebuilt, per the brief. */
function LogoRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 animate-[marquee_52s_linear_infinite] items-center gap-16 pr-16 sm:gap-20 sm:pr-20" aria-hidden={ariaHidden}>
      {PLACEHOLDER_LOGOS.map((label, i) => (
        <span key={i} className="shrink-0 font-mono text-sm font-medium tracking-[0.04em] text-white/40 sm:text-base">
          {label}
        </span>
      ))}
    </div>
  );
}

export function ContactLogoMarquee() {
  return (
    <Reveal>
      <Container>
        <div className="relative flex h-16 w-full items-center overflow-hidden">
          <div
            className="flex w-full"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 13%, black 87%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 13%, black 87%, transparent)",
            }}
          >
            <LogoRow />
            <LogoRow ariaHidden />
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
