# Design System — the engineering specification

**Status: LOCKED.** This is not a UI kit or a moodboard — it's the production specification every component, page, and future contributor inherits. If a value isn't here, it isn't approved; don't invent one in the moment. Supersedes [03-DESIGN-SYSTEM.md](03-DESIGN-SYSTEM.md), [02-BRAND.md](02-BRAND.md)'s light/dark pairing, and [05-ANIMATION.md](05-ANIMATION.md)'s motion specifics (both now point here). Translates [00-creative-direction.html](00-creative-direction.html) (locked: **Signal & Noise**) and [00-experience-blueprint.html](00-experience-blueprint.html) into numbers an engineer can implement without guessing.

Read this file before touching any component. Do not redesign the philosophy — extend it.

---

## 1. Design Philosophy

Two states, no third: **signal** (real, verified, always sharp) and **noise** (aspirational, unproven, allowed to blur and recede). The accent color marks truth, never decoration. One true signature moment per page — everything else is quiet variation, not reinvention. Motion never fully stops, but its *intensity* is set by register: calm/breathing for signal, active/drifting for noise — never uniform. Restraint is the actual differentiator; when in doubt, ship the quieter version of an effect. Full principles: [00-experience-blueprint.html §06–07](00-experience-blueprint.html).

**Permanent dark theme — one explicit, contained exception (2026-08-15):** the homepage's Why Choose Us section inverts to a light background (`#f2f2f5`/`#08080a`, the site's own two core tokens swapped) as a deliberate one-section design moment, confirmed with Ritik after flagging that it reverses the locked "no light mode" hard rule (`CLAUDE.md`). Hardcoded locally in that one component — not a CSS variable, not a `data-theme` system, not a toggle. Every other section stays permanently dark; this is not a precedent for lightening anything else.

---

## 2. Design Tokens

### 2.1 Color (locked, unchanged)

| Token | Value | Use |
|---|---|---|
| `--background` | `#08080a` | Page background, always |
| `--foreground` | `#f2f2f5` | Primary text |
| `--accent` | `#3B4FDB` (revised 2026-08-15 — see `docs/02-BRAND.md`; the raw logo hex `#1627C6` read flat/muddy directly on `#08080a`) | The one truth-marker hue — never a second accent |

**Text opacity ladder:** primary `white`/`white/90` · secondary `white/70`–`/65` · tertiary/muted `white/50`–`/40` · disabled/decorative `white/20` and below.

**Accent usage (10–15% max coverage/screen):** solid fill on primary CTA only (one per view); small non-text marks (status dot, icon accent, nav underglow); low-opacity glows (`accent/05`–`/25`). Never as text color directly on background (contrast ~1.6:1). Never as a large fill/wash.

**Surfaces:** resting `white/[0.03–0.05]` · hover `white/[0.06–0.09]` · elevated panel `#0b0b0f/70–90`. **Borders:** default `white/[0.08]`, emphasized `white/[0.12–0.14]`, never fully opaque.

**Signal & Noise color roles** *(new)*: the accent only ever marks something real — the in-focus marker, a live metric line, the primary CTA, `--glow-*` tokens (§2.3). If an element isn't verifiably true, it does not get accent-colored.

**Glow/glass restraint — tightened, not new** *(2026-08-15)*: `--glow-*` and the Glass recipe (§2.4) were always scoped to a *rare* signal moment (the in-focus marker's own definition names a real, cited result — e.g. the future Kaja Hair Studio case study — as its example), not a decorative default. Two sections built this session (Market Shift, AI Visibility Explainer) applied glow/glass/pill-badge/checkmark-chip/fake-dashboard treatment to ordinary stats and an illustrative mockup — neither is a verified real result — and it read as generic AI-SaaS UI, not this brand. Both were rebuilt flat/editorial. Reserve glow and glass **exclusively** for genuinely real, cited proof content going forward; everything else gets typography, scale, and whitespace instead. See `feedback_avoid_ai_generated_look` memory for the full list of what this rules out (glowing dots/particles, pill-shaped labels/tabs/chips, checkmarks-in-pills, fake dashboards/product-interface mockups, excessive `rounded-*`).

### 2.2 Typography (revised 2026-08-15 — Switzer replaces Fraunces + Geist)

**Pairing:** Switzer (self-hosted, `src/fonts/switzer/`, weights 100–900 + italics) is the one sitewide typeface — both `font-display` and `font-sans` resolve to it (`globals.css` `@theme inline`). Superseded the earlier Fraunces/Geist serif+sans pairing per explicit instruction; hierarchy now comes from **weight/size/tracking contrast** instead of family contrast — see the Weight column below, which is the part that actually changed. Geist Mono (`font-mono`) is untouched, still the separate eyebrow/caption/label register.

| Level | Size | Line-height | Tracking | Weight |
|---|---|---|---|---|
| H1 (hero only) | `2.5rem → 4rem → 4.75rem` | `0.95` | `-0.02em` | **800 (Extrabold)** |
| H2 (section heading) | `1.875rem → 2.5rem` | `1.1` | `-0.01em` | **700 (Bold)** |
| H3 (card/subsection) | `1.25rem → 1.375rem` | `1.25` | normal | 600 |
| H4 (small heading) | `1.0625rem` | `1.35` | normal | 600 |
| Body large | `1.125rem` | `1.6` | normal | 400 |
| Body | `1rem` | `1.6` | normal | 400 |
| Small/caption | `0.8125–0.875rem` | `1.5` | normal | 500 |
| Eyebrow/overline | `0.75–0.8125rem` | `1.4` | `0.12–0.16em`, uppercase | 500–600 |

H1/H2 moved up from 500 to 800/700 — a Fraunces serif at 500 had presence a sans at the same weight wouldn't; Switzer's fuller range makes that a deliberate weight bump instead. Everything at H3 and below kept its existing weight — serif vs. sans made little visible difference at those smaller, already semibold-or-lighter sizes. Flat reference — **weights:** 400 / 500 / 600 / 700 / 800. **Line-heights:** 1.0 / 1.1 / 1.25 / 1.35 / 1.4 / 1.5 / 1.6. **Tracking:** `-0.02em` / `-0.01em` / normal / `0.12em` / `0.16em`.

Display headings always tighter than body (<1.15 line-height). Word-reveal wrapping spans use `pb-1`, never `pb-2`. Never justify; never center body paragraphs >1 line.

**Signal & Noise typography states** *(new)*: real headings/body are always `blur(0)`, `opacity: 1` — text is never blurred at rest. "Noise" register text (decorative background phrases only, e.g. Hero's dissolving generic-agency phrases) uses `blur(var(--blur-noise))`, `opacity: var(--opacity-ghost)` — and must remain screen-reader-accessible regardless (§9).

**Content width:** body `max-w-xl`(576px)–`max-w-2xl`(672px); section intro pairs `max-w-2xl` copy with `max-w-3xl` heading.

**Eyebrow container — one capsule badge, sitewide** *(2026-08-15, revised same day)*: the Eyebrow/overline row above specifies the type treatment; the container is a small pill (`rounded-full border border-white/15 bg-white/5 px-4 py-1.5`). `Kicker` (`src/components/Kicker.tsx`) is the one shared implementation — every section's eyebrow uses it, so it only needs to be right in one place. (A same-day intermediate pass tried a plain rule+text kicker instead, reasoning that pill badges were part of the generic-AI-site fingerprint `feedback_avoid_ai_generated_look` corrects — Ritik asked for the capsule back specifically for this one recurring short-word role. That memory's broader point stands: pills/chips/checkmarks used as *scattered, repeated* decoration are still out — one consistent badge in one defined role is not that.)

### 2.3 New scales — blur, glow, opacity

| Token | Value | Use |
|---|---|---|
| `--blur-signal` | `0px` | Signal — always in focus |
| `--blur-partial` | `2px` | Lightly aspirational (partial-proof specialty tile) |
| `--blur-noise` | `3px` | Standard noise at rest |
| `--blur-ambient` | `4px` | Deep ambient background (grain/particle/bokeh) |
| `--blur-transition` | `350ms`, easing `[0.16,1,0.3,1]` | Resolve-from-blur duration |

Implemented in `src/app/globals.css` (CSS vars) and mirrored in `src/lib/tokens.ts` (JS constants for Framer Motion). Semantic names, not a numeric form — clearer in component code and avoids collision with Tailwind's own numeric arbitrary-value scale.

| Token | Value | Use |
|---|---|---|
| `--glow-whisper` | `0 0 8px accent/15%` | Breathing ambient (signal scenes at rest) |
| `--glow-soft` | `0 0 20px accent/25%` | Hover/focus emphasis |
| `--glow-live` | `0 0 32px accent/40%` | In-focus marker, live metric line, Signal Ping |

Glows use the one accent hue only. Radial falloff always feathers to transparent by 70% radius — never a hard-edged circle.

| Token | Value |
|---|---|
| `--opacity-ghost` | `0.15` |
| `--opacity-faint` | `0.4` |
| `--opacity-muted` | `0.65` |
| `--opacity-visible` | `0.9` |
| `--opacity-full` | `1` |

### 2.4 Radius, shadow (locked, unchanged)

Pills/buttons/badges/nav `rounded-full` · small cards/inputs `rounded-xl` (0.75rem) · standard cards `rounded-2xl` (1rem) · large panels `rounded-3xl` (1.5rem). No arbitrary radii outside this scale.

Shadow elevation: subtle `0 8px 30px rgba(0,0,0,.35)` · medium `0 20px 60px rgba(0,0,0,.45)` · prominent `0 24px 70px rgba(0,0,0,.6)`. Glass recipe (all four, always): translucent surface → `backdrop-blur-xl`(`-2xl` for menus) → thin border → elevation shadow. **Shadow is secondary to blur/focus for conveying depth** — never use shadow alone to imply the signal/noise distinction.

### 2.5 Spacing, container, grid, breakpoints, z-index

**Base unit:** 4px. **Vertical rhythm:** eyebrow→heading `mb-4/5`, heading→paragraph `mt-6/7`, paragraph→CTA `mt-8/10`, never <`mt-4`. **Section padding:** flat `py-20` (80px) at every breakpoint, same value on every section — deliberately not responsive-scaled, since scaling up at each breakpoint (previously `py-24`→`py-32`→`py-36`) made the *gap between* two padded sections balloon to 192–288px combined while the Logo Marquee (no padding of its own, part of the Hero's viewport composition, not a regular section) stayed tight — the mismatch read as uneven spacing (Hero is height-locked instead, §3).

| Container token | Value | Use |
|---|---|---|
| `--container-page` | `clamp(1400px, 94vw, 1800px)` | Shared full-width container (nav, hero, footer, every section). **Revised 2026-08-17** (Ritik: "full width content to responsive in all screens") — a flat `1400px` left ~260px of dead black margin per side on a 1920px monitor (worse on wider), with section-level decoration (`AmbientGlow`) anchored to the real viewport edge stranded out in that margin, disconnected from the content column — the direct cause of a "not centered/right-aligned" complaint on wide screens. The floor still protects laptop/tablet widths (the `min()` semantics of `clamp()` mean the 1400px floor only ever wins when `94vw` would resolve smaller, i.e. viewports under ~1490px, where the cap wasn't binding anyway); the 1800px ceiling keeps very large monitors from going fully edge-to-edge, which would fight the narrower `--container-heading`/`--container-prose` reading widths below (untouched — readability-driven, not viewport-driven). |
| `--container-heading` | `768px` (`max-w-3xl`) | Section intro headings |
| `--container-prose` | `672px` (`max-w-2xl`) | Body copy, section intro |
| `--container-prose-narrow` | `576px` (`max-w-xl`) | Tightest reading measure |

Consumption: Tailwind v4's canonical shorthand references the CSS var directly — e.g. `max-w-(--container-page)` — no new `@theme` namespace required.

**Grid:** 12-column, gutter 24px desktop / 16px mobile. Horizontal padding `px-6` mobile / `px-10` tablet / `px-16` desktop. No decorative visible grid lines anywhere — that motif belongs to the un-chosen "Vital Signal" direction, not Signal & Noise.

**Breakpoints** (unchanged): base 0 (mobile) · `sm` 640 · `md` 768 · `lg` 1024 (nav/hamburger threshold) · `xl` 1280 · `2xl` 1536. Recompose within this set; don't add a breakpoint for one component.

**Z-index** *(new)*:

| Token | Value | Layer |
|---|---|---|
| `--z-ambient` | `0` | Noise field, grain, bokeh, particles |
| `--z-base` | `10` | Default page content |
| `--z-raised` | `20` | Hovered/focus-pulled cards |
| `--z-nav` | `40` | Floating navbar |
| `--z-overlay` | `50` | Mobile menu, modals, dropdowns |
| `--z-toast` | `60` | Form feedback |
| `--z-cursor-fx` | `70` | Cursor-following glow / magnetic effects |

---

## 3. Composition Rules

- **Viewport-locked Hero:** Hero is `h-[90vh]` (fixed, not `min-h`) sitting below the navbar's own flow space; content is centered (`flex-1 flex items-center`, text-center) — a deliberate exception to the asymmetry rule below, closer to the hero's single-statement moment than a body section.
- **Editorial asymmetry over centered symmetry:** left-aligned text blocks by default for every section *after* the Hero; center only short standalone statements.
- **One shared max-width** (`--container-page`) across every full-bleed section so edges align down the page.
- **Breathing room:** explicit padding clears the floating nav — never assume `fixed` positioning pushes content down.
- **Content hierarchy** *(new)*: real (signal) content always holds the primary reading position; ambient/noise elements are always background-layer (`--z-ambient`), never competing for the eye's first stop.
- **Alignment rules:** unchanged — left-aligned default, center reserved for punchy standalone beats, per the existing editorial rule above.

---

## 4. Lighting System

| Element | Spec |
|---|---|
| **Ambient lighting** | One radial accent gradient, corner-flush (never dead-center), 60–90s drift loop, feathering to transparent by 65% of its own radius — well inside its own box, so it never depends on a section's `overflow-hidden` clip to look soft. Present on every signal scene as the "breathing glow" — built sitewide via the shared `AmbientGlow` component (2026-08-17), extending it to every section that previously had none. **Revised twice same day:** the original 4–6% figure read as functionally invisible once shipped (Ritik: "make it more happening... not look boring"); a first correction to ~30% peak (two-stop gradient, positioned half-outside each corner) then read as too strong and produced a visible hard seam at the section edge — settled on a single gradient stop at 0.2 alpha, positioned flush at the corner (no negative outside-offset) so nothing relies on clipping. Still radial-only, accent-hue-only, off-center, soft/heavily-blurred — only the intensity and positioning technique changed. |
| **Hero lighting** | Clean SaaS-premium register (Linear/Stripe/Framer) — timeless, not futuristic/cyberpunk. Nothing decorative renders at rest; the cursor is a flashlight revealing a hidden layer, and everything fades fully to zero the instant it leaves — never a static "always slightly visible" baseline. Shared `useSpotlight(ref, presenceSpring?)` hook: spring-smoothed local cursor position + a "presence" spring (0 outside the tracked element's rect, 1 inside, eased both ways) — the presence spring stiffness/damping is an optional per-consumer override (default `{stiffness:70, damping:22}`) so one consumer's fade can be tuned softer without affecting the others; `HeroMist` uses a slower `{stiffness:40, damping:20}` so its glow eases out gracefully crossing into the navbar rather than snapping, while `ArchitecturalGrid` keeps the default. Bounds-checked inside one `window` mousemove handler rather than `mouseenter`/`mouseleave` on the element itself — every consumer is `pointer-events-none` (so it doesn't block real content), and pointer-events removal takes an element out of hit-testing entirely, so it can never receive its own enter/leave. Four consumers, the fourth (`CursorGlow`) being the one exception mounted globally at the page root rather than nested in the navbar+hero wrapper — it isn't a descendant of `TestHero` and holds no ref to it, so it locates the hero via `document.getElementById("hero")` in an effect and feeds that into the same `useSpotlight` hook (softened spring, matching `HeroMist`); visible at up to `0.5` opacity only over the hero, 0 everywhere else including the navbar, easing both ways. (1) `HeroMist` — an always-faint GSAP-drifting blue haze (opacity-6, 60s right-left yoyo + scale breathe) plus a presence-gated cursor-follow glow, deliberately wide and soft (760px, 0→0.12) rather than a tight bright flashlight — correctly stays at 0 while hovering the navbar, since its `ref` scopes to the Hero section only, not the shared navbar+hero wrapper. The drift shape must stay small relative to the hero (currently ~42%×58%) with a large `xPercent` swing (150%) — an earlier version sized at 140%×80% of the hero moved the same absolute distance but read as completely static, because the shape was already so large that shifting it was imperceptible relative to its own size (confirmed via computed `transform` — the tween was genuinely running, just invisible); (2) `ArchitecturalGrid` — continuous 36px connected-cell grid mounted at the navbar+hero wrapper (so it spans behind the navbar's transparent-at-rest chrome too), 0 opacity until presence gates a cursor-mask reveal up to 0.5, and separately wrapped in a static vertical `linear-gradient` mask (`black 0%→72%, transparent 96%`) so it dissolves into the next section at the bottom instead of a hard cut — the two masks compose via ancestor nesting, not `mask-composite`; (3) keyword pills — `0.1` opacity at rest (not fully invisible), spring-eased to `0.9` by each pill's own distance to the cursor (not the shared presence — proximity is per-pill), scattered into corners/edges with headroom kept above the hero's bottom edge, frosted-glass card styling (`rounded-xl`, `backdrop-blur-md`, thin white border, inset top-highlight, no accent color), GSAP owns only their idle float (y + ±2° rotate, `sine.inOut`, no bounce) so it never fights the Framer-driven opacity over a property. |
| **Cursor lighting** | Radial glow, 280–320px diameter, `--glow-soft` opacity, follows cursor via spring (`stiffness:60, damping:20, mass:0.8`, per the existing validated cursor-lerp precedent). Used only in Focus Pull contexts — never omnipresent. |
| **Card lighting** | Resting: `--blur-noise` optional soft treatment. Hovered/focused: resolves to `--blur-signal` + `--glow-soft` edge light (Depth-of-Field Hover). |
| **Edge lighting** | Default border `white/[0.08]`, hover `white/[0.12–0.14]` (unchanged). Signal-register cards additionally get a 1px accent-tinted edge (`accent/20%`) on their focused/active state only. |
| **Glow behavior** | Only `--glow-*` tokens, accent hue only. **Max one active glow source per viewport on mobile** — hard rule, ties to §10. |
| **Light falloff** | Radial gradients always feather to transparent by 70% radius. |
| **Shadow philosophy** | Shadow is secondary to focus/blur for depth (§2.4) — reserve for raised/interactive elements, never as the signal/noise signal itself. |

---

## 5. Background System

| Layer | Density | Opacity | Blur | Movement | Register |
|---|---|---|---|---|---|
| **Noise field** (drifting phrases) | 5–7 visible max | `--opacity-ghost` | `--blur-noise` | Independent drift, 25–40s | Noise only |
| **Particles** | 8–16/viewport max, 2–6px | ghost→faint | `--blur-partial` min | 0.1–0.2px/frame, wrap at edges | Noise only |
| **Grain** | Full-viewport, CSS-generated (no image asset) | 3–4% sitewide, 5–6% in noise zones | n/a | Position shift every 8s (avoid "dirty screen" static feel) | Sitewide, intensity varies |
| **Bokeh** | 2–3/viewport max, 150–300px | 10–18% | `--blur-ambient` | Slow, near-static | Signal ambient only |
| **Gradients** | — | accent-hue only, varying opacity | — | — | Radial only, never a linear full-bleed wash |

**Grid layers:** the 12-column *layout* grid only (§2.5) — no decorative visible grid lines; that's a different, un-chosen direction's motif. **Accent usage:** scoped to glow/bokeh ambient, the in-focus marker, live-metric lines, and CTAs — never a background wash. **Background transitions:** cross-fade 400–600ms, triggered once via `IntersectionObserver` on scene entry — never scroll-linked pixel-by-pixel (jank risk).

---

## 6. Motion System

**Signature easing** (unchanged): primary `[0.16, 1, 0.3, 1]`, secondary `[0.22, 1, 0.36, 1]`. **Durations:** micro `0.2–0.3s`, component reveal `0.4–0.5s`, hero/section entrance `0.6–0.9s`. **Stagger:** `0.05–0.08s` (lists), up to `0.12s` (≤5 hero elements). No repeated fade-up as the sole language — every distinct part needs one signature beyond opacity+y.

**Library decision tree** *(new — resolves what 05-ANIMATION.md left open)*:

| Use case | Library |
|---|---|
| Entrances, `whileInView` reveals, hover/tap, `layoutId` transitions, `AnimatePresence`, cursor-follow springs, Depth-of-Field Hover, Magnetic CTA, Resolve-on-Scroll | **Framer Motion** (default, ~90% of cases) |
| Pinned/scrubbed sequences (Process section, built 2026-08-16 — the one real use so far), horizontal scroll, choreographed timelines >4 concurrent tweens | **GSAP + ScrollTrigger** |
| Per-element idle loops combining float + rotate + fade with randomized duration/delay (Hero keyword pills) | **GSAP core** (no ScrollTrigger needed) — `sine.inOut`, `repeat:-1, yoyo:true`, one tween per ref, `.kill()` on cleanup |
| Always-on ambient loops needing no JS control (grain shift, bokeh drift, base particle drift) | **CSS animation** (zero JS runtime cost) |
| Real 3D/shader work | **Three.js/R3F** — not justified anywhere in the current locked scene list; do not add speculatively |

**Entrance:** `blur(3px)→0` + `opacity 0.4→1` + `y:8px→0`, 500–600ms, primary easing — this *is* the fade-up replacement. **Ambient loops:** grain 8s, bokeh 45–90s, breathing glow pulse 4–6s ease-in-out infinite alternate. **Scroll storytelling:** `IntersectionObserver`-triggered register cross-fades at scene boundaries; no scroll-linked continuous transforms outside the one reserved GSAP pin. **Page transitions:** `AnimatePresence`, 300–400ms, primary easing, cross-fade + slight blur-out/in. **Hover:** 200–300ms, secondary easing. **Cursor:** spring baseline `stiffness:60, damping:20, mass:0.8`; Magnetic CTA snappier at `stiffness:300, damping:20, mass:0.5`. **Exit:** blur back to `--blur-partial` (not full `--blur-noise/ambient` — avoid a jarring exit) + opacity to `--opacity-visible`, 300ms.

Per-scene application (which scene gets which register/intensity) is authoritative in [00-experience-blueprint.html §03](00-experience-blueprint.html) — this section defines the library/physics layer, that one defines the per-scene application. Don't re-derive one from the other; keep them cross-referenced.

---

## 7. Interaction System

| Interaction | Spec |
|---|---|
| **Cursor physics (ambient)** | `stiffness:60, damping:20, mass:0.8` |
| **Magnetic pull** | 80px activation radius, max 12px displacement, `stiffness:300, damping:20, mass:0.5` |
| **Cursor-trail (image reveal)** | `stiffness:120, damping:18, mass:0.6` — between the two above; a large (~280px) trailing image reads as disconnected at the ambient spring's slower lag |
| **Hover** | 200–300ms, secondary easing; always paired with an equivalent focus state |
| **Click/tap** | Scale to `0.97`, 100ms, ease-out — no spring (perceived responsiveness over physicality) |
| **Focus (keyboard)** | 2px accent ring, 2px offset — never `outline:none` without a replacement |
| **Drag** | Not used anywhere in the current locked scenes — reserved, undefined until a real use case exists. Don't invent one speculatively. |
| **Scroll** | Passive/native by default, no scroll-jacking, except the one reserved GSAP pin — now spent on Process (built 2026-08-16, gated to lg+ via `gsap.matchMedia`, skipped entirely under reduced motion) |
| **Loading** | `--blur-noise` + `--opacity-faint` pulse, 4s ease-in-out infinite — loading *is* "not yet resolved," the motif's own vocabulary, not a generic spinner |
| **Forms** | Minimal motion only: focus = border-color + `--glow-whisper`, 150ms, no spring, never blurred. Validation error = sharp inline message, color shift only, no shake/bounce |

---

## 8. Component Personality

| Component | Personality |
|---|---|
| **Buttons — primary** (`ShinyButton`, `.shiny-cta`) | Confident, solid, real — Magnetic CTA + rotating accent-ring glow, breathing bloom on hover. One per view (§2.1) — never two solid CTAs competing |
| **Buttons — secondary** (`GhostButton`, `.ghost-cta`) | Same shape as `ShinyButton` always — identical padding, `360px` radius, type scale. Color is the only differentiator: a light glass chip (border/bg only, no fill/glow ring) vs the primary's dark-fill glow. Signature move is the arrow icon revealing smoothly on hover; text lifts `white/70→white`. Pairs *next to* a `ShinyButton`, never replaces it |
| **Cards** | Recede until you look, then resolve — Depth-of-Field Hover is the default, not an option |
| **Services** (`Services`, homepage) | Superseded a sticky-panel layout (kept here for history: click-to-activate list + sticky floating panel). Current version is a full-width hover-reveal list, not cards — four rows divided by hairlines, name (`font-semibold`, widened to a 400px column for the current longer service names) dims/brightens on hover, hook+body render as one flowing paragraph (the hook sentence in full white, the rest in `white/70` — replaced the earlier `includes` chip-tag list, which doesn't fit prose-shaped copy) on the right only while hovered/focused, plus a flat borderless tonal wash (`bg-white/[0.02]`) behind the active row for extra hierarchy without adding card/pill decoration. A cursor-trailing floating image (a distinct abstract graphic per service) follows the pointer across the whole list, using a dedicated `SPRING.trail` physics (§7) plus a small rotation derived from cursor velocity (`useVelocity`); while visible, its inner card also gets a slow GSAP idle "breathing" scale pulse (1→1.02→1) — applied to the inner div specifically, not the outer motion.div, since Framer already owns that element's own `scale` for the visible/hidden transition and two systems animating the same property would fight. Rows dim via **opacity only, no blur** — a deliberate, section-scoped exception to Depth-of-Field's default blur, since the list must stay legible at a glance. No scroll-jack/pin — the one reserved GSAP pin slot (§7, "Scroll") is spent on Process, not here. Mobile: every row's content renders statically, no hover-gating, no floating image (no cursor to drive it). **Services (2026-08-15):** AI Visibility (GEO) for Healthcare Practices, Healthcare SEO, Reputation Management for Medical Practices, Paid Search & Social for Healthcare — replaced the earlier SEO/GEO/Reputation/Website Design set. The new Paid Search mark is a bullseye (equal-opacity concentric rings + solid center + a dart landing on it) — deliberately distinct from GEO's fading-outward pulse despite both being ring-based. **Flagged, not resolved:** the hrefs supplied (`/ai-visibility-geo/`, `/healthcare-seo/`, `/healthcare-reputation-management/`, `/healthcare-paid-search/`) don't match `docs/13-URL-ARCHITECTURE.md`'s already-locked generic `/services/...` pattern (`/services/ai-search-optimization/`, `/services/reputation-management/`, separate `/services/google-ads/` + `/services/meta-ads/`) — used as given per explicit instruction that they're "just reference for where this redirects," but the two IAs need reconciling before real pages exist. |
| **Who We Serve** (`WhoWeServe`, homepage) | Six specialty cards (hair restoration flagship, dental, med spa, dermatology, plastic surgery, orthodontist), each a real H3 + paragraph + "View More →" linking to its real locked slug (`docs/13-URL-ARCHITECTURE.md`). The one section with real video — an explicit, requested exception to "no stock-photo agency clichés" (`docs/02-BRAND.md`), self-hosted in `public/videos/`, never hotlinked. Lazy-mounted per card via `useInView` (plain `IntersectionObserver`, mirrors `usePrefersReducedMotion`'s style) so six videos never all load at page mount; `autoPlay` drops under reduced motion (static first frame, not removed — it's real content, not decoration). Hover: opacity-only sibling dimming (unchanged, section-scoped exception to Depth-of-Field's default blur) plus a `scale-105` on the hovered card's video. |
| **Logo marquee** (`LogoMarquee`) | A quiet trust signal, not a focal element — no card, border, shadow, glass, or hover state at all; just small monochrome (`white/55`) marks drifting on the bare page background between Hero and the next section, ~70–80px tall. Pure CSS `@keyframes marquee` (translateX 0→-100%, linear, 52s, infinite) on two duplicated, adjacent rows — the standard zero-seam technique: as the first row's translation reaches -100% (its own full width), the second (positioned immediately after it) is at that same start position, so the loop restarts invisibly. `mask-image` gradient fades the first/last ~13% — never a colored overlay, which is how it blends into the page rather than reading as a dark vignette. Deliberately the *one* exception to "never a second solid CTA/card register" rule elsewhere — this section has no card at all. |
| **Market Shift** (`MarketShift`, homepage) | The Hero's "recommended by AI" claim, backed with three real numbers. Single-select accordion (plain content, no card — one stat open at a time, clicking the open item is a no-op, never collapses to nothing) beside a flat data-graphic (radial arc / three-bar comparison / 0–5★ threshold gauge), separated by a plain vertical rule, no glass/backdrop/glow. Numerals draw in as a live arc/bar (never counting up per **Statistics**' locked personality below) — flat white, dimmed when inactive; scale and weight carry the hierarchy, not lighting. **Superseded:** an earlier pass wrapped both sides in glass cards with a glowing `InFocusMarker` dot and a rotating `.scan-ring` "dashboard" backdrop — corrected per `feedback_avoid_ai_generated_look` (read generic AI-SaaS, not this brand). Mobile: one column, each expanded item shows its graphic small and inline (same fallback as Services). |
| **AI Visibility Explainer** (`AiVisibilityExplainer`, homepage) | Explain / demonstrate split — text entirely in one column, one editorial pull-quote (`AiAnswerQuote`) filling the other, separated by a plain vertical rule. The illustrative answer sits in large italic Switzer with an oversized decorative quotation mark — the one graphic device — and **Your Practice** breaks italic to roman for emphasis (never a glow/underline-draw/corner-dot). The AI systems and the three mechanism factors are plain typographic lists (`·`/`—` separated), not tabs or checkmark-pill chips. **Superseded:** an earlier pass simulated an AI-chat UI with auto-cycling provider tabs and checkmark chips — a fake product interface at its core, replaced rather than re-skinned per `feedback_avoid_ai_generated_look`. The cited "practice" is always the generic **Your Practice**, never a real business — matches the honesty gate the same way Market Shift's stats do. |
| **Why Choose Us** (`WhyChooseUs`, homepage) | The one light-background exception on the site (see §1). A "solar system" composition — 2–3 thin rotating orbit rings (dark, low-opacity strokes, `.orbit-ring` CSS keyframe, ~110s/rotation) centered behind the eyebrow+H2, with 5 accent node markers on the outermost ring at 5 trigonometry-computed points, matching the 5 differentiator items in the grid below (3 top / 2 centered — real prose never sits curved on the ring itself, that's illegible and unworkable responsively). Each item gets a small line-only icon (no circular badge — that's the pattern `feedback_avoid_ai_generated_look` already rules out). Both the white background layer and the content fade in/out together on a bidirectional scroll trigger (`viewport:{once:false}`) — a plain slow cross-fade, not a strobe; an earlier pass tried a multi-step flicker and it read as gimmicky, corrected same-day. Mobile drops the ring graphic entirely (illegible at that scale) and stacks the 5 items in a plain list. |
| **Process** (`Process`, homepage) | The one section that scroll-jacks (§7, "Scroll") — desktop pins for ~300% of scroll while a continuous GSAP-scrubbed rail (`01—02—03—04`, one fill-bar tracking raw progress, not stepped) drives the step copy on the left and a live citation-network diagram (`ProcessGraphic`) on the right, both permanently-mounted panels crossfading/sliding per step rather than `AnimatePresence`. The diagram reuses the node/trigonometry motif already established by Market Shift's gauges and Why Choose Us's orbit rings, restaged to literally depict "your visibility across AI engines": Scan sweeps a radar beam over dim pulsing nodes; Diagnose solidifies and links the competitor nodes while your center node stays small and alone; Fix draws lines from your node out to those competitors as it grows and turns accent; Rescan connects everything to a steadily-pulsing center. **Superseded:** an earlier pass paired the rail with plain text and no diagram, which read as sparse/generic on the left — replaced with the copy-left/diagram-right layout and the citation-network graphic described above (2026-08-16). Mobile and reduced motion (including desktop-with-reduced-motion) skip the pin for a plain stacked list — scroll-jacking on touch is a hazard, and a reduced-motion visitor gets no scroll-scrub or click to advance a frozen pin. |
| **Navigation** | Quietly authoritative, never decorative — always full signal, never blurred/aspirational |
| **Forms** | Direct, unglamorous, fast — least motion of any component category |
| **Testimonials** | Earned, rare — per the honesty gate, renders *absent* rather than fabricated; full signal treatment only when real |
| **FAQ** | Plain-spoken — accordion only, zero blur/focus effects |
| **Blog cards** | Provisional until published — unpublished/draft states don't render at all, no "coming soon" placeholders |
| **Case studies** | The proof — always full signal, Live Metric Draw signature |
| **Statistics** | Tabular-nums, Live Metric Draw entrance, in-focus marker beside each stat. First built in Market Shift (homepage) — see that row above |
| **Final CTA** | The resolution — brightest, calmest, most spacious moment on the page |
| **Footer** | **Exception, 2026-08-17** (Ritik: "footer animation... make it more elegant and smooth") — the locked Scene 09 concept below called for "zero ambient motion, the one scene genuinely allowed to be still"; overridden for this section only, per CLAUDE.md's decision hierarchy (current request > locked doc). Built: six slow seeded (not `Math.random()`) accent-hue wave paths behind the content at low opacity, a "BOOST" wordmark with a cursor-position `radialGradient` mask reveal (same cursor-as-flashlight language as `CursorGlow`/`useSpotlight` elsewhere, restyled from a pasted reference — accent+white fill instead of a five-color rainbow, `font-display` instead of Helvetica), and a `pathLength` stroke-draw entrance matching the sitewide "arrival" grammar. Every other §4 Lighting constraint still holds (accent-hue-only, low-opacity, slow, respects reduced motion) — only the "none at all" rule for this one section changed. Content (CTA line, four-column nav, copyright bar) recovered from the pre-reset `Footer.tsx` in git history and rebuilt in the current system with current URL-architecture-locked links; the never-wired newsletter column and "#" social links were dropped rather than carried forward as fake functional UI, replaced by a real specialty-links column serving the same sitewide-internal-linking objective. |

---

## 9. Accessibility

Contrast: body text minimum `white/65` (~7:1); never dip below `white/50` for anything meant to be read. Every interactive element needs a visible `:focus-visible` state. Every icon-only control needs `aria-label`. One `<h1>` per page, headings descend without skipping.

**Signal & Noise-specific rules** *(new, the most important additions in this document)*:
- **Blur is visual-only, never semantic.** A blurred "noise" element stays fully present in the DOM, fully readable by screen readers, and fully keyboard-focusable/tabbable — blur ≠ hidden, ever.
- **`prefers-reduced-motion` resolves everything to legibility immediately:** all blur → `0` on load (no resolve animation, just render sharp), all ambient loops (grain/bokeh/particle drift, breathing glows) stop entirely, entrance animations reduce to opacity-only (no y-translate, no blur transition), cursor-follow effects (glow, magnetic pull) disable entirely in favor of static states. Implemented via `useSyncExternalStore` on the media query (not `useEffect`+`useState` — that trips the `react-hooks/set-state-in-effect` lint rule and isn't SSR-safe the same way). Gotcha found the hard way: the reduced-motion variant object must *explicitly* zero `y`/`scale`/`filter` rather than omitting them — `getServerSnapshot` assumes not-reduced, so the first client render can briefly mount with the full variants before the hook corrects itself, and a variant that doesn't mention a property leaves it uncontrolled at whatever value that first render left it at (a stuck `blur()` on the H1, caught only by actually screenshotting with `reducedMotion: "reduce"`, not by reasoning about the code).
- **Touch targets:** minimum 44×44px, no exceptions (accordion triggers, nav items included).
- **Noise-register text is always decorative/redundant** — real content is never carried *only* by a near-illegible `--opacity-ghost` element. If it matters, it isn't allowed to be noise.

---

## 10. Performance Budget

Carried forward from [07-ARCHITECTURE.md](07-ARCHITECTURE.md), this is the authoritative full spec:

- Lighthouse Performance ≥ 90 (mobile) before merging any GSAP or Three.js-heavy section
- Core Web Vitals: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- No more than one heavy animation library (GSAP or Three.js) per page
- **Bundle size** *(new)*: initial JS payload ≤ 180KB gzipped per route
- **Animation limits** *(new)*: max 3 concurrent JS-driven animations per viewport (pure-CSS ambient loops don't count — GPU-cheap)
- **GPU layer limits** *(new)*: max 6 actively composited layers (transform/opacity-animated elements) per viewport
- **Mobile scale-down** *(new)*: reduce ambient element counts ~50% below `md` (768px) — fewer particles, fewer noise phrases, one bokeh instead of two or three, ties to §4's one-glow-on-mobile rule

---

## 11. Mobile Experience

Not a resize — several signature interactions are cursor-only and need a real touch equivalent, not an assumption they'll "just work":

| Desktop interaction | Touch equivalent |
|---|---|
| Focus Pull (cursor proximity) | Resolve-on-Scroll — element sharpens as it centers in viewport. No separate code path; simply don't attach pointermove-only listeners that would sit inert on touch. |
| Magnetic CTA | Simple press-scale (`0.97`, 100ms) — no hover/proximity concept on touch |
| Cursor lighting/glow | Removed entirely — replaced by the static breathing ambient glow already defined for signal scenes |
| Hover-to-reveal (specialty tile value prop) | Tap-to-expand, tap-outside-or-again to collapse — an interaction *model* change, not a smaller version of the same one |

**Navigation:** hamburger below `lg`, expands from the toggle's own position (unchanged, locked). **Gestures:** native scroll/tap only — no custom swipe (avoids browser back-swipe conflicts). **Layout:** two-column `field`/`dims`-style grids collapse to one column; Hero's noise-phrase density reduces (a busy blurred field reads as cramped, not atmospheric, on a small viewport). **Touch targets:** 44×44px minimum (§9).

---

## 12. Component Inventory & Build Order

Dependency-ordered — nothing below should be started before its row's prerequisites exist.

| Tier | Contents | Depends on |
|---|---|---|
| 0 — Foundation | The token file itself (§2: color, type, spacing, blur/glow/opacity, z-index) | Nothing — build first |
| 1 — Primitives | `ShinyButton`, `GhostButton`, Badge/Pill, Input, Textarea, Select, `Container`, `Section`, `Grid` | Tier 0 |
| 2 — Motion primitives | `RevealOnScroll` (Resolve-on-Scroll) — **built**, `src/components/Reveal.tsx` (`Reveal`/`RevealGroup`/`RevealItem`; `trigger="mount"` for above-the-fold content like the Hero, `"viewport"` for everything scrolled into view, `"inherit"` to nest a tighter second stagger inside an outer group) — `CursorGlow`, `MagneticWrapper`, `NoiseField`, `BokehLayer`, `GrainOverlay`, `InFocusMarker` | Tier 0–1 |
| 3 — Chrome | `Navbar`, `MobileMenu`, `Breadcrumbs`, `Footer` | Tier 1–2 |
| 4 — Content | `SpecialtyCard`, `ServiceCard`, `BlogCard`, `CaseStudyCard`, `ResourceCard`, `TeamCard`, `StatBlock`, `HonestyProofBlock`, `FAQAccordion`, `ComparisonTable` | Tier 1–2 |
| 5 — Forms | `ContactForm`, `NewsletterForm`, inline feedback/toast | Tier 1 only (deliberately minimal Tier-2 dependency — forms stay low-motion) |
| 6 — Scene assembly | Hero, Specialty Recognition, Proof Spotlight, Why Us, Services, FAQ, Final CTA scenes | Tiers 1–5, per [00-experience-blueprint.html §02](00-experience-blueprint.html) |

See [00-PROJECT-BLUEPRINT.md §5](00-PROJECT-BLUEPRINT.md) for the original inventory this supersedes.

---

## 13. Quality Standards

Every component and page passes all seven before merge:

| Review | Gate |
|---|---|
| **Design** | Matches locked Creative Direction/Experience Blueprint; uses only locked tokens (no ad-hoc hex/px) |
| **Motion** | Correct register (signal=calm, noise=active); no repeated fade-up; one signature per *scene*, not per element; correct library per §6's decision tree |
| **Accessibility** | Blurred elements remain DOM-present/focusable; `prefers-reduced-motion` fully handled; contrast checked; touch targets ≥44px |
| **Performance** | Lighthouse ≥90 mobile; within animation/GPU-layer budget (§10); one heavy library max |
| **SEO** | Semantic HTML; correct heading order; schema present where required; honesty gate respected — no fabricated proof anywhere |
| **Responsive** | Mobile designed intentionally, not resized; every cursor-based interaction has a defined touch equivalent (§11) |
| **Code quality** | Tokens used throughout (no magic values); components composed, not one-off; no unused motion library imported per page |
