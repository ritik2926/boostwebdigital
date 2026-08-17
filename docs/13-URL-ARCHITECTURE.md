# URL Architecture

Boost Web Digital — Healthcare Digital Marketing Agency · locked structure, sourced July 2026.
Pattern validated against 54 ranking agencies and 10 commercial SERPs. Priorities: **P1** = months 1–2 · **P2** = 3–5 · **P3** = 6–9 · **P4** = 9–12.

This is the binding sitemap/IA reference for the site. Read it before creating any new route — page hierarchy, heading structure (H1 = primary target keyword), and internal linking should all derive from here, not be decided ad hoc per page.

## Honesty gate — read before building any specialty or case-study page

Per the honesty hard rule in [CLAUDE.md](../CLAUDE.md): **Kaja Hair Studio (hair restoration) is the only vertical with a real, nameable result behind it.** Every other specialty hub below (dermatology, plastic surgery, med spa, dental, orthodontist, chiropractic, mental health) is aspirational positioning until a real client exists in that vertical.

Concretely:
- Specialty **hub** and **service-spoke** pages (marketing/SEO/ads/web-design explainer pages) can be built for any specialty at any time — they describe *what Boost Web Digital offers*, not a client result, so they don't trigger the honesty rule.
- Specialty **case-study** pages (`/case-studies/{specialty}-{service}-{result}/`) may only be built and published once a real result exists for that specialty. The slug can be reserved here for planning purposes; the page itself stays unbuilt until it's true.
- Today, that means `/case-studies/hair-restoration-...` is the only case-study slug allowed to go live near-term — pending Ritik supplying the actual metric/result to cite. Every other specialty's case-study slug is a placeholder for later, not a build target now.

## The Five Rules

1. **Money pages live at most TWO levels deep.** Three-level money URLs (`/industries/healthcare/dentists/`) appeared zero times across every SERP analyzed.
2. **Specialty hubs sit at ROOT** (`/dental-marketing/`) because "{specialty} marketing" is its own head term. Hierarchy is expressed through breadcrumbs + internal links, not URL depth.
3. **One slug formula per page type, enforced in writing.** Slug drift is the #1 equity leak observed in every competitor teardown (Cardinal, Thrive, First Page Sage).
4. **Service children carry the qualified keyword slug** (`/dental-marketing/dental-seo/`) — the slug self-describes in SERP display, copied links, and LLM retrieval. Pattern of Lasso MD, Practis, Cardinal.
5. **A page is built only when its query has standalone demand** and you have specialty-specific substance. Empty matrix cells stay unbuilt.

## Slug Formulas (governance)

| Page type | Formula | Example |
|---|---|---|
| Vertical pillar | `/{vertical}-marketing/` | `/healthcare-marketing/` |
| Vertical × service | `/{vertical}-marketing/{vertical}-{service}/` | `/healthcare-marketing/healthcare-seo/` |
| Specialty hub | `/{specialty}-marketing/` | `/dental-marketing/` |
| Specialty × SEO | `/{specialty}-marketing/{specialty}-seo/` | `/dental-marketing/dental-seo/` |
| Specialty × Google Ads | `/{specialty}-marketing/google-ads-for-{plural}/` | `/dental-marketing/google-ads-for-dentists/` |
| Specialty × Web design | `/{specialty}-marketing/{specialty}-website-design/` | `/dental-marketing/dental-website-design/` |
| Specialty × other service | `/{specialty}-marketing/{service}-for-{plural}/` | `/dental-marketing/ai-chatbots-for-dentists/` |
| Generic service pillar | `/services/{service}/` | `/services/seo/` |
| Generic sub-service | `/services/{pillar}/{sub-service}/` | `/services/seo/technical-seo/` |
| Blog post | `/blog/{slug}/` (category = taxonomy, never in URL) | `/blog/dental-seo-cost/` |
| Case study | `/case-studies/{specialty}-{service}-{result}/` | `/case-studies/dental-seo-3x-patients/` |
| Resource / guide | `/resources/{asset}/` (+ `/{chapter}/`) | `/resources/dental-seo-guide/` |
| Glossary / definition | `/resources/what-is-{term}/` | `/resources/what-is-geo/` |
| Competitor comparison | `/vs/{competitor-slug}/` | `/vs/cardinal-digital-marketing/` |
| Legal | `/{page}/` | `/privacy-policy/` |

## Complete URL Structure

### 1 · Core & trust pages

| URL | Primary target / role | Pri |
|---|---|---|
| `/` | healthcare marketing agency + brand (homepage SERP — healthcare-first positioning) | P1 |
| `/about/` | agency story, E-E-A-T | P1 |
| `/team/` | bios with Person schema — authors for all content | P1 |
| `/contact/` | conversion endpoint for every CTA | P1 |
| `/pricing/` | transparent ranges — conversion + AI-citation differentiator | P2 |
| `/case-studies/` | proof hub, filterable by specialty + service | P1 |
| `/privacy-policy/` | legal requirement — GA4 sets cookies, this can't be a footnote | P1 |
| `/terms/` | legal requirement | P1 |

### 2 · Healthcare vertical pillar + children

| URL | Primary target | Pri |
|---|---|---|
| `/healthcare-marketing/` | healthcare digital marketing, healthcare marketing services | P1 |
| `/healthcare-marketing/healthcare-seo/` | healthcare SEO + medical SEO (one page — same intent) | P1 |
| `/healthcare-marketing/healthcare-web-design/` | healthcare website design | P1 |
| `/healthcare-marketing/healthcare-google-ads/` | healthcare google ads, medical PPC | P1 |
| `/healthcare-marketing/healthcare-local-seo/` | healthcare local SEO | P2 |
| `/healthcare-marketing/healthcare-ai-automation/` | healthcare AI automation + AI chatbots | P2 |
| `/healthcare-marketing/healthcare-content-marketing/` | healthcare content marketing | P3 |
| `/healthcare-marketing/healthcare-social-media/` | healthcare social media marketing | P3 |
| `/healthcare-marketing/healthcare-reputation-management/` | healthcare reputation management | P3 |

### 3 · Specialty hubs + service spokes (money layer)

**Hair restoration is the P1 lead specialty** — not because of SERP softness like the others, but because it's the one vertical with a real, nameable result (Kaja Hair Studio) ready to back the claims on these pages immediately. See the honesty gate above.

| URL | Primary target | Pri |
|---|---|---|
| `/hair-restoration-marketing/` | hair restoration marketing, hair transplant marketing (one page — same intent) — **real case study available** | P1 |
| `/hair-restoration-marketing/hair-restoration-seo/` | hair restoration SEO + hair transplant SEO (one page — same intent) | P1 |
| `/hair-restoration-marketing/google-ads-for-hair-restoration-clinics/` | google ads for hair transplant / hair restoration clinics | P2 |
| `/hair-restoration-marketing/hair-restoration-website-design/` | hair restoration / hair transplant clinic website design | P2 |
| `/dermatology-marketing/` | dermatology marketing (softest SERP among aspirational verticals — build early) | P1 |
| `/dermatology-marketing/dermatology-seo/` | SEO for dermatologists | P1 |
| `/dermatology-marketing/google-ads-for-dermatologists/` | google ads for dermatologists | P2 |
| `/dermatology-marketing/dermatology-website-design/` | dermatology website design | P2 |
| `/plastic-surgery-marketing/` | plastic surgery marketing | P1 |
| `/plastic-surgery-marketing/plastic-surgery-seo/` | SEO for plastic surgeons | P1 |
| `/plastic-surgery-marketing/google-ads-for-plastic-surgeons/` | plastic surgery advertising / PPC | P2 |
| `/plastic-surgery-marketing/plastic-surgery-website-design/` | plastic surgery website design | P2 |
| `/med-spa-marketing/` | med spa marketing | P2 |
| `/med-spa-marketing/med-spa-seo/` | med spa SEO | P2 |
| `/med-spa-marketing/google-ads-for-med-spas/` | med spa advertising | P3 |
| `/dental-marketing/` | dental marketing agency, dentist marketing (hardest — needs authority first) | P2 |
| `/dental-marketing/dental-seo/` | dental SEO + dentist SEO + SEO for dentists (one page) | P2 |
| `/dental-marketing/google-ads-for-dentists/` | google ads for dentists, dental PPC | P2 |
| `/dental-marketing/dental-website-design/` | dental website design | P3 |
| `/dental-marketing/social-media-for-dentists/` | social media marketing for dentists | P3 |
| `/dental-marketing/ai-chatbots-for-dentists/` | AI chatbot for dental office | P3 |
| `/dental-marketing/dental-reputation-management/` | dentist reputation management | P4 |
| `/orthodontist-marketing/` | orthodontic marketing | P3 |
| `/orthodontist-marketing/orthodontist-seo/` | orthodontist SEO, SEO for orthodontists | P3 |
| `/orthodontist-marketing/google-ads-for-orthodontists/` | orthodontist advertising | P4 |
| `/chiropractic-marketing/` | chiropractic marketing | P4 |
| `/chiropractic-marketing/chiropractor-seo/` | SEO for chiropractors | P4 |
| `/mental-health-marketing/` | mental health marketing (therapists, clinics) | P4 |

### 4 · Generic services layer (conversion + AI-citation role, not primary rankers)

**Flagged conflict (2026-08-15):** the homepage Services section (`docs/11-HOMEPAGE.md`) was built with different, healthcare-prefixed hrefs for three of these — `/ai-visibility-geo/` (not `/services/ai-search-optimization/`), `/healthcare-reputation-management/` (not `/services/reputation-management/`), and one combined `/healthcare-paid-search/` (not separate `/services/google-ads/` + `/services/meta-ads/`). Supplied as "just reference for where this redirects," so used as-is on the homepage rather than silently swapped to match this doc — needs a deliberate reconciliation pass (pick one pattern) before either set of pages actually gets built.

| URL | Notes | Pri |
|---|---|---|
| `/services/` | capability hub | P1 |
| `/services/seo/` | pillar — absorbs on-page, off-page, keyword research, entity SEO | P1 |
| `/services/seo/local-seo/` | absorbs Google Business Profile optimization | P2 |
| `/services/seo/technical-seo/` | absorbs schema markup, Core Web Vitals, site speed | P2 |
| `/services/seo/link-building/` | absorbs digital PR (split later if demand justifies) | P3 |
| `/services/seo/seo-audit/` | high commercial intent — audits are a foot-in-door offer | P2 |
| `/services/seo/seo-content-writing/` | | P3 |
| `/services/seo/programmatic-seo/` | ties directly to this site's own hub-and-spoke build pattern — legitimately on-brand, unlike the cut generalist pages below | P4 |
| `/services/seo/wordpress-seo/` | | P3 |

**Cut post-review (2026):** `/services/seo/ecommerce-seo/`, `/services/seo/enterprise-seo/`, `/services/seo/international-seo/`, `/services/seo/shopify-seo/` — generalist-agency filler that contradicted the site's own "healthcare specialist, not generalist agency" positioning. See [00-PROJECT-BLUEPRINT.md](00-PROJECT-BLUEPRINT.md). Don't re-add without a specific healthcare-specific reframing and a real reason.
| `/services/ai-search-optimization/` | pillar — targets AI SEO + AI search optimization (one intent) | P1 |
| `/services/ai-search-optimization/answer-engine-optimization/` | AEO | P2 |
| `/services/ai-search-optimization/generative-engine-optimization/` | GEO — covers Gemini + Perplexity until demand splits | P2 |
| `/services/ai-search-optimization/google-ai-overviews/` | Google AI Overviews optimization | P3 |
| `/services/ai-search-optimization/chatgpt-visibility/` | ChatGPT visibility optimization | P3 |
| `/services/web-design/` | pillar | P1 |
| `/services/web-design/wordpress-development/` | | P3 |
| `/services/web-design/shopify-development/` | | P4 |
| `/services/google-ads/` | | P1 |
| `/services/meta-ads/` | | P3 |
| `/services/social-media-marketing/` | | P3 |
| `/services/content-marketing/` | | P3 |
| `/services/ai-automation/` | | P2 |
| `/services/ai-chatbots/` | | P3 |
| `/services/conversion-rate-optimization/` | | P4 |
| `/services/reputation-management/` | | P4 |

### 5 · Content, proof & citation layer

| URL | Role | Pri |
|---|---|---|
| `/blog/{slug}/` | cluster posts — each supports exactly ONE money page; category as taxonomy, not in URL | P1+ |
| `/blog/best-dental-marketing-agencies/` | own the listicle SERPs + primary LLM-recommendation vector | P2 |
| `/blog/best-healthcare-seo-agencies/` | same — listicle SERP + LLM citation | P2 |
| `/blog/best-plastic-surgery-marketing-agencies/` | same — listicle SERP + LLM citation | P3 |
| `/blog/best-med-spa-marketing-agencies/` | same — listicle SERP + LLM citation | P3 |
| `/blog/best-dermatology-marketing-agencies/` | same — listicle SERP + LLM citation | P3 |
| `/resources/` | hub | P2 |
| `/resources/healthcare-marketing-statistics/` | THE citation magnet — journalists + Perplexity/AI Overviews; update quarterly | P2 |
| `/resources/dental-marketing-statistics/` | specialty citation magnet | P3 |
| `/resources/dental-seo-guide/` (+ chapters) | chaptered guide hub — deepest topical asset | P3 |
| `/resources/healthcare-seo-checklist/` | lead magnet | P3 |
| `/case-studies/{specialty}-{service}-{result}/` | each links to its specialty hub + the service spoke it proves — **honesty gate applies, see top of doc** | P2+ |

### 5b · Glossary & competitor comparison (added post-review)

**Glossary/definitions** — cheap, high AI-citation value, directly proves the agency practices the AI-search optimization it sells. Higher priority than most of the P3/P4 resources above.

| URL | Primary target | Pri |
|---|---|---|
| `/resources/what-is-geo/` | what is GEO / generative engine optimization | P2 |
| `/resources/what-is-aeo/` | what is AEO / answer engine optimization | P2 |
| `/resources/what-is-ai-overviews-optimization/` | what is AI Overviews optimization | P3 |

**Competitor comparison** — high-commercial-intent B2B searches this site didn't previously target. Gated by Rule 5 same as everything else: only build a `/vs/{competitor}/` page once a specific competitor + real search demand is confirmed (use the `seo-competitor-pages` skill when this phase starts). No named competitor pages exist yet — this reserves the pattern, not a build order.

### 6 · Vertical expansion template (year 2+)

Replicate the identical pattern per vertical — zero restructuring. Gate: a new vertical opens only after the previous one has pillar + ≥3 specialty hubs + ≥12 spokes + ≥15 supporting posts + ≥3 case studies + 1 statistics page.

| Vertical | Pillar | Example specialty hub | Example spoke |
|---|---|---|---|
| Legal | `/legal-marketing/` | `/personal-injury-marketing/` | `/personal-injury-marketing/personal-injury-seo/` |
| Finance | `/financial-services-marketing/` | `/accounting-firm-marketing/` | `/accounting-firm-marketing/accounting-firm-seo/` |
| SaaS | `/saas-marketing/` | `/fintech-saas-marketing/` | `/saas-marketing/saas-seo/` |
| Home Services | `/home-services-marketing/` | `/hvac-marketing/` | `/hvac-marketing/hvac-seo/` |
| Real Estate | `/real-estate-marketing/` | `/realtor-marketing/` | `/real-estate-marketing/real-estate-seo/` |
| Manufacturing | `/manufacturing-marketing/` | `/industrial-marketing/` | `/manufacturing-marketing/manufacturing-seo/` |

This layer is explicitly out of scope until healthcare is fully built out per the gate above — don't start scaffolding these routes early.

## Internal linking (one-line reference)

Hub → all spokes (varied anchors) · spoke → hub + 2–3 siblings + matching `/services/` page + 1 case study · every blog post → exactly ONE money page · `/healthcare-marketing/healthcare-seo/` → every specialty SEO spoke (column linking) · breadcrumbs with `BreadcrumbList` schema: Home → Healthcare Marketing → Dental Marketing → Dental SEO · verticals never cross-link each other's spokes.
