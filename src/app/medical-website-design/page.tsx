import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { MwdHero } from "@/components/medical-website-design/Hero";
import { MwdWhatChanges } from "@/components/medical-website-design/WhatChanges";
import { MwdCompliance } from "@/components/medical-website-design/Compliance";
import { MwdWhoItsWorthItFor } from "@/components/medical-website-design/WhoItsWorthItFor";
import { MwdMethod } from "@/components/medical-website-design/Method";
import { MwdWhatWeWontDo } from "@/components/medical-website-design/WhatWeWontDo";
import { MwdBySpecialty } from "@/components/medical-website-design/BySpecialty";
import { MwdEngagement } from "@/components/medical-website-design/Engagement";
import { MwdNotFor } from "@/components/medical-website-design/NotFor";
import { MwdFaq, MWD_FAQ_ITEMS } from "@/components/medical-website-design/Faq";
import { MwdClosingCta } from "@/components/medical-website-design/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/medical-website-design/`;

const TITLE = "Medical Website Design for Healthcare Practices";
const DESCRIPTION =
  "A redesign changes how a site looks. See what actually needs fixing first — speed, the booking path, accessibility — and how a rebuild is priced.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/medical-website-design/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/medical-website-design/", type: "website" },
};

/**
 * Service hub — built ahead of the /services/ rebuild, which links down to
 * this page as one of the five live service cards. Same pattern as the
 * other three service hubs (healthcare-seo, healthcare-reputation-
 * management, healthcare-social-media-management): reused sections
 * (StaticCta, StaticGlow, plain Sparkles), no framer-motion anywhere in
 * this tree, project-priced per PricingExclusions.tsx's own "Website
 * Rebuilds" line rather than folded into the monthly tiers.
 *
 * Flat at root rather than nested — same root-vs-nested-slug gap already
 * flagged on the other three hubs against docs/13-URL-ARCHITECTURE.md's
 * planned `/services/web-design/` and `/{specialty}-marketing/
 * {specialty}-website-design/` slugs. See sitemap.ts.
 *
 * NO AggregateRating, NO Review schema anywhere in this file or its
 * children.
 */
export default function MedicalWebsiteDesignPage() {
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
    name: "Medical Website Design",
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
        { name: "Medical Website Design", url: PAGE_URL },
      ]),
      faqPage(MWD_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <MwdHero />
        <MwdWhatChanges />
        <MwdCompliance />
        <MwdWhoItsWorthItFor />
        <MwdMethod />
        <MwdWhatWeWontDo />
        <MwdBySpecialty />
        <MwdEngagement />
        <MwdNotFor />
        <MwdFaq />
        <MwdClosingCta />
      </main>
      <Footer />
    </>
  );
}
