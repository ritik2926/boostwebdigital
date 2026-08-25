/**
 * Shared transactional-email template. Table-based layout, all styles
 * inline, no web fonts — the rules that look outdated are the ones that
 * keep this rendering correctly in Outlook/Gmail/Apple Mail. Brand colours
 * and layout are the light, real-company treatment (docs/PASTE-fix-
 * contact.txt) — deliberately not the site's own dark theme, which most
 * clients render unpredictably.
 */

const FONT_STACK = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const LOGO_URL = "https://boostwebdigital.com/logo/logo-email.png";

const COLOR = {
  blue: "#2221ee",
  ink: "#0c0b0b",
  body: "#3f3f46",
  muted: "#71717a",
  hairline: "#e4e4e7",
  background: "#f4f4f5",
  card: "#ffffff",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A zero-height, zero-font-size spacer row — the email-safe way to add
 * vertical gap between block elements without relying on CSS margin,
 * which several Outlook builds collapse or ignore between tables. */
function spacer(px: number): string {
  return `<div style="height:${px}px;line-height:${px}px;font-size:0;">&nbsp;</div>`;
}

/** A 1px rule via a coloured <td>, not a CSS border — Outlook drops
 * `border` on table cells more often than it drops a bgcolor fill. */
function hairlineRule(color: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${color}" style="height:1px;line-height:0;font-size:0;">&nbsp;</td></tr></table>`;
}

export function renderEmail(opts: {
  preheader: string;
  heading: string;
  bodyHtml: string; // caller-supplied, already escaped
  bodyText: string; // plain-text equivalent of bodyHtml — the text part is
  // derived from this directly, never from stripping tags out of bodyHtml,
  // since a generic tag-strip can mangle entities/whitespace unpredictably.
  cta?: { label: string; url: string };
  footerNote?: string;
  showSignature?: boolean; // default true
}): { html: string; text: string } {
  const showSignature = opts.showSignature ?? true;
  const preheader = escapeHtml(opts.preheader);
  const heading = escapeHtml(opts.heading);
  const footerNote = opts.footerNote ? escapeHtml(opts.footerNote) : undefined;
  const ctaLabel = opts.cta ? escapeHtml(opts.cta.label) : undefined;
  const ctaUrl = opts.cta ? escapeHtml(opts.cta.url) : undefined;

  const ctaHtml =
    ctaLabel && ctaUrl
      ? `${spacer(8)}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td bgcolor="${COLOR.blue}" style="border-radius: 8px; background-color: ${COLOR.blue};">
              <a href="${ctaUrl}" style="display: inline-block; padding: 14px 28px; font-family: ${FONT_STACK}; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none;">
                ${ctaLabel}
              </a>
            </td>
          </tr>
        </table>`
      : "";

  const signatureHtml = showSignature
    ? `${spacer(24)}
      ${hairlineRule(COLOR.hairline)}
      ${spacer(24)}
      <p style="margin: 0; font-family: ${FONT_STACK}; font-size: 15px; font-weight: 700; color: ${COLOR.ink};">Ritik Malhotra</p>
      <p style="margin: 4px 0 0 0; font-family: ${FONT_STACK}; font-size: 14px; color: ${COLOR.muted};">Founder, Boost Web Digital</p>
      <p style="margin: 4px 0 0 0; font-family: ${FONT_STACK}; font-size: 14px;">
        <a href="https://boostwebdigital.com" style="color: ${COLOR.blue}; text-decoration: none;">boostwebdigital.com</a>
      </p>`
    : "";

  const footerLine2 = footerNote ? `<br />${footerNote}` : "";

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>${heading}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: ${COLOR.background};">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;">${preheader}${"&zwnj;&nbsp;".repeat(40)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.background}" style="background-color: ${COLOR.background};">
      <tr>
        <td align="center" style="padding: 32px 16px;">

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.card}" style="max-width: 600px; width: 100%; background-color: ${COLOR.card}; border-radius: 12px; border: 1px solid ${COLOR.hairline};">
            <tr>
              <td style="padding: 28px; text-align: left;">
                <img
                  src="${LOGO_URL}"
                  width="200"
                  height="45"
                  alt="Boost Web Digital"
                  style="display: block; border: 0; font-family: ${FONT_STACK}; font-size: 20px; font-weight: 700; color: ${COLOR.ink};"
                />
              </td>
            </tr>
            <tr>
              <td height="3" bgcolor="${COLOR.blue}" style="height: 3px; line-height: 0; font-size: 0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <h1 style="margin: 0 0 16px 0; font-family: ${FONT_STACK}; font-size: 24px; font-weight: 700; color: ${COLOR.ink}; line-height: 1.3;">${heading}</h1>
                <div style="font-family: ${FONT_STACK}; font-size: 16px; color: ${COLOR.body}; line-height: 1.6;">
                  ${opts.bodyHtml}
                </div>
                ${ctaHtml}
                ${signatureHtml}
              </td>
            </tr>
          </table>

          ${spacer(24)}

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
            <tr>
              <td align="center" style="font-family: ${FONT_STACK}; font-size: 12px; line-height: 1.5; color: ${COLOR.muted}; text-align: center;">
                Boost Web Digital &middot; Amritsar, Punjab, India${footerLine2}
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textLines = [opts.heading, "", opts.bodyText];
  if (opts.cta) textLines.push("", `${opts.cta.label}: ${opts.cta.url}`);
  if (showSignature) {
    textLines.push("", "--", "Ritik Malhotra", "Founder, Boost Web Digital", "https://boostwebdigital.com", "Amritsar, Punjab, India");
  }
  if (opts.footerNote) textLines.push("", opts.footerNote);
  textLines.push("", "Boost Web Digital · Amritsar, Punjab, India");

  return { html, text: textLines.join("\n") };
}
