/**
 * JS/Framer Motion mirror of docs/12-DESIGN-STANDARDS.md and src/app/globals.css.
 * Import from here instead of hard-coding easing curves, spring physics, or
 * blur/opacity numbers in a component — that's the "no magic values" gate
 * (§13 Quality Standards) enforced at the source.
 */

/** §6 Motion System — signature easing curves */
export const EASE = {
  primary: [0.16, 1, 0.3, 1],
  secondary: [0.22, 1, 0.36, 1],
} as const;

/** §6 Motion System — durations, in seconds (Framer Motion convention) */
export const DURATION = {
  micro: 0.25,
  reveal: 0.45,
  entrance: 0.7,
  blurTransition: 0.35,
  pageTransition: 0.35,
  exit: 0.3,
} as const;

/** §6 Motion System — stagger between siblings, in seconds */
export const STAGGER = {
  list: 0.06,
  hero: 0.1,
} as const;

/** §6/§7 — cursor and magnetic spring physics */
export const SPRING = {
  cursor: { stiffness: 60, damping: 20, mass: 0.8 },
  magnetic: { stiffness: 300, damping: 20, mass: 0.5 },
  /** Cursor-follow image reveal (Services row list) — deliberately between
   * the two above: snappier than the ambient cursor glow's slow drift so a
   * 280px image doesn't feel disconnected, but not as instant as the
   * magnetic button nudge, since a visible trail is the point. */
  trail: { stiffness: 120, damping: 18, mass: 0.6 },
  /** Soft presence-fade for glows that cross a hard boundary (navbar↔hero,
   * or any section-scoped ambient light) — slower than `cursor` so the
   * fade reads as graceful rather than a snap. Shared by CursorGlow,
   * HeroMist, and TestimonialCursorGlow. */
  presenceFade: { stiffness: 40, damping: 20 },
} as const;

/** §7 Interaction System — Magnetic CTA activation */
export const MAGNETIC = {
  radiusPx: 80,
  maxDisplacementPx: 12,
} as const;

/** §4 Lighting System — cursor glow */
export const CURSOR_GLOW = {
  minDiameterPx: 280,
  maxDiameterPx: 320,
} as const;

/** §2.3 — blur scale, in px. Mirrors the CSS vars in globals.css. */
export const BLUR = {
  signal: 0,
  partial: 2,
  noise: 3,
  ambient: 4,
} as const;

/** §2.3 — opacity scale */
export const OPACITY = {
  ghost: 0.15,
  faint: 0.4,
  muted: 0.65,
  visible: 0.9,
  full: 1,
} as const;

/** §2.5 — z-index scale */
export const Z_INDEX = {
  ambient: 0,
  base: 10,
  raised: 20,
  nav: 40,
  overlay: 50,
  toast: 60,
  cursorFx: 70,
} as const;

/** Helper: build a `filter: blur(...)` value from a BLUR token. */
export function blurPx(value: number) {
  return `blur(${value}px)`;
}

/**
 * §6 Motion System — Reveal-on-Scroll, the one entrance every section uses.
 * Reuses DURATION.entrance and STAGGER.hero/list rather than inventing new
 * numbers; `y`/`scale`/`blur` are the only genuinely new values this system
 * needed. See src/components/Reveal.tsx.
 */
export const REVEAL = {
  y: 26,
  scale: 0.98,
  blur: 6,
  duration: DURATION.entrance,
  stagger: STAGGER.hero,
  cardStagger: STAGGER.list,
} as const;

/**
 * §2.2 Composition — three section-padding tiers, nothing else. Replaces
 * eight ad-hoc values that had accumulated independently across five pages
 * built in separate sessions (2026-08-19 spacing/alignment/motion pass).
 * Mobile and desktop are both set explicitly — never derive one by halving
 * the other, which is what produced the drift in the first place.
 *
 * A section MAY use a different tier for its top vs. its bottom padding
 * (e.g. a hero whose bottom edge must not double-stack with the section
 * below it) — but both values must come from this set. Never a one-off
 * number. See docs/DESIGN-CRAFT.md.
 */
export const SECTION_PADDING = {
  compact: "py-16 lg:py-24", // 64px mobile / 96px desktop — dense utility sections
  default: "py-20 lg:py-32", // 80px mobile / 128px desktop — most sections
  spacious: "py-24 lg:py-40", // 96px mobile / 160px desktop — hero, major CTA
} as const;

/** §2.5 — grid gap, two values only. */
export const GRID_GAP = {
  default: "gap-6 lg:gap-8", // 24px mobile / 32px desktop
  tight: "gap-4", // 16px flat — chips, pills, inline groups only
} as const;

/** §2.5 — card padding, two values only. */
export const CARD_PADDING = {
  standard: "p-6 lg:p-8", // 24px mobile / 32px desktop
  feature: "p-8 lg:p-10", // 32px mobile / 40px desktop
} as const;

/**
 * §2.4 — card radius, two values only. Matches the scale already locked in
 * docs/12-DESIGN-STANDARDS.md §2.4 ("standard cards rounded-2xl, large
 * panels rounded-3xl") — this just makes it an importable constant instead
 * of a value every component re-typed by hand.
 */
export const CARD_RADIUS = {
  standard: "rounded-2xl", // 16px
  feature: "rounded-3xl", // 24px
} as const;

/**
 * §2.1 — the one resting/default border opacity, site-wide (2026-08-19
 * audit found white/8 and white/10 both in use for the same resting-state
 * role; white/8 was already the locked value in 12-DESIGN-STANDARDS.md
 * §2.1, so /10 instances were the drift, not the standard). This is
 * deliberately NOT the same value as the emphasized/hover border tier
 * (white/[0.12–0.14]) — collapsing resting and hover into one opacity would
 * remove the hover feedback entirely, which nobody asked for.
 */
export const BORDER = "border-white/8";

/**
 * §2.5 — the rhythm INSIDE a section (kicker → heading → subheading →
 * content → CTA), as opposed to SECTION_PADDING which is the rhythm
 * BETWEEN sections. Equally visible, previously unenforced.
 */
export const STACK = {
  kickerToHeading: "mt-4", // 16px
  headingToSub: "mt-5", // 20px
  subToContent: "mt-12 lg:mt-16", // 48px mobile / 64px desktop
  contentToCta: "mt-12", // 48px
} as const;
