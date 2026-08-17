# Reference analysis — `docs/refs/about us page ref.webp`

Source: a two-panel scroll capture of one continuous page (a consulting-agency
site, "Eterna Cloud"). Left panel = top of page; right panel = its direct
continuation below the fold — read as one sequence, not two pages.

## 1. Section rhythm

Nine units, top to bottom:

1. Navbar — logo left, 3 links center-right, solid pill CTA right
2. Hero — kicker, H1, one dominant centered graphic (glowing ring)
3. "One service" — badge, H2, 3-card row
4. Transition statement — one big centered line, no card, no badge (the one
   deliberate break in the badge→H2→content unit — a pure typographic beat)
5. "One Vision" — small circular mark, H2, one-line subtitle (a *second*,
   smaller hero-like beat, not a full section — bridges dark→light)
6. "Meet the founders" — badge, H2, 3-card row (photo + quote)
7. "We are all One" — badge, H2, 4-tile letter grid
8. "Join our team" — badge, two-tone H2, subtitle
9. "Our mission in Action" — one wide card (chat/dashboard style)

Repeating unit = **badge → centered H2 → content row**, almost every time
followed by a 3-item or 4-item horizontal grid. It breaks exactly twice: the
transition statement (#4, text-only, no badge) and "Our mission in Action"
(#9, one full-width card instead of a grid). Those two breaks are what keep
nine consecutive centered sections from feeling monotonous.

## 2. Alignment pattern

Everything is dead-centered — badge, heading, subtitle, and the grids
themselves are centered as a block (though the cards inside a grid read
left-to-right, the grid's own container is centered). There is **no**
left-aligned or split/asymmetric section anywhere in this reference. This is
the one dimension our own system already disagrees with by default
(`12-DESIGN-STANDARDS.md` §3: "left-aligned by default, center only short
standalone statements") — noted here, resolved in Phase 2.

## 3. Container strategy

Every section is contained, not full-bleed — a single centered column,
roughly 1100–1200px max-width judging by the card row's total width against
the visible page edges, with generous side gutters even at the captured
viewport width. Nothing overflows the container; the glow/gradient
background layers are the only things that extend to the true page edge.

## 4. Colour blocking

This is the reference's most load-bearing device:

- Hero → dark (near-black with a purple radial glow)
- "One service" → dark (same background, no hard edge — glow just fades)
- Transition statement → dark, same background
- "One Vision" → the flip happens **here**, mid-scroll, via a soft diagonal
  gradient wash (cream/peach → violet → dark-navy) rather than a hard cut —
  the gradient itself *is* the transition, spanning maybe 15–20% of a
  viewport height
- "Meet the founders" + "We are all One" → light (near-white/lavender-white)
- "Join our team" → flips back to dark, again via a soft gradient wash at
  the top of the section rather than a hard line
- "Our mission in Action" → dark, continues

So: dark → **soft gradient flip** → light → **soft gradient flip** → dark.
Two flips total, both eased through a gradient transition zone rather than
a hard boundary — the flip is telegraphed over roughly one section's worth
of scroll, not instant. This is the mechanism, not just "some sections are
light."

## 5. Vertical rhythm

Padding reads generous and fairly uniform — each section clears roughly a
full small-viewport's worth of breathing room above/below its content
(estimate 120–160px top+bottom at this capture width). The "One Vision"
beat is the one exception: deliberately tighter/shorter, functioning as a
punctuation mark between two bigger sections rather than a section with its
own full padding budget.

## 6. Type scale

- H1 (hero): large, centered, two lines, medium weight (not extra-bold) —
  the weight is restrained; scale carries the moment, not boldness
- H2 (section headings): noticeably smaller than H1 but still clearly
  "heading" weight — maybe 55–65% of H1's size
- Card headings (H3-equivalent): small, semibold
- Body/quote text: small, low-contrast (light gray on dark, mid-gray on
  light)
- Kicker/eyebrow: smallest, colored (not plain white/gray like a typical
  eyebrow) — the kicker text on "one business is clarity..." uses a
  gradient/tint color, not the flat white-on-dark treatment ours uses

Ratio between H1 and body is large — comfortably past our own >3× scale-
contrast floor already, so no conflict there.

## 7. Surfaces

- Service cards: dark, softly rounded corners (~16–20px), a thin/no visible
  border, generous internal padding (~32px+), a small abstract line-art
  graphic occupying the top ~50% of the card before the heading+body text
- Founder cards: photo fills the top ~60%, a light card body below with
  name/title, then a **second, distinctly colored gradient band** at the
  very bottom holding the attribution — three separate visual layers
  stacked in one card, not a flat single surface
- LIFE tiles: small square swatches, flat solid color per tile, a single
  letter centered, no border — closer to a colored badge than a card
- "Mission in Action" card: wide, one rounded panel, icon + heading + body
  inside, chat-bubble/dashboard styling (this is exactly the "fake
  dashboard mockup" pattern our own `feedback_avoid_ai_generated_look`
  memory rules out — flagged for Phase 2, not carried over as-is)

## 8. Imagery

- Founder cards: real photography, ~60% of each card's height — this is
  the reference's only real-photo use
- Service cards: abstract generative line-art (particles + curved lines),
  small, decorative, not literal icons
- Everywhere else: no imagery, pure typography + color + one graphic device
  per section (the hero's glowing ring, the LIFE tiles, the mission card)

## 9. Density

Estimated occupied-vs-empty per section:
- Hero: ~55% (a lot of the glow/ring is atmosphere, not content, but the
  ring itself is large and load-bearing, so it doesn't read as empty)
- "One service": ~70% (3 full cards + heading stack)
- Transition statement: ~35% (deliberately sparse — the "breath" section)
- "One Vision": ~30% (deliberately the smallest, quietest beat)
- "Meet the founders": ~75%
- "We are all One": ~55% (heading + 4 small tiles, more whitespace than the
  founder row above it)
- "Join our team": ~50%
- "Mission in Action": ~65%

Average sits around 55–60% — comfortably clears our own 60% floor in the
sections meant to carry weight, and deliberately dips below it exactly
twice, on purpose, as a pacing device.

## 10. Accents

One consistent capsule badge above almost every H2 (small icon + label,
pill-shaped, low-contrast background) — same device we already use via
`Kicker`. Numerals are not used anywhere (no "01/02/03"). The LIFE tiles
are the reference's one numeral-adjacent device (single letters, not
numbers) and they only make sense because L-I-F-E is an actual acronym —
not a generic pattern to reuse elsewhere.

## 11. Motion cues

Static image, but composition implies: scroll-reveal on each section
(standard), a slow ambient drift on the hero's glow ring, and the
gradient colour-flip zones read as scroll-linked cross-fades rather than
instant cuts.

## 12. The single thing that makes it feel designed

**The colour temperature itself tells the story arc** — dark/serious for
the problem-and-method sections, warm/light for the human/people sections,
dark again for the ambition/close. The page uses light-vs-dark as a
narrative device, not a decoration. That's the one structural idea worth
protecting in the rebuild; everything else (glow rings, chat-mockup card,
literal LIFE tiles) is surface treatment specific to this brand, not the
mechanism.
