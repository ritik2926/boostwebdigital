// PRE-LAUNCH GATE
// Sections: LogoMarquee, ReviewPlatforms, Testimonials contain
// [SQUARE BRACKET] placeholders. Before this page is linked in the nav
// or submitted to Search Console, either replace them with real,
// verifiable content or remove the sections.
// Check with: grep -rn "\[" src/app/contact/

import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb, faqPage } from "@/lib/schema";
import { FAQ_ITEMS } from "@/lib/contact-faq";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactLogoMarquee } from "@/components/contact/ContactLogoMarquee";
import { ReviewPlatforms } from "@/components/contact/ReviewPlatforms";
import { TestimonialCarousel } from "@/components/contact/TestimonialCarousel";
import { ContactFaq } from "@/components/contact/ContactFaq";

const SITE_URL = "https://boostwebdigital.com";
const CONTACT_URL = `${SITE_URL}/contact/`;

const TITLE = "Contact Us | Boost Web Digital";
const DESCRIPTION =
  "Tell us about your practice and we'll respond within 12 hours. No account managers — you talk directly to the founder.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/contact/", type: "website" },
};

export default function ContactPage() {
  const contactPage = {
    "@type": "ContactPage",
    "@id": `${CONTACT_URL}#webpage`,
    url: CONTACT_URL,
    name: TITLE,
    description: DESCRIPTION,
    about: { "@id": ORGANIZATION["@id"] },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      contactPage,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Contact", url: CONTACT_URL },
      ]),
      faqPage(FAQ_ITEMS.map(({ question, answer }) => ({ question, answer }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <ContactHero />
        <ContactLogoMarquee />
        <ReviewPlatforms />
        <TestimonialCarousel />
        <ContactFaq />
      </main>
      <Footer />
    </>
  );
}
