import type { NextConfig } from "next";

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
