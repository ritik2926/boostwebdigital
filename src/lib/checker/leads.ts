import { Resend } from "resend";
import { renderEmail, escapeHtml } from "@/lib/email/template";
import { buildVerdict } from "./reportCopy";

/**
 * Everything that happens AFTER a checker report is saved and the visitor
 * already has their answer on screen: the report email to them, the alert
 * to Ritik, and the Google Sheet mirror. Called from inside run/route.ts's
 * `after()` — see this file's own callers for why nothing here may ever
 * block or fail the HTTP response.
 *
 * Every sink below is independently try/caught and logs exactly one
 * ok/failed line, by design — one sink failing must never take another
 * down with it, and the visitor already has their report regardless of
 * what happens here.
 *
 * REWORK (2026-09-02, shareable-report task): both emails are now
 * doorways/briefs, not copies of the report — the report itself lives at
 * a permanent, shareable URL (src/app/tools/ai-visibility-checker/
 * report/[id]/page.tsx). Neither email needs the score breakdown,
 * competitors, or recommendations any more; both just link to the report
 * page instead of restating it.
 */

const FROM_EMAIL = "Boost Web Digital <hello@boostwebdigital.com>";
const OWNER_EMAIL = "ritik@boostwebdigital.com";
const SITE_URL = "https://boostwebdigital.com";
const CHECKER_PAGE_URL = `${SITE_URL}/tools/ai-visibility-checker/`;
const FOUNDER_PHOTO_URL = `${SITE_URL}/founder/ritik.jpg`;
const SHEET_WEBHOOK_TIMEOUT_MS = 10_000;

const FOUNDER_NOTE =
  "I read every report that comes through here. If anything above doesn't make sense, or you want to know what it would take to fix it, reply to this email and you'll get me — not a form.";

export interface LeadCompetitor {
  name: string;
  appearedIn: number;
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
  ownDomainCited: boolean;
  competitors: LeadCompetitor[]; // still needed for the Sheet mirror's payload
  // The matched answer with the earliest (best) relative position, or null
  // if the business wasn't named in any answer — still needed for the
  // Sheet mirror's mention_index; no longer used by either email.
  bestAnswer: LeadBestAnswer | null;
  // False for a "no-answer" report (Exa returned nothing for any of the
  // three questions) — the owner alert still fires either way, but the
  // visitor email and the Sheet mirror do not (see sendLeadNotifications).
  hasAnswer: boolean;
}

function reportUrl(reportId: string | null): string {
  return reportId ? `${SITE_URL}/tools/ai-visibility-checker/report/${reportId}/` : CHECKER_PAGE_URL;
}

/**
 * The one-line version of section 3's interpretation, for the visitor
 * email only — the email is a doorway to the report, not a copy of it, so
 * this is deliberately shorter than reportCopy.ts's buildInterpretation()
 * and does not repeat every measured number. Same branch logic (named vs
 * not) × (own domain cited vs not), same governing rules: never more
 * certainty than the data supports, never an engine name not queried.
 */
function buildOneLineTakeaway(input: { businessName: string; namedCount: number; ownDomainCited: boolean }): string {
  const { businessName, namedCount, ownDomainCited } = input;
  if (namedCount === 0 && !ownDomainCited) return `Right now, this engine doesn't mention ${businessName} at all.`;
  if (namedCount === 0 && ownDomainCited) return `This engine reads your site, but never names ${businessName} as the answer.`;
  if (namedCount > 0 && !ownDomainCited) return `${businessName} was named, but not because of your own website.`;
  return `${businessName} is both named and cited as a source — the strongest position to be in.`;
}

/**
 * SINK 1 — the report email to the VISITOR who submitted the form. Short —
 * a doorway to the report page, not a copy of it. Transactional (they
 * asked for this by submitting), so no unsubscribe link and, deliberately,
 * no newsletter signup — consent to receive a report is not consent to
 * receive a newsletter.
 */
async function sendVisitorEmail(data: LeadReportData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[checker/leads] visitor email: skipped (RESEND_API_KEY not set)");
    return;
  }

  const verdict = buildVerdict({ businessName: data.businessName, namedCount: data.namedCount, totalQueries: data.totalQueries });
  const subject =
    data.namedCount > 0
      ? `${data.businessName} was named in ${data.namedCount} of ${data.totalQueries} answers for '${data.keyword}'`
      : `${data.businessName} was not named in any of ${data.totalQueries} answers for '${data.keyword}'`;

  const oneLiner = buildOneLineTakeaway({ businessName: data.businessName, namedCount: data.namedCount, ownDomainCited: data.ownDomainCited });
  const url = reportUrl(data.reportId);

  // `heading` below already renders the verdict as the email's own H1 (and
  // renderEmail's text version already prepends `heading` before
  // `bodyText`) — the body must not repeat it, or the verdict appears
  // twice in a row.
  const bodyHtml =
    `<p style="margin: 0 0 16px 0;"><strong>Visibility score:</strong> ${data.score}/100</p>` + `<p style="margin: 0;">${escapeHtml(oneLiner)}</p>`;

  const bodyTextLines = [`Visibility score: ${data.score}/100`, "", oneLiner];

  // Founder block — HTML email, so it's a table (Outlook-safe), not flexbox.
  const founderHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; padding-top: 24px; border-top: 1px solid #e4e4e7; width: 100%;">
      <tr>
        <td style="width: 72px; vertical-align: top;">
          <img src="${FOUNDER_PHOTO_URL}" width="64" height="64" alt="Ritik Malhotra" style="display: block; border: 0; border-radius: 9999px; width: 64px; height: 64px;" />
        </td>
        <td style="vertical-align: top; padding-left: 16px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0c0b0b;">Ritik Malhotra</p>
          <p style="margin: 2px 0 0 0; font-size: 13px; color: #71717a;">Founder, Boost Web Digital</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.6; color: #3f3f46;">&ldquo;${escapeHtml(FOUNDER_NOTE)}&rdquo;</p>
        </td>
      </tr>
    </table>`;

  const { html, text } = renderEmail({
    preheader: subject,
    heading: verdict,
    bodyHtml: bodyHtml + founderHtml,
    bodyText: [...bodyTextLines, "", "Ritik Malhotra, Founder, Boost Web Digital:", `"${FOUNDER_NOTE}"`].join("\n"),
    cta: { label: "Open your full report", url },
    showSignature: false,
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

function buildHotness(score: number): string {
  if (score === 0) return "STRONG — they have just discovered they are invisible. Best possible moment to reply.";
  if (score < 40) return "GOOD — barely visible. Clear gap to sell against.";
  if (score < 70) return "MEDIUM — partially visible. Sell improvement, not rescue.";
  return "WEAK FIT — already visible. Low urgency.";
}

/**
 * SINK 2 — the internal alert to Ritik. A SALES BRIEF ABOUT A PERSON, not
 * a copy of the AI report — no source list, no answers, no competitor
 * list. Deliberately NOT renderEmail() — no branding, no logo, dense and
 * scannable, built to be searched/sorted in Gmail by subject line. Reply-
 * To is the PROSPECT's address so replying in Gmail goes straight to them.
 */
async function sendOwnerAlert(data: LeadReportData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[checker/leads] owner alert: skipped (RESEND_API_KEY not set)");
    return;
  }

  const subject = !data.hasAnswer
    ? `[Checker] ${data.businessName} — ${data.city} — NO ANSWER RETURNED`
    : data.namedCount > 0
      ? `[Checker] ${data.businessName} — ${data.city} — Score ${data.score} — NAMED IN ${data.namedCount} OF ${data.totalQueries}`
      : `[Checker] ${data.businessName} — ${data.city} — Score ${data.score} — NOT NAMED`;

  const textLines = [
    subject,
    "",
    "WHO",
    `  ${data.businessName} · ${data.city}${data.region ? ", " + data.region : ""}, ${data.country}`,
    `  Website: ${data.website ?? "none given"}`,
    `  Email:   ${data.email}`,
    `  Keyword: ${data.keyword}`,
    "",
  ];

  if (data.hasAnswer) {
    textLines.push("HOW HOT", `  ${buildHotness(data.score)}`);
    if (!data.website) textLines.push("  No website given — score understated.");
    textLines.push("");
  } else {
    textLines.push("HOW HOT", "  No answer was returned for any of the three questions — still a real lead.", "");
  }

  textLines.push("THE REPORT", `  ${reportUrl(data.reportId)}`);
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
 * Fires the applicable sinks concurrently. Every sink above already
 * catches its own errors and never throws, so this never rejects — but
 * it's still awaited from inside `after()` in run/route.ts, never before
 * the response is returned to the visitor.
 *
 * The owner alert ALWAYS fires — someone who submitted the form is a real
 * lead regardless of whether Exa returned an answer. The visitor email and
 * the Sheet mirror only fire when `hasAnswer` is true: there's no report
 * to send the visitor for a no-answer result, and no answer-derived data
 * worth mirroring to the Sheet.
 */
export async function sendLeadNotifications(data: LeadReportData): Promise<void> {
  const tasks: Promise<void>[] = [sendOwnerAlert(data)];
  if (data.hasAnswer) {
    tasks.push(sendVisitorEmail(data), mirrorToSheet(data));
  }
  await Promise.all(tasks);
}
