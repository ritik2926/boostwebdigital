import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isDisposableEmail } from "@/lib/email/disposable";
import { buildQuery, DEFAULT_ENGINE_ID, getEngine } from "@/lib/checker/engines";
import {
  ExaAuthError,
  ExaCreditsExhaustedError,
  ExaQueryError,
  ExaRateLimitError,
  ExaServerError,
} from "@/lib/checker/engines/exa";
import { findMentions, scoreVisibility } from "@/lib/checker/parse";
import { analyse } from "@/lib/checker/analyse";
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
 * REAL SCHEMA — confirmed live against information_schema.columns, most
 * recently on 2026-09-01 (variant_matched, status, and a now-nullable
 * raw_answer were hand-added to `reports` after the previous task; not
 * created or altered by this route).
 *
 *   reports (
 *     id                 uuid primary key default ...,
 *     created_at         timestamptz not null default now(),
 *     business_name      text not null,
 *     website            text,
 *     email              text not null,
 *     keyword            text not null,
 *     city               text not null,
 *     region             text,
 *     country            text not null,
 *     engine             text not null,   -- e.g. "exa"
 *     model              text not null,   -- e.g. "exa/answer"
 *     query_sent         text not null,
 *     raw_answer         text,            -- nullable; '' for a real-but-empty answer
 *     grounding_sources  jsonb,
 *     mentioned          boolean not null,
 *     mention_index      integer,
 *     mention_count      integer not null,
 *     competitors        jsonb not null,  -- NOT NULL: '[]' when call 2 didn't run/failed
 *     visibility_score   integer not null,
 *     strengths          jsonb,
 *     weaknesses         jsonb,
 *     recommendations    jsonb,
 *     visitor_id         uuid not null,
 *     ip_hash            text not null,
 *     user_agent         text,
 *     referrer           text,
 *     variant_matched    text,            -- nullable
 *     status             text not null default 'ok'  -- 'ok' | 'no-answer'
 *   )
 *
 *   usage_counters (
 *     visitor_id uuid primary key,
 *     ip_hash    text not null,
 *     count      integer not null,
 *     first_seen timestamptz not null,
 *     last_seen  timestamptz not null
 *   )
 *
 * Still no column for the score breakdown array — that exists in the JSON
 * response this route returns to the caller, it's just not persisted.
 */

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
const MIN_SUBMIT_DELAY_MS = 3000;
const FREE_REPORTS_LIMIT = 2;
const IP_REPORTS_24H_LIMIT = 5;

/**
 * FIX 3 — the only cap fully under our control. The per-visitor limit stops
 * one person; it does nothing against fifty people, or one person with
 * fifty cookies. This is what actually protects the Exa credit balance.
 * Change this number, not the query below, if the limit needs to move.
 */
const DAILY_REPORT_CAP = 50;

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
  visibility_score: number;
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

/**
 * Compares against the REQUEST's own origin (request.nextUrl.origin —
 * http://localhost:3000 in dev, https://boostwebdigital.com in production),
 * not a hardcoded SITE_ORIGIN constant. A hardcoded production URL would
 * reject every same-origin request made from local dev or a preview
 * deploy — this bug was only caught once the form was actually tested
 * through a real browser fetch() instead of a curl call with a manually
 * supplied Origin header.
 */
function isOurOrigin(request: NextRequest): boolean {
  const selfOrigin = request.nextUrl.origin;
  const origin = request.headers.get("origin");
  if (origin) return origin === selfOrigin;
  const referer = request.headers.get("referer");
  if (!referer) return false; // neither header present — reject rather than assume same-origin
  try {
    return new URL(referer).origin === selfOrigin;
  } catch {
    return false;
  }
}

/**
 * Honeypot/timing decoy reuses the exact shape of a real "already used your
 * free reports" response — a bot sees an outcome indistinguishable from a
 * legitimate rate-limited visitor rather than a shape unique to bot
 * detection, and nothing is computed, written, or sent to Exa either way.
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

  // 5. Global daily cap — checked before validation/free-limit/Exa, since a
  // capped day means nothing else about this request matters. Fails OPEN
  // on a lookup error (a broken count must never block a genuine visitor).
  let dailyCapped = false;
  try {
    const daily = (await sql`
      SELECT count(*)::int AS n FROM reports WHERE created_at >= date_trunc('day', now())
    `) as Array<{ n: number }>;
    if ((daily[0]?.n ?? 0) >= DAILY_REPORT_CAP) dailyCapped = true;
  } catch (err) {
    console.warn("[checker/run] Daily cap lookup failed — failing open:", err instanceof Error ? err.message : String(err));
  }
  if (dailyCapped) {
    // Not the visitor's fault — no cookie write, no counter touched.
    return NextResponse.json({
      ok: true,
      blocked: true,
      reason: "daily-cap",
      message: "We've hit today's report limit across all visitors — please try again tomorrow.",
    });
  }

  // 6. Validate input.
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

  // 7. Free-report limit — 2 per visitor, lifetime. Runs before any Exa
  // call. Fails OPEN on a lookup error (same philosophy as rate-limit.ts):
  // a broken counter must never block a genuine visitor, and the cost of
  // failing open here is bounded by the abuse rate limit and the daily cap
  // above either way.
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
        SELECT id, created_at, business_name, keyword, visibility_score
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
    console.warn("[checker/run] Free-report limit lookup failed — failing open:", err instanceof Error ? err.message : String(err));
  }

  if (blocked) {
    const response = NextResponse.json({ ok: true, blocked: true, reason: "visitor-limit", reports: previousReports });
    setVisitorCookie(response, visitorId);
    return response;
  }

  // 8. Run call 1 (Exa) → parse → call 2 (Exa).
  const engine = getEngine(DEFAULT_ENGINE_ID);
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
    // None of Exa's error codes are the visitor's fault — no row saved, no
    // counter incremented, for any of them.
    if (err instanceof ExaAuthError) {
      // exa.ts already logged the env var NAME (never its value) for a 401.
      return NextResponse.json({ ok: false, message: "Visibility checker is not configured correctly." }, { status: 503 });
    }
    if (err instanceof ExaCreditsExhaustedError) {
      return NextResponse.json({ ok: false, message: "The checker is temporarily out of capacity. Please try again later." }, { status: 503 });
    }
    if (err instanceof ExaQueryError) {
      console.error("[checker/run] Exa could not process the query:", err.message);
      return NextResponse.json({ ok: false, message: "That combination couldn't be checked. Please try different details." }, { status: 422 });
    }
    if (err instanceof ExaRateLimitError) {
      return NextResponse.json({ ok: false, message: "The checker is busy right now. Please try again in a moment." }, { status: 503 });
    }
    if (err instanceof ExaServerError) {
      return NextResponse.json({ ok: false, message: "The check failed. Please try again in a moment." }, { status: 503 });
    }
    console.error("[checker/run] Call 1 failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false, message: "Something went wrong running the check. Please try again." }, { status: 503 });
  }

  // Exa 501 surfaces here as a real, empty answer (see engines/exa.ts) —
  // not a crash. It flows through the exact same scoring path as any other
  // answer: no mention, score 0, real evidence, never a fabricated report.
  const isEmptyAnswer = answer.trim().length === 0;
  const mentions = findMentions(answer, businessName, keyword);
  const { score, breakdown } = scoreVisibility({ answer, mentions, sources, website: website || null });

  // Call 2 — prose only, never influences the measured score above. Not
  // worth running (and not worth the extra Exa cost) on an empty answer.
  const generated = isEmptyAnswer ? null : await analyse({ answer, businessName, matched: mentions.matched, score });

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
    engine: engine.id,
    model,
    answer,
    sources,
    matched: mentions.matched,
    variantMatched: mentions.variantMatched,
    firstIndex: mentions.firstIndex,
    mentionCount: mentions.count,
    score,
    competitors: generated?.competitors ?? [],
    strengths: generated?.strengths ?? null,
    weaknesses: generated?.weaknesses ?? null,
    recommendations: generated?.recommendations ?? null,
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
    status: isEmptyAnswer ? "no-answer" : "ok",
  });

  // Increment only for a real answer — a 501/empty answer is real evidence
  // (saved above) but not a report the visitor actually got value from, so
  // it must not cost them one of their two free reports.
  if (!isEmptyAnswer) {
    try {
      await sql`
        INSERT INTO usage_counters (visitor_id, ip_hash, count, first_seen, last_seen)
        VALUES (${visitorId}, ${ipHash}, 1, now(), now())
        ON CONFLICT (visitor_id) DO UPDATE SET count = usage_counters.count + 1, last_seen = now()
      `;
    } catch (err) {
      console.error("[checker/run] Failed to increment usage_counters:", err instanceof Error ? err.message : String(err));
    }
  }

  const response = NextResponse.json({
    ok: true,
    report: {
      id: row?.id ?? null,
      status: isEmptyAnswer ? "no-answer" : "ok",
      message: isEmptyAnswer ? "No answer was returned for this query. This did not use one of your free reports." : undefined,
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
  engine: string;
  model: string;
  answer: string;
  sources: string[];
  matched: boolean;
  variantMatched: string | null;
  firstIndex: number | null;
  mentionCount: number;
  score: number;
  competitors: string[];
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  recommendations?: unknown;
  userAgent: string | null;
  referrer: string | null;
  status: "ok" | "no-answer";
}

/** A database write failure must never lose the report the caller is about
 * to receive — this only ever logs and returns null on failure, it never
 * throws. */
async function saveRow(input: SaveRowInput): Promise<{ id: string } | null> {
  try {
    const rows = (await sql`
      INSERT INTO reports (
        business_name, website, email, keyword, city, region, country,
        engine, model, query_sent, raw_answer, grounding_sources,
        mentioned, variant_matched, mention_index, mention_count, competitors,
        visibility_score, strengths, weaknesses, recommendations,
        visitor_id, ip_hash, user_agent, referrer, status
      ) VALUES (
        ${input.businessName}, ${input.website || null}, ${input.email}, ${input.keyword}, ${input.city},
        ${input.region || null}, ${input.country}, ${input.engine}, ${input.model}, ${input.query},
        ${input.answer}, ${JSON.stringify(input.sources)}, ${input.matched}, ${input.variantMatched}, ${input.firstIndex},
        ${input.mentionCount}, ${JSON.stringify(input.competitors)}, ${input.score},
        ${input.strengths ? JSON.stringify(input.strengths) : null},
        ${input.weaknesses ? JSON.stringify(input.weaknesses) : null},
        ${input.recommendations ? JSON.stringify(input.recommendations) : null},
        ${input.visitorId}, ${input.ipHash}, ${input.userAgent}, ${input.referrer}, ${input.status}
      )
      RETURNING id
    `) as Array<{ id: string }>;
    return rows[0] ?? null;
  } catch (err) {
    console.error("[checker/run] Failed to save report row:", err instanceof Error ? err.message : String(err));
    return null;
  }
}
