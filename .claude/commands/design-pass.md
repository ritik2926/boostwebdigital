---
description: Screenshot an existing page, critique it against the craft standards, and fix everything below PASS
argument-hint: <route, e.g. /about/>
---

# Design pass

**Target route:** $ARGUMENTS

Read `docs/DESIGN-CRAFT.md` and `docs/12-DESIGN-STANDARDS.md` before anything else.

You are acting as a senior product designer reviewing work, not a developer
implementing a ticket. The output is judged on how the page **looks**, not on
whether the sections exist.

---

## 1. Look at it

The dev server must be running (`npm run dev`). Then:

```
npm run shot http://localhost:3000$ARGUMENTS <name>
```

**Open both screenshots — desktop and mobile — and actually look at them.**

If the script reports console errors, fix those first and re-shoot. Do not
begin design work on a page with errors.

---

## 2. Critique

Score every section against the ten hard-floor rules in `DESIGN-CRAFT.md`:

| Section | Anchor | ≥60% width | Alignment varies | Card presence | Scale contrast | Density | Score |
|---|---|---|---|---|---|---|---|

Then answer the eight self-critique questions from `DESIGN-CRAFT.md` in writing.

Also list explicitly:

- Every empty region over 200px tall, and where it is
- Every pair of sections that look the same as each other
- What the focal point of the page is — or state that there isn't one
- Estimated density percentage per section

Be blunt. A generous review here produces a bad page.

---

## 3. Propose, then stop

For every WEAK or FAIL, propose a specific fix:

- Which composition pattern to switch to (name it from the list in DESIGN-CRAFT.md)
- What visual anchor to add
- What sizes to change, with numbers

**Wait for approval before editing.**

Constraints:
- This is a **composition pass**. Do not rewrite copy. If copy needs to change,
  flag it separately and wait.
- Do not invent content, statistics, testimonials, or client names.
- Reuse `Container`, `Kicker`, `Reveal`, `Buttons`, and `src/lib/tokens.ts`.
  Extend them if the composition needs it — don't reinvent them.

---

## 4. Fix, then look again

Apply the approved fixes → `npm run shot` again → re-score.

**Repeat until every section is PASS.** Minimum two cycles.

---

## 5. Report

- Screenshot paths, desktop and mobile
- Before/after score table
- Number of iterations run
- Anything needing a human decision: real images, real content, a judgement call

**Never report with a known FAIL.**
