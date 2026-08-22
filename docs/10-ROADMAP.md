# Roadmap

## What's actually built and working

- Next.js project (App Router, TypeScript, Tailwind, `src/` dir, Turbopack), Git + GitHub set up
- Light/dark theme system working end-to-end
- Brand accent color and Geist + Fraunces typography wired through Tailwind
- Full homepage: Navbar → Hero → Who We Serve → Why Choose Us (with honest Kaja Hair Studio proof point) → Final CTA → Footer
- Scroll-triggered and staggered entrance animations via Framer Motion throughout
- `about/page.tsx` exists (placeholder-level content)
- Headless WordPress blog (2026-08-22) — `/blogs/` and `/blog/[slug]/` pull live from `blog.boostwebdigital.com`'s REST API via `src/lib/blog/wordpress.ts`; the old local-MDX system (`content/blog/`, `src/lib/blog/local.ts`) is gone. See [08-CMS.md](08-CMS.md) for what's actually wired up vs. still a gap.

## What's not built yet

- `services/page.tsx` and `contact/page.tsx` — **do not exist in the repo yet**, despite earlier notes suggesting they were placeholders already; verify actual repo state before assuming
- The real, locked sitemap is much larger than "Services + Contact" — see [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md) for the full P1–P4 page list (specialty hubs, service spokes, blog, resources, case studies). Phases below should be read against that priority list, not built ad hoc.
- Real content beyond the homepage (About needs real content too)
- Contact form + API route + n8n webhook integration
- SEO metadata, Open Graph, schema/JSON-LD, sitemap
- Deployment to Vercel (not yet deployed live)
- FAQ section
- Real photography/imagery pipeline (using abstract gradient/blur shapes for now, not stock photos or broken placeholders)
- GSAP/ScrollTrigger, Three.js/React Three Fiber — available tools per [05-ANIMATION.md](05-ANIMATION.md), not yet used on the live homepage; introduce when a specific effect calls for it

## Phases

1. **Foundation** — core pages + P1 sitemap per [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md) (including `/privacy-policy/` and `/terms/`, added post-review — not optional launch-day items); premium UI/UX, performance, accessibility, semantic structure — mostly started (see above), not complete
2. **Launch + Index** — deploy to Vercel on the custom domain, connect Google Search Console + GA4, submit the sitemap, begin indexing. Deliberately moved earlier than a "finish everything then launch" order — the site starts accumulating index age/authority while P2–P4 content is still being built.
3. **Expand** — P2–P4 pages per [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md) (remaining specialty hubs/spokes, service pages, blog, topical authority). **State-wise location pages are explicitly deferred out of this phase** — see the gate below.
4. **Headless WordPress CMS** — ✅ done for blog posts (2026-08-22): categories, authors, and SEO fields (via Yoast) are managed inside WordPress, and the Next.js frontend consumes them via REST API — see [08-CMS.md](08-CMS.md) for the current field mapping and known gaps (no CTA/related-post override fields yet — needs an ACF plugin). Still open: service pages, redirects, and anything beyond blog posts.

## Geographic expansion gate (deferred, not a calendar phase)

Confirmed with Ritik: stay national/broad for now (see [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md)'s honesty gate and the SEO scope decision it references). **State-wise** location pages get added only *after* the national P1 pages show real ranking traction — this is a results-based trigger, not something scheduled into Phase 3 by default. Don't build location-based pages, switch any schema to `LocalBusiness`, or add state/city-specific landing pages until that trigger is actually reached. When it is, come back to [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md) to design the state-tier URL pattern before building anything — don't improvise it ad hoc in the moment.

## Pre-launch gate (added post-review — real checklist, not a note)

None of these are optional before Phase 2 (Launch + Index) actually ships:

- [ ] Accessibility audit pass against [12-DESIGN-STANDARDS.md §9](12-DESIGN-STANDARDS.md) (contrast, focus states, `prefers-reduced-motion`, heading order) — not just "the rules exist," an actual pass
- [ ] Cross-device/cross-browser QA, broken-link check, contact-form submission test end-to-end (including the lead-persistence write, see [07-ARCHITECTURE.md](07-ARCHITECTURE.md))
- [ ] Lighthouse Performance ≥ 90 mobile, per the performance budget in [07-ARCHITECTURE.md](07-ARCHITECTURE.md)
- [ ] `/privacy-policy/` and `/terms/` live (GA4 sets cookies — this can't ship without them)
- [ ] Domain cutover plan documented (Hostinger DNS → Vercel) before executing it, not improvised live
- [ ] GA4 event plan defined (form submit, primary CTA click, scroll depth) — decided before traffic starts, not after

## Immediate next steps

1. Verify the latest Navbar + Footer rebuild renders correctly (full-page check)
2. Visual polish pass: spacing rhythm, section-to-section consistency, refine the specialty grid and Why Choose Us visuals against the reference-site quality bar ([04-REFERENCES.md](04-REFERENCES.md))
3. Build out About, Services, Contact pages with the same design language
4. Build the real Contact form (React Hook Form + Zod + Resend) and connect it to n8n, including the lead-persistence write
5. SEO phase: metadata, schema, sitemap
6. Deploy to Vercel Pro (see [07-ARCHITECTURE.md](07-ARCHITECTURE.md) — moved up from Hobby post-review), connect custom domain, run the pre-launch gate above

## Lessons already paid for

See the "Lessons already paid for" section in the root [CLAUDE.md](../CLAUDE.md) — kept there since it applies to every phase, not just this one.
