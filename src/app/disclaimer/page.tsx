import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb } from "@/lib/schema";
import { LegalLayout, LegalP, Fill, LEGAL_LAST_UPDATED, type LegalSection } from "@/components/legal/LegalLayout";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/disclaimer/`;

const TITLE = "Disclaimer | Boost Web Digital";
const DESCRIPTION =
  "Disclaimers covering results, testimonials, and third-party platform dependency for Boost Web Digital's healthcare marketing services.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/disclaimer/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/disclaimer/", type: "website" },
  // Boilerplate legal text has no organic-search value of its own — noindex,
  // but still follow so outbound links keep passing link equity normally.
  robots: { index: false, follow: true },
};

const SECTIONS: LegalSection[] = [
  {
    id: "general-disclaimer",
    heading: "General Information Disclaimer",
    content: (
      <LegalP>
        The information on boostwebdigital.com is provided for general informational purposes about our
        healthcare marketing services. While we try to keep it accurate and current, we make no representation or
        warranty, express or implied, about its completeness, accuracy, or reliability for any particular purpose.
      </LegalP>
    ),
  },
  {
    id: "no-guaranteed-results",
    heading: "No Guaranteed Results",
    content: (
      <LegalP>
        Search rankings, AI search/citation visibility, website traffic, lead volume, and advertising performance
        depend on factors outside our control, including search engine and AI platform algorithm changes,
        competitor activity, and your own practice&apos;s reputation and market. We do not guarantee any specific
        result. Where a client agreement includes a conditional, results-based refund tied to pre-agreed KPIs, that
        term is governed exclusively by our{" "}
        <a href="/refund-policy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Refund &amp; Cancellation Policy
        </a>
        {" "}and the signed agreement — it is not a guarantee stated anywhere else on this Website.
      </LegalP>
    ),
  },
  {
    id: "not-medical-advice",
    heading: "Not Medical, Legal, or Financial Advice",
    content: (
      <LegalP>
        Boost Web Digital is a marketing agency, not a medical, legal, or financial advisory firm. Nothing on this
        Website or in our Services constitutes medical, legal, or financial advice. Content we create on behalf of
        a healthcare practice reflects information and claims provided by that practice; the practice remains
        responsible for ensuring its own advertising complies with applicable medical advertising and professional
        conduct rules in its jurisdiction.
      </LegalP>
    ),
  },
  {
    id: "testimonials-disclaimer",
    heading: "Testimonials & Case Studies Disclaimer",
    content: (
      <LegalP>
        Testimonials and case studies referenced on this Website reflect the genuine experience of the client
        described, are not necessarily typical, and individual results vary based on practice, market, and
        engagement scope — a testimonial about one client&apos;s results is not a guarantee of similar results for
        any other client. Where a testimonial or case study involves a material connection to Boost Web Digital
        (for example, a current client describing their own engagement with us), that connection is disclosed.
      </LegalP>
    ),
  },
  {
    id: "third-party-links",
    heading: "Third-Party Links & Tools Disclaimer",
    content: (
      <LegalP>
        This Website may link to third-party websites or use third-party tools (analytics, payment processors) for
        your convenience. We do not control and are not responsible for the content, accuracy, or privacy
        practices of third-party sites. Use of third-party tools is subject to that provider&apos;s own terms and
        privacy policy.
      </LegalP>
    ),
  },
  {
    id: "platform-dependency",
    heading: "External Platform Dependency Disclaimer",
    content: (
      <LegalP>
        Our Services rely in part on third-party platforms — Google, Meta, Bing, ChatGPT, Perplexity, and similar
        search/AI systems — whose algorithms, policies, and features change without our control and without
        advance notice to us. Changes made by these platforms may affect the visibility, ranking, or performance of
        work we deliver, and are outside our responsibility.
      </LegalP>
    ),
  },
  {
    id: "errors-omissions",
    heading: "Errors & Omissions",
    content: (
      <LegalP>
        While we take reasonable care in preparing content on this Website, we do not warrant that it is free of
        errors or omissions, and reserve the right to correct any error or update any information at any time
        without prior notice.
      </LegalP>
    ),
  },
  {
    id: "disclaimer-liability",
    heading: "Limitation of Liability",
    content: (
      <LegalP>
        This Disclaimer should be read together with the Limitation of Liability clause in our{" "}
        <a href="/terms/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Terms &amp; Conditions
        </a>
        , which governs the extent of our liability for any claim arising from use of this Website or our
        Services.
      </LegalP>
    ),
  },
  {
    id: "disclaimer-contact",
    heading: "Contact Us",
    content: (
      <LegalP>
        Questions about this Disclaimer can be sent to{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        . Phone: <Fill>phone number — optional</Fill>.
      </LegalP>
    ),
  },
];

export default function DisclaimerPage() {
  const webPage = {
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    about: { "@id": ORGANIZATION["@id"] },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      webPage,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Disclaimer", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <LegalLayout
        kicker="Legal"
        title="Disclaimer"
        subtitle="What this Website and our Services do — and don't — promise, including how we handle testimonials."
        lastUpdated={LEGAL_LAST_UPDATED}
        sections={SECTIONS}
        intro={
          <LegalP>
            This Disclaimer applies alongside our{" "}
            <a href="/terms/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
              Terms &amp; Conditions
            </a>
            {" "}and{" "}
            <a href="/refund-policy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
              Refund &amp; Cancellation Policy
            </a>
            .
          </LegalP>
        }
      />
    </>
  );
}

// LAWYER REVIEW REQUIRED before publishing: the testimonials/case-studies
// section is written for FTC compliance (truthful, not implying typical
// results, material connections disclosed) but should be checked against
// the actual testimonial content live on the site.
