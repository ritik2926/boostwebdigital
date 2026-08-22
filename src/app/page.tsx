import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, PERSON, WEBSITE, faqPage } from "@/lib/schema";

const SITE_URL = "https://boostwebdigital.com";

const TITLE = "Healthcare Marketing Agency | AI Search & SEO";
const DESCRIPTION =
  "Boost Web Digital helps healthcare practices get recommended by AI search engines and found in traditional search, combining GEO with proven SEO strategy.";

export const metadata: Metadata = {
  title: { absolute: "Healthcare Marketing Agency | Boost Web Digital" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

// Word-for-word copies of data defined in src/components/HomePage.tsx
// (SERVICES, FAQ_ITEMS) — not imported, so HomePage.tsx stays untouched.
// Keep these in sync with that file if the visible copy ever changes.
//
// No `href` field: these four services don't have real pages yet (the
// URL-architecture slugs below are reserved, not built), so the schema
// below omits `url` on each Offer/Service entirely — asserting a URL
// that 404s is worse than describing the service without one.
const SERVICES_FOR_SCHEMA = [
  {
    name: "AI Visibility (GEO) for Healthcare Practices",
    description: "We get your practice named by ChatGPT, Google AI Overviews, Perplexity and Gemini.",
  },
  {
    name: "Healthcare SEO",
    description: "Technical foundations, specialty-specific content, local visibility and Google Business Profile optimisation.",
  },
  {
    name: "Reputation Management for Medical Practices",
    description: "75% of patients won't book below 4.0 stars, and 66% say your replies to reviews affect their trust.",
  },
  {
    name: "Paid Search & Social for Healthcare",
    description:
      "Google Ads and Meta campaigns for specialties where the unit economics work, run inside healthcare ad policy so your account doesn't get suspended.",
  },
];

const FAQ_FOR_SCHEMA = [
  {
    question: "What is AI visibility, and how is it different from SEO?",
    answer:
      "SEO gets you ranked in a list of links. AI visibility gets you named inside the AI-generated answer that now appears above those links on 88% of health searches. They overlap, but they're optimised differently — AI systems weight entity consistency, structured data and third-party mentions far more heavily than traditional rankings do.",
  },
  {
    question: "How do you measure AI visibility?",
    answer:
      "We ask fifteen patient-intent questions across ChatGPT, Perplexity, Google AI Overviews and Gemini, and count how many times your practice is named. The same questions run against the same engines every month, so the number is directly comparable over time.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "AI citations typically move faster than rankings — often within 30 to 60 days — because the underlying signals can be corrected quickly. Traditional SEO gains usually take longer. We rescan monthly, so you see movement or its absence immediately rather than waiting a quarter.",
  },
  {
    question: "Do you handle patient data? Is this HIPAA-relevant?",
    answer:
      "No. Our work uses publicly available data only — your website, your listings, your reviews and public AI outputs. We don't access patient records, intake forms, call recordings or CRM data, so no business associate agreement is required.",
  },
  {
    question: "Which healthcare specialties do you work with?",
    answer:
      "Hair transplant and restoration is our deepest specialty and where we have a live client. We also work with dental practices, med spas, dermatology clinics, plastic surgery practices and orthodontists, with a separate strategy built for each.",
  },
];

const webPage = {
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: TITLE,
  description: DESCRIPTION,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

const service = {
  "@type": "Service",
  "@id": `${SITE_URL}/#services`,
  serviceType: "Healthcare Marketing",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "US",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Healthcare Marketing Services",
    itemListElement: SERVICES_FOR_SCHEMA.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
      },
    })),
  },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [ORGANIZATION, PERSON, WEBSITE, webPage, service, faqPage(FAQ_FOR_SCHEMA)],
};

export default function Home() {
  return (
    <>
      <JsonLd data={graph} />
      <HomePage />
    </>
  );
}
