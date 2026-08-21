import { cn, seeded } from "@/lib/utils";

/**
 * No standalone reusable "sparkle" component exists yet — Contact's
 * HeroBackground.tsx bundles its particle field together with two large
 * page-specific glow shapes, so importing it wholesale would drag in glows
 * tuned for Contact's composition, not this page's. Built the minimal
 * version instead, reusing the exact same technique (seeded deterministic
 * positions, `.particle-twinkle`'s existing opacity-only CSS animation,
 * already reduced-motion-safe) rather than inventing a new one — pure CSS,
 * no JS, so this stays a Server Component regardless of where it's placed.
 */
const SPARKLE_COUNT = 24;

interface Sparkle {
  top: number;
  left: number;
  size: number;
  opacityMax: number;
  duration: number;
  delay: number;
}

function buildSparkles(seedOffset: number): Sparkle[] {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const seed = seedOffset + i * 2.73;
    return {
      top: 4 + seeded(seed + 0.1) * 92,
      left: 4 + seeded(seed + 0.2) * 92,
      size: 1 + Math.round(seeded(seed + 0.3)),
      opacityMax: 0.2 + seeded(seed + 0.4) * 0.3,
      duration: 3 + seeded(seed + 0.5) * 3,
      delay: seeded(seed + 0.6) * 5,
    };
  });
}

/** `seedOffset` lets Hero and CTA each get their own deterministic layout
 * instead of two identical-looking sparkle fields. */
export function Sparkles({ seedOffset = 0 }: { seedOffset?: number }) {
  const sparkles = buildSparkles(seedOffset);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {sparkles.map((s, i) => (
        <span
          key={i}
          // §10 Performance Budget: reduce ambient element counts ~50%
          // below `md` — every other sparkle is desktop-only.
          className={cn("particle-twinkle absolute rounded-full", i % 2 === 1 && "hidden md:block")}
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: "rgb(var(--accent-rgb))",
              "--twinkle-min": "0.1",
              "--twinkle-max": s.opacityMax,
              "--twinkle-duration": `${s.duration}s`,
              "--twinkle-delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
