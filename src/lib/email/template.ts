/**
 * Shared transactional-email template. Table-based layout, all styles
 * inline, no web fonts — the rules that look outdated are the ones that
 * keep this rendering correctly in Outlook/Gmail/Apple Mail rather than
 * reproducing the site's own (unsupported-in-email) dark theme and CSS.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
}): { html: string; text: string } {
  const preheader = escapeHtml(opts.preheader);
  const heading = escapeHtml(opts.heading);
  const footerNote = opts.footerNote ? escapeHtml(opts.footerNote) : undefined;
  const ctaLabel = opts.cta ? escapeHtml(opts.cta.label) : undefined;
  const ctaUrl = opts.cta ? escapeHtml(opts.cta.url) : undefined;

  const fontStack = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const ctaHtml =
    ctaLabel && ctaUrl
      ? `
        <tr>
          <td style="padding: 8px 0 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-radius: 6px; background-color: #3B4FDB;">
                  <a href="${ctaUrl}" style="display: inline-block; padding: 12px 24px; font-family: ${fontStack}; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
                    ${ctaLabel}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
      : "";

  const footerHtml = footerNote
    ? `<p style="margin: 0 0 12px 0; font-family: ${fontStack}; font-size: 13px; line-height: 1.5; color: #666666;">${footerNote}</p>`
    : "";

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${heading}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f5;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px;">
            <tr>
              <td style="padding: 40px 32px 24px 32px;">
                <h1 style="margin: 0; font-family: ${fontStack}; font-size: 22px; line-height: 1.3; color: #111111;">${heading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 8px 32px; font-family: ${fontStack}; font-size: 15px; line-height: 1.6; color: #111111;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 32px 32px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${ctaHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 32px 32px 32px; border-top: 1px solid #e5e5e5;">
                ${footerHtml}
                <p style="margin: 0; font-family: ${fontStack}; font-size: 13px; line-height: 1.5; color: #999999;">
                  Boost Web Digital &middot; Amritsar, Punjab, India<br />
                  <a href="https://boostwebdigital.com" style="color: #999999; text-decoration: underline;">boostwebdigital.com</a>
                </p>
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
  if (opts.footerNote) textLines.push("", opts.footerNote);
  textLines.push("", "Boost Web Digital · Amritsar, Punjab, India", "https://boostwebdigital.com");

  return { html, text: textLines.join("\n") };
}
