import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { HairRestorationHero } from "@/components/hair-restoration-marketing/Hero";
import { HairRestorationProof } from "@/components/hair-restoration-marketing/Proof";
import { HairRestorationMethod } from "@/components/hair-restoration-marketing/Method";
import { HairRestorationIncluded } from "@/components/hair-restoration-marketing/Included";
import { HairRestorationNotFor } from "@/components/hair-restoration-marketing/NotFor";
import { HairRestorationTimeline } from "@/components/hair-restoration-marketing/Timeline";
import { HairRestorationFaq, HAIR_RESTORATION_FAQ_ITEMS } from "@/components/hair-restoration-marketing/Faq";
import { HairRestorationClosingCta } from "@/components/hair-restoration-marketing/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/hair-restoration-marketing/`;

const TITLE = "Hair Restoration Marketing Agency | Hair Transplant SEO";
const DESCRIPTION =
  "Hair restoration marketing built for a six-to-twelve-month private research window, backed by our real client, Kaja Hair Studio.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/hair-restoration-marketing/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/hair-restoration-marketing/", type: "website" },
};

/**
 * The flagship specialty hub — see src/lib/navigation.ts's own comment
 * ("the flagship specialty — the only one with a real client") and
 * docs/13-URL-ARCHITECTURE.md's honesty gate. Built directly off the
 * dermatology-marketing / dental-marketing pattern: same Container/Kicker/
 * SECTION_PADDING/STACK tokens, same StaticCta/StaticGlow (framer-motion-
 * free) components, same Server-Component-only tree, no "use client"
 * anywhere in this page.
 *
 * URL note: same root-vs-nested slug situation already flagged on
 * /healthcare-seo/ and others — docs/13-URL-ARCHITECTURE.md locks this
 * specialty hub at /hair-restoration-marketing/ (root, correct) with its
 * SEO spoke nested beneath it at /hair-restoration-marketing/hair-
 * restoration-seo/ (also correct, per the "Specialty × SEO" slug formula)
 * — this build matches the doc exactly, no conflict to flag here.
 */
export default function HairRestorationMarketingPage() {
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
    name: "Hair Restoration Marketing",
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
        { name: "Hair Restoration Marketing", url: PAGE_URL },
      ]),
      faqPage(HAIR_RESTORATION_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <HairRestorationHero />
        <HairRestorationProof />
        <HairRestorationMethod />
        <HairRestorationIncluded />
        <HairRestorationNotFor />
        <HairRestorationTimeline />
        <HairRestorationFaq />
        <HairRestorationClosingCta />
      </main>
      <Footer />
    </>
  );
}
