// Served as a route handler rather than a public/ static file — a static
// file's MIME type on Vercel isn't guaranteed to be text/xsl (it can come
// back as application/octet-stream or text/plain depending on the CDN's
// extension table), and browsers silently skip an <?xml-stylesheet?>
// whose response Content-Type isn't XML/XSL, rendering the raw XML tree
// instead. A route handler lets us set the header explicitly.

const XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Sitemap — Boost Web Digital</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f4f4f5;
            color: #18181b;
          }
          .header {
            background: #0c0b0b;
            color: #ffffff;
            padding: 28px 32px;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
          }
          .header p {
            margin: 6px 0 0 0;
            font-size: 13px;
            color: #a1a1aa;
          }
          .header a {
            color: #8b93f5;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 24px 32px 64px 32px;
          }
          .count {
            font-size: 13px;
            color: #52525b;
            margin: 0 0 16px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
            border: 1px solid #e4e4e7;
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #71717a;
            background: #fafafa;
            padding: 12px 16px;
            border-bottom: 1px solid #e4e4e7;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #f0f0f1;
            font-size: 14px;
            vertical-align: top;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background: #fafafa;
          }
          a {
            color: #2221ee;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .lastmod {
            color: #52525b;
            white-space: nowrap;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Boost Web Digital — XML Sitemap</h1>
          <p>This is an XML sitemap, meant for search engines. <a href="/">Visit boostwebdigital.com</a></p>
        </div>
        <div class="container">
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <p class="count">
                This sitemap index contains <xsl:value-of select="count(s:sitemapindex/s:sitemap)"/> sitemaps.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Sitemap</th>
                    <th>Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:sitemapindex/s:sitemap">
                    <tr>
                      <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td class="lastmod"><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
            <xsl:when test="s:urlset">
              <p class="count">
                This sitemap contains <xsl:value-of select="count(s:urlset/s:url)"/> URLs.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:urlset/s:url">
                    <tr>
                      <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td class="lastmod"><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export async function GET() {
  return new Response(XSL, {
    headers: { "Content-Type": "text/xsl" },
  });
}
