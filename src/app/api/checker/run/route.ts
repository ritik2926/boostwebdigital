import { NextRequest, NextResponse, after } from "next/server";
import { sql } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isDisposableEmail } from "@/lib/email/disposable";
import { buildQueries, DEFAULT_ENGINE_ID, getEngine, type BuiltQuery, type VisibilityEngine } from "@/lib/checker/engines";
import {
  ExaAuthError,
  ExaCreditsExhaustedError,
  ExaQueryError,
  ExaRateLimitError,
  ExaServerError,
} from "@/lib/checker/engines/exa";
import {
  aggregateSources,
  countCompetitorAppearances,
  findMentions,
  scoreVisibility,
  type QueryMentionResult,
  type RankedSource,
} from "@/lib/checker/parse";
import { analyse } from "@/lib/checker/analyse";
import { sendLeadNotifications } from "@/lib/checker/leads";
import { rescaleScore } from "@/lib/checker/scoreRows";
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
 *     city               text not null,  -- '' for "no city given" (PART 1,
 *                                        -- 2026-09-02) — NOT NULL was never
 *                                        -- altered; blank is stored as an
 *                                        -- empty string, never null
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
 *
 * THREE-QUERY REWORK (2026-09-02): no column was added or altered for this.
 * The single-query columns below are wide enough (text/jsonb) to carry the
 * three-query shape by serialising it, so nothing here required a schema
 * change:
 *   - query_sent  now holds JSON.stringify(the 3 {label, query} pairs)
 *   - raw_answer  now holds JSON.stringify(the 3 per-query results: label,
 *                 ok, answer, matched, variantMatched, firstIndex,
 *                 mentionCount, sources)
 *   - grounding_sources (jsonb) now holds the ranked, deduplicated source
 *     list aggregated across all successful answers (RankedSource[])
 *   - variant_matched now holds a comma-joined list of which query labels
 *     matched (e.g. "Q1,Q3"), or null if none did
 *   - mentioned / mention_index / mention_count / competitors / status keep
 *     their original meaning, aggregated across the up-to-three answers
 *     (see saveRow below for exactly how)
 * See this task's report for the full reasoning — this was a deliberate
 * choice to serialise into existing flexible columns rather than request a
 * migration.
 */

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
const MIN_SUBMIT_DELAY_MS = 3000;
const FREE_REPORTS_LIMIT = 2;
const IP_REPORTS_24H_LIMIT = 5;
// PART 7 (2026-09-02) — lifetime, not rolling, unlike the IP check above.
// A real practice has one email address, so this has no false positives
// for a genuine customer; someone clearing cookies to get more free
// reports now needs a fresh email address too, not just a fresh cookie.
const EMAIL_REPORTS_LIMIT = 2;

/**
 * FIX 3 — the only cap fully under our control. The per-visitor limit stops
 * one person; it does nothing against fifty people, or one person with
 * fifty cookies. This is what actually protects the Exa credit balance.
 * Change this number, not the query below, if the limit needs to move.
 *
 * FIX B (2026-09-02) — bounded by EXA, not by Resend. A report costs FOUR
 * Exa calls (3 answers + 1 analysis), ~$0.005 each, ~$0.02/report. Against
 * $10/month of free Exa credit that's ~500 reports/month; 15/day is
 * ~450/month — safely inside the free allotment — and still roughly 15x
 * the traffic this tool actually expects. (A same-day task briefly raised
 * this to 25 reasoning from Resend's email cap instead; that was reverted
 * — Exa credit is the binding constraint here, not Resend. Do not change
 * this number again without checking both budgets.)
 */
const DAILY_REPORT_CAP = 15;

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

  // 6. Validate input. City is optional (PART 1, 2026-09-02) — a national
  // or online-only business has no single city to check visibility "in".
  // Country stays required: the location string always needs something to
  // fall back to when city is blank (see buildLocationString).
  const businessName = requiredField(body.business_name, MAX_LENGTHS.business_name);
  const keyword = requiredField(body.keyword, MAX_LENGTHS.keyword);
  const city = optionalField(body.city, MAX_LENGTHS.city);
  const country = requiredField(body.country, MAX_LENGTHS.country);
  const region = optionalField(body.region, MAX_LENGTHS.region);
  const website = optionalField(body.website, MAX_LENGTHS.website);
  const emailRaw = requiredField(body.email, MAX_LENGTHS.email);

  if (!businessName || !keyword || city === null || !country || region === null || website === null || !emailRaw) {
    return NextResponse.json({ ok: false, message: "Please fill in every required field." }, { status: 400 });
  }
  const email = emailRaw.toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });
  }
  if (isDisposableEmail(email)) {
    return NextResponse.json({ ok: false, message: "Please use a permanent email address." }, { status: 400 });
  }

  // 7. Free-report + IP + EMAIL limits — FIX A (2026-09-02) plus PART 7
  // (same day, shareable-report task). Previously the IP check only ran
  // inside the cookie check's `else` branch, and used `>` instead of `>=`,
  // which together meant a cleared cookie could reach 6 reports per IP
  // before the 7th attempt was refused, and reset every 24h with no
  // lifetime backstop at all — "unlimited" in the sense that a visitor
  // willing to wait a day between cookie clears was never actually
  // stopped. All three checks now run every time, independently of each
  // other. The IP check uses `>=` so the 6th report from one IP within 24h
  // (not the 7th) is the one refused; it stays at 5 (never lower — offices
  // and mobile carriers share IPs). The email check is LIFETIME, not
  // rolling, and keyed on the already-lowercased/trimmed `email` — a real
  // practice has one email address, so clearing cookies now needs a fresh
  // email too. All three fail OPEN on a lookup error — a broken counter
  // must never block a genuine visitor, and the abuse rate limit + daily
  // cap above bound the cost of that either way.
  const existingVisitorId = verifyVisitorCookie(request.cookies.get(VISITOR_COOKIE_NAME)?.value);
  const visitorId = existingVisitorId ?? newVisitorId();
  const ipHash = hashIp(ip);

  let blocked = false;
  let previousReports: ReportRow[] = [];
  try {
    const usage = (await sql`SELECT count FROM usage_counters WHERE visitor_id = ${visitorId}`) as Array<{
      count: number;
    }>;
    const cookieBlocked = (usage[0]?.count ?? 0) >= FREE_REPORTS_LIMIT;

    const ipReports = (await sql`
      SELECT count(*)::int AS n FROM reports
      WHERE ip_hash = ${ipHash} AND created_at > now() - interval '24 hours'
    `) as Array<{ n: number }>;
    const ipBlocked = (ipReports[0]?.n ?? 0) >= IP_REPORTS_24H_LIMIT;

    const emailReports = (await sql`
      SELECT count(*)::int AS n FROM reports WHERE email = ${email}
    `) as Array<{ n: number }>;
    const emailBlocked = (emailReports[0]?.n ?? 0) >= EMAIL_REPORTS_LIMIT;

    if (cookieBlocked || ipBlocked || emailBlocked) {
      blocked = true;
      previousReports = (await sql`
        SELECT id, created_at, business_name, keyword, visibility_score
        FROM reports WHERE visitor_id = ${visitorId}
        ORDER BY created_at DESC
      `) as ReportRow[];
    }
  } catch (err) {
    console.warn("[checker/run] Free-report/IP/email limit lookup failed — failing open:", err instanceof Error ? err.message : String(err));
  }

  if (blocked) {
    // Reason is always "visitor-limit" on the wire regardless of which of
    // the three checks actually triggered — an email-specific reason value
    // would let someone probe which addresses have already used the tool.
    // Same response shape, same message, in every case.
    const response = NextResponse.json({ ok: true, blocked: true, reason: "visitor-limit", reports: previousReports });
    setVisitorCookie(response, visitorId);
    return response;
  }

  // 8. Build the three query variants and run all three against Exa in
  // parallel — the visitor is already waiting, and one unlucky phrasing
  // must not stand in for the whole verdict (see this task's report).
  const engine = getEngine(DEFAULT_ENGINE_ID);
  if (!engine) {
    return NextResponse.json({ ok: false, message: "Visibility checker is not configured." }, { status: 503 });
  }

  const queries = buildQueries({ keyword, city, region: region || null, country });
  const queryResults = await Promise.all(queries.map((q) => runOneQuery(engine, q)));

  const successResults = queryResults.filter((r): r is QueryRunSuccess => r.ok);
  if (successResults.length === 0) {
    // Total failure of all three — the only case that's a real error. No
    // row saved, no counter incremented, no fabricated data.
    const firstFailure = queryResults[0];
    const status = firstFailure && !firstFailure.ok ? firstFailure.status : 503;
    const message = firstFailure && !firstFailure.ok ? firstFailure.message : "Something went wrong running the check. Please try again.";
    console.error("[checker/run] All three queries failed.");
    return NextResponse.json({ ok: false, message }, { status });
  }

  const model = successResults[0]!.model;
  const failedLabels = queryResults.filter((r) => !r.ok).map((r) => r.label);

  // Exa 501 surfaces as a real, empty answer per query (see engines/exa.ts)
  // — not a crash. Every successful query flows through the exact same
  // scoring path: no mention, no points from it, real evidence, never a
  // fabricated report.
  const mentionResults: QueryMentionResult[] = successResults.map((r) => ({
    label: r.label,
    answer: r.answer,
    mentions: findMentions(r.answer, businessName, keyword),
  }));

  const isAllEmpty = successResults.every((r) => r.answer.trim().length === 0);
  const namedCount = mentionResults.filter((r) => r.mentions.matched).length;
  const matchedLabels = mentionResults.filter((r) => r.mentions.matched).map((r) => r.label);
  const totalMentionCount = mentionResults.reduce((sum, r) => sum + r.mentions.count, 0);

  // The firstIndex of whichever matched answer has the earliest (best)
  // relative position — same "which third" logic as scoreVisibility, kept
  // in step with it deliberately so the persisted mention_index always
  // corresponds to the answer that actually earned the position bonus.
  let bestFirstIndex: number | null = null;
  let bestAnswerText: string | null = null;
  let bestPosition = Infinity;
  for (const r of mentionResults) {
    if (!r.mentions.matched || r.mentions.firstIndex === null) continue;
    const position = r.mentions.firstIndex / Math.max(r.answer.length, 1);
    if (position < bestPosition) {
      bestPosition = position;
      bestFirstIndex = r.mentions.firstIndex;
      bestAnswerText = r.answer;
    }
  }

  const sources: RankedSource[] = aggregateSources(
    successResults.map((r) => ({ label: r.label, sources: r.sources })),
    website || null
  );
  const flatSourceUrls = sources.map((s) => s.url);
  const { score: rawScore, breakdown } = scoreVisibility({ results: mentionResults, sources: flatSourceUrls, website: website || null });
  // Rescaled onto only the points that were actually possible to earn — see
  // scoreRows.ts's own header comment. A no-op when a website was given.
  // This IS "the score" from here on: persisted, returned, and emailed —
  // the breakdown table's individual row weights stay at their original
  // (unrescaled) values, which is what makes the table itself an honest,
  // auditable record of the raw formula even though the headline number
  // above it is normalised.
  const score = rescaleScore(rawScore, Boolean(website));

  // Call 2 — prose only, never influences the measured score above. Runs
  // over every successful, non-empty answer combined. Not worth running
  // (or worth the extra Exa cost) when every answer that came back was
  // empty.
  const nonEmptyAnswers = successResults.filter((r) => r.answer.trim().length > 0);
  const generated = isAllEmpty
    ? null
    : await analyse({
        answers: nonEmptyAnswers.map((r) => ({ label: r.label, query: r.query, answer: r.answer })),
        businessName,
        namedCount,
        totalQueries: queries.length,
        score,
      });
  const competitors = generated
    ? countCompetitorAppearances(
        generated.competitors,
        nonEmptyAnswers.map((r) => r.answer)
      )
    : [];

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
    queries,
    engine: engine.id,
    model,
    queryResults,
    mentionResults,
    sources,
    matchedLabels,
    bestFirstIndex,
    totalMentionCount,
    namedCount,
    score,
    competitors,
    strengths: generated?.strengths ?? null,
    weaknesses: generated?.weaknesses ?? null,
    recommendations: generated?.recommendations ?? null,
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
    status: isAllEmpty ? "no-answer" : "ok",
  });

  // Increment only for a real answer — an all-empty result is real evidence
  // (saved above) but not a report the visitor actually got value from, so
  // it must not cost them one of their two free reports.
  if (!isAllEmpty) {
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
      status: isAllEmpty ? "no-answer" : "ok",
      message: isAllEmpty ? "No answer was returned for any of the three questions. This did not use one of your free reports." : undefined,
      model,
      queries,
      answers: queryResults.map((r) => {
        if (r.ok) {
          const mention = mentionResults.find((m) => m.label === r.label)!;
          return {
            label: r.label,
            query: r.query,
            ok: true,
            answer: r.answer,
            matched: mention.mentions.matched,
            variantMatched: mention.mentions.variantMatched,
            firstIndex: mention.mentions.firstIndex,
            mentionCount: mention.mentions.count,
            sources: r.sources,
          };
        }
        return {
          label: r.label,
          query: r.query,
          ok: false,
          answer: "",
          matched: false,
          variantMatched: null,
          firstIndex: null,
          mentionCount: 0,
          sources: [],
          error: r.message,
        };
      }),
      namedCount,
      totalQueries: queries.length,
      sources,
      score,
      breakdown,
      competitors: generated ? competitors : null,
      strengths: generated?.strengths ?? null,
      weaknesses: generated?.weaknesses ?? null,
      recommendations: generated?.recommendations ?? null,
      partialFailure: failedLabels.length > 0,
      failedQueries: failedLabels,
    },
  });
  setVisitorCookie(response, visitorId);

  // Fires the visitor email, the owner alert, and the Sheet mirror AFTER
  // this response is already on its way — the visitor has already waited
  // for three Exa calls plus an analysis call, they must not wait a
  // millisecond longer for an email or a spreadsheet write.
  //
  // The owner alert fires EVEN on a no-answer result: someone who submitted
  // the form is a real lead with a real email address regardless of
  // whether Exa returned an answer, and Ritik should hear about them. The
  // visitor email and the Sheet mirror still only fire for a real answer —
  // there's no report to send the visitor, and no answer-derived data
  // worth mirroring (see sendLeadNotifications's own `hasAnswer` branch).
  {
    const bestAnswer = bestFirstIndex !== null && bestAnswerText !== null ? { firstIndex: bestFirstIndex, answer: bestAnswerText } : null;
    after(() =>
      sendLeadNotifications({
        reportId: row?.id ?? null,
        businessName,
        email,
        website: website || null,
        keyword,
        city,
        region: region || null,
        country,
        namedCount,
        totalQueries: queries.length,
        score,
        ownDomainCited: sources.some((s) => s.isOwnDomain),
        competitors,
        bestAnswer,
        hasAnswer: !isAllEmpty,
      })
    );
  }

  return response;
}

/** One classification point for every Exa error this route treats
 * specially — used both per-query (when running the three in parallel) and
 * for the all-three-failed response, so the two paths can't drift apart. */
function classifyExaError(err: unknown): { status: number; message: string } {
  if (err instanceof ExaAuthError) {
    // exa.ts already logged the env var NAME (never its value) for a 401.
    return { status: 503, message: "Visibility checker is not configured correctly." };
  }
  if (err instanceof ExaCreditsExhaustedError) {
    return { status: 503, message: "The checker is temporarily out of capacity. Please try again later." };
  }
  if (err instanceof ExaQueryError) {
    return { status: 422, message: "That combination couldn't be checked. Please try different details." };
  }
  if (err instanceof ExaRateLimitError) {
    return { status: 503, message: "The checker is busy right now. Please try again in a moment." };
  }
  if (err instanceof ExaServerError) {
    return { status: 503, message: "The check failed. Please try again in a moment." };
  }
  return { status: 503, message: "Something went wrong running the check. Please try again." };
}

interface QueryRunSuccess {
  label: string;
  query: string;
  ok: true;
  answer: string;
  sources: string[];
  model: string;
}

interface QueryRunFailure {
  label: string;
  query: string;
  ok: false;
  status: number;
  message: string;
}

type QueryRunResult = QueryRunSuccess | QueryRunFailure;

/** Never throws — a single query's failure must not take the other two
 * down with it. Promise.all over three calls to this is what makes "one
 * fails, the other two still render" possible. */
async function runOneQuery(engine: VisibilityEngine, built: BuiltQuery): Promise<QueryRunResult> {
  try {
    const result = await engine.run(built.query);
    return { label: built.label, query: built.query, ok: true, answer: result.answer, sources: result.sources, model: result.model };
  } catch (err) {
    console.error(`[checker/run] ${built.label} failed:`, err instanceof Error ? err.message : String(err));
    const classified = classifyExaError(err);
    return { label: built.label, query: built.query, ok: false, status: classified.status, message: classified.message };
  }
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
  queries: BuiltQuery[];
  engine: string;
  model: string;
  queryResults: QueryRunResult[];
  mentionResults: QueryMentionResult[];
  sources: RankedSource[];
  matchedLabels: string[];
  bestFirstIndex: number | null;
  totalMentionCount: number;
  namedCount: number;
  score: number;
  competitors: Array<{ name: string; appearedIn: number }>;
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  recommendations?: unknown;
  userAgent: string | null;
  referrer: string | null;
  status: "ok" | "no-answer";
}

/** A database write failure must never lose the report the caller is about
 * to receive — this only ever logs and returns null on failure, it never
 * throws. Serialises the three-query shape into the existing single-query
 * columns — see this file's schema comment above for exactly what each
 * column now holds. */
async function saveRow(input: SaveRowInput): Promise<{ id: string } | null> {
  const rawAnswer = input.queryResults.map((r) => {
    if (r.ok) {
      const mention = input.mentionResults.find((m) => m.label === r.label);
      return {
        label: r.label,
        ok: true,
        answer: r.answer,
        matched: mention?.mentions.matched ?? false,
        variantMatched: mention?.mentions.variantMatched ?? null,
        firstIndex: mention?.mentions.firstIndex ?? null,
        mentionCount: mention?.mentions.count ?? 0,
        sources: r.sources,
      };
    }
    return { label: r.label, ok: false, answer: "", matched: false, variantMatched: null, firstIndex: null, mentionCount: 0, sources: [] };
  });

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
        ${input.region || null}, ${input.country}, ${input.engine}, ${input.model},
        ${JSON.stringify(input.queries)}, ${JSON.stringify(rawAnswer)}, ${JSON.stringify(input.sources)},
        ${input.namedCount > 0}, ${input.matchedLabels.length > 0 ? input.matchedLabels.join(",") : null}, ${input.bestFirstIndex},
        ${input.totalMentionCount}, ${JSON.stringify(input.competitors)}, ${input.score},
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
