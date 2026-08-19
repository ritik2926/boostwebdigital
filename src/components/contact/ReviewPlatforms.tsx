import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { SECTION_PADDING, STACK, GRID_GAP, CARD_RADIUS } from "@/lib/tokens";

// PLACEHOLDER — replace with real, verifiable review-platform names and
// review counts before this page goes live. Square-bracket text is
// intentional and greppable.
const PLATFORMS = [
  { platform: "[PLATFORM 1]", count: "[X]+", elevated: false },
  { platform: "[PLATFORM 2]", count: "[X]+", elevated: true },
  { platform: "[PLATFORM 3]", count: "[X]+", elevated: false },
];

function StarIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 1l2.06 4.44L15 6.18l-3.5 3.42.83 4.9L8 12.14 3.67 14.5l.83-4.9L1 6.18l4.94-.74L8 1z" />
    </svg>
  );
}

export function ReviewPlatforms() {
  return (
    <section className={SECTION_PADDING.spacious}>
      <Container>
        <RevealGroup as="div" className="flex flex-col items-center text-center">
          <RevealItem>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.2] tracking-[-0.01em] sm:text-[2.25rem]">
              <span className="italic font-normal text-accent">Industry recognitions</span>{" "}
              <span className="text-white/50">from</span>
              <br />
              <span className="text-white/50">leading</span> <span className="text-white">review platforms</span>
            </h2>
          </RevealItem>
        </RevealGroup>

        <RevealGroup as="ul" trigger="viewport" className={cn(STACK.subToContent, "mx-auto grid max-w-4xl grid-cols-1 sm:grid-cols-3", GRID_GAP.default)}>
          {PLATFORMS.map((item) => (
            <RevealItem as="li" key={item.platform}>
              <div
                className={cn(
                  "relative flex h-45 flex-col items-center justify-center gap-3 overflow-hidden border px-6 text-center transition-transform duration-300",
                  CARD_RADIUS.standard,
                  item.elevated
                    ? "-translate-y-2 border-accent/40 bg-white/[0.05] shadow-[0_20px_50px_rgba(var(--accent-rgb),0.15)]"
                    : "border-white/8 bg-white/[0.02] hover:-translate-y-1"
                )}
              >
                {item.elevated && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.3), transparent 70%)", filter: "blur(20px)" }}
                  />
                )}
                <span className="relative flex items-center gap-2 font-display text-xl font-bold text-white">
                  {item.elevated && <StarIcon className="text-accent" />}
                  {item.platform}
                </span>
                <span className="relative text-sm text-white/50">
                  {item.count} reviews on {item.platform}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
