import GithubSlugger from "github-slugger";
import type { TocItem } from "./types";

/**
 * Extract h2/h3 headings straight from the raw MDX source into a TOC tree.
 * Uses the same slugger rehype-slug runs on the rendered output, so anchor
 * ids computed here always match the actual heading ids in the DOM.
 */
export function extractToc(mdxSource: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headingPattern = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];

  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(mdxSource)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim().replace(/[*_`]/g, "");
    items.push({ id: slugger.slug(text), text, level });
  }

  return items;
}

const WORDS_PER_MINUTE = 200;

/** Reading time from word count — never hand-entered in frontmatter. */
export function computeReadingTime(mdxSource: string): number {
  const words = mdxSource
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
