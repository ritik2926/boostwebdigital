# Brand

## Accent color

**`#3B4FDB`** (`--accent` / `--accent-rgb: 59, 79, 219` in `globals.css`) — the site's one UI accent token, revised 2026-08-15.

This entry previously listed a "light mode" (`#1627C6`, the literal logo hex) and an unused "dark mode" variant (`#5b6ef5`) that was never actually wired into `globals.css` — the site ran the raw logo color directly on `#08080a` the whole time, which read flat/muddy as text and generic as a fill (confirmed by rendering it against the real background, not just by inspecting the hex). `#3B4FDB` is the shade that held up best in that same rendered comparison — legible as text, confident as a button fill, still unmistakably the same blue family as the logo. The literal logo asset (`public/logo/*.svg`) is unaffected — it stays `#1627C6`, the printed brand mark; only the dynamic UI token changed, since it's the one actually meant to work on this site's near-black background.

Wired through Tailwind's `@theme inline` system in `globals.css`. Use as an accent to guide attention — not as a dominant fill color. Target roughly 10-20% usage on any given screen.

## Typography

**Switzer** (self-hosted, `src/fonts/switzer/`, weights 100–900 + italics) is the one sitewide typeface as of 2026-08-15 — replaces the earlier Fraunces (display) + Geist (body) pairing, per explicit instruction. Hierarchy now comes from **weight, size, and tracking contrast**, not a serif/sans family contrast: H1 Extrabold (800), H2 Bold (700), H3/H4 Semibold (600), body Regular (400), captions Medium (500). See `docs/12-DESIGN-STANDARDS.md` §2.2 for the full scale.

**Geist Mono** stays as the separate technical/label register (eyebrows, captions, stat labels) — untouched by this change, still the one place the sitewide typeface isn't used.

## Tone

Confident, professional, helpful, modern. Never salesy-desperate, never dry-corporate.

## Visual direction

- Editorial layouts over templated agency grids
- Strong typographic hierarchy as the primary design tool
- Minimal clutter, generous whitespace used intentionally (not just as leftover space)
- No stock-photo agency clichés — **one explicit, requested exception**: Who We Serve's specialty cards (homepage) use real, free-licensed Pexels video as ambient background texture per specialty (2026-08-15), self-hosted in `public/videos/`. Not a precedent for the rest of the site — every other section stays illustration/typography-only.
