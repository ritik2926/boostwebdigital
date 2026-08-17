# Architecture

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS v4
- **Hosting:** Vercel Pro (~$20/mo) **from Phase 1 launch**, not deferred to "first paying client." Revised post-review: this site is the revenue-generating asset of a real business, not a side project — running it on Hobby's non-commercial tier risks an account flag/suspension at exactly the worst moment (mid-ranking-sensitive period, or a lead converting). Treat the $20/mo as a business-continuity cost, not a luxury.
- **Lead persistence:** the contact form (React Hook Form + Zod + Resend + n8n, see [10-ROADMAP.md](10-ROADMAP.md)) must write submissions to a queryable store (a simple sheet/lightweight CRM via the same n8n workflow), not just fire an email notification. An email-only pipeline means a lead's only record is an inbox — a missed or filtered email shouldn't mean a lost lead.

## Performance budget

Concrete gate, not just "keep CWV high" as a sentiment — needed now that [CLAUDE.md](../CLAUDE.md)'s tooling is open (Framer Motion/GSAP/Three.js/WebGL) so "open" doesn't quietly become "unbounded":

- Lighthouse Performance ≥ 90 (mobile) before merging any section that adds GSAP or a Three.js/WebGL scene
- Core Web Vitals field targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- No more than one heavy animation library (GSAP or Three.js) loaded on a single page at a time — if a page seems to need both, that's a signal to simplify the page, not to ship both bundles
- **Domain:** stays at Hostinger (boostwebdigital.com), DNS pointed at Vercel
- **WordPress:** stays on Hostinger, headless, connected via REST API — not yet implemented (see [08-CMS.md](08-CMS.md))

## Portability rule

Avoid Vercel-locked features: Vercel Blob, KV, Postgres, Cron Jobs, `@vercel/og`, Edge Runtime middleware. The goal is that migrating to another Node host later requires close to zero code changes.

## Rejected, with reasons

- **Hostinger Business hosting** — unnecessary cost; Vercel Hobby/Pro already covers everything needed
- **Static export** — breaks at scale, blocks redirects and previews needed once the CMS and dynamic routes exist
