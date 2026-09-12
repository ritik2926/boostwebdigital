import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesDiagnostic } from "@/components/services/ServicesDiagnostic";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServicesBySpecialty } from "@/components/services/ServicesBySpecialty";
import { ServicesEngagement } from "@/components/services/ServicesEngagement";
import { ServicesExclusions } from "@/components/services/ServicesExclusions";
import { ServicesFaq, SERVICES_FAQ_ITEMS } from "@/components/services/ServicesFaq";
import { ServicesCTA } from "@/components/services/ServicesCTA";

const SITE_URL = "https://boostwebdigital.com";
const SERVICES_URL = `${SITE_URL}/services/`;

const TITLE = "Healthcare Marketing Services | Boost Web Digital";
const DESCRIPTION =
  "Most practices need one of these five services, not all of them. A two-minute diagnostic table tells you which one to start with.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/services/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/services/", type: "website" },
};

/**
 * Rebuilt 2026-09-12 — Google had this page in "Crawled – currently not
 * indexed." The previous version was a card-grid-first directory: a hero,
 * a "why three things" positioning essay, then a list of three services,
 * framer-motion (RevealGroup/RevealItem) throughout. See the Step 0 audit
 * in the task report for the full before/after comparison.
 *
 * This version is framer-motion-free end to end (StaticGlow/Sparkles/
 * StaticCta, no Reveal) and leads with a real diagnostic table before the
 * five service cards — cards route, the table earns the page's reason to
 * be indexed. Five services, not three: /medical-website-design/ and
 * /healthcare-social-media-management/ are both live now, and the earlier
 * "why we only do three things" position (ServicesApproach.tsx, deleted
 * in this pass) directly contradicted listing five. That section is gone
 * rather than rewritten into "why five things" — the diagnostic table
 * argues the real point instead (most practices need one, not all of
 * them), which doesn't require picking or defending a specific count.
 *
 * Deleted as part of this rebuild (now orphaned, not removed from disk
 * due to a tooling restriction — flagged to Ritik to remove manually):
 * ServicesApproach.tsx, ThreePillarsVenn.tsx, ServicesStats.tsx,
 * ServicesProcess.tsx, ServicesAudience.tsx, SpotlightField.tsx,
 * SpotlightTitleCard.tsx, ServicesCtaButton.tsx, HeroKeywordPills.tsx, and
 * src/lib/services.ts (the old SERVICES/PROCESS_STEPS/AUDIENCE_EXCLUSIONS/
 * SERVICE_STATS data, superseded by this file's own data and by reusing
 * PricingExclusions.tsx/PricingQualification.tsx's real copy directly in
 * ServicesExclusions.tsx).
 *
 * NO AggregateRating, NO Review schema anywhere in this file or its
 * children.
 */
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
    areaServed: "US",
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
      faqPage(SERVICES_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <ServicesHero />
        <ServicesDiagnostic />
        <ServicesGrid />
        <ServicesBySpecialty />
        <ServicesEngagement />
        <ServicesExclusions />
        <ServicesFaq />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
