import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, WEBSITE, breadcrumb } from "@/lib/schema";
import { SERVICE_CARDS } from "@/lib/services";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServicesApproach } from "@/components/services/ServicesApproach";
import { ServicesStats } from "@/components/services/ServicesStats";
import { ServicesCTA } from "@/components/services/ServicesCTA";
import { ContactLogoMarquee } from "@/components/contact/ContactLogoMarquee";
import { TestimonialCarousel } from "@/components/contact/TestimonialCarousel";

const SITE_URL = "https://boostwebdigital.com";
const SERVICES_URL = `${SITE_URL}/services/`;

const TITLE = "Healthcare Marketing Services";
const DESCRIPTION =
  "AI visibility (GEO), healthcare SEO, reputation management and paid search — full-service marketing built for how patients search in 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/services/", type: "website" },
};

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
    areaServed: { "@type": "Country", name: "United States" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Healthcare Marketing Services",
      itemListElement: SERVICE_CARDS.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.description },
      })),
    },
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
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <ServicesHero />
        <ContactLogoMarquee />
        <ServicesGrid />
        <ServicesApproach />
        <ServicesStats />
        <TestimonialCarousel />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
