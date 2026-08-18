import { seeded } from "@/lib/utils";

/**
 * Two large edge-bleeding radial glows (left/right, different vertical
 * positions) plus a scattered particle field, both from Phase 1 of the
 * reference reproduction. Pure CSS/deterministic — no client component
 * needed. Positions come from `seeded()` (already used for exactly this in
 * Footer.tsx and about/page.tsx's ScatterFieldGraphic) rather than
 * `Math.random()`, which would differ between server and client render and
 * break hydration.
 */

interface Particle {
  top: number; // %
  left: number; // %
  size: number; // px
  isAccent: boolean;
  opacityMax: number;
  duration: number; // s
  delay: number; // s
}

const PARTICLE_COUNT = 42;

const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const seed = i * 3.17;
  // Bias horizontal position toward the two edges (where the glows sit) —
  // roughly 65% of dots land in the outer thirds, 35% in the middle third.
  const edgeRoll = seeded(seed + 0.15);
  let left: number;
  if (edgeRoll < 0.35) {
    left = 8 + seeded(seed + 0.2) * 22; // left third
  } else if (edgeRoll < 0.7) {
    left = 70 + seeded(seed + 0.25) * 22; // right third
  } else {
    left = 32 + seeded(seed + 0.3) * 36; // middle third, sparse
  }

  return {
    top: 4 + seeded(seed + 0.4) * 80,
    left,
    size: 1 + Math.round(seeded(seed + 0.5)) * 1, // 1 or 2px
    isAccent: seeded(seed + 0.6) > 0.5,
    opacityMax: 0.25 + seeded(seed + 0.7) * 0.35, // 0.25-0.6
    duration: 3 + seeded(seed + 0.8) * 3, // 3-6s
    delay: seeded(seed + 0.9) * 5,
  };
});

export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* 1.1 — two edge-bleeding glows */}
      <div
        className="absolute -left-40 top-0 h-225 w-225 rounded-full sm:-left-60"
        style={{
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.34), transparent 68%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute -right-40 top-45 h-250 w-250 rounded-full sm:-right-72"
        style={{
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.3), transparent 68%)",
          filter: "blur(80px)",
        }}
      />

      {/* 1.2 — particle field */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle-twinkle absolute rounded-full"
          style={
            {
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.isAccent ? "rgb(var(--accent-rgb))" : "#ffffff",
              "--twinkle-min": "0.1",
              "--twinkle-max": p.opacityMax,
              "--twinkle-duration": `${p.duration}s`,
              "--twinkle-delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
