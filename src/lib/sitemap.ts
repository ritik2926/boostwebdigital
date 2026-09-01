import { getAllPosts } from "@/lib/blog/source";

export const SITE_URL = "https://boostwebdigital.com";

export interface SitemapUrlEntry {
  url: string;
  lastModified: string;
}

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
  "/ai-visibility-geo/": "2026-08-25",
  "/tools/ai-visibility-checker/": "2026-09-01",
};

/**
 * Homepage, /about/, /contact/, /blogs/, /pricing/, /services/ (the
 * generic services hub — its child pillar pages below are still unbuilt
 * except /ai-visibility-geo/, now live), /faq/, /ai-visibility-geo/, and
 * /tools/ai-visibility-checker/ are live today. `/blog/` itself is a 301 redirect to /blogs/
 * (next.config.ts) and is deliberately NOT listed here — a redirecting URL
 * in a sitemap is a Search Console warning. `/design-lab` is excluded from
 * production entirely (see its page.tsx), `/api/contact/` is a route
 * handler not a page, and the five legal pages (/terms/, /privacy/,
 * /refund-policy/, /disclaimer/, /cookie-policy/) carry
 * `robots: { index: false }` in their own metadata — all deliberately
 * excluded here, since submitting a noindex URL in a sitemap is itself a
 * Search Console warning ("Submitted URL marked noindex").
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
 * Generic services layer children (hub + /ai-visibility-geo/ are live —
 *   see above): seo/, web-design/, google-ads/, meta-ads/,
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
export function getStaticPageEntries(): SitemapUrlEntry[] {
  return [
    { url: SITE_URL, lastModified: PAGE_DATES["/"] },
    { url: `${SITE_URL}/about/`, lastModified: PAGE_DATES["/about/"] },
    { url: `${SITE_URL}/contact/`, lastModified: PAGE_DATES["/contact/"] },
    { url: `${SITE_URL}/blogs/`, lastModified: PAGE_DATES["/blogs/"] },
    { url: `${SITE_URL}/pricing/`, lastModified: PAGE_DATES["/pricing/"] },
    { url: `${SITE_URL}/services/`, lastModified: PAGE_DATES["/services/"] },
    { url: `${SITE_URL}/faq/`, lastModified: PAGE_DATES["/faq/"] },
    { url: `${SITE_URL}/ai-visibility-geo/`, lastModified: PAGE_DATES["/ai-visibility-geo/"] },
    { url: `${SITE_URL}/tools/ai-visibility-checker/`, lastModified: PAGE_DATES["/tools/ai-visibility-checker/"] },
  ];
}

/** Blog post entries are generated from getAllPosts(), so a new post
 * appears here automatically the day it's published — nothing to
 * hand-maintain for those. */
export async function getPostSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: post.updatedAt ?? post.publishedAt,
  }));
}

/** The newest lastmod among a set of entries, returned as its original
 * string (never reformatted) — used for a sitemap index's per-child
 * <lastmod>. Falls back to today's date if the set is ever empty, so the
 * index always has a valid, well-formed lastmod. */
export function getNewestLastMod(entries: SitemapUrlEntry[]): string {
  if (entries.length === 0) return new Date().toISOString();
  return entries.reduce((newest, entry) =>
    new Date(entry.lastModified).getTime() > new Date(newest.lastModified).getTime() ? entry : newest
  ).lastModified;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const XML_STYLESHEET_PI = `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>`;

export function renderUrlset(entries: SitemapUrlEntry[]): string {
  const urls = entries
    .map((e) => `  <url>\n    <loc>${escapeXml(e.url)}</loc>\n    <lastmod>${escapeXml(e.lastModified)}</lastmod>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n${XML_STYLESHEET_PI}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderSitemapIndex(entries: SitemapUrlEntry[]): string {
  const sitemaps = entries
    .map((e) => `  <sitemap>\n    <loc>${escapeXml(e.url)}</loc>\n    <lastmod>${escapeXml(e.lastModified)}</lastmod>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n${XML_STYLESHEET_PI}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`;
}
