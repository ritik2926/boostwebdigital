import GithubSlugger from "github-slugger";
import type { TocItem } from "./types";
import { decodeHtmlEntities } from "./entities";

// h2/h3 only — matches TocItem.level (2 | 3) and TableOfContents' rendering,
// checked in src/lib/blog/types.ts and src/components/blog/TableOfContents.tsx
// rather than assumed.
const HEADING_PATTERN = /<(h[23])((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/gi;
const EXISTING_ID_PATTERN = /\sid="[^"]*"/i;

function textContent(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

/**
 * WordPress returns raw content HTML with no heading ids — MDX got them for
 * free from rehype-slug (which is github-slugger under the hood). This does
 * both jobs the old pipeline split across two systems (rehype-slug injecting
 * ids into rendered output, extractToc reading ids from raw MDX source) in a
 * single pass over the same HTML, off the same GithubSlugger instance, so
 * the injected ids and the returned TOC can never disagree.
 *
 * Uses a regex pass rather than a full HTML parser — deliberately: no new
 * dependency, and WordPress's block output is well-formed enough (Gutenberg
 * always emits matching open/close heading tags) that a non-greedy
 * tag-pair match is reliable here.
 */
export function processContent(html: string): { html: string; headings: TocItem[] } {
  const slugger = new GithubSlugger();
  const headings: TocItem[] = [];

  const withIds = html.replace(HEADING_PATTERN, (match, tag: string, attrs: string, inner: string) => {
    const level = (tag.toLowerCase() === "h2" ? 2 : 3) as 2 | 3;
    const text = textContent(inner);
    if (!text) return match; // an empty heading has nothing to link to — leave it alone

    const id = slugger.slug(text);
    headings.push({ id, text, level });

    const cleanAttrs = attrs.replace(EXISTING_ID_PATTERN, "");
    return `<${tag} id="${id}"${cleanAttrs}>${inner}</${tag}>`;
  });

  return { html: withIds, headings };
}
