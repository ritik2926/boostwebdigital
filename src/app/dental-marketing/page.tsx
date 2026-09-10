import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { DentalHero } from "@/components/dental-marketing/Hero";
import { DentalProblem } from "@/components/dental-marketing/Problem";
import { DentalMethod } from "@/components/dental-marketing/Method";
import { DentalIncluded } from "@/components/dental-marketing/Included";
import { DentalNotFor } from "@/components/dental-marketing/NotFor";
import { DentalTimeline } from "@/components/dental-marketing/Timeline";
import { DentalFaq, DENTAL_FAQ_ITEMS } from "@/components/dental-marketing/Faq";
import { DentalClosingCta } from "@/components/dental-marketing/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/dental-marketing/`;

const TITLE = "Dental Marketing Agency | Emergency & Elective SEO";
const DESCRIPTION =
  "Dental marketing built around two behaviors, not one: separate query sets for emergency-intent searches and elective procedures like implants and Invisalign.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/dental-marketing/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/dental-marketing/", type: "website" },
};

/**
 * Same architecture note as /dermatology-marketing/page.tsx: no "use
 * client" anywhere in this tree, no framer-motion, no GSAP. See
 * StaticCta.tsx / StaticGlow.tsx for what replaces MagneticButton/
 * AmbientGlow here and why.
 */
export default function DentalMarketingPage() {
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
    name: "Dental Marketing",
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
        { name: "Dental Marketing", url: PAGE_URL },
      ]),
      faqPage(DENTAL_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <DentalHero />
        <DentalProblem />
        <DentalMethod />
        <DentalIncluded />
        <DentalNotFor />
        <DentalTimeline />
        <DentalFaq />
        <DentalClosingCta />
      </main>
      <Footer />
    </>
  );
}
