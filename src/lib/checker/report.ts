import { sql } from "@/lib/db";
import { scoreVisibility, type QueryMentionResult, type RankedSource, type ScoreBreakdownRow } from "./parse";

/**
 * Powers ONLY the shareable report page (src/app/tools/ai-visibility-
 * checker/report/[id]/page.tsx) — a public, unauthenticated-by-obscurity
 * URL (see that page's own comment). The column allowlist below is
 * deliberate and explicit, same convention as src/app/api/checker/history/
 * route.ts: email, ip_hash, visitor_id, user_agent, and referrer are never
 * selected, so there's nothing to accidentally leak by widening this query
 * later. query_sent/raw_answer are JSON stored in text columns (see
 * run/route.ts's schema comment) — parsed back out below.
 */

export interface FullReportAnswer {
  label: string;
  query: string;
  ok: boolean;
  answer: string;
  matched: boolean;
  variantMatched: string | null;
  firstIndex: number | null;
  mentionCount: number;
  sources: string[];
}

export interface FullReportData {
  id: string;
  createdAt: string;
  businessName: string;
  website: string | null;
  keyword: string;
  city: string;
  region: string | null;
  country: string;
  model: string;
  queries: Array<{ label: string; query: string }>;
  answers: FullReportAnswer[];
  namedCount: number;
  totalQueries: number;
  sources: RankedSource[];
  score: number;
  breakdown: ScoreBreakdownRow[];
  competitors: Array<{ name: string; appearedIn: number }>;
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: Array<{ title: string; why: string; effort: "low" | "medium" | "high" }> | null;
  status: string;
}

interface ReportDbRow {
  id: string;
  created_at: string;
  business_name: string;
  website: string | null;
  keyword: string;
  city: string;
  region: string | null;
  country: string;
  model: string;
  query_sent: string;
  raw_answer: string | null;
  grounding_sources: RankedSource[] | null;
  competitors: Array<{ name: string; appearedIn: number }> | null;
  visibility_score: number;
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: FullReportData["recommendations"];
  status: string;
}

function safeParseArray<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Missing, malformed, or a lookup failure all resolve to null — the page
 * itself turns that into a friendly 404, never a crash or a leaked error.
 * The uuid shape is checked BEFORE querying purely to reject obvious
 * garbage cheaply; a well-formed-but-nonexistent uuid still just returns
 * null from the query itself.
 */
export async function getReportById(id: string): Promise<FullReportData | null> {
  if (!UUID_PATTERN.test(id)) return null;

  let rows: ReportDbRow[] = [];
  try {
    rows = (await sql`
      SELECT
        id, created_at, business_name, website, keyword, city, region, country,
        model, query_sent, raw_answer, grounding_sources, competitors,
        visibility_score, strengths, weaknesses, recommendations, status
      FROM reports
      WHERE id = ${id}
    `) as ReportDbRow[];
  } catch (err) {
    console.warn("[checker/report] Lookup failed:", err instanceof Error ? err.message : String(err));
    return null;
  }

  const row = rows[0];
  if (!row) return null;

  const queries = safeParseArray<{ label: string; query: string }>(row.query_sent);
  const answers = safeParseArray<FullReportAnswer>(row.raw_answer);
  const sources = row.grounding_sources ?? [];
  const website = row.website;

  // Recompute the breakdown from the same stored, measured facts that
  // originally produced it — scoreVisibility is pure and deterministic, so
  // this reproduces the identical rows without persisting a breakdown
  // column (there still isn't one — see run/route.ts's schema comment).
  const mentionResults: QueryMentionResult[] = answers
    .filter((a) => a.ok)
    .map((a) => ({
      label: a.label,
      answer: a.answer,
      mentions: { matched: a.matched, variantMatched: a.variantMatched, firstIndex: a.firstIndex, count: a.mentionCount },
    }));
  const { breakdown } = scoreVisibility({
    results: mentionResults,
    sources: sources.map((s) => s.url),
    website,
  });

  return {
    id: row.id,
    createdAt: row.created_at,
    businessName: row.business_name,
    website,
    keyword: row.keyword,
    city: row.city,
    region: row.region,
    country: row.country,
    model: row.model,
    queries,
    answers,
    namedCount: answers.filter((a) => a.matched).length,
    totalQueries: queries.length,
    sources,
    score: row.visibility_score,
    breakdown,
    competitors: row.competitors ?? [],
    strengths: row.strengths,
    weaknesses: row.weaknesses,
    recommendations: row.recommendations,
    status: row.status,
  };
}
