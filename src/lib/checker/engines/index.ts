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
 * The query-template functions themselves live in ../queryBuilder.ts, not
 * here — that file has zero imports (no EXA_API_KEY, no GEMINI_API_KEY),
 * which is what lets CheckerWidget.tsx ("use client") import the exact same
 * template logic for its running-state display without ever importing this
 * engines/ barrel (which pulls in exa.ts/gemini.ts). Re-exported here so
 * run/route.ts's existing `from "@/lib/checker/engines"` imports keep
 * working unchanged.
 */
export { buildLocationString, buildQueries, stripLeadingSuperlative, type BuiltQuery } from "../queryBuilder";

export type { VisibilityEngine };
