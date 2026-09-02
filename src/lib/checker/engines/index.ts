import exaEngine from "./exa";
import geminiEngine from "./gemini";
import type { VisibilityEngine } from "./types";

/**
 * Gemini stays registered but unused — it becomes valid again if billing is
 * ever enabled on the Google AI Studio key (see gemini.ts's own header
 * comment). Exa is the default: it's what actually runs today.
 */
export const ENGINES: Record<string, VisibilityEngine> = {
  [exaEngine.id]: exaEngine,
  [geminiEngine.id]: geminiEngine,
};

export const DEFAULT_ENGINE_ID = exaEngine.id;

export function getEngine(id: string): VisibilityEngine | null {
  return ENGINES[id] ?? null;
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

export interface BuiltQuery {
  label: "Q1" | "Q2" | "Q3";
  query: string;
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
  const location = `${city}${region ? ", " + region : ""}, ${country}`;

  return [
    { label: "Q1", query: `best ${base} in ${location}` },
    { label: "Q2", query: `top rated ${base} in ${location}` },
    { label: "Q3", query: `recommend a ${base} in ${location}` },
  ];
}

export type { VisibilityEngine };
