import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { HairRestorationGoogleAdsHero } from "@/components/hair-restoration-google-ads/Hero";
import { HairRestorationGoogleAdsWhyDifferent } from "@/components/hair-restoration-google-ads/WhyDifferent";
import { HairRestorationGoogleAdsMethod } from "@/components/hair-restoration-google-ads/Method";
import { HairRestorationGoogleAdsIncluded } from "@/components/hair-restoration-google-ads/Included";
import { HairRestorationGoogleAdsFaq, HAIR_RESTORATION_GOOGLE_ADS_FAQ_ITEMS } from "@/components/hair-restoration-google-ads/Faq";
import { HairRestorationGoogleAdsClosingCta } from "@/components/hair-restoration-google-ads/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/hair-restoration-google-ads/`;

const TITLE = "Hair Restoration Google Ads | Hair Transplant PPC";
const DESCRIPTION =
  "Google Ads built around a high-ticket, months-long decision — separate campaigns by research stage, policy-compliant before/after creative, and real travel-based targeting.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/hair-restoration-google-ads/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/hair-restoration-google-ads/", type: "website" },
};

/**
 * Specialty × Google Ads spoke — flat at root per the locked convention
 * (approved 2026-09-19: fully flat {specialty}-{service}, no
 * google-ads-for-{plural} tails). Breadcrumb parent is Services, matching
 * every other flat spoke on this site (see /hair-restoration-seo/'s own
 * page.tsx comment for the full precedent list).
 *
 * No link to a generic "Google Ads" services hub below — none exists yet
 * (`/healthcare-paid-search/` is referenced only in dead homepage data,
 * confirmed 404 in docs/LINK-TARGETS.md). Internal linking here is hub +
 * sibling spoke only until a real generic Google Ads hub ships; adding a
 * link to an unbuilt page would just be another 404 waiting to happen.
 *
 * Pricing section deliberately does NOT reuse the sitewide Visibility/
 * Growth/Market Leader tiers — see Included.tsx's own comment for why.
 *
 * Not wired into navigation.ts — reachable only via the hub and sibling
 * spoke's internal links, per instruction to flag before wiring nav.
 */
export default function HairRestorationGoogleAdsPage() {
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
    name: "Hair Restoration Google Ads",
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
        { name: "Hair Restoration Google Ads", url: PAGE_URL },
      ]),
      faqPage(HAIR_RESTORATION_GOOGLE_ADS_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <HairRestorationGoogleAdsHero />
        <HairRestorationGoogleAdsWhyDifferent />
        <HairRestorationGoogleAdsMethod />
        <HairRestorationGoogleAdsIncluded />
        <HairRestorationGoogleAdsFaq />
        <HairRestorationGoogleAdsClosingCta />
      </main>
      <Footer />
    </>
  );
}
