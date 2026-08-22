import type { BlogPost } from "./types";
import { processContent } from "./headings";
import { decodeHtmlEntities } from "./entities";

/**
 * Headless WordPress adapter — implements the exact same exports as
 * ./local.ts (getAllPosts/getPostBySlug/getAllSlugs/getRelatedPosts), same
 * signatures, same BlogPost shape. See source.ts for the swap point; no
 * consumer of source.ts needed to change for this file to exist.
 */

const WP_API_URL = process.env.WP_API_URL;
const WORDS_PER_MINUTE = 200;
const DEFAULT_IMAGE_WIDTH = 1600;
const DEFAULT_IMAGE_HEIGHT = 900;
const EXCERPT_FALLBACK_WORD_COUNT = 40;

// Ritik Malhotra is the site's one real author; the public WP REST API has
// no field for a job title, and the WP author-archive link WordPress embeds
// (/author/<slug>/) 404s on the front end (see wordpress.ts's schema note
// in page.tsx) — so both fall back to the same facts already used
// everywhere else on the site (PERSON in lib/schema.ts) rather than to
// nothing. A future second author with no entry here still renders
// correctly, just without a role/link — see the report's Q&A for the
// alternative (an ACF field) if a real per-author title is wanted later.
const AUTHOR_FALLBACK: Record<string, { role: string; url: string; avatar: string }> = {
  "Ritik Malhotra": { role: "Founder", url: "/about/", avatar: "/images/ritik-malhotra.webp" },
};

interface WPTerm {
  name: string;
  slug: string;
  taxonomy: string;
}

interface WPMedia {
  source_url: string;
  alt_text: string;
  media_details?: { width?: number; height?: number };
}

interface WPAuthorEmbed {
  name: string;
  avatar_urls?: Record<string, string>;
}

interface WPYoastRobots {
  index?: string;
  follow?: string;
}

interface WPYoastHead {
  title?: string;
  description?: string;
  robots?: WPYoastRobots;
}

interface WPPost {
  slug: string;
  date_gmt: string;
  modified_gmt: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: WPYoastHead;
  _embedded?: {
    author?: WPAuthorEmbed[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** WordPress tables/code blocks have no scroll container of their own —
 * without one, a wide table blows out the article's fixed-width column
 * instead of scrolling inside itself (checked at 360px). */
function wrapScrollableBlocks(html: string): string {
  return html
    .replace(/<table(\s[^>]*)?>/gi, '<div class="wp-scroll-x"><table$1>')
    .replace(/<\/table>/gi, "</table></div>")
    .replace(/<pre(\s[^>]*)?>/gi, '<div class="wp-scroll-x"><pre$1>')
    .replace(/<\/pre>/gi, "</pre></div>");
}

/** Gutenberg doesn't reliably emit these on every image — added only when
 * missing, and the existing `src`/`srcset`/`sizes`/`alt` attributes (the
 * only responsive-image handling a raw <img> gets here) are left untouched. */
function ensureLazyImages(html: string): string {
  return html.replace(/<img(\s[^>]*)?>/gi, (match, attrs = "") => {
    let next = attrs as string;
    if (!/\sloading=/i.test(next)) next += ' loading="lazy"';
    if (!/\sdecoding=/i.test(next)) next += ' decoding="async"';
    return `<img${next}>`;
  });
}

function computeReadingTime(contentHtml: string): number {
  const words = stripTags(contentHtml).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** WordPress usually auto-fills excerpt.rendered from the content when an
 * editor leaves it blank, but derive one ourselves too in case that's ever
 * off — trimmed to a whole-word boundary, never mid-word. */
function deriveExcerpt(excerptHtml: string, contentHtml: string): string {
  const fromField = decodeHtmlEntities(stripTags(excerptHtml));
  if (fromField) return fromField;

  const words = decodeHtmlEntities(stripTags(contentHtml)).split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const snippet = words.slice(0, EXCERPT_FALLBACK_WORD_COUNT).join(" ");
  return words.length > EXCERPT_FALLBACK_WORD_COUNT ? `${snippet}…` : snippet;
}

/** `_gmt` fields come back with no "Z" suffix (e.g. "2026-08-22T12:52:06"),
 * which `new Date()` would otherwise parse as local time instead of the UTC
 * the field name promises — every consumer (formatDate, sitemap lastmod,
 * JSON-LD datePublished) needs the real instant, not a shifted one. */
function toIsoUtc(gmtDate: string): string {
  return gmtDate.endsWith("Z") ? gmtDate : `${gmtDate}Z`;
}

function mapPost(wp: WPPost): BlogPost {
  const title = decodeHtmlEntities(wp.title.rendered);
  const rawContentHtml = wp.content.rendered;
  const { html: withHeadingIds, headings } = processContent(rawContentHtml);
  const content = ensureLazyImages(wrapScrollableBlocks(withHeadingIds));

  const termGroups = wp._embedded?.["wp:term"] ?? [];
  const allTerms = termGroups.flat();
  const firstCategory = allTerms.find((term) => term.taxonomy === "category");
  const tagTerms = allTerms.filter((term) => term.taxonomy === "post_tag");

  const authorEmbed = wp._embedded?.author?.[0];
  const authorName = authorEmbed?.name?.trim() || "Boost Web Digital";
  const authorFallback = AUTHOR_FALLBACK[authorName];
  const gravatarUrl = authorEmbed?.avatar_urls?.["96"] ?? authorEmbed?.avatar_urls?.["48"];
  // "d=mm" is Gravatar's own "no photo on file" placeholder (a generic grey
  // silhouette) — confirmed by screenshot to look worse than just using the
  // real photo we already have for this named author, not a fetch failure
  // to fall back from.
  const isGenericGravatar = gravatarUrl?.includes("d=mm") ?? true;
  const authorAvatar = isGenericGravatar ? authorFallback?.avatar ?? gravatarUrl : gravatarUrl;

  const media = wp._embedded?.["wp:featuredmedia"]?.[0];
  const robots = wp.yoast_head_json?.robots;

  return {
    slug: wp.slug,
    title,
    excerpt: deriveExcerpt(wp.excerpt?.rendered ?? "", rawContentHtml),
    category: firstCategory
      ? { name: decodeHtmlEntities(firstCategory.name), slug: firstCategory.slug }
      : { name: "Uncategorized", slug: "uncategorized" },
    tags: tagTerms.length ? tagTerms.map((term) => decodeHtmlEntities(term.name)) : undefined,
    featuredImage: media?.source_url
      ? {
          src: media.source_url,
          alt: decodeHtmlEntities(media.alt_text) || title,
          width: media.media_details?.width ?? DEFAULT_IMAGE_WIDTH,
          height: media.media_details?.height ?? DEFAULT_IMAGE_HEIGHT,
        }
      : { src: "", alt: title, width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT },
    author: {
      name: authorName,
      role: authorFallback?.role ?? "Contributor",
      avatar: authorAvatar ?? "/images/ritik-malhotra.webp",
      url: authorFallback?.url,
    },
    publishedAt: toIsoUtc(wp.date_gmt),
    updatedAt: wp.modified_gmt ? toIsoUtc(wp.modified_gmt) : undefined,
    readingTime: computeReadingTime(rawContentHtml),
    toc: headings,
    content,
    // cta/relatedSlugs have no WordPress field behind them (no ACF plugin
    // configured) — left undefined, which the page already treats as "use
    // the sitewide default CTA" / "fall through to category matching".
    cta: undefined,
    relatedSlugs: undefined,
    seo: {
      title: wp.yoast_head_json?.title ? decodeHtmlEntities(wp.yoast_head_json.title) : undefined,
      description: wp.yoast_head_json?.description ? decodeHtmlEntities(wp.yoast_head_json.description) : undefined,
      noindex: robots ? robots.index !== "index" : false,
    },
  };
}

async function fetchJson<T>(path: string): Promise<{ data: T; headers: Headers } | null> {
  if (!WP_API_URL) {
    console.error("[blog/wordpress] WP_API_URL is not set");
    return null;
  }
  try {
    // `revalidate` is a time-based fallback alongside the tag, not a
    // replacement for it: /api/revalidate's revalidateTag("posts", "max")
    // call is unverified against Next 16's new second-argument signature
    // (see that route's comment) — if tag invalidation silently no-ops,
    // this still self-heals within an hour instead of caching forever.
    const res = await fetch(`${WP_API_URL}${path}`, { next: { tags: ["posts"], revalidate: 3600 } });
    if (!res.ok) {
      console.error(`[blog/wordpress] GET ${path} -> ${res.status}`);
      return null;
    }
    return { data: (await res.json()) as T, headers: res.headers };
  } catch (err) {
    console.error(`[blog/wordpress] GET ${path} failed:`, err);
    return null;
  }
}

/**
 * WordPress caps a single request at 100 posts and defaults to 10 — without
 * paging through every page the API reports via X-WP-TotalPages, post #11
 * onward silently disappears from the archive and the sitemap with no
 * error. `status=publish` is also WP's own default for an unauthenticated
 * request (drafts/scheduled posts require an authenticated request to see
 * at all) — passed explicitly anyway so the guarantee doesn't rely on that
 * implicit behavior alone.
 */
async function fetchAllPosts(): Promise<WPPost[]> {
  const perPage = 100;
  const first = await fetchJson<WPPost[]>(`/posts?_embed&status=publish&per_page=${perPage}&page=1`);
  if (!first) return [];

  const posts = [...first.data];
  const totalPages = Number(first.headers.get("x-wp-totalpages")) || 1;

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchJson<WPPost[]>(`/posts?_embed&status=publish&per_page=${perPage}&page=${i + 2}`)
      )
    );
    for (const page of rest) if (page) posts.push(...page.data);
  }

  return posts;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const wpPosts = await fetchAllPosts();
  return wpPosts.map(mapPost).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const result = await fetchJson<WPPost[]>(`/posts?_embed&status=publish&slug=${encodeURIComponent(slug)}`);
  if (!result || result.data.length === 0) return null;
  return mapPost(result.data[0]);
}

export async function getAllSlugs(): Promise<string[]> {
  return (await getAllPosts()).map((post) => post.slug);
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const all = await getAllPosts();
  const current = all.find((post) => post.slug === slug);
  const others = all.filter((post) => post.slug !== slug);

  if (current) {
    const sameCategory = others.filter((post) => post.category.slug === current.category.slug);
    if (sameCategory.length) return sameCategory.slice(0, limit);
  }

  return others.slice(0, limit);
}
