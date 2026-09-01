import type { VisibilityEngine } from "./types";

/**
 * Replaces Gemini as the default engine (see engines/gemini.ts's own header
 * comment and this task's report for why: Gemini 2.5 now 404s for new API
 * keys, and Google Search grounding requires billing on every 3.x model).
 * Exa's /answer does the same job — search the live web, return a written
 * answer plus the source URLs — for $5/1,000 requests against a $10/month
 * free allotment, no payment method required.
 */
const EXA_ANSWER_URL = "https://api.exa.ai/answer";
const REQUEST_TIMEOUT_MS = 45_000;
const RATE_LIMIT_RETRY_DELAY_MS = 2_000;

export class ExaAuthError extends Error {
  constructor() {
    super("Exa API key is missing or invalid");
    this.name = "ExaAuthError";
  }
}

export class ExaCreditsExhaustedError extends Error {
  constructor() {
    super("Exa credits exhausted for this billing period");
    this.name = "ExaCreditsExhaustedError";
  }
}

export class ExaQueryError extends Error {
  constructor(detail?: string) {
    super(detail ? `Exa could not process the query: ${detail}` : "Exa could not process the query");
    this.name = "ExaQueryError";
  }
}

export class ExaRateLimitError extends Error {
  constructor() {
    super("Exa rate limit reached after one retry");
    this.name = "ExaRateLimitError";
  }
}

export class ExaServerError extends Error {
  constructor(status: number) {
    super(`Exa server error (${status || "timeout"}) after one retry`);
    this.name = "ExaServerError";
  }
}

interface ExaCitation {
  id?: string;
  url?: string;
  title?: string;
  author?: string;
  publishedDate?: string;
  image?: string;
  favicon?: string;
}

interface ExaAnswerResponse {
  requestId?: string;
  answer?: string;
  citations?: ExaCitation[];
  costDollars?: { total?: number };
  error?: string;
}

interface ExaCallResult {
  status: number;
  json: ExaAnswerResponse | null;
}

async function requestOnce(body: Record<string, unknown>, apiKey: string): Promise<ExaCallResult | "timeout"> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(EXA_ANSWER_URL, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const json = (await res.json().catch(() => null)) as ExaAnswerResponse | null;
    return { status: res.status, json };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "timeout";
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exa's documented error codes, each handled distinctly. 501 ("could not
 * generate an answer from available data") is deliberately NOT in the
 * retry/throw chain below — it's a real, valid result (an empty answer),
 * not a failure, so it falls through to the final `return result` exactly
 * like a 200 does. Never logs the request body or the key; the key travels
 * in a header, and a 401 logs only the env var NAME, never its value.
 */
export async function callExaAnswer(body: Record<string, unknown>): Promise<ExaCallResult> {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) throw new ExaAuthError();

  let result = await requestOnce(body, apiKey);

  const isRetryable = result === "timeout" || result.status === 429 || (result.status >= 500 && result.status !== 501);
  if (isRetryable) {
    if (result !== "timeout" && result.status === 429) await delay(RATE_LIMIT_RETRY_DELAY_MS);
    result = await requestOnce(body, apiKey);
  }

  if (result === "timeout") throw new ExaServerError(0);
  if (result.status === 401) {
    console.error("[checker/exa] 401 from Exa — check whether EXA_API_KEY is set and valid (name only, never its value).");
    throw new ExaAuthError();
  }
  if (result.status === 402) throw new ExaCreditsExhaustedError();
  if (result.status === 422) throw new ExaQueryError(typeof result.json?.error === "string" ? result.json.error : undefined);
  if (result.status === 429) throw new ExaRateLimitError();
  if (result.status >= 500 && result.status !== 501) throw new ExaServerError(result.status);

  return result; // 200 and 501 both land here — 501 just carries no answer.
}

function extractSources(citations: ExaCitation[] | undefined): string[] {
  if (!Array.isArray(citations)) return [];
  const urls = new Set<string>();
  for (const citation of citations) {
    if (typeof citation.url === "string" && citation.url) urls.add(citation.url);
  }
  return Array.from(urls);
}

/**
 * The query is sent to Exa exactly as built by the caller (see `buildQuery`
 * in engines/index.ts) — no persona, no formatting instruction added here.
 * `text: false` — citations only, not full page text, to keep the payload
 * (and the cost) small; the answer text itself is already the evidence.
 */
const exaEngine: VisibilityEngine = {
  id: "exa",
  async run(query: string) {
    const { json } = await callExaAnswer({ query, text: false });

    const cost = json?.costDollars?.total;
    if (typeof cost === "number") {
      // The dollar amount is not a secret — logging it is how this project
      // finds out its real per-report cost.
      console.log(`[checker/exa] costDollars.total: ${cost}`);
    }

    return {
      answer: typeof json?.answer === "string" ? json.answer : "",
      sources: extractSources(json?.citations),
      model: "exa/answer",
    };
  },
};

export default exaEngine;
