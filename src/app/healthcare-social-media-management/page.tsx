import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { HsmmHero } from "@/components/healthcare-social-media-management/Hero";
import { HsmmWhatItActuallyDoes } from "@/components/healthcare-social-media-management/WhatItActuallyDoes";
import { HsmmHipaaSection } from "@/components/healthcare-social-media-management/HipaaSection";
import { HsmmWhoItsWorthItFor } from "@/components/healthcare-social-media-management/WhoItsWorthItFor";
import { HsmmMethod } from "@/components/healthcare-social-media-management/Method";
import { HsmmWhatWeWontDo } from "@/components/healthcare-social-media-management/WhatWeWontDo";
import { HsmmBySpecialty } from "@/components/healthcare-social-media-management/BySpecialty";
import { HsmmTiers } from "@/components/healthcare-social-media-management/Tiers";
import { HsmmNotFor } from "@/components/healthcare-social-media-management/NotFor";
import { HsmmFaq, HSMM_FAQ_ITEMS } from "@/components/healthcare-social-media-management/Faq";
import { HsmmClosingCta } from "@/components/healthcare-social-media-management/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/healthcare-social-media-management/`;

const TITLE = "Social Media Management for Healthcare Practices";
const DESCRIPTION =
  "Social media rarely brings new patients. It verifies you look real to ones who already have your name. What it does, what HIPAA requires, and our method.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/healthcare-social-media-management/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/healthcare-social-media-management/", type: "website" },
};

/**
 * Service hub on the services axis — owns the WORK (what social media does
 * and does not do, the HIPAA exposure most agencies ignore), while the
 * specialty pages own the buyer and link here for method detail. Built to
 * the same pattern as the sibling hubs (/healthcare-seo/,
 * /healthcare-reputation-management/): reused sections (StaticCta,
 * StaticGlow, plain Sparkles), no framer-motion anywhere in this tree.
 *
 * NO AggregateRating, NO Review schema anywhere in this file or its
 * children.
 */
export default function HealthcareSocialMediaManagementPage() {
  const webPage = {
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE["@id"] },
    about: { "@id": ORGANIZATION["@id"] },
  };

  const service = {
    "@type": "Service",
    "@id": `${PAGE_URL}#service`,
    name: "Healthcare Social Media Management",
    serviceType: "Healthcare Marketing",
    provider: { "@id": ORGANIZATION["@id"] },
    areaServed: "US",
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      webPage,
      service,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Services", url: `${SITE_URL}/services/` },
        { name: "Healthcare Social Media Management", url: PAGE_URL },
      ]),
      faqPage(HSMM_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <HsmmHero />
        <HsmmWhatItActuallyDoes />
        <HsmmHipaaSection />
        <HsmmWhoItsWorthItFor />
        <HsmmMethod />
        <HsmmWhatWeWontDo />
        <HsmmBySpecialty />
        <HsmmTiers />
        <HsmmNotFor />
        <HsmmFaq />
        <HsmmClosingCta />
      </main>
      <Footer />
    </>
  );
}
