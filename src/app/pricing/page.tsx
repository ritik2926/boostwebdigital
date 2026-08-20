import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/FinalCTA";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { PRICING_FAQ_ITEMS } from "@/lib/pricing-faq";
import { PricingBackground } from "@/components/pricing/PricingBackground";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingMath } from "@/components/pricing/PricingMath";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { PricingGuarantee } from "@/components/pricing/PricingGuarantee";
import { PricingExclusions } from "@/components/pricing/PricingExclusions";
import { PricingQualification } from "@/components/pricing/PricingQualification";
import { PricingFaq } from "@/components/pricing/PricingFaq";

const SITE_URL = "https://boostwebdigital.com";
const PRICING_URL = `${SITE_URL}/pricing/`;

const TITLE = "Healthcare Marketing Pricing | Boost Web Digital";
const DESCRIPTION =
  "Published pricing for healthcare marketing and AI visibility — $1,500 to $7,500/mo. Month to month, no contract, 90-day guarantee.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pricing/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/pricing/", type: "website" },
};

export default function PricingPage() {
  const pricingWebPage = {
    "@type": "WebPage",
    "@id": `${PRICING_URL}#webpage`,
    url: PRICING_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE["@id"] },
    about: { "@id": ORGANIZATION["@id"] },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      pricingWebPage,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Pricing", url: PRICING_URL },
      ]),
      faqPage(PRICING_FAQ_ITEMS),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <PricingBackground />
      <Navbar />
      <main>
        <PricingHero />
        <PricingMath />
        <PricingPlans />
        <PricingComparison />
        <PricingGuarantee />
        <PricingExclusions />
        <PricingQualification />
        <PricingFaq />
        <FinalCTA
          kicker="Not sure which plan?"
          body="Start with the free scan. We'll run fifteen patient questions against four AI engines, send you the report, and tell you honestly which plan fits — or that none of them do."
          cardHeading="Get My Free AI Visibility Report"
          cardBody="No call required. No obligation. You'll get three specific fixes even if you never hire us."
        />
      </main>
      <Footer />
    </>
  );
}
