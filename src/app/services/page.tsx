import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb } from "@/lib/schema";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServicesApproach } from "@/components/services/ServicesApproach";
import { ServicesStats } from "@/components/services/ServicesStats";
import { ServicesProcess } from "@/components/services/ServicesProcess";
import { ServicesAudience } from "@/components/services/ServicesAudience";
import { ServicesCTA } from "@/components/services/ServicesCTA";

const SITE_URL = "https://boostwebdigital.com";
const SERVICES_URL = `${SITE_URL}/services/`;

const TITLE = "Healthcare Marketing Services | Boost Web Digital";
const DESCRIPTION =
  "AI search visibility, healthcare SEO and reputation management for medical, dental, aesthetic and hair restoration practices. Measured monthly, not quarterly.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/services/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/services/", type: "website" },
};

/**
 * OfferCatalog — docs/services-content.md, SCHEMA section. Exactly these
 * three entries, verbatim; no url field (those pages don't exist yet), no
 * areaServed (removed sitewide — see src/lib/schema.ts). "Supporting work
 * is not an Offer" per the same doc, so it's deliberately absent here even
 * though it's a real section on the page.
 */
const SERVICE_OFFERS = [
  {
    name: "AI Search Visibility (GEO) for Healthcare Practices",
    description:
      "We get your practice named by ChatGPT, Google AI Overviews, Perplexity and Gemini, measured monthly against a fixed set of patient questions.",
  },
  {
    name: "Healthcare SEO",
    description: "Technical foundations, specialty-specific content, local visibility and Google Business Profile optimisation.",
  },
  {
    name: "Reputation Management for Medical Practices",
    description: "Review velocity, response quality and rating trajectory — the profile patients check before they book.",
  },
];

export default function ServicesPage() {
  const servicesWebPage = {
    "@type": "WebPage",
    "@id": `${SERVICES_URL}#webpage`,
    url: SERVICES_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE["@id"] },
    about: { "@id": ORGANIZATION["@id"] },
  };

  const service = {
    "@type": "Service",
    "@id": `${SERVICES_URL}#service`,
    name: "Healthcare Marketing Services",
    serviceType: "Healthcare Marketing",
    provider: { "@id": ORGANIZATION["@id"] },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Healthcare Marketing Services",
      itemListElement: SERVICE_OFFERS.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.description },
      })),
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      servicesWebPage,
      service,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Services", url: SERVICES_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <ServicesHero />
        <ServicesApproach />
        <ServicesGrid />
        <ServicesStats />
        <ServicesProcess />
        <ServicesAudience />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
