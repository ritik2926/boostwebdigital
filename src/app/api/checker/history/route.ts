import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { VISITOR_COOKIE_NAME, verifyVisitorCookie } from "@/lib/checker/visitor";

export const runtime = "nodejs";

/**
 * The visitor's own reports, and only theirs — scoped entirely by the
 * signed visitor_id cookie already set by run/quota. No id/visitorId
 * parameter exists anywhere in this route; there is no way to ask for
 * another visitor's data because there is nothing in the request to ask
 * with except the cookie itself, which is HMAC-signed (visitor.ts) so it
 * can't be forged into someone else's id.
 *
 * A missing or unverifiable cookie returns an empty list, not an error —
 * "no history yet" and "not a returning visitor" are the same thing from
 * here.
 *
 * Column allowlist is deliberate and explicit: never ip_hash, email,
 * user_agent, or referrer — none of those are selected below at all, so
 * there's nothing to accidentally leak by widening this query later.
 *
 * THREE-QUERY REWORK (2026-09-02): query_sent and raw_answer are now JSON
 * text (see run/route.ts's schema comment for exactly what each holds) —
 * parsed back out below rather than treated as plain strings. grounding_sources
 * (jsonb) already round-trips as a parsed value via the neon driver.
 */
interface RawAnswerEntry {
  label: string;
  ok: boolean;
  answer: string;
  matched: boolean;
  variantMatched: string | null;
  firstIndex: number | null;
  mentionCount: number;
  sources: string[];
}

interface RankedSourceRow {
  url: string;
  citedByCount: number;
  citedIn: string[];
  isOwnDomain: boolean;
}

interface HistoryRow {
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
  grounding_sources: RankedSourceRow[] | null;
  mentioned: boolean;
  variant_matched: string | null;
  mention_index: number | null;
  mention_count: number;
  competitors: Array<{ name: string; appearedIn: number }> | null;
  visibility_score: number;
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: unknown;
  status: string;
}

/** query_sent/raw_answer are JSON stored in text columns — a row saved
 * before this rework (or a corrupted value) must degrade to an empty list
 * rather than throw and break the whole history endpoint for one visitor. */
function safeParseArray<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const visitorId = verifyVisitorCookie(request.cookies.get(VISITOR_COOKIE_NAME)?.value);
  if (!visitorId) {
    return NextResponse.json({ reports: [] });
  }

  let rows: HistoryRow[] = [];
  try {
    rows = (await sql`
      SELECT
        id, created_at, business_name, website, keyword, city, region, country,
        model, query_sent, raw_answer, grounding_sources, mentioned,
        variant_matched, mention_index, mention_count, competitors,
        visibility_score, strengths, weaknesses, recommendations, status
      FROM reports
      WHERE visitor_id = ${visitorId}
      ORDER BY created_at DESC
    `) as HistoryRow[];
  } catch (err) {
    console.warn("[checker/history] Lookup failed — returning empty:", err instanceof Error ? err.message : String(err));
  }

  return NextResponse.json({
    reports: rows.map((row) => {
      const queries = safeParseArray<{ label: string; query: string }>(row.query_sent);
      const rawAnswers = safeParseArray<RawAnswerEntry>(row.raw_answer);

      return {
        id: row.id,
        createdAt: row.created_at,
        businessName: row.business_name,
        website: row.website,
        keyword: row.keyword,
        city: row.city,
        region: row.region,
        country: row.country,
        model: row.model,
        queries,
        answers: rawAnswers.map((a) => ({ ...a, error: a.ok ? undefined : "This query did not return a result." })),
        namedCount: rawAnswers.filter((a) => a.matched).length,
        totalQueries: queries.length,
        sources: row.grounding_sources ?? [],
        score: row.visibility_score,
        competitors: row.competitors ?? [],
        strengths: row.strengths,
        weaknesses: row.weaknesses,
        recommendations: row.recommendations,
        status: row.status,
      };
    }),
  });
}
