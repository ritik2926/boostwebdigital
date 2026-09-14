import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { DermatologyHero } from "@/components/dermatology-marketing/Hero";
import { DermatologyProblem } from "@/components/dermatology-marketing/Problem";
import { DermatologyMethod } from "@/components/dermatology-marketing/Method";
import { DermatologyIncluded } from "@/components/dermatology-marketing/Included";
import { DermatologyNotFor } from "@/components/dermatology-marketing/NotFor";
import { DermatologyTimeline } from "@/components/dermatology-marketing/Timeline";
import { DermatologyFaq, DERMATOLOGY_FAQ_ITEMS } from "@/components/dermatology-marketing/Faq";
import { DermatologyClosingCta } from "@/components/dermatology-marketing/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/dermatology-marketing/`;

const TITLE = "Dermatology Marketing Agency | Medical & Cosmetic SEO";
const DESCRIPTION =
  "Dermatology marketing built around two audiences, not one: separate query sets for medical patients and cosmetic patients competing with med spas.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/dermatology-marketing/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/dermatology-marketing/", type: "website" },
};

/**
 * No "use client" anywhere in this tree — every section above is a Server
 * Component. Deliberately does not use MagneticButton/AmbientGlow/Reveal
 * (all framer-motion-based) or GSAP-based AmbientGlow: see StaticCta.tsx and
 * StaticGlow.tsx for the framer-motion-free stand-ins used instead, and
 * their own comments for why. This keeps framer-motion out of this route's
 * bundle entirely, per this page's explicit performance requirement.
 */
export default function DermatologyMarketingPage() {
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
    name: "Dermatology Marketing",
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
        { name: "Dermatology Marketing", url: PAGE_URL },
      ]),
      faqPage(DERMATOLOGY_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <DermatologyHero />
        <DermatologyProblem />
        <DermatologyMethod />
        <DermatologyIncluded />
        <DermatologyNotFor />
        <DermatologyTimeline />
        <DermatologyFaq />
        <DermatologyClosingCta />
      </main>
      <Footer />
    </>
  );
}
