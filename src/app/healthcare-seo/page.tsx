import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { HealthcareSeoHero } from "@/components/healthcare-seo/Hero";
import { HealthcareSeoStatStrip } from "@/components/healthcare-seo/StatStrip";
import { HealthcareSeoWhyDifferent } from "@/components/healthcare-seo/WhyDifferent";
import { HealthcareSeoMethod } from "@/components/healthcare-seo/Method";
import { HealthcareSeoAiAnswers } from "@/components/healthcare-seo/AiAnswers";
import { HealthcareSeoBySpecialty } from "@/components/healthcare-seo/BySpecialty";
import { HealthcareSeoIncluded } from "@/components/healthcare-seo/Included";
import { HealthcareSeoNotFor } from "@/components/healthcare-seo/NotFor";
import { HealthcareSeoFaq, HEALTHCARE_SEO_FAQ_ITEMS } from "@/components/healthcare-seo/Faq";
import { HealthcareSeoClosingCta } from "@/components/healthcare-seo/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/healthcare-seo/`;

const TITLE = "Healthcare SEO for Medical Practices";
const DESCRIPTION =
  "Healthcare SEO runs under YMYL and HIPAA rules regular SEO doesn't. See our method for entity data, reviewer credentials, and AI-answer visibility.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/healthcare-seo/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/healthcare-seo/", type: "website" },
};

/**
 * Service hub, not a specialty page — this is the method page the specialty
 * pages (/dental-marketing/, /dermatology-marketing/) point to when they say
 * "our SEO approach," and the internal-link hub for the services axis. No
 * framer-motion anywhere in this tree; every section reused from the
 * dental-marketing/dermatology-marketing pattern (StaticCta, StaticGlow,
 * plain Sparkles) for the same reason those pages avoid it.
 *
 * URL note: docs/13-URL-ARCHITECTURE.md's locked slug formula puts this
 * page at /healthcare-marketing/healthcare-seo/ (a vertical × service
 * child route), not flat at root. This task's brief explicitly specifies
 * /healthcare-seo/ at root instead, with a Services breadcrumb parent — a
 * direct instruction, so it wins for this build per CLAUDE.md's decision
 * hierarchy. Flagging rather than silently building at the doc's URL; the
 * doc itself still needs a deliberate reconciliation pass if this root
 * placement is meant to stick (see docs/13-URL-ARCHITECTURE.md's own
 * "flagged conflict" precedent for exactly this kind of mismatch).
 */
export default function HealthcareSeoPage() {
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
    name: "Healthcare SEO",
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
        { name: "Healthcare SEO", url: PAGE_URL },
      ]),
      faqPage(HEALTHCARE_SEO_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <HealthcareSeoHero />
        <HealthcareSeoStatStrip />
        <HealthcareSeoWhyDifferent />
        <HealthcareSeoMethod />
        <HealthcareSeoAiAnswers />
        <HealthcareSeoBySpecialty />
        <HealthcareSeoIncluded />
        <HealthcareSeoNotFor />
        <HealthcareSeoFaq />
        <HealthcareSeoClosingCta />
      </main>
      <Footer />
    </>
  );
}
