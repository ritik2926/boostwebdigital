import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/design-lab/", "/handbook/", "/tools/ai-visibility-checker/report/"],
    },
    sitemap: "https://boostwebdigital.com/sitemap_index.xml",
  };
}
