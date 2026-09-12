import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { HrmHero } from "@/components/healthcare-reputation-management/Hero";
import { HrmReplyLiability } from "@/components/healthcare-reputation-management/ReplyLiability";
import { HrmDiagramSection } from "@/components/healthcare-reputation-management/DiagramSection";
import { HrmWhatItCovers } from "@/components/healthcare-reputation-management/WhatItCovers";
import { HrmMethod } from "@/components/healthcare-reputation-management/Method";
import { HrmWhatWeWontDo } from "@/components/healthcare-reputation-management/WhatWeWontDo";
import { HrmBySpecialty } from "@/components/healthcare-reputation-management/BySpecialty";
import { HrmTiers } from "@/components/healthcare-reputation-management/Tiers";
import { HrmNotFor } from "@/components/healthcare-reputation-management/NotFor";
import { HrmFaq, HRM_FAQ_ITEMS } from "@/components/healthcare-reputation-management/Faq";
import { HrmClosingCta } from "@/components/healthcare-reputation-management/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/healthcare-reputation-management/`;

const TITLE = "Healthcare Reputation Management for Practices";
const DESCRIPTION =
  "The reply to a bad review can be a bigger HIPAA risk than the review itself. See what to say, what never to say, and our full method.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/healthcare-reputation-management/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/healthcare-reputation-management/", type: "website" },
};

/**
 * Service hub — this page was blocking (blog post 1 links here twice, the
 * homepage links here, it 404'd) so it's built to the same pattern as
 * /healthcare-seo/: reused sections (StaticCta, StaticGlow, plain
 * Sparkles), no framer-motion anywhere in this tree.
 *
 * The HIPAA case in HrmReplyLiability.tsx carries a visible
 * [UNVERIFIED — RITIK TO CONFIRM] marker — HHS.gov returned 403 on every
 * URL variant tried (direct fetch, not a search), so the case is
 * confirmed only against secondary legal-industry reporting (HIPAA
 * Journal, JD Supra), not the primary resolution agreement. Do not remove
 * that marker without checking the source yourself.
 *
 * NO AggregateRating, NO Review schema anywhere in this file or its
 * children — the temptation is strongest on exactly this page, and the
 * rule is absolute regardless.
 */
export default function HealthcareReputationManagementPage() {
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
    name: "Healthcare Reputation Management",
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
        { name: "Healthcare Reputation Management", url: PAGE_URL },
      ]),
      faqPage(HRM_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <HrmHero />
        <HrmReplyLiability />
        <HrmDiagramSection />
        <HrmWhatItCovers />
        <HrmMethod />
        <HrmWhatWeWontDo />
        <HrmBySpecialty />
        <HrmTiers />
        <HrmNotFor />
        <HrmFaq />
        <HrmClosingCta />
      </main>
      <Footer />
    </>
  );
}
