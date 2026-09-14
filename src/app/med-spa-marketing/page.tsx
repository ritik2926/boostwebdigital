import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { MedSpaHero } from "@/components/med-spa-marketing/Hero";
import { MedSpaCredibilityGap } from "@/components/med-spa-marketing/CredibilityGap";
import { MedSpaAdvertisingRules } from "@/components/med-spa-marketing/AdvertisingRules";
import { MedSpaWhatPatientsSearch } from "@/components/med-spa-marketing/WhatPatientsSearch";
import { MedSpaMethod } from "@/components/med-spa-marketing/Method";
import { MedSpaWhatWeWontDo } from "@/components/med-spa-marketing/WhatWeWontDo";
import { MedSpaServices } from "@/components/med-spa-marketing/Services";
import { MedSpaTiers } from "@/components/med-spa-marketing/Tiers";
import { MedSpaNotFor } from "@/components/med-spa-marketing/NotFor";
import { MedSpaFaq, MED_SPA_FAQ_ITEMS } from "@/components/med-spa-marketing/Faq";
import { MedSpaClosingCta } from "@/components/med-spa-marketing/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/med-spa-marketing/`;

const TITLE = "Med Spa Marketing Agency | Credibility & AI Visibility";
const DESCRIPTION =
  "Med spa marketing built around the credibility gap a med spa has to close, plus the AI-visibility and search work every specialty needs.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/med-spa-marketing/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/med-spa-marketing/", type: "website" },
};

/**
 * Specialty hub — owns the BUYER (a med spa), not a service. No "use
 * client" anywhere in this tree; same framer-motion-free component set as
 * /dermatology-marketing/ and /dental-marketing/ (StaticGlow/StaticCta,
 * plain Sparkles).
 *
 * Central angle verified this session: medical director requirements,
 * who may legally inject, and how much on-site physician supervision is
 * required all vary by state — confirmed as a general principle against
 * the Texas Medical Board's own published position (non-surgical cosmetic
 * injection = practice of medicine, delegable under physician
 * supervision), not independently verified for all 50 states. The
 * advertising-rules angle cites two real FTC primary sources: the 2023
 * Endorsement Guides revision (16 CFR Part 255) and the 2024 Rule on the
 * Use of Consumer Reviews and Testimonials (16 CFR Part 465, effective
 * October 21, 2024). See the task report for the full verification
 * status of every claim on this page.
 *
 * NO AggregateRating, NO Review schema anywhere in this file or its
 * children.
 */
export default function MedSpaMarketingPage() {
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
    name: "Med Spa Marketing",
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
        { name: "Med Spa Marketing", url: PAGE_URL },
      ]),
      faqPage(MED_SPA_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <MedSpaHero />
        <MedSpaCredibilityGap />
        <MedSpaAdvertisingRules />
        <MedSpaWhatPatientsSearch />
        <MedSpaMethod />
        <MedSpaWhatWeWontDo />
        <MedSpaServices />
        <MedSpaTiers />
        <MedSpaNotFor />
        <MedSpaFaq />
        <MedSpaClosingCta />
      </main>
      <Footer />
    </>
  );
}
