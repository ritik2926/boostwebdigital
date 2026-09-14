import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { getAllNavItems } from "./src/lib/navigation";

/**
 * Build-time assertion (Phase 1, sitewide nav map): every `live: true` href
 * declared in src/lib/navigation.ts must resolve to a real
 * `src/app/**‍/page.tsx` — a live nav entry pointing at a route that
 * doesn't exist yet is a shipped 404, not a plumbing detail. Runs here
 * (plain Node, evaluated once at the very start of `next build`/`next
 * dev`, never bundled into client code) rather than inside a component,
 * so a broken mapping fails the build itself with the offending href named
 * in the message, instead of surfacing as a runtime 404 a visitor finds
 * first.
 */
function assertLiveNavRoutesExist(): void {
  const appDir = path.join(__dirname, "src", "app");
  const missing: string[] = [];

  for (const item of getAllNavItems()) {
    if (!item.live) continue;
    const relative = item.href.replace(/^\/+|\/+$/g, "");
    const pagePath = path.join(appDir, relative, "page.tsx");
    if (!fs.existsSync(pagePath)) {
      missing.push(`"${item.href}" (expected src/app/${relative}/page.tsx)`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[src/lib/navigation.ts] ${missing.length} live nav href(s) have no matching route:\n  - ${missing.join(
        "\n  - "
      )}\nEither build the missing page(s) or set live: false until they exist.`
    );
  }
}

assertLiveNavRoutesExist();

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    // blog.boostwebdigital.com serves featured images from the headless WP
    // media library (src/lib/blog/wordpress.ts); secure.gravatar.com is
    // where WordPress's own author-avatar_urls point — both render through
    // next/image (PostHero, PostThumbnail, PostMeta, AuthorCard), which
    // throws on an unlisted remote host.
    remotePatterns: [
      { protocol: "https", hostname: "blog.boostwebdigital.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
  async redirects() {
    // Source and destination both carry the trailing slash explicitly.
    // A request for the already-slashed "/blog/" matches this rule directly
    // and reaches "/blogs/" in one hop. A request for the bare "/blog" does
    // NOT — with trailingSlash:true, Next's own slash-normalization redirect
    // fires first (on any path missing the slash) before custom redirects()
    // are evaluated at all, so "/blog" always hops to "/blog/" first and
    // only then matches this rule — two hops, for that one entry point
    // specifically. That's a trailingSlash/redirects() interaction in the
    // framework itself, not something this rule's source/destination
    // strings can avoid; the only way to actually collapse it to one hop
    // would be disabling trailingSlash sitewide or adding middleware —
    // both bigger changes than a redirect-rule fix.
    return [
      { source: "/blog/", destination: "/blogs/", permanent: true },
      // The flat sitemap.ts route was replaced by a Yoast-style
      // sitemap_index.xml + page-sitemap.xml/post-sitemap.xml split — this
      // keeps the URL already submitted in Search Console (and any other
      // existing references to it) resolving instead of 404ing.
      { source: "/sitemap.xml", destination: "/sitemap_index.xml", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
