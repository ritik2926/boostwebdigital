---
description: Build a page from a visual reference image with a mandatory analyse → build → screenshot → self-critique → iterate loop
argument-hint: <route> <path/to/reference-image(s)>
---

# Build from a visual reference

**Target:** $ARGUMENTS

You are acting as a senior product designer, not a developer implementing a ticket. The output is judged on **visual quality**, not on whether the sections exist.

---

## THE RULE THAT MATTERS MOST

**You may not finish this task without looking at what you built.**

Writing JSX and declaring it done is the failure mode this command exists to prevent. You will screenshot your work, open the image, compare it against the reference, and iterate. Minimum **three** build→screenshot→critique cycles before you report back.

If your screenshot and the reference don't feel like they belong to the same tier of craft, you are not finished.

---

## PHASE 1 — Analyse the reference in writing

Read every reference image. **Write the analysis to `docs/refs/[route]-spec.md` before touching any code.** Do not skip to building — an unwritten analysis is an unmade decision.

Extract all twelve dimensions. Be specific and numeric. "Nice spacing" is not an observation.

1. **Section rhythm** — list every section top to bottom. What is the repeating unit? Where does it deliberately break?
2. **Alignment pattern** — which sections are centred, left, right, split, asymmetric? *A reference that varies alignment and a build that doesn't will never match, no matter how good the type is.*
3. **Container strategy** — per section: full-bleed, contained, or narrow? What's the max width? Does anything intentionally overflow?
4. **Colour blocking** — the dark/light sequence. Where does the background flip? What does that flip do for pacing?
5. **Vertical rhythm** — approximate padding above/below each section. Is it uniform or does it vary by section weight?
6. **Type scale** — biggest to smallest, with weights. What's the ratio between h1 and body? Where does weight rather than size carry the hierarchy?
7. **Surfaces** — cards: radius, border, fill, elevation, internal padding. How much of the canvas is card versus bare background?
8. **Imagery** — what percentage of each section is image, illustration, or graphic? What's the treatment — full-bleed, masked, bordered, floating?
9. **Density** — roughly what percentage of each viewport is occupied versus empty? *This is the number that separates a designed page from a wireframe.*
10. **Accents** — badges, pills, dividers, numerals, icons. Size, placement, frequency.
11. **Motion cues** — anything implying scroll reveal, parallax, marquee, hover.
12. **The single thing that makes it feel designed** — name it in one sentence. Usually it's one bold move: a dominant image, an unexpected asymmetry, a scale jump, an unusual colour block.

---

## PHASE 2 — Reconcile with our design system

Read `docs/12-DESIGN-STANDARDS.md`, `src/lib/tokens.ts`, and `src/components/HomePage.tsx`.

Then produce a three-column table:

| Reference does | Our system says | Resolution |
|---|---|---|

**How to resolve conflicts:**

- Our system wins on **surface treatment** — colour, effects, materials, typeface.
- The reference wins on **composition** — layout, rhythm, density, scale relationships, alignment variation.

That split is the point. We are not copying someone's visual style. We are matching their **structural craft** using our own materials.

**Never resolve a conflict by doing less.** If the reference uses a glowing glass card and our system forbids glass, the answer is not "a paragraph of text." It's a flat card with real presence — generous padding, a considered border, a genuine visual anchor inside it. Restraint is a style, not an excuse for emptiness.

---

## PHASE 3 — Composition plan, then stop

Before writing code, output a per-section plan:

```
SECTION 3 — How I work
  Layout:      2-col asymmetric, 5/7 split, content right
  Container:   contained, 1200px
  Background:  light — flips from the dark section above
  Padding:     160px top / 160px bottom
  Anchor:      4-tile grid, each tile 280px min-height, numeral + label + body
  Density:     ~75% occupied
  Motion:      staggered reveal, 60ms apart
```

**Wait for approval.** Do not build until the plan is agreed.

---

## PHASE 4 — Build

Reuse `Container`, `Kicker`, `Reveal`/`RevealGroup`/`RevealItem`, `Buttons`, and `src/lib/tokens.ts`. Extend them if the composition needs something new — don't fight them, and don't reinvent them either.

### Craft floor — every one of these is a hard requirement

- **No section is text-only.** Every section needs at least one visual anchor: an image, a graphic, a card group, a numeral, a data element, a distinct colour block.
- **No section may be under 60% horizontally occupied.** A 45%-wide text column with dead space beside it is a bug, not minimalism.
- **Alignment must vary.** Three consecutive sections with identical alignment and container width is an automatic fail.
- **The background must flip at least twice** across the page, unless the reference is monotone by design.
- **Vertical gaps between sections are capped at 200px desktop / 120px mobile** unless something occupies that space.
- **The hero must own the first viewport.** If it doesn't fill the screen with intent, rebuild it.
- **Cards need presence** — minimum 32px internal padding, a real minimum height, a defined border or fill. Not a hairline box around a paragraph.
- **Scale contrast must be visible.** If your largest and smallest type are within 3× of each other, the page will read flat.
- **Icons at 16px are decoration, not anchors.** If an icon is doing structural work, it's 32px minimum, or it's replaced with something with more weight.

---

## PHASE 5 — Screenshot

```js
// scripts/shot.js
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  for (const [name, vw] of [["desktop", 1440], ["mobile", 390]]) {
    const p = await b.newPage({ viewport: { width: vw, height: vw === 1440 ? 900 : 844 } });
    await p.goto(process.argv[2], { waitUntil: "networkidle" });
    await p.screenshot({ path: `docs/refs/shots/${process.argv[3]}-${name}.png`, fullPage: true });
  }
  await b.close();
})();
```

Run it against the dev server. Then **open both screenshots and actually look at them.**

---

## PHASE 6 — Self-critique

Put your screenshot beside the reference and answer honestly:

1. Does mine look like it took the same amount of design effort? **Yes / no, and why.**
2. Where is the dead space? List every region over 200px tall with nothing in it.
3. Which sections are visually identical to each other? (Repetition reads as low effort.)
4. Is anything undersized — images, cards, buttons, type?
5. Does the page have a focal point, or is everything the same weight?
6. Is the density comparable to the reference, or is mine emptier?
7. Any rendering bugs — clipped text, overlap, broken layout, console errors?
8. **Does it look finished, or does it look like a wireframe?**

Write the answers out. Score each section **PASS / WEAK / FAIL**.

---

## PHASE 7 — Iterate

Fix everything marked WEAK or FAIL. Screenshot again. Critique again.

**Minimum three cycles.** Stop when every section is PASS and question 8 answers "finished."

Do not report back mid-loop. Do not report back with known FAILs and a note explaining them.

---

## PHASE 8 — Report

1. Screenshot paths, desktop and mobile
2. The final critique table with all sections PASS
3. Number of iterations run
4. Anything you deliberately took from the reference and anything you deliberately didn't, with reasons
5. Anything needing a human decision — real content, real images, a judgement call

Then the standard SEO layer: one h1, no skipped heading levels, `metadata` with unique title/description/canonical, JSON-LD with `BreadcrumbList`, sitemap entry, `next/image` everywhere. See `docs/SEO-BUILD-RULES.md`.

---

## Anti-patterns — automatic fail

| Never | Why |
|---|---|
| Report done without screenshotting | The entire point of this command |
| Six sections with the same layout | Repetition is the primary symptom of low effort |
| A text paragraph where the reference has a visual | Not a simplification — a downgrade |
| Uniform 50% content width down the page | Reads as a wireframe |
| "I kept it minimal per the design standards" | Minimal means considered, not empty |
| Icons under 20px as a section's only visual | Not enough weight to anchor anything |
| Shipping with a console error | Check it before reporting |
