# SEO

Not yet implemented — this is Phase 4 (see [10-ROADMAP.md](10-ROADMAP.md)). SEO is architecture, not an afterthought bolted on before launch.

**The full sitemap, slug formulas, per-page target keywords, and build priorities live in [13-URL-ARCHITECTURE.md](13-URL-ARCHITECTURE.md)** — read that before creating any route. This file covers the technical implementation layer (metadata, schema, sitemap generation); that one covers *which pages exist and why*.

## Dedicated SEO skills/agents

A full SEO skill/agent set is installed (seo-audit, seo-technical, seo-schema, seo-sitemap, seo-cluster, seo-content, seo-content-brief, seo-geo, seo-page, seo-plan, seo-google, seo-images, seo-performance, seo-unlighthouse, and more) — use them directly for audits, schema generation, sitemap validation, content-quality/E-E-A-T review, and AI-search (GEO) optimization, rather than reasoning about SEO from scratch.

**Precedence still follows [CLAUDE.md](../CLAUDE.md)'s external-skill rule:** these are execution tools, not a source of new scope decisions. Notably, `seo-local` and `seo-maps` analyze local-SEO signals (GBP, NAP, geo-grid ranking) that don't apply to Boost Web Digital's own site — this project is national/broad, not location-targeted (see the honesty/scope notes above and in memory). Those two skills stay relevant only if this site ever audits a *client's* local presence as part of a service deliverable, not for Boost Web Digital's own pages.

## Plan

- Semantic HTML throughout (already a constraint on every component, not just future pages)
- Metadata + Open Graph tags per page (Next.js Metadata API)
- Structured data / JSON-LD (Organization, LocalBusiness or ProfessionalService, Service, FAQPage where relevant)
- `sitemap.xml` and `robots.txt` via Next.js conventions
- Internal linking strategy once Services/Blog pages exist
- Topical authority structure for the healthcare verticals
- AI search / GEO optimization (the agency's own specialty — the site should demonstrate it practices what it sells)
- Core Web Vitals as a hard constraint, not a nice-to-have

## Timeline honesty (added post-review)

Head terms like "healthcare marketing agency" or "dental marketing agency" are held by funded, years-old incumbents — some are literally named as competitors in this project's own source research (Cardinal, Thrive, First Page Sage). **A brand-new domain will not out-rank them in months 3–12.** Realistic near-term wins come from long-tail/specialty-specific queries and the glossary/AEO content added in [13-URL-ARCHITECTURE.md §5b](13-URL-ARCHITECTURE.md) — not head-term competition, which is a multi-year game. Report progress against that reality, or early results will look like failure when they're actually on track.

The "validated against 54 ranking agencies and 10 commercial SERPs" claim behind the URL architecture hasn't been independently re-verified — the installed `seo-cluster` skill can do a live SERP-overlap validation pass. Treat the current P1–P4 priorities as directionally sound but not yet empirically confirmed until that run happens.
