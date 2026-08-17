# Components

**The full build-order inventory and per-component personality spec lives in [12-DESIGN-STANDARDS.md §8/§12](12-DESIGN-STANDARDS.md)** — read that for how each component should feel, not just what it does. This file tracks the actual `src/components/` and `src/lib/` inventory so it doesn't drift from reality the way an earlier version of this doc did (it once claimed "nothing exists yet" long after the homepage was built at `/testhome` — verify against the repo, not this file's prose, if the two disagree).

## Actual current state (2026-08-17)

The homepage is real and lives at the site root (`src/app/page.tsx` → `src/components/HomePage.tsx`) — there is no more `/testhome` staging route. `HomePage.tsx` still holds every section that's specific to the homepage's own narrative (Hero, Logo Marquee, Market Shift, AI Visibility Explainer, Who We Serve, Services, Why Choose Us, Process, FAQ) plus the shared ambient chrome (`GrainOverlay`, `CursorGlow`, `ArchitecturalGrid`). Sections likely to appear on *other* pages later have been extracted into standalone, importable components:

| Component | File | Notes |
|---|---|---|
| `Navbar` | `src/components/Navbar.tsx` | Renders `DesktopNavLinks`/`MobileNav` internally (not exported — nothing else needs them) |
| `Footer` | `src/components/Footer.tsx` | The one section with a deliberate ambient-motion exception — see its own file comment and `docs/12-DESIGN-STANDARDS.md` §8 |
| `Testimonials` | `src/components/Testimonials.tsx` | Placeholder content — see the honesty-gate note in the file itself |
| `Pricing` | `src/components/Pricing.tsx` | Includes its own `SegmentedControl` (colocated, not shared — nothing else uses it yet) |
| `Founder` | `src/components/Founder.tsx` | `FOUNDER_YEARS_IN_SEO` is still an unconfirmed `"[X]"` placeholder — honesty gate, don't guess a real number |
| `MagneticButton` / `GhostButton` | `src/components/Buttons.tsx` | The two CTA variants — same padding/radius/type, color is the only differentiator (`feedback_button_system_consistency`) |
| `Kicker` | `src/components/Kicker.tsx` | The one eyebrow-pill treatment sitewide |
| `AmbientGlow` | `src/components/AmbientGlow.tsx` | The shared "breathing glow" background, one per section that needs it |
| `Container` | `src/components/Container.tsx` | Page-width wrapper, `size` variants for narrower reading columns |
| `Reveal` / `RevealGroup` / `RevealItem` / `usePrefersReducedMotion` | `src/components/Reveal.tsx` | The one entrance-motion system every section uses |

Shared, non-component logic lives in `src/lib/`: `tokens.ts` (design tokens — easing, spring physics, spacing, z-index), `utils.ts` (`cn()`, and `seeded()` — the deterministic pseudo-random helper that keeps generative SVG positions hydration-safe), `useSpotlight.ts` (the cursor-spotlight tracker hook `CursorGlow`/`HeroMist`/`TestimonialCursorGlow` all share), `specialties.ts` (`SPECIALTIES` — the six-specialty array both Who We Serve and the Footer's specialty links read from).

**Not extracted, and why:** Hero, Market Shift, AI Visibility Explainer, Who We Serve, Services, Why Choose Us, Process, and FAQ all stay inside `HomePage.tsx`. Nothing has asked for these on another page yet, and CLAUDE.md's own scope-discipline rule ("if something's usefulness is speculative, leave it out") argues against splitting them out pre-emptively — extract a section the moment a second page actually needs it, not before.

`src/app/design-lab/` (its own `DesignLab.tsx`, deliberately self-contained, `noindex`) is a separate prototyping sandbox, not wired into the real site — several sitewide patterns (the magnetic-button physics, the grain/cursor-glow ambient system) were validated there first. Left in place as a live reference/sandbox for prototyping the next page's components, not dead code.
