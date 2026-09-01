import geminiEngine from "./gemini.ts";
import type { VisibilityEngine } from "./types.ts";

export const ENGINES: Record<string, VisibilityEngine> = {
  [geminiEngine.id]: geminiEngine,
};

export function getEngine(id: string): VisibilityEngine | null {
  return ENGINES[id] ?? null;
}

/**
 * Sent to the engine verbatim — no persona, no formatting instruction, no
 * "list the top 5". The entire value of this tool is that it sends what a
 * real patient would type; prompt-engineering the query would mean
 * measuring the prompt instead of reality.
 */
export function buildQuery(input: { keyword: string; city: string; region?: string | null; country: string }): string {
  const { keyword, city, region, country } = input;
  return `${keyword} in ${city}${region ? ", " + region : ""}, ${country}`;
}

export type { VisibilityEngine };
