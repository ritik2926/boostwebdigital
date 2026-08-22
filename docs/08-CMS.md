# CMS

**Blog posts: implemented (2026-08-22).** Everything else below is still the plan, not yet built — see [10-ROADMAP.md](10-ROADMAP.md).

## What's live

WordPress runs headless on `blog.boostwebdigital.com` (Hostinger), consumed via its REST API (`WP_API_URL` in `.env.local`). Ritik publishes posts in the normal WordPress editor; nothing about the Next.js frontend needs touching for a new post to appear — it's live on `/blogs/` and `/blog/<slug>/` as soon as it's published (or immediately, once `POST /api/revalidate?secret=...` is wired to a WordPress webhook).

The adapter lives at `src/lib/blog/wordpress.ts`, behind the same `src/lib/blog/source.ts` seam the old local-MDX system used — every consumer (`/blogs/`, `/blog/[slug]/`, `sitemap.ts`) is unaware of where the data actually comes from.

**Field mapping** (WordPress → this site):

| Field | Source |
|---|---|
| Title, excerpt, body | `title.rendered` / `excerpt.rendered` / `content.rendered`, HTML-entity-decoded |
| Category | First term on the `category` taxonomy (`_embedded['wp:term']`) — **only one**, see the gap below |
| Tags | All `post_tag` terms |
| Featured image | `_embedded['wp:featuredmedia']` — falls back to a generated title-card SVG when absent |
| Author name | `_embedded.author[0].name` |
| Author role/photo | WordPress has no field for either — falls back to the real site facts (`Founder`, `/images/ritik-malhotra.webp`) for Ritik specifically; an unrecognized author name renders as "Contributor" with WordPress's own Gravatar |
| SEO title/description/noindex | Yoast's `yoast_head_json` (`title`, `description`, `robots.index`) |
| Table of contents | Computed server-side from the post's own `h2`/`h3` tags (`src/lib/blog/headings.ts`) — WordPress carries no TOC field |

**Known gaps** (no WordPress field exists yet for these — the site falls back gracefully, doesn't break):

- **Multiple categories per post** — the site's `BlogPost` type only carries one category (used across `BlogCard`, `FeatureCard`, `CategoryStrip`, `PostThumbnail`); a post in two categories only shows/filters under the first. Fixing this for real means widening that type and its component call sites — a deliberate follow-up, not done as a side effect of the WordPress swap.
- **Per-post CTA override / manual "related posts"** — no ACF (Advanced Custom Fields) plugin is installed on the WordPress side, so every post uses the sitewide default CTA and same-category-based related posts. Add ACF fields matching `BlogPost.cta`/`relatedSlugs` (see `src/lib/blog/types.ts`) if per-post control is ever needed.
- **Rich content blocks** (stat callouts, pull quotes, inline CTA cards) — the old MDX system had custom components for these; WordPress has no equivalent block, so that content now renders as plain paragraphs/blockquotes. Revisit only if a specific post needs one of these back — see the visual-regression note in the 2026-08-22 swap's report.

## Still to do

- Service pages, categories/redirects beyond blog, and letting a future content hire manage more than posts
- A real webhook from WordPress's publish action to `/api/revalidate` (the route exists; nothing calls it yet)
