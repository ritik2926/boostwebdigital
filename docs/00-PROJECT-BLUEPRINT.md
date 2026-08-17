# Boost Web Digital — Project Blueprint

**Status: LOCKED.** This is the version that governs Phase 1. It supersedes the original draft after a full adversarial review — see [00-BLUEPRINT-CHALLENGE.md](00-BLUEPRINT-CHALLENGE.md) for the critique that produced these revisions. Two items remain genuinely open and are named explicitly at the end rather than glossed over — locking the plan doesn't mean pretending everything is resolved.

---

## 0. Reality check

Unchanged from the original pass: `src/components/` doesn't exist, `src/app/page.tsx` returns `null`. `layout.tsx` and `globals.css` already have the correct metadata/font/dark-theme foundation. [09-COMPONENTS.md](09-COMPONENTS.md) and parts of [10-ROADMAP.md](10-ROADMAP.md) describing a "built" homepage are stale and get corrected when Phase 1 build work actually starts — this is a genuine blank-slate rebuild.

---

## 1. Website Goal

**Business objective:** the site is proof-of-competence — it has to demonstrate the SEO/GEO/AI-search skill Boost Web Digital sells, on itself.

**User goals:** fast self-identification with the visitor's specialty, credibility in under 10 seconds, clear service/engagement understanding, low-friction path to a conversation.

**Conversion goals:** (1) consultation booking, (2) resource/lead-magnet capture for not-yet-ready visitors, (3) engagement signals for remarketing.

**Brand positioning — sharpened post-review:** healthcare-specialist, not generalist-agency-that-also-does-healthcare. Three additions from the challenge review, now locked:
- **Founder-led credibility** — Ritik building and owning this directly is a positioning strength (accountable, boutique, no bloated-agency overhead), not something to downplay in favor of a generic "our team" page.
- **A confident exclusion statement** — real category leaders say who they *don't* serve. State plainly that this agency doesn't work outside healthcare. Stronger trust signal than another services list.
- **Pricing transparency moved earlier**, not held to P2 — see §8/§10.

---

## 2. Sitemap

Full detail in [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md), updated post-review:

| Change | What happened |
|---|---|
| **Cut** | `/services/seo/ecommerce-seo/`, `/services/seo/enterprise-seo/`, `/services/seo/international-seo/`, `/services/seo/shopify-seo/` — generalist-agency filler that undercut the healthcare-specialist positioning |
| **Added** | `/privacy-policy/`, `/terms/` (P1, real entries — not a footnote); `/resources/what-is-geo/`, `/resources/what-is-aeo/`, `/resources/what-is-ai-overviews-optimization/` (glossary, P2–P3); `/vs/{competitor-slug}/` (competitor comparison, gated by real demand per Rule 5) |
| **Unchanged** | Everything else — hair restoration as the P1 lead specialty, the healthcare pillar, dermatology/plastic surgery as next-softest, dental deferred to P2 (needs authority first), the geographic expansion gate (state-wise, trigger-based, not now) |

**Navigation IA — still an open decision, not yet made.** The challenge review correctly flagged that clean URLs aren't the same as a defined nav menu. Before Phase 1 component work: decide what's under Services ▾, what's under Industries ▾, what stays flat in the header. Not resolved by this lock — a small, fast decision to make at the start of Phase 3 (Header & Footer) in §10, not before.

---

## 3. Homepage Scope

**Locked change: sections 2 and 7 from the original table are merged.** A fast specialty-recognition strip and a deeper "Industries We Serve" were doing adjacent jobs — that's redundancy dressed up as a distinction. One section now, shallow-to-deep on interaction.

| # | Section | Purpose | Conversion goal | SEO value | Motion |
|---|---|---|---|---|---|
| 1 | **Hero** | Thesis: "healthcare-only," not generalist | Hook | Primary H1 target | The one signature moment (see §7 — still being defined, see open items) |
| 2 | **Specialty recognition** *(merged)* | Fast ID, then deepens per-specialty on interaction with a one-line value prop + link | Reduces bounce; internal links to every specialty hub | High — internal-linking backbone | Staggered reveal, expand-on-interaction |
| 3 | **Honest proof spotlight** | Kaja Hair Studio, presented with full confidence | Builds trust harder than generic trust bands | Feeds the case-study page | The real signature moment |
| 4 | **Why Boost Web Digital** | Differentiators + the confident exclusion statement (§1) | Objection handling | E-E-A-T | Restrained |
| 5 | **Featured Services** | SEO / AI Search / Web Design / Google Ads → `/services/` | Internal linking equity | Pages an LLM cites | Card hover depth |
| 6 | **Our Process** *(conditional)* | Only if a real, distinct process exists — cut entirely rather than fabricate a generic 3-step | Reduces perceived risk | Minor | Genuine scroll sequence, if real |
| 7 | **FAQ** | Objection handling, visitor's own language | Conversion + `FAQPage` schema | Direct AEO value | Accordion, no motion needed |
| 8 | **Final CTA** | Closing statement | Primary conversion moment | — | Confident, minimal |
| 9 | **Premium Footer** | Utility + secondary trust | Secondary CTA, sitewide nav | Internal linking | None |

**Still deferred, stated not dropped:** Testimonials and a blog/resources preview (no real content yet — see the honesty rule), a homepage pricing teaser (page doesn't exist yet at P1).

---

## 4. URL Structure

Governed by [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md) — see §2 above for what changed. Categories, blog taxonomy-not-in-URL, and the location/tools future-expansion notes are unchanged from the original pass.

---

## 5. Component Inventory

Unchanged list from the original pass (Primitives, Layout, Navigation incl. `Breadcrumbs`, Cards, Proof, Content, Forms, Feedback, Motion primitives, SEO support — see [09-COMPONENTS.md](09-COMPONENTS.md) once it's corrected in Phase 1). One addition: a **`ComparisonTable`** component for the future `/vs/{competitor}/` pages (§2) — not built now, named so it isn't forgotten when that phase arrives.

---

## 6. Design System Scope

Most of the system is locked in [12-DESIGN-STANDARDS.md](12-DESIGN-STANDARDS.md) — unchanged. **One item is explicitly NOT resolved by this lock:** the visual-differentiation gap the challenge review raised (dark + glass + editorial risks reading as "the current genre of premium agency site," not distinctly Boost Web Digital). That needs a real design-exploration pass — brainstorm, critique, revise — not a decision invented inside a planning lock-down. See "Open items" at the end.

Photography/illustration system for honesty-constrained specialties, empty-state and form-state visual language — unchanged, still to be defined in Phase 1.

---

## 7. Motion System Scope

Tool-assignment table is unchanged from the original pass (Framer Motion default; GSAP + ScrollTrigger for pinned/scrubbed/horizontal-scroll sequences; Three.js/R3F only if a section is genuinely 3D). Two additions from the review, now locked:

- **Where to avoid animation entirely:** FAQ accordion body copy, case-study/proof text, and — most importantly — **form fields and the submission flow.** Motion competing with dense reading content hurts comprehension; motion friction at the exact moment someone submits a lead form is the worst place for it.
- **One true signature, not one per section.** The brief's own wording ("every section should feel unique") taken literally produces a busy, AI-generated-feeling page. Locked interpretation: one real signature moment (Hero or the proof spotlight), quieter tasteful *variation* elsewhere — not full reinvention every scroll stop.

---

## 8. SEO Roadmap

Full detail and the new timeline-honesty section live in [06-SEO.md](06-SEO.md). Locked additions:

- **Timeline expectations rewritten to be honest**: long-tail/specialty/glossary content wins first; head-term competition against funded incumbents (Cardinal, Thrive, First Page Sage) is a multi-year game, not a 6–12 month one. Report progress against that reality.
- **The 54-agency SERP-validation claim is flagged as directionally sound but empirically unverified** — see "Open items."
- **Pricing transparency moved up** — no longer strictly P2-only; consider a minimal pricing signal (even a range statement) as part of Phase 1, not deferred until the full `/pricing/` page is built.

---

## 9. Technical Architecture

Full detail in [07-ARCHITECTURE.md](07-ARCHITECTURE.md), updated post-review:

- **Vercel Pro from Phase 1 launch**, not deferred to "first paying client" — this is real revenue infrastructure, treated as a business-continuity cost.
- **Lead persistence added**: contact-form submissions write to a queryable store (sheet/lightweight CRM via n8n), not email-only.
- **Explicit performance budget defined**: Lighthouse ≥ 90 mobile before merging any GSAP/Three.js-heavy section, LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1, no more than one heavy animation library per page.
- WPGraphQL-over-REST and deferring WordPress CMS integration until a real content hire exists — unchanged from the original review.

---

## 10. Project Roadmap

Phases unchanged in structure from [10-ROADMAP.md](10-ROADMAP.md), with the pre-launch gate now a real checklist (accessibility audit, cross-device/browser QA, Lighthouse gate, legal pages live, domain-cutover plan documented, GA4 event plan defined) rather than a note — see that file for the full checklist. Phase 1 (Foundation) now explicitly includes `/privacy-policy/` and `/terms/` as real deliverables, not optional.

**What Phase 1 actually starts with**, unchanged from before this review: rebuild `/`, `/about/`, `/team/`, `/contact/`, `/case-studies/` hub — now joined by `/privacy-policy/` and `/terms/`.

---

## Open items — not resolved by locking this blueprint

Locking the plan closes the *planning* phase. It doesn't manufacture answers to two things that need actual follow-up work, not a documentation edit:

1. **Visual differentiation motif.** The design system is execution-ready; the *direction* isn't yet subject-distinctive. This needs a dedicated design-exploration pass (brainstorm, critique, revise — per the `frontend-design` skill's own process) before Phase 3–4 component/homepage work starts. Don't build components against "dark + glass + editorial" as if that alone answers the differentiation question.
2. **SERP-validation verification.** The URL architecture's core competitive claim hasn't been independently re-checked. Run the installed `seo-cluster` skill for a live SERP-overlap validation before treating the P1 priorities as fully confirmed — directionally trustworthy in the meantime, not yet proven.

Everything else raised in the challenge review has a locked resolution above and in the per-topic docs it points to.
