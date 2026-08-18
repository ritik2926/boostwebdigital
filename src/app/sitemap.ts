import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/source";

const SITE_URL = "https://boostwebdigital.com";

// Fixed date, not new Date() — update this by hand whenever homepage
// content actually changes. A live timestamp would tell Google the page
// changed on every single build even when nothing did.
const LAST_UPDATED = new Date("2026-08-17");

/**
 * Homepage, /about/, and /blog/ (+ every post) are live today. `/design-lab`
 * is a `noindex` dev playground and is intentionally excluded — it should
 * never appear here. Blog post entries are generated from getAllSlugs() via
 * getAllPosts(), so a new post appears here automatically the day it's added
 * to content/blog/ — nothing to hand-maintain for those.
 *
 * Planned routes (not yet built — do not add until the page exists), per
 * docs/13-URL-ARCHITECTURE.md:
 *
 * Core & trust: /team/ /contact/ /pricing/ /case-studies/
 *   /privacy-policy/ /terms/
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
 * Generic services layer: /services/ and its seo/, ai-search-optimization/,
 *   web-design/, google-ads/, meta-ads/, social-media-marketing/,
 *   content-marketing/, ai-automation/, ai-chatbots/,
 *   conversion-rate-optimization/, reputation-management/ children
 * Content/proof: /resources/, /resources/what-is-{term}/,
 *   /case-studies/{specialty}-{service}-{result}/
 * Comparison: /vs/{competitor}/ — reserved pattern, no pages yet
 *
 * Add each route to this file the same day its page ships, not before.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    {
      url: SITE_URL,
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
