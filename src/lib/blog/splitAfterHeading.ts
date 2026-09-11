/**
 * Splits a post's rendered HTML right after the Nth <h2>'s closing tag, so
 * a real React component (the inline checker CTA) can be interleaved
 * between two dangerouslySetInnerHTML chunks instead of living inside the
 * raw HTML string. Falls back to "after the last h2 that exists" when the
 * post has fewer than N — a shorter post still gets the CTA once, just
 * earlier than "after the third section." A post with zero h2s at all
 * gets it appended at the very end, rather than never shown.
 */
export function splitAfterHeading(html: string, n: number): { before: string; after: string } {
  const closeTag = "</h2>";
  let index = -1;
  let searchFrom = 0;
  let found = 0;

  while (found < n) {
    const next = html.indexOf(closeTag, searchFrom);
    if (next === -1) break;
    index = next;
    searchFrom = next + closeTag.length;
    found += 1;
  }

  if (index === -1) {
    return { before: html, after: "" };
  }

  const splitAt = index + closeTag.length;
  return { before: html.slice(0, splitAt), after: html.slice(splitAt) };
}
