import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/source";

const SITE_URL = "https://boostwebdigital.com";

/**
 * Update the date when you meaningfully change a page. A stale date here is
 * better than a wrong one.
 *
 * Previously a single frozen constant shared by every URL — Google only
 * trusts lastmod when it's demonstrably accurate, and one identical
 * never-moving date across eight unrelated pages teaches it to discard the
 * field. Deliberately not derived from git or file mtime: mtime is wrong
 * after a fresh clone, and a git call at build time is complexity this
 * doesn't need.
 */
const PAGE_DATES: Record<string, string> = {
  "/": "2026-08-22",
  "/about/": "2026-08-22",
  "/contact/": "2026-08-22",
  "/blogs/": "2026-08-22",
  "/pricing/": "2026-08-22",
  "/services/": "2026-08-22",
  "/faq/": "2026-08-22",
};

/**
 * Homepage, /about/, /contact/, /blogs/ (+ every post at /blog/<slug>/),
 * /pricing/, /services/ (the generic services hub — its child pillar
 * pages below are still unbuilt), and /faq/ are live today. `/blog/` itself
 * is a 301 redirect to /blogs/ (next.config.ts) and is deliberately NOT
 * listed here — a redirecting URL in a sitemap is a Search Console warning.
 * `/design-lab` is excluded from production entirely (see its page.tsx),
 * `/api/contact/` is a route handler not a page, and the five legal pages
 * (/terms/, /privacy/, /refund-policy/, /disclaimer/, /cookie-policy/)
 * carry `robots: { index: false }` in their own metadata — all deliberately
 * excluded here, since submitting a noindex URL in a sitemap is itself a
 * Search Console warning ("Submitted URL marked noindex"). Blog post
 * entries are generated from getAllSlugs() via getAllPosts(), so a new post
 * appears here automatically the day it's added to content/blog/ — nothing
 * to hand-maintain for those.
 *
 * Planned routes (not yet built — do not add until the page exists), per
 * docs/13-URL-ARCHITECTURE.md:
 *
 * Core & trust: /team/ /case-studies/
 * Healthcare vertical pillar: /healthcare-marketing/ and its
 *   /healthcare-marketing/{healthcare-seo,healthcare-web-design,
 *   healthcare-google-ads,healthcare-local-seo,healthcare-ai-automation,
 *   healthcare-content-marketing,healthcare-social-media,
 *   healthcare-reputation-management}/ children
 * Specialty hubs + spokes: /hair-restoration-marketing/ (P1, real case
 *   study), /dermatology-marketing/, /plastic-surgery-marketing/,
 *   /med-spa-marketing/, /dental-marketing/, /orthodontist-marketing/,
 *   /chiropractic-marketing/, /mental-health-marketing/ — each with its own
 *   -seo/, google-ads-for-.../, -website-design/ spokes per the slug
 *   formulas table
 * Generic services layer children (hub itself is live — see above): seo/,
 *   ai-search-optimization/, web-design/, google-ads/, meta-ads/,
 *   social-media-marketing/, content-marketing/, ai-automation/,
 *   ai-chatbots/, conversion-rate-optimization/, reputation-management/
 * Content/proof: /resources/, /resources/what-is-{term}/,
 *   /case-studies/{specialty}-{service}-{result}/
 * Comparison: /vs/{competitor}/ — reserved pattern, no pages yet
 *
 * Add each route to this file the same day its page ships, not before.
 *
 * changeFrequency/priority were removed sitewide (2026-08-22) — Google has
 * stated publicly it ignores both, so they were noise in a file whose only
 * job is to declare the indexable URL set.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  // Legal pages are deliberately noindexed and therefore excluded. A
  // noindexed URL must never appear in a sitemap — the two must always agree.
  return [
    { url: SITE_URL, lastModified: PAGE_DATES["/"] },
    { url: `${SITE_URL}/about/`, lastModified: PAGE_DATES["/about/"] },
    { url: `${SITE_URL}/contact/`, lastModified: PAGE_DATES["/contact/"] },
    { url: `${SITE_URL}/blogs/`, lastModified: PAGE_DATES["/blogs/"] },
    { url: `${SITE_URL}/pricing/`, lastModified: PAGE_DATES["/pricing/"] },
    { url: `${SITE_URL}/services/`, lastModified: PAGE_DATES["/services/"] },
    { url: `${SITE_URL}/faq/`, lastModified: PAGE_DATES["/faq/"] },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: post.updatedAt ?? post.publishedAt,
    })),
  ];
}
