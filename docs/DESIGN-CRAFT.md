# Design Craft Standards

**Binding on every page.** Read before building or changing any UI.

`docs/12-DESIGN-STANDARDS.md` governs **style** — colour, typeface, effects.
This file governs **composition and density** — layout, rhythm, weight.

---

## The distinction that matters most

Our style is flat and editorial: no glow, no glass, no dashboard widgets.

**That is a rule about effects, not about effort.** Stripe and Linear are flat
and visually excellent. Flat can still be dense, varied and compositionally
strong.

When a rule in `12-DESIGN-STANDARDS.md` removes a visual element, the answer is
**never** "put a paragraph of text there." Replace it with something of equal
weight in our own language:

- a large numeral
- a data table
- a full-bleed image
- a strong colour block
- a card with real presence

**Removing without replacing is the failure mode.** It produces a wireframe.

> **Flat is a style. Empty is a defect.**

---

## Hard floor — ten measurable rules

Check every one against the screenshot, not against the code.

| # | Rule | It FAILS when |
|---|---|---|
| 1 | Every section has a visual anchor | A section is heading + paragraph only |
| 2 | Content occupies ≥60% of container width | A 45%-wide text column with dead space beside it |
| 3 | Alignment varies | 3 consecutive sections share alignment AND container width |
| 4 | Background flips at least twice per page | The whole page is one flat tone |
| 5 | Section gaps ≤200px desktop, ≤120px mobile | Empty vertical space above the cap |
| 6 | Hero fills the first viewport | The second section is visible on load at 1440×900 |
| 7 | Cards: ≥32px padding, real min-height, defined border or fill | A hairline box around a paragraph |
| 8 | Largest type ≥3× smallest | Everything reads at the same weight |
| 9 | Structural icons ≥32px | A 16px icon is a section's only visual |
| 10 | Zero console errors | Anything in the console |

---

## Composition patterns — rotate, never repeat back to back

- **Centred** — hero, section intros, CTA
- **Split 50/50** — text one side, image or card the other
- **Asymmetric 5/7 or 4/8** — most useful, most underused
- **Full-bleed** — image or colour edge to edge, breaks the container rhythm
- **Grid** — 2/3/4 columns of equal cards
- **Offset** — content deliberately off-centre, negative space used as shape

**A six-section page must use at least four different patterns.**

---

## Spacing system (locked 2026-08-19)

One `Container` (`src/components/Container.tsx`), one set of section-padding
tiers, one grid gap pair, one card-padding pair — all in `src/lib/tokens.ts`.
This followed a site-wide audit that found 8 distinct section-padding
values, 10 distinct grid gaps, and a `Container` variant with no horizontal
padding at all, across five pages built in separate sessions.

- **No `Container` size variant may ever ship without horizontal padding.**
  Only `max-width` may differ between variants — every variant carries the
  same `px-6 md:px-10 lg:px-16` gutters. The `heading` variant shipped
  without them for months before this was caught; it isn't allowed to
  happen again.
- **A section may use a different tier for its top padding vs. its bottom**
  (e.g. a hero whose bottom edge must not double-stack with the section
  below it) — but both values must come from `SECTION_PADDING`'s three
  tiers (`compact`/`default`/`spacious`). Never a one-off number, even when
  the asymmetry itself is justified.

---

## Density target

**70–80% of each viewport occupied.**

Below 60% reads as unfinished. Above 90% reads as cramped.

Squint at the screenshot. Large regions of nothing = too sparse.

---

## Every page needs one bold move

One element that carries the page — a dominant image, an unexpected scale jump,
a full-bleed data visual, a striking numeral, a hard colour break.

Six evenly-weighted sections have no focal point, and a page without a focal
point is boring even when every individual part is technically correct.

---

## Self-critique — answer in writing, every time

After screenshotting, before reporting:

1. Does this look like the same effort as the rest of the site?
2. Where is the dead space? List every empty region over 200px tall.
3. Which sections look identical to each other?
4. What is undersized — images, cards, buttons, type?
5. Where does the eye land first? Is there a focal point at all?
6. Density versus the 70–80% target — over or under?
7. Rendering bugs? Clipped text, overlap, console errors?
8. **Finished, or wireframe?**

Score every section **PASS / WEAK / FAIL**. Fix everything below PASS, then
screenshot and score again.

Never report a visual task complete with a known FAIL.
