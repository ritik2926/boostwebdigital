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
 * §2.5 Composition Rules — flat section padding, same value at every
 * breakpoint and on every section below the Hero (Logo Marquee excluded —
 * it's part of the Hero's own viewport composition, not a regular section).
 * Deliberately not responsive-scaled: scaling up per breakpoint made the
 * combined gap between two padded sections balloon well past what reads as
 * "even" spacing. See docs/12-DESIGN-STANDARDS.md §2.5.
 */
export const SECTION_PADDING = "py-20";
