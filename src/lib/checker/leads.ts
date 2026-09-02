import { Resend } from "resend";
import { renderEmail, escapeHtml } from "@/lib/email/template";

/**
 * Everything that happens AFTER a checker report is saved and the visitor
 * already has their answer on screen: the report email to them, the alert
 * to Ritik, and the Google Sheet mirror. Called from inside run/route.ts's
 * `after()` — see this file's own callers for why nothing here may ever
 * block or fail the HTTP response.
 *
 * Every sink below is independently try/caught and logs exactly one
 * ok/failed line, by design (see this task's report) — one sink failing
 * must never take another down with it, and the visitor already has their
 * report regardless of what happens here.
 */

const FROM_EMAIL = "Boost Web Digital <hello@boostwebdigital.com>";
const OWNER_EMAIL = "ritik@boostwebdigital.com";
const CHECKER_PAGE_URL = "https://boostwebdigital.com/tools/ai-visibility-checker/";
const SHEET_WEBHOOK_TIMEOUT_MS = 10_000;

export interface LeadCompetitor {
  name: string;
  appearedIn: number;
}

export interface LeadRecommendation {
  title: string;
  why: string;
  effort: string;
}

export interface LeadBestAnswer {
  answer: string;
  firstIndex: number;
}

export interface LeadReportData {
  reportId: string | null;
  businessName: string;
  email: string;
  website: string | null;
  keyword: string;
  city: string;
  region: string | null;
  country: string;
  namedCount: number;
  totalQueries: number;
  score: number;
  breakdown: Array<{ signal: string; points: number }>;
  competitors: LeadCompetitor[];
  recommendations: LeadRecommendation[] | null;
  // The matched answer with the earliest (best) relative position, or null
  // if the business wasn't named in any answer — same "best" answer
  // run/route.ts already tracks for the score's position bonus.
  bestAnswer: LeadBestAnswer | null;
}

/**
 * A rough, honest "named Nth" for a subject line — NOT the measured score,
 * which never depends on competitor ranking (see parse.ts's own header
 * comment). Counts how many aggregated competitor names appear earlier than
 * the business's own first mention in its best answer, case-insensitive
 * substring search — the same convention this codebase already used for a
 * display-only rank before the three-query rework. Returns null when the
 * business wasn't named anywhere, since "position" has no meaning then.
 */
function computePosition(bestAnswer: LeadBestAnswer | null, competitors: LeadCompetitor[]): number | null {
  if (!bestAnswer) return null;
  const lowerAnswer = bestAnswer.answer.toLowerCase();
  const earlier = competitors.filter((c) => {
    const idx = lowerAnswer.indexOf(c.name.toLowerCase());
    return idx !== -1 && idx < bestAnswer.firstIndex;
  }).length;
  return 1 + earlier;
}

function namedLabel(position: number | null): string {
  return position === null ? "NOT NAMED" : `NAMED #${position}`;
}

/**
 * SINK 1 — the report email to the VISITOR who submitted the form.
 * Transactional (they asked for this by submitting), so no unsubscribe
 * link and, deliberately, no newsletter signup — consent to receive a
 * report is not consent to receive a newsletter (see this task's report).
 */
async function sendVisitorEmail(data: LeadReportData, position: number | null): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[checker/leads] visitor email: skipped (RESEND_API_KEY not set)");
    return;
  }

  const heading = position === null ? `${data.businessName} was not named` : `${data.businessName} was named #${position}`;
  const subject =
    position === null
      ? `${data.businessName} was not named in AI search for '${data.keyword}'`
      : `${data.businessName} was named #${position} in AI search for '${data.keyword}'`;

  const verdictLine =
    data.namedCount > 0
      ? `In our check for &ldquo;${escapeHtml(data.keyword)}&rdquo; near ${escapeHtml(data.city)}, ${escapeHtml(data.businessName)} was named in ${data.namedCount} of ${data.totalQueries} answers.`
      : `In our check for &ldquo;${escapeHtml(data.keyword)}&rdquo; near ${escapeHtml(data.city)}, ${escapeHtml(data.businessName)} was not named in any of the ${data.totalQueries} answers.`;

  const topCompetitors = data.competitors.slice(0, 3);
  const competitorsLine =
    topCompetitors.length > 0
      ? `<p style="margin: 0 0 16px 0;"><strong>Named instead:</strong> ${escapeHtml(topCompetitors.map((c) => c.name).join(", "))}</p>`
      : "";

  const topRecommendation = data.recommendations?.[0] ?? null;
  const recommendationHtml = topRecommendation
    ? `<p style="margin: 0 0 4px 0;"><strong>Top recommendation:</strong> ${escapeHtml(topRecommendation.title)}</p>` +
      `<p style="margin: 0 0 16px 0;">${escapeHtml(topRecommendation.why)}</p>`
    : "";

  const bodyHtml =
    `<p style="margin: 0 0 16px 0;">${verdictLine}</p>` +
    `<p style="margin: 0 0 16px 0;"><strong>Visibility score:</strong> ${data.score}/100</p>` +
    competitorsLine +
    recommendationHtml +
    `<p style="margin: 0;">This was three questions, on one engine. Different AI engines search different indexes.</p>`;

  const bodyTextLines = [
    verdictLine.replace(/&ldquo;|&rdquo;/g, '"'),
    "",
    `Visibility score: ${data.score}/100`,
  ];
  if (topCompetitors.length > 0) bodyTextLines.push("", `Named instead: ${topCompetitors.map((c) => c.name).join(", ")}`);
  if (topRecommendation) bodyTextLines.push("", `Top recommendation: ${topRecommendation.title}`, topRecommendation.why);
  bodyTextLines.push("", "This was three questions, on one engine. Different AI engines search different indexes.");

  const { html, text } = renderEmail({
    preheader: subject,
    heading,
    bodyHtml,
    bodyText: bodyTextLines.join("\n"),
    cta: { label: "See your full report", url: CHECKER_PAGE_URL },
    showSignature: true,
  });

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      replyTo: OWNER_EMAIL,
      subject,
      html,
      text,
    });
    console.log(`[checker/leads] visitor email: ${error ? "failed" : "ok"}`);
  } catch {
    console.log("[checker/leads] visitor email: failed");
  }
}

/**
 * SINK 2 — the internal alert to Ritik. Deliberately NOT renderEmail() —
 * no branding, no logo, dense and scannable, built to be searched/sorted in
 * Gmail by subject line rather than read as a polished document. Reply-To
 * is the PROSPECT's address so replying in Gmail goes straight to the lead.
 */
async function sendOwnerAlert(data: LeadReportData, position: number | null): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[checker/leads] owner alert: skipped (RESEND_API_KEY not set)");
    return;
  }

  const subject = `[Checker] ${data.businessName} — ${data.city} — Score ${data.score} — ${namedLabel(position)}`;

  const breakdownLines = data.breakdown.length > 0 ? data.breakdown.map((row) => `  +${row.points}  ${row.signal}`) : ["  (no signals earned)"];
  const competitorLines =
    data.competitors.length > 0 ? data.competitors.map((c) => `  ${c.name} — named in ${c.appearedIn} of ${data.totalQueries}`) : ["  (none named)"];

  const textLines = [
    subject,
    "",
    `Business:    ${data.businessName}`,
    `Website:     ${data.website ?? "(not provided)"}`,
    `Email:       ${data.email}`,
    `Keyword:     ${data.keyword}`,
    `Location:    ${data.city}${data.region ? ", " + data.region : ""}, ${data.country}`,
    `Named in:    ${data.namedCount} of ${data.totalQueries} answers`,
    `Score:       ${data.score}/100`,
    "",
    "Score breakdown:",
    ...breakdownLines,
    "",
    "Named instead:",
    ...competitorLines,
    "",
    `Report ID (Neon "reports" table): ${data.reportId ?? "(not saved)"}`,
  ];
  const text = textLines.join("\n");
  const html = `<pre style="font-family: ui-monospace, monospace; font-size: 13px; white-space: pre-wrap;">${escapeHtml(text)}</pre>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: data.email,
      subject,
      html,
      text,
    });
    console.log(`[checker/leads] owner alert: ${error ? "failed" : "ok"}`);
  } catch {
    console.log("[checker/leads] owner alert: failed");
  }
}

/**
 * SINK 3 — mirrors one row to a Google Sheet via an Apps Script Web App
 * webhook. Apps Script answers a POST with a 302 to a googleusercontent
 * URL to deliver its response body — fetch follows that automatically, so
 * by the time this code sees `res`, the sheet write already happened on
 * the ORIGINAL POST regardless of whether the redirect was followed. No
 * retry: a missed row is recoverable from Neon, a retry storm against
 * someone's spreadsheet is not.
 */
async function mirrorToSheet(data: LeadReportData): Promise<void> {
  const url = process.env.SHEET_WEBHOOK_URL;
  const secret = process.env.SHEET_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.log("[checker/leads] sheet: skipped (SHEET_WEBHOOK_URL/SHEET_WEBHOOK_SECRET not set)");
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHEET_WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        secret,
        report_id: data.reportId,
        business_name: data.businessName,
        email: data.email,
        website: data.website,
        keyword: data.keyword,
        city: data.city,
        region: data.region,
        country: data.country,
        mentioned: data.namedCount > 0,
        mention_index: data.bestAnswer?.firstIndex ?? null,
        score: data.score,
        competitors: data.competitors.map((c) => c.name),
      }),
    });
    console.log(`[checker/leads] sheet: ${res.ok ? "ok" : "failed"}`);
  } catch {
    console.log("[checker/leads] sheet: failed");
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fires all three sinks concurrently. Every sink above already catches its
 * own errors and never throws, so this never rejects — but it's still
 * awaited from inside `after()` in run/route.ts, never before the response
 * is returned to the visitor.
 */
export async function sendLeadNotifications(data: LeadReportData): Promise<void> {
  const position = computePosition(data.bestAnswer, data.competitors);
  await Promise.all([sendVisitorEmail(data, position), sendOwnerAlert(data, position), mirrorToSheet(data)]);
}
