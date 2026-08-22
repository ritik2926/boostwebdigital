const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

/**
 * WordPress's REST API returns HTML-entity-encoded text in title.rendered
 * and excerpt.rendered (&#8217; for a curly apostrophe, &amp; for "&", etc.)
 * — this decodes both named and numeric (decimal/hex) entities with no new
 * dependency. Covers everything Gutenberg/Yoast actually emit; unrecognized
 * named entities are left as-is rather than dropped.
 */
export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, code: string) => {
    if (code[0] === "#") {
      const isHex = code[1]?.toLowerCase() === "x";
      const codePoint = isHex ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return NAMED_ENTITIES[code] ?? match;
  });
}
