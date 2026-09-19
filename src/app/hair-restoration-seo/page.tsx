import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { HairRestorationSeoHero } from "@/components/hair-restoration-seo/Hero";
import { HairRestorationSeoWhyDifferent } from "@/components/hair-restoration-seo/WhyDifferent";
import { HairRestorationSeoMethod } from "@/components/hair-restoration-seo/Method";
import { HairRestorationSeoIncluded } from "@/components/hair-restoration-seo/Included";
import { HairRestorationSeoFaq, HAIR_RESTORATION_SEO_FAQ_ITEMS } from "@/components/hair-restoration-seo/Faq";
import { HairRestorationSeoClosingCta } from "@/components/hair-restoration-seo/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/hair-restoration-seo/`;

const TITLE = "Hair Restoration SEO | Hair Transplant Clinic SEO";
const DESCRIPTION =
  "SEO built around how hair transplant patients actually search — privately, for months, across three research stages before they ever call.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/hair-restoration-seo/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/hair-restoration-seo/", type: "website" },
};

/**
 * Flat at root rather than nested under /hair-restoration-marketing/ —
 * corrected 2026-09-18. docs/13-URL-ARCHITECTURE.md's locked "Specialty ×
 * SEO" formula puts this at /hair-restoration-marketing/hair-restoration-
 * seo/, and that's how this page was first built — but that formula has
 * already been deviated from FOUR times on this exact site, on purpose,
 * for exactly this "vertical/specialty × SEO-type-service" shape:
 * /healthcare-seo/, /healthcare-reputation-management/,
 * /healthcare-social-media-management/, and /medical-website-design/ are
 * all flat at root, each with its own comment flagging the same doc gap
 * (see medical-website-design/page.tsx: "same root-vs-nested-slug gap
 * already flagged on the other three hubs"). That's a real, repeated
 * existing-implementation pattern, which outranks the doc per CLAUDE.md's
 * own decision hierarchy — this page was moved to match it rather than be
 * the one page that breaks the site's actual convention. The doc itself
 * still needs a deliberate reconciliation pass (five instances now, not
 * one) rather than five more one-off flags.
 *
 * Breadcrumb parent is Services, same as every one of those four pages —
 * not the hair-restoration-marketing hub, even though this is that hub's
 * spoke in content terms. Cross-linked from the hub in both directions
 * (see hair-restoration-marketing/Method.tsx and ClosingCta.tsx).
 */
export default function HairRestorationSeoPage() {
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
    name: "Hair Restoration SEO",
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
        { name: "Hair Restoration SEO", url: PAGE_URL },
      ]),
      faqPage(HAIR_RESTORATION_SEO_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <HairRestorationSeoHero />
        <HairRestorationSeoWhyDifferent />
        <HairRestorationSeoMethod />
        <HairRestorationSeoIncluded />
        <HairRestorationSeoFaq />
        <HairRestorationSeoClosingCta />
      </main>
      <Footer />
    </>
  );
}
