/**
 * The query-template logic, deliberately split out of src/lib/checker/
 * engines/index.ts into its own file with ZERO imports — engines/index.ts
 * pulls in exa.ts and gemini.ts, which touch EXA_API_KEY/GEMINI_API_KEY,
 * so nothing under engines/ may ever be imported from a "use client" file
 * (see CheckerWidget.tsx's own header comment). This file has no such
 * secret anywhere in its import graph, so it's safe for BOTH the server
 * (run/route.ts, via engines/index.ts re-exporting it) and the client
 * (CheckerWidget.tsx's running-state display, which needs the exact same
 * three query strings the server is about to send — importing the same
 * source instead of duplicating the template logic is what guarantees the
 * two never drift apart).
 */

export interface BuiltQuery {
  label: "Q1" | "Q2" | "Q3";
  query: string;
}

/**
 * Stripped so "best dental clinic" (a keyword the visitor already typed
 * with its own superlative) doesn't turn into "best best dental clinic" once
 * Q1 prepends its own "best". Longest phrase first ("top rated" before
 * "top") so a two-word superlative doesn't leave its second word dangling.
 * Only a LEADING superlative is stripped — "clinic near the best hospital"
 * keeps its "best" because it isn't at the front.
 */
const LEADING_SUPERLATIVES = ["top rated", "top-rated", "best", "top", "good", "cheap"];

export function stripLeadingSuperlative(keyword: string): string {
  const trimmed = keyword.trim();
  const lower = trimmed.toLowerCase();
  for (const phrase of LEADING_SUPERLATIVES) {
    if (lower === phrase) return "";
    if (lower.startsWith(`${phrase} `)) return trimmed.slice(phrase.length).trim();
  }
  return trimmed;
}

/**
 * City is optional — a national/online business (a software company, an
 * e-commerce shop) has no single city to search "in", so it searches by
 * country alone. Region is folded in only alongside a real city; a region
 * given with no city is still treated as "no city" here, matching the
 * brief's own two-branch formula exactly rather than inventing a third
 * "region, country" shape nothing asked for.
 */
export function buildLocationString(city: string, region: string | null | undefined, country: string): string {
  const trimmedCity = city.trim();
  if (!trimmedCity) return country;
  return `${trimmedCity}${region ? ", " + region : ""}, ${country}`;
}

/**
 * Three phrasings of the same underlying question, each sent to the engine
 * verbatim — no persona, no "list the top 5" formatting instruction beyond
 * what a real patient would actually type across a few searches. One
 * phrasing can miss a business an AI answer engine would otherwise name for
 * a slightly different phrasing of the exact same question; three variants
 * is what makes a single unlucky phrasing stop reading as a verdict.
 */
export function buildQueries(input: { keyword: string; city: string; region?: string | null; country: string }): BuiltQuery[] {
  const { keyword, city, region, country } = input;
  const base = stripLeadingSuperlative(keyword) || keyword.trim();
  const location = buildLocationString(city, region, country);

  return [
    { label: "Q1", query: `best ${base} in ${location}` },
    { label: "Q2", query: `top rated ${base} in ${location}` },
    { label: "Q3", query: `recommend a ${base} in ${location}` },
  ];
}
