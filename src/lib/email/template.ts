/**
 * One shared transactional-email template. Table-based layout + inline
 * styles throughout (not classes) — required for Outlook/older clients,
 * which strip <style> blocks and most CSS entirely. Dark background to
 * match the brand (`#08080a`/`#f2f2f5`/accent `#3B4FDB`, same tokens as
 * globals.css) rather than the more common light-email default — this is
 * the first email built against this template, so there's no existing
 * precedent to break.
 *
 * Every future transactional email (the separate, not-yet-built
 * blog-publish notification included) should call this rather than
 * hand-rolling another HTML string.
 */

const BRAND_BG = "#08080a";
const BRAND_SURFACE = "#0f0f13";
const BRAND_TEXT = "#f2f2f5";
const BRAND_MUTED = "#a1a1aa";
const BRAND_ACCENT = "#3B4FDB";
const SITE_URL = "https://boostwebdigital.com";

export interface RenderEmailOptions {
  /** Used as the <title> and the email's Subject line by the caller. */
  subject: string;
  /** Hidden preview text shown in the inbox list, before the email opens. */
  preheader: string;
  heading: string;
  /** One or more paragraphs, rendered in order. */
  body: string[];
  cta: { label: string; url: string };
  /** Appends "— Ritik Malhotra, Founder, Boost Web Digital" below the body. */
  showSignature?: boolean;
  footerNote: string;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderEmail({ subject, preheader, heading, body, cta, showSignature, footerNote }: RenderEmailOptions): {
  html: string;
  text: string;
} {
  const paragraphsHtml = body
    .map(
      (p) =>
        `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${BRAND_TEXT};">${escapeHtml(p)}</p>`
    )
    .join("");

  const signatureHtml = showSignature
    ? `<p style="margin:24px 0 0 0;font-size:15px;line-height:1.6;color:${BRAND_TEXT};">— Ritik Malhotra<br/><span style="color:${BRAND_MUTED};">Founder, Boost Web Digital</span></p>`
    : "";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND_BG};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BG};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:${BRAND_SURFACE};border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${BRAND_TEXT};text-transform:uppercase;">Boost Web Digital</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0 32px;font-family:Arial,Helvetica,sans-serif;">
                <h1 style="margin:0 0 20px 0;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND_TEXT};">${escapeHtml(heading)}</h1>
                ${paragraphsHtml}
                ${signatureHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 32px 32px;font-family:Arial,Helvetica,sans-serif;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background-color:${BRAND_ACCENT};">
                      <a href="${cta.url}" style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(cta.label)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px 32px;border-top:1px solid rgba(255,255,255,0.08);font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND_MUTED};">${escapeHtml(footerNote)}</p>
                <p style="margin:12px 0 0 0;font-size:12px;line-height:1.6;color:${BRAND_MUTED};">
                  <a href="${SITE_URL}" style="color:${BRAND_MUTED};">boostwebdigital.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [heading, "", ...body, "", `${cta.label}: ${cta.url}`, "", ...(showSignature ? ["— Ritik Malhotra", "Founder, Boost Web Digital", ""] : []), footerNote].join(
    "\n"
  );

  return { html, text };
}
