import { MODELS } from "../config";
import type { VisibilityEngine } from "./types";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 45_000;

export class GeminiRateLimitError extends Error {
  constructor() {
    super("Gemini grounding rate limit reached (500 requests/day, shared across free-tier models)");
    this.name = "GeminiRateLimitError";
  }
}

export class GeminiTimeoutError extends Error {
  constructor() {
    super("Gemini request timed out after one retry");
    this.name = "GeminiTimeoutError";
  }
}

interface GeminiResponseJson {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    groundingMetadata?: { groundingChunks?: Array<{ web?: { uri?: string } }> };
  }>;
}

interface GeminiCallResult {
  status: number;
  json: GeminiResponseJson | null;
}

/**
 * The shared low-level call both this engine's grounded request (Call 1)
 * and analyse.ts's structured request (Call 2) go through — one retry on
 * timeout, one place that classifies a 429 as the free-tier grounding cap.
 * The API key travels in a header, never a URL, so it can never end up in a
 * server access log — and this function never logs the request body or the
 * key itself under any circumstance.
 */
export async function callGeminiApi(model: string, body: Record<string, unknown>): Promise<GeminiCallResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const attempt = async (): Promise<GeminiCallResult> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(`${GEMINI_API_BASE}/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const json = (await res.json().catch(() => null)) as GeminiResponseJson | null;
      return { status: res.status, json };
    } finally {
      clearTimeout(timer);
    }
  };

  let result: GeminiCallResult;
  try {
    result = await attempt();
  } catch (err) {
    if (!(err instanceof Error) || err.name !== "AbortError") throw err;
    try {
      result = await attempt();
    } catch (retryErr) {
      if (retryErr instanceof Error && retryErr.name === "AbortError") throw new GeminiTimeoutError();
      throw retryErr;
    }
  }

  if (result.status === 429) throw new GeminiRateLimitError();
  return result;
}

function extractText(json: GeminiResponseJson | null): string {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
}

function extractSources(json: GeminiResponseJson | null): string[] {
  const chunks = json?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!Array.isArray(chunks)) return [];
  const urls = new Set<string>();
  for (const chunk of chunks) {
    const uri = chunk.web?.uri;
    if (typeof uri === "string" && uri) urls.add(uri);
  }
  return Array.from(urls);
}

/**
 * The query is sent to Gemini exactly as built by the caller (see
 * `buildQuery` in engines/index.ts) — no persona, no formatting instruction
 * added here. Prompt-engineering the query would mean measuring the
 * prompt's effect instead of what a real patient's search would surface.
 */
const geminiEngine: VisibilityEngine = {
  id: "gemini",
  async run(query: string) {
    const model = MODELS.grounded;
    const { json } = await callGeminiApi(model, {
      contents: [{ parts: [{ text: query }] }],
      tools: [{ google_search: {} }],
    });
    return {
      answer: extractText(json),
      sources: extractSources(json),
      model,
    };
  },
};

export default geminiEngine;
