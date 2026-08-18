import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    // Destination has the trailing slash explicitly ("/blogs/", not "/blogs")
    // — with trailingSlash:true, a slash-less destination triggers a SECOND
    // redirect hop (/blog/ → /blogs → /blogs/), which fails the single-hop
    // requirement this exact redirect is verified against.
    return [{ source: "/blog", destination: "/blogs/", permanent: true }];
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
