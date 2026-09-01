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
