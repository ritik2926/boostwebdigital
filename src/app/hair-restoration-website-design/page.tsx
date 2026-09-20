import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { HairRestorationWebsiteDesignHero } from "@/components/hair-restoration-website-design/Hero";
import { HairRestorationWebsiteDesignWhyDifferent } from "@/components/hair-restoration-website-design/WhyDifferent";
import { HairRestorationWebsiteDesignMethod } from "@/components/hair-restoration-website-design/Method";
import { HairRestorationWebsiteDesignIncluded } from "@/components/hair-restoration-website-design/Included";
import { HairRestorationWebsiteDesignFaq, HAIR_RESTORATION_WEBSITE_DESIGN_FAQ_ITEMS } from "@/components/hair-restoration-website-design/Faq";
import { HairRestorationWebsiteDesignClosingCta } from "@/components/hair-restoration-website-design/ClosingCta";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/hair-restoration-website-design/`;

const TITLE = "Hair Restoration Website Design | Hair Transplant Clinic Web Design";
const DESCRIPTION =
  "Website design built around what actually drives bookings — your before/after gallery, technique pages, and booking path — priced as a project, not a monthly tier.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/hair-restoration-website-design/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/hair-restoration-website-design/", type: "website" },
};

/**
 * Third and, per docs/13-URL-ARCHITECTURE.md's P1/P2 list, final planned
 * spoke off the hair-restoration hub. Flat at root, breadcrumb parent
 * Services — same locked convention as /hair-restoration-seo/ and
 * /hair-restoration-google-ads/ (see the former's page.tsx comment for the
 * full precedent list). Same Server-Component-only, framer-motion-free tree
 * as every other specialty spoke.
 *
 * Copy reframed 2026-09-20, before build: this page sells a web-design
 * service to a CLINIC OWNER, not to a patient. Every WhyDifferent angle
 * (and the hero/method/FAQ copy around it) closes on an owner outcome —
 * less legal exposure, more booked consults, a bigger pipeline, less wasted
 * ad spend — never a patient-experience fact stated for its own sake. See
 * WhyDifferent.tsx's own comment for the four angles and what was
 * deliberately left out.
 *
 * Included.tsx is project-priced, not the sitewide monthly tiers — same
 * reasoning as /hair-restoration-google-ads/'s Included.tsx and
 * /medical-website-design/'s Engagement.tsx: a website rebuild is a fixed
 * scope with a defined end, not an ongoing service.
 *
 * Cross-links hub + both sibling spokes only (Method.tsx, ClosingCta.tsx) —
 * no link to the generic /medical-website-design/ services-layer page,
 * matching the precedent already set by /hair-restoration-seo/ (confirmed:
 * that spoke doesn't link its generic-layer analog, /healthcare-seo/,
 * either).
 *
 * Not wired into navigation.ts — reachable only via the hub and sibling
 * spokes' internal links, same as /hair-restoration-google-ads/, until
 * instructed to wire it in.
 */
export default function HairRestorationWebsiteDesignPage() {
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
    name: "Hair Restoration Website Design",
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
        { name: "Hair Restoration Website Design", url: PAGE_URL },
      ]),
      faqPage(HAIR_RESTORATION_WEBSITE_DESIGN_FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <HairRestorationWebsiteDesignHero />
        <HairRestorationWebsiteDesignWhyDifferent />
        <HairRestorationWebsiteDesignMethod />
        <HairRestorationWebsiteDesignIncluded />
        <HairRestorationWebsiteDesignFaq />
        <HairRestorationWebsiteDesignClosingCta />
      </main>
      <Footer />
    </>
  );
}
