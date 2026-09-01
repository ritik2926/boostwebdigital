import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isDisposableEmail } from "@/lib/email/disposable";
import { buildQuery, getEngine } from "@/lib/checker/engines";
import { GeminiRateLimitError, GeminiTimeoutError } from "@/lib/checker/engines/gemini";
import { findMentions, scoreVisibility } from "@/lib/checker/parse";
import { analyse } from "@/lib/checker/analyse";
import { MODELS } from "@/lib/checker/config";
import {
  VISITOR_COOKIE_MAX_AGE_SECONDS,
  VISITOR_COOKIE_NAME,
  buildVisitorCookieValue,
  hashIp,
  newVisitorId,
  verifyVisitorCookie,
} from "@/lib/checker/visitor";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * ASSUMED SCHEMA — not created or altered by this route (constraint: "Do
 * not create, alter or drop any database table"). These two tables are
 * expected to already exist in Neon; if the live schema differs, every
 * query below is isolated in its own try/catch and fails toward "don't
 * block a genuine visitor, don't lose the computed report" rather than a
 * hard crash — see the per-query comments. Confirm the actual column names
 * match before relying on persistence or the free-report counter.
 *
 *   reports (
 *     id            uuid primary key default gen_random_uuid(),
 *     visitor_id    text not null,
 *     ip_hash       text not null,
 *     business_name text not null,
 *     keyword       text not null,
 *     city          text not null,
 *     region        text,
 *     country       text not null,
 *     website       text,
 *     email         text not null,
 *     query         text not null,
 *     model         text,
 *     answer        text,
 *     sources       jsonb,
 *     matched       boolean,
 *     variant_matched text,
 *     first_index   integer,
 *     mention_count integer,
 *     score         integer,
 *     breakdown     jsonb,
 *     competitors   jsonb,
 *     strengths     jsonb,
 *     weaknesses    jsonb,
 *     recommendations jsonb,
 *     status        text not null,   -- 'complete' | 'pending' | 'no_answer'
 *     created_at    timestamptz not null default now()
 *   )
 *
 *   usage_counters (
 *     visitor_id text primary key,
 *     count      integer not null default 0,
 *     last_seen  timestamptz not null default now()
 *   )
 */

const SITE_ORIGIN = "https://boostwebdigital.com";
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
const MIN_SUBMIT_DELAY_MS = 3000;
const FREE_REPORTS_LIMIT = 2;
const IP_REPORTS_24H_LIMIT = 5;

const MAX_LENGTHS = {
  business_name: 120,
  keyword: 100,
  city: 80,
  region: 80,
  country: 80,
  website: 200,
  email: 200,
} as const;

interface RunBody {
  business_name?: unknown;
  keyword?: unknown;
  city?: unknown;
  region?: unknown;
  country?: unknown;
  website?: unknown;
  email?: unknown;
  "company-website"?: unknown;
  "rendered-at"?: unknown;
}

interface ReportRow {
  id: string;
  created_at: string;
  business_name: string;
  keyword: string;
  score: number | null;
  status: string;
}

// Deliberately matching control characters, to reject them.
const CONTROL_CHARS = /[\x00-\x08\x0b\x0c\x0e-\x1f]/;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Required text field: non-empty, within max length, no control chars. */
function requiredField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength || CONTROL_CHARS.test(trimmed)) return null;
  return trimmed;
}

/** Optional text field: empty/absent is fine, but if present it's still
 * bounded and control-char-free. */
function optionalField(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string" || value.length > maxLength || CONTROL_CHARS.test(value)) return null;
  return value.trim();
}

function isOurOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (origin) return origin === SITE_ORIGIN;
  const referer = request.headers.get("referer");
  if (!referer) return false; // neither header present — reject rather than assume same-origin
  try {
    return new URL(referer).origin === SITE_ORIGIN;
  } catch {
    return false;
  }
}

/**
 * Honeypot/timing decoy reuses the exact shape of a real "already used your
 * free reports" response — a bot sees an outcome indistinguishable from a
 * legitimate rate-limited visitor rather than a shape unique to bot
 * detection, and nothing is computed, written, or sent to Gemini either way.
 */
function decoySuccess(): NextResponse {
  return NextResponse.json({ ok: true, blocked: true, reports: [] });
}

function setVisitorCookie(response: NextResponse, visitorId: string): void {
  response.cookies.set(VISITOR_COOKIE_NAME, buildVisitorCookieValue(visitorId), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Origin check.
  if (!isOurOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Invalid request origin." }, { status: 403 });
  }

  let body: RunBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // 2. Honeypot.
  const honeypot = body["company-website"];
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return decoySuccess();
  }

  // 3. Timing.
  const renderedAt = typeof body["rendered-at"] === "number" ? body["rendered-at"] : null;
  if (renderedAt === null || Date.now() - renderedAt < MIN_SUBMIT_DELAY_MS) {
    return decoySuccess();
  }

  // 4. Abuse rate limit — reusing the existing generic limiter.
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(`checker-run:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_SECONDS);
  if (!rateLimit.ok) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again in an hour." }, { status: 429 });
  }

  // 5. Validate input.
  const businessName = requiredField(body.business_name, MAX_LENGTHS.business_name);
  const keyword = requiredField(body.keyword, MAX_LENGTHS.keyword);
  const city = requiredField(body.city, MAX_LENGTHS.city);
  const country = requiredField(body.country, MAX_LENGTHS.country);
  const region = optionalField(body.region, MAX_LENGTHS.region);
  const website = optionalField(body.website, MAX_LENGTHS.website);
  const emailRaw = requiredField(body.email, MAX_LENGTHS.email);

  if (!businessName || !keyword || !city || !country || region === null || website === null || !emailRaw) {
    return NextResponse.json({ ok: false, message: "Please fill in every required field." }, { status: 400 });
  }
  const email = emailRaw.toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });
  }
  if (isDisposableEmail(email)) {
    return NextResponse.json({ ok: false, message: "Please use a permanent email address." }, { status: 400 });
  }

  // 6. Free-report limit — 2 per visitor, lifetime. Runs before any Gemini
  // call. Fails OPEN on a lookup error (same philosophy as rate-limit.ts):
  // a broken counter must never block a genuine visitor, and the cost of
  // failing open here is bounded by the abuse rate limit above either way.
  const existingVisitorId = verifyVisitorCookie(request.cookies.get(VISITOR_COOKIE_NAME)?.value);
  const visitorId = existingVisitorId ?? newVisitorId();
  const ipHash = hashIp(ip);

  let blocked = false;
  let previousReports: ReportRow[] = [];
  try {
    const usage = (await sql`SELECT count FROM usage_counters WHERE visitor_id = ${visitorId}`) as Array<{
      count: number;
    }>;
    if ((usage[0]?.count ?? 0) >= FREE_REPORTS_LIMIT) {
      blocked = true;
      previousReports = (await sql`
        SELECT id, created_at, business_name, keyword, score, status
        FROM reports WHERE visitor_id = ${visitorId}
        ORDER BY created_at DESC
      `) as ReportRow[];
    } else {
      const ipReports = (await sql`
        SELECT count(*)::int AS n FROM reports
        WHERE ip_hash = ${ipHash} AND created_at > now() - interval '24 hours'
      `) as Array<{ n: number }>;
      if ((ipReports[0]?.n ?? 0) > IP_REPORTS_24H_LIMIT) blocked = true;
    }
  } catch (err) {
    console.warn("[checker/run] Free-report limit lookup failed — failing open:", err instanceof Error ? err.message : err);
  }

  if (blocked) {
    const response = NextResponse.json({ ok: true, blocked: true, reports: previousReports });
    setVisitorCookie(response, visitorId);
    return response;
  }

  // 7. Run call 1 → parse → call 2.
  if (MODELS.combined) {
    console.warn("[checker/run] GEMINI_TIER=paid requests the combined single-call path, which is not implemented yet — falling through to the two-call path.");
  }

  const engine = getEngine("gemini");
  if (!engine) {
    return NextResponse.json({ ok: false, message: "Visibility checker is not configured." }, { status: 503 });
  }

  const query = buildQuery({ keyword, city, region: region || null, country });

  let answer: string;
  let sources: string[];
  let model: string;
  try {
    const result = await engine.run(query);
    answer = result.answer;
    sources = result.sources;
    model = result.model;
  } catch (err) {
    if (err instanceof GeminiRateLimitError) {
      await saveRow({
        visitorId,
        ipHash,
        businessName,
        keyword,
        city,
        region,
        country,
        website,
        email,
        query,
        model: MODELS.grounded,
        status: "pending",
      });
      return NextResponse.json(
        { ok: true, status: "pending", message: "We've hit today's check limit — this one is queued and will complete soon." },
        { status: 503 }
      );
    }
    if (err instanceof GeminiTimeoutError) {
      return NextResponse.json(
        { ok: false, message: "The check timed out. Please try again in a moment." },
        { status: 503 }
      );
    }
    console.error("[checker/run] Call 1 failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Something went wrong running the check. Please try again." }, { status: 503 });
  }

  // Empty answer / model refuses — real evidence, not a fabricated report.
  if (answer.trim().length === 0) {
    const row = await saveRow({
      visitorId,
      ipHash,
      businessName,
      keyword,
      city,
      region,
      country,
      website,
      email,
      query,
      model,
      answer: "",
      sources,
      status: "no_answer",
    });
    const response = NextResponse.json({
      ok: true,
      report: {
        id: row?.id ?? null,
        status: "no_answer",
        message: "No AI answer was returned for this query.",
        query,
        model,
      },
    });
    setVisitorCookie(response, visitorId);
    return response;
  }

  const mentions = findMentions(answer, businessName);
  const { score, breakdown } = scoreVisibility({ answer, mentions, sources, website: website || null });

  // Call 2 — prose only, never influences the measured score above.
  const generated = await analyse({ answer, businessName, matched: mentions.matched, score });

  const row = await saveRow({
    visitorId,
    ipHash,
    businessName,
    keyword,
    city,
    region,
    country,
    website,
    email,
    query,
    model,
    answer,
    sources,
    matched: mentions.matched,
    variantMatched: mentions.variantMatched,
    firstIndex: mentions.firstIndex,
    mentionCount: mentions.count,
    score,
    breakdown,
    competitors: generated?.competitors ?? null,
    strengths: generated?.strengths ?? null,
    weaknesses: generated?.weaknesses ?? null,
    recommendations: generated?.recommendations ?? null,
    status: "complete",
  });

  // Increment only now — a real, measured report was produced and returned.
  try {
    await sql`
      INSERT INTO usage_counters (visitor_id, count, last_seen)
      VALUES (${visitorId}, 1, now())
      ON CONFLICT (visitor_id) DO UPDATE SET count = usage_counters.count + 1, last_seen = now()
    `;
  } catch (err) {
    console.error("[checker/run] Failed to increment usage_counters:", err instanceof Error ? err.message : err);
  }

  const response = NextResponse.json({
    ok: true,
    report: {
      id: row?.id ?? null,
      status: "complete",
      query,
      model,
      answer,
      sources,
      matched: mentions.matched,
      variantMatched: mentions.variantMatched,
      firstIndex: mentions.firstIndex,
      mentionCount: mentions.count,
      score,
      breakdown,
      competitors: generated?.competitors ?? null,
      strengths: generated?.strengths ?? null,
      weaknesses: generated?.weaknesses ?? null,
      recommendations: generated?.recommendations ?? null,
    },
  });
  setVisitorCookie(response, visitorId);
  return response;
}

interface SaveRowInput {
  visitorId: string;
  ipHash: string;
  businessName: string;
  keyword: string;
  city: string;
  region: string;
  country: string;
  website: string;
  email: string;
  query: string;
  model: string;
  answer?: string;
  sources?: string[];
  matched?: boolean;
  variantMatched?: string | null;
  firstIndex?: number | null;
  mentionCount?: number;
  score?: number;
  breakdown?: Array<{ signal: string; points: number }>;
  competitors?: string[] | null;
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  recommendations?: unknown;
  status: "complete" | "pending" | "no_answer";
}

/** A database write failure must never lose the report the caller is about
 * to receive — this only ever logs and returns null on failure, it never
 * throws. See PART 7: "Database write fails → still return the report to
 * the caller." */
async function saveRow(input: SaveRowInput): Promise<{ id: string } | null> {
  try {
    const rows = (await sql`
      INSERT INTO reports (
        visitor_id, ip_hash, business_name, keyword, city, region, country, website, email,
        query, model, answer, sources, matched, variant_matched, first_index, mention_count,
        score, breakdown, competitors, strengths, weaknesses, recommendations, status
      ) VALUES (
        ${input.visitorId}, ${input.ipHash}, ${input.businessName}, ${input.keyword}, ${input.city},
        ${input.region || null}, ${input.country}, ${input.website || null}, ${input.email},
        ${input.query}, ${input.model}, ${input.answer ?? null},
        ${input.sources ? JSON.stringify(input.sources) : null},
        ${input.matched ?? null}, ${input.variantMatched ?? null}, ${input.firstIndex ?? null},
        ${input.mentionCount ?? null}, ${input.score ?? null},
        ${input.breakdown ? JSON.stringify(input.breakdown) : null},
        ${input.competitors ? JSON.stringify(input.competitors) : null},
        ${input.strengths ? JSON.stringify(input.strengths) : null},
        ${input.weaknesses ? JSON.stringify(input.weaknesses) : null},
        ${input.recommendations ? JSON.stringify(input.recommendations) : null},
        ${input.status}
      )
      RETURNING id
    `) as Array<{ id: string }>;
    return rows[0] ?? null;
  } catch (err) {
    console.error("[checker/run] Failed to save report row:", err instanceof Error ? err.message : err);
    return null;
  }
}
