/**
 * Shared JSON-LD nodes, referenced by @id across every page's @graph.
 * Matches the style of src/lib/specialties.ts — plain exported consts and
 * helper functions, no framework imports.
 */

const SITE_URL = "https://boostwebdigital.com";

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Boost Web Digital",
  alternateName: "Boost Web Digital — Healthcare Marketing & AI Visibility",
  url: SITE_URL,
  logo: `${SITE_URL}/logo/logo-dark.svg`,
  description:
    "Boost Web Digital is a healthcare-only marketing agency that gets medical practices named by AI search engines like ChatGPT, Google AI Overviews, Perplexity and Gemini, alongside traditional healthcare SEO.",
  founder: { "@id": `${SITE_URL}/#ritik` },
  // sameAs: populate with LinkedIn / Google Business Profile / Clutch
  // once those profiles are live. Do not emit an empty array — that
  // asserts "this entity exists nowhere else online," which is worse
  // than omitting the claim entirely.
  knowsAbout: [
    "healthcare marketing",
    "generative engine optimization",
    "AI search visibility",
    "medical SEO",
    "healthcare reputation management",
    "hair transplant marketing",
  ],
};

export const PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/#ritik`,
  name: "Ritik Malhotra",
  jobTitle: "Founder",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  image: `${SITE_URL}/images/ritik-malhotra.webp`,
};

export const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Boost Web Digital",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPage(qas: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}
