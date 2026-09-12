# Link Targets — Live Inventory & Blog Linking Reference

Audited 2026-09-12 directly against production (`https://boostwebdigital.com`) and the repo at that commit. This is a reference document, not a design doc — open it mid-task, get an answer, move on. Re-audit and update the date whenever a new page ships or a route changes.

`trailingSlash: true` is set in `next.config.ts` — every URL below is written with the trailing slash on purpose. Never link without it.

---

## A · LIVE MONEY PAGES — safe to link to now

| URL | What it is | Anchor text to use |
|---|---|---|
| `/` | Homepage | "Boost Web Digital" / "our homepage" |
| `/about/` | Agency story, founder, E-E-A-T | "how Boost Web Digital works" |
| `/services/` | Services hub (3 core services, not 4 — see Rule note below) | "our full range of services" |
| `/ai-visibility-geo/` | Service hub — AI Search Visibility (GEO) | "AI search visibility (GEO)" |
| `/healthcare-seo/` | Service hub — Healthcare SEO | "healthcare SEO" |
| `/healthcare-reputation-management/` | Service hub — Reputation Management | "healthcare reputation management" |
| `/healthcare-social-media-management/` | Service hub — Social Media Management | "healthcare social media management" |
| `/dental-marketing/` | Specialty hub — Dental | "dental marketing" |
| `/dermatology-marketing/` | Specialty hub — Dermatology | "dermatology marketing" |
| `/tools/ai-visibility-checker/` | Free AI visibility checker (the lead magnet) | "run the free AI visibility check" / "check your AI visibility" |
| `/pricing/` | Pricing tiers (Visibility $1,500/mo, Growth $3,500/mo, Market Leader $7,500/mo) | "our pricing" |
| `/contact/` | Contact form | "get in touch" / "talk to us" |
| `/blogs/` | Blog archive | "the blog" |
| `/faq/` | Sitewide FAQ | "frequently asked questions" |

Never use "click here" or "learn more" as the entire anchor for any of these — the anchor text itself must name the destination.

**Legal pages exist and are live but carry `noindex,follow`** — link to them only from a footer/legal context, never as a content link in a blog post: `/terms/`, `/privacy/`, `/refund-policy/`, `/disclaimer/`, `/cookie-policy/`.

---

## B · DO NOT LINK YET — planned, referenced, or built but not live

| URL / slug | What it is | Waiting on |
|---|---|---|
| `/hair-restoration-marketing/` | Specialty hub — the flagship specialty (real client, Kaja Hair Studio) | Not built. Confirmed 404 live. Data exists in `src/lib/specialties.ts` but is correctly gated (`built` flag unset) so it renders as a non-clickable card, not a link. |
| `/med-spa-marketing/` | Specialty hub | Not built. 404 live, correctly gated. |
| `/plastic-surgery-marketing/` | Specialty hub | Not built. 404 live, correctly gated. |
| `/orthodontist-marketing/` | Specialty hub | Not built. 404 live, correctly gated. |
| `/healthcare-paid-search/` | Service hub — Paid Search & Social | Not built. Referenced in `src/components/HomePage.tsx`'s `SERVICES` array but that array is explicitly dead data (rendered as a plain `<div>`, not a link — see that file's own comment). 404 live. |
| `/research/`, `/tools/`, `/compare/` | Parent/index paths | None of the three resolve — no page file exists for any of them, and none has real children beyond `/tools/ai-visibility-checker/`. Confirmed 404 live for all three. |
| Any `/services/{service}/` page (`/services/seo/`, `/services/web-design/`, etc.) | Generic service pillar pages per `docs/13-URL-ARCHITECTURE.md` | Not built. `/services/` currently lists exactly 3 services (AI Visibility, Healthcare SEO, Reputation Management) — see Rule note below. |
| `/case-studies/`, `/team/`, `/resources/`, `/vs/{competitor}/` | Planned per URL architecture doc | Not built at all. |

A blog post linking to anything in this table ships with a 404. If in doubt, curl it against production before publishing.

**Open positioning conflict, not resolved as of this audit:** `src/lib/services.ts`'s `SERVICES` array (source for `/services/`) intentionally still has only 3 entries. `ServicesApproach.tsx` runs a whole section arguing "why we only do three things." Adding Social Media Management as a 4th formal service there was drafted and reverted for this reason — it's linked from the nav only, not listed as a core service. Don't add a 4th entry to that array without deciding to rewrite that section first.

---

## C · THREE-LINK MINIMUM per content cluster

Every post must link to: **its specialty hub, one service hub, and the checker.** If a cluster has no live hub yet, say so and link only what's live — don't invent the destination.

| Cluster | Specialty hub | Service hub to pair | Checker (always) |
|---|---|---|---|
| Dental posts | `/dental-marketing/` | `/healthcare-seo/` (or whichever service the post is actually about) | `/tools/ai-visibility-checker/` |
| Dermatology posts | `/dermatology-marketing/` | `/healthcare-seo/` (or whichever service the post is actually about) | `/tools/ai-visibility-checker/` |
| AI visibility / GEO posts | *(none — no AI-visibility-specific specialty hub exists)* | `/ai-visibility-geo/` | `/tools/ai-visibility-checker/` |
| Hair restoration posts | **No live hub. `/hair-restoration-marketing/` does not exist yet** — do not write these posts until it ships. | — | — |
| Med spa posts | **No live hub. `/med-spa-marketing/` does not exist yet.** | `/ai-visibility-geo/` or `/healthcare-seo/`, whichever fits | `/tools/ai-visibility-checker/` |
| Plastic surgery / orthodontist posts | **No live hub for either.** | — | — |

**Current reality check:** the two blog posts live today do not yet follow this rule. Both link to the checker and to each other, but neither links to a specialty hub or a service hub in body content (only the sitewide nav/footer touch those URLs). Worth fixing on the next editorial pass, not urgent enough to block this audit.

---

## D · BREADCRUMB PARENTS

Flat URLs, so the hierarchy exists only in `BreadcrumbList` schema and in-page links — not in the path itself.

| Page type | Declared parent (schema + visible link) |
|---|---|
| `/healthcare-seo/` | Home → **Services** → Healthcare SEO (visible link + schema, both present) |
| `/healthcare-reputation-management/` | Home → **Services** → Healthcare Reputation Management (visible link + schema, both present) |
| `/healthcare-social-media-management/` | Home → **Services** → Healthcare Social Media Management (visible link + schema, both present) |
| `/ai-visibility-geo/` | Home → **Services** → AI Search Visibility — **schema only, no visible on-page link to `/services/`** |
| `/dental-marketing/` | Home → Dental Marketing — **no Services parent at all, schema or visible** |
| `/dermatology-marketing/` | Home → Dermatology Marketing — **no Services parent at all, schema or visible** |
| `/blog/{slug}/` | Home → Blog → post (no BreadcrumbList schema found tying a post to its money-page cluster) |
| Legal pages | Standalone, no parent (correctly `noindex`) |

Specialty hubs (dental, dermatology) are intentionally root-level per `docs/13-URL-ARCHITECTURE.md` Rule 2 ("hierarchy is expressed through breadcrumbs + internal links, not URL depth") — but right now neither one actually expresses that hierarchy. See the Up-Link finding below.

---

## E · THE RULES

- **Flat URLs at root**, two levels max, except city/location pages (none exist yet — not designed).
- **Two axes, never three**: specialty (`/dental-marketing/`) and service (`/healthcare-seo/`) are the only two structural axes live today. No specialty×service intersection page (e.g. `/dental-marketing/dental-seo/`) is built yet.
- **No generic, non-healthcare service pages.** `/services/seo/ecommerce-seo/` etc. were cut post-review as generalist-agency filler — don't re-add without a healthcare-specific reframing.
- **Max two intersection pages per specialty** once specialty×service pages start getting built.
- **Descriptive anchors only** — never "click here" / "learn more" as the whole anchor text.
- `/blog/` 301s to `/blogs/`; `/sitemap.xml` 301s to `/sitemap_index.xml` (Yoast-style split: `sitemap_index.xml` → `page-sitemap.xml` + `post-sitemap.xml`). Link to the canonical form, not the redirect source.

---

## Appendix · Full route inventory (repo vs. production)

All 24 `page.tsx` files are **Server Components** at the top level (none declare `"use client"` themselves — interactivity is delegated to client child components: `Navbar`, `Footer`, forms, the checker widget, `Reveal`-based sections).

| Route | File | Prod status | Body word count* |
|---|---|---|---|
| `/` | `src/app/page.tsx` | 200 | 2,324 |
| `/about/` | `src/app/about/page.tsx` | 200 | 443 |
| `/ai-visibility-geo/` | `src/app/ai-visibility-geo/page.tsx` | 200 | 1,419 |
| `/blog/{slug}/` | `src/app/blog/[slug]/page.tsx` | 200 (both posts) | ~2,120–2,324 (sampled) |
| `/blogs/` | `src/app/blogs/page.tsx` | 200 | 230 |
| `/contact/` | `src/app/contact/page.tsx` | 200 | 348 |
| `/cookie-policy/` | `src/app/cookie-policy/page.tsx` | 200 (noindex) | 620 |
| `/dental-marketing/` | `src/app/dental-marketing/page.tsx` | 200 | 1,801 |
| `/dermatology-marketing/` | `src/app/dermatology-marketing/page.tsx` | 200 | 1,444 |
| `/design-lab/` | `src/app/design-lab/page.tsx` | 404 (by design — dev-only, `notFound()` in production) | N/A |
| `/disclaimer/` | `src/app/disclaimer/page.tsx` | 200 (noindex) | 597 |
| `/faq/` | `src/app/faq/page.tsx` | 200 | 3,012 |
| `/handbook/` | `src/app/handbook/page.tsx` | 200 (noindex + robots disallow, deliberately unlinked) | 6,382 |
| `/healthcare-reputation-management/` | `src/app/healthcare-reputation-management/page.tsx` | 200 | 1,724 |
| `/healthcare-seo/` | `src/app/healthcare-seo/page.tsx` | 200 | 1,702 |
| `/healthcare-social-media-management/` | `src/app/healthcare-social-media-management/page.tsx` | 200 | 1,622 |
| `/newsletter/confirmed/` | `src/app/newsletter/confirmed/page.tsx` | 200 (noindex, orphan by design) | 15 |
| `/newsletter/unsubscribe/` | `src/app/newsletter/unsubscribe/page.tsx` | 200 (noindex, orphan by design) | 4 |
| `/pricing/` | `src/app/pricing/page.tsx` | 200 | 1,316 |
| `/privacy/` | `src/app/privacy/page.tsx` | 200 (noindex) | 1,477 |
| `/refund-policy/` | `src/app/refund-policy/page.tsx` | 200 (noindex) | 722 |
| `/services/` | `src/app/services/page.tsx` | 200 | 1,122 |
| `/terms/` | `src/app/terms/page.tsx` | 200 (noindex) | 1,485 |
| `/tools/ai-visibility-checker/` | `src/app/tools/ai-visibility-checker/page.tsx` | 200 | 415 |
| `/tools/ai-visibility-checker/report/{id}/` | `src/app/tools/ai-visibility-checker/report/[id]/page.tsx` | 404 for any non-real id (correct — noindex + robots disallow, no static id to sample) | N/A |

\* Real prose inside `<main>` only — nav and footer chrome excluded, `<svg>`/`<script>` content stripped. Measured against the running build, not estimated.

**Sitemap check:** `page-sitemap.xml` (14 URLs) and `post-sitemap.xml` (2 URLs) match `src/lib/sitemap.ts` exactly. Zero sitemap URLs 404. Zero live, indexable routes missing from the sitemap — every route excluded from it (legal ×5, newsletter ×2, `/handbook/`, `/design-lab/`, the dynamic report route) carries its own `noindex`, so the exclusion is correct, not an oversight.

**No orphaned deploy found** — every route that returned 200 in production corresponds to a real file in the repo. Caveat: this was checked by curling every route discoverable from the repo, the sitemap, and the rendered internal link graph — not a blind crawl, so a truly unlinked, un-sitemapped live route would not surface with this method.
