import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb } from "@/lib/schema";
import { LegalLayout, LegalP, LegalUL, Fill, LEGAL_LAST_UPDATED, type LegalSection } from "@/components/legal/LegalLayout";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/terms/`;

const TITLE = "Terms & Conditions | Boost Web Digital";
const DESCRIPTION =
  "The terms governing use of boostwebdigital.com and any marketing services agreement with Boost Web Digital, for clients in India and internationally.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/terms/", type: "website" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of Terms",
    content: (
      <LegalP>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of boostwebdigital.com (the
        &quot;Website&quot;) and any services provided by Boost Web Digital (&quot;we&quot;, &quot;us&quot;,
        &quot;our&quot;). By visiting the Website, submitting an enquiry, or signing a proposal or client agreement
        with us, you agree to be bound by these Terms. If you do not agree, please do not use the Website or engage
        our services.
      </LegalP>
    ),
  },
  {
    id: "definitions",
    heading: "Definitions",
    content: (
      <LegalUL>
        <li><strong className="text-white/85">&quot;Client&quot; / &quot;you&quot;</strong> — the individual or practice engaging Boost Web Digital for services.</li>
        <li><strong className="text-white/85">&quot;Services&quot;</strong> — the SEO, AI/GEO visibility, reputation management, paid advertising, web design, and related marketing automation services described in a proposal, order form, or signed client agreement.</li>
        <li><strong className="text-white/85">&quot;Agreement&quot;</strong> — these Terms together with any signed proposal, statement of work, or client agreement that references them.</li>
        <li><strong className="text-white/85">&quot;Deliverables&quot;</strong> — the specific outputs (reports, creative assets, code, content, campaigns) produced under a Service.</li>
      </LegalUL>
    ),
  },
  {
    id: "about-us",
    heading: "About Us",
    content: (
      <LegalP>
        Boost Web Digital is a sole proprietorship owned and operated by Ritik Malhotra, registered address 622,
        Near Beri Gate, Katra Bhai Sant Singh, Amritsar, District Amritsar, Punjab 143001, India (GSTIN
        03FYBPM7255M1Z2). References to &quot;Boost Web Digital&quot;, &quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot; throughout this Website and any Agreement refer to this proprietorship.
      </LegalP>
    ),
  },
  {
    id: "services-provided",
    heading: "Services Provided",
    content: (
      <>
        <LegalP>
          We provide healthcare-focused digital marketing services, which may include search engine optimization
          (SEO), AI/generative engine optimization (GEO), online reputation management, paid search and social
          advertising, website design and development, content marketing, and marketing automation. The exact
          scope, timeline, and fees for any engagement are set out in a separate proposal or signed client
          agreement, which forms part of this Agreement.
        </LegalP>
        <LegalP>
          Where a specific Service description conflicts with these Terms, the signed proposal or client agreement
          controls for that engagement only; these Terms continue to apply to everything not addressed there.
        </LegalP>
      </>
    ),
  },
  {
    id: "client-responsibilities",
    heading: "Client Responsibilities",
    content: (
      <LegalUL>
        <li>Provide timely access to accounts, systems, credentials, and approvals reasonably required to deliver the Services (e.g. website/CMS access, Google Business Profile, ad accounts, analytics).</li>
        <li>Provide accurate information about your practice, including any claims, credentials, or compliance requirements (e.g. medical advertising rules) relevant to content we create on your behalf.</li>
        <li>Review and approve deliverables (ad copy, website content, campaigns) before they go live where review is offered — delays in review may delay results.</li>
        <li>Comply with the platform policies of any third-party tool or ad network used on your behalf (Google, Meta, etc.).</li>
      </LegalUL>
    ),
  },
  {
    id: "fees-payment-taxes",
    heading: "Fees, Payment & Taxes",
    content: (
      <>
        <LegalP>
          Fees for Services are set out in the applicable proposal or client agreement and are exclusive of
          Goods and Services Tax (GST) unless stated otherwise. GST, where applicable, is charged in addition to
          the quoted fee at the prevailing rate against GSTIN 03FYBPM7255M1Z2.
        </LegalP>
        <LegalP>
          Clients in India may pay via Razorpay, UPI, or direct bank transfer. International clients may pay via
          Stripe or PayPal. Payment processing fees charged by these providers, where applicable, are the
          responsibility of the payer unless otherwise agreed in writing.
        </LegalP>
        <LegalP>
          Invoices are due on the terms stated on the invoice or in the client agreement. Late payment may result
          in suspension of Services until the account is brought current, as described in{" "}
          <a href="#termination" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
            Term, Termination &amp; Suspension
          </a>
          . Third-party costs — advertising spend (Google Ads, Meta Ads), domain registration, hosting, licensed
          software or stock assets — are billed separately or passed through at cost and are not included in our
          service fees unless explicitly stated.
        </LegalP>
      </>
    ),
  },
  {
    id: "results-disclaimer",
    heading: "Results & Performance Disclaimer",
    content: (
      <LegalP>
        Search engine rankings, AI search/citation visibility, traffic, lead volume, and advertising performance
        depend on factors outside our control, including third-party algorithm changes (Google, Bing, ChatGPT,
        Perplexity, Google AI Overviews, and similar systems), competitor activity, and platform policy changes.
        We do not guarantee specific rankings, traffic, citations, lead counts, or revenue outcomes. The single
        exception is the conditional, results-based refund term described in our{" "}
        <Link href="/refund-policy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Refund &amp; Cancellation Policy
        </Link>
        , which applies only where the specific conditions stated there are met.
      </LegalP>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual Property",
    content: (
      <>
        <LegalP>
          Unless otherwise agreed in writing, upon full payment, the Client owns the final deliverables created
          specifically for them (e.g. website content, ad creative, on-page copy). Boost Web Digital retains
          ownership of its own pre-existing tools, templates, processes, and methodologies used to deliver the
          Services, and may use non-confidential, anonymized learnings from an engagement to improve its general
          service delivery.
        </LegalP>
        <LegalP>
          The Website itself — its design, code, and content — is owned by Boost Web Digital and may not be
          copied or reproduced without permission.
        </LegalP>
      </>
    ),
  },
  {
    id: "confidentiality",
    heading: "Confidentiality",
    content: (
      <LegalP>
        Each party agrees to keep the other&apos;s confidential business information (including patient-volume or
        revenue figures shared for reporting purposes) confidential, and to use it only to perform under this
        Agreement, except where disclosure is required by law. This clause survives the end of the engagement.
        Where a Client requires a separate, signed non-disclosure agreement, we will provide one on request.
      </LegalP>
    ),
  },
  {
    id: "termination",
    heading: "Term, Termination & Suspension",
    content: (
      <>
        <LegalP>
          Engagements run on the term (project-based or month-to-month) stated in the applicable client agreement.
          Either party may terminate under the notice terms stated there. We may suspend or terminate Services
          immediately if fees remain unpaid past the due date stated on an invoice, or if the Client&apos;s use of
          the Services violates applicable law or a third-party platform&apos;s policies in a way that puts our
          accounts or standing at risk.
        </LegalP>
        <LegalP>
          Cancellation terms, and the specific conditional refund available where pre-agreed performance targets
          are not met, are set out in full in our{" "}
          <Link href="/refund-policy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
            Refund &amp; Cancellation Policy
          </Link>
          .
        </LegalP>
      </>
    ),
  },
  {
    id: "communications",
    heading: "Communications",
    content: (
      <LegalP>
        By engaging our Services or submitting an enquiry, you consent to receive service-related emails (project
        updates, invoices, reports) and, where you have opted in, marketing emails from us. Every marketing email
        includes a clear way to unsubscribe, and we honor unsubscribe requests promptly, consistent with the U.S.
        CAN-SPAM Act and India&apos;s applicable regulations. You may withdraw marketing consent at any time by
        using the unsubscribe link or emailing us at{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        .
      </LegalP>
    ),
  },
  {
    id: "international-clients",
    heading: "International Clients & Your Local Rights",
    content: (
      <LegalP>
        We work with clients based outside India, including in the United States. While this Agreement is governed
        by Indian law (see{" "}
        <a href="#governing-law" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Governing Law &amp; Dispute Resolution
        </a>
        ), nothing in these Terms is intended to override any mandatory consumer-protection right you are entitled
        to under the law of your own country or state that cannot lawfully be waived by agreement. If any part of
        these Terms conflicts with such a mandatory right, that part does not apply to you to the extent of the
        conflict, and the rest of these Terms remains in effect.
      </LegalP>
    ),
  },
  {
    id: "limitation-of-liability",
    heading: "Limitation of Liability",
    content: (
      <LegalP>
        To the maximum extent permitted by law, Boost Web Digital&apos;s total liability arising out of or related
        to the Services is limited to the total fees paid by the Client for the specific Service giving rise to the
        claim in the three (3) months preceding the claim. We are not liable for indirect, incidental, or
        consequential damages, including loss of profits, patients, or business opportunity, except where such
        limitation is not permitted by applicable law.
      </LegalP>
    ),
  },
  {
    id: "indemnification",
    heading: "Indemnification",
    content: (
      <LegalP>
        You agree to indemnify and hold Boost Web Digital harmless from claims arising out of content, claims, or
        credentials you provide to us for use in marketing materials (including medical or professional claims
        about your practice), your violation of these Terms, or your violation of applicable law or a third-party
        platform&apos;s policies.
      </LegalP>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing Law & Dispute Resolution",
    content: (
      <LegalP>
        These Terms are governed by the laws of India. Subject to the international-clients note above, the courts
        at Amritsar, Punjab have exclusive jurisdiction over any dispute arising out of or relating to these Terms
        or any Agreement with us. We encourage clients to raise concerns directly with us first, at{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        , so most issues can be resolved without formal proceedings.
      </LegalP>
    ),
  },
  {
    id: "changes",
    heading: "Changes to These Terms",
    content: (
      <LegalP>
        We may update these Terms from time to time to reflect changes in our Services or legal requirements. The
        &quot;Last updated&quot; date at the top of this page reflects the most recent revision. Material changes
        affecting an active client agreement will be communicated directly before taking effect for that
        engagement.
      </LegalP>
    ),
  },
  {
    id: "contact",
    heading: "Contact Us",
    content: (
      <LegalP>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        , or by post to Boost Web Digital, 622, Near Beri Gate, Katra Bhai Sant Singh, Amritsar, District Amritsar,
        Punjab 143001, India. Phone: <Fill>phone number — optional</Fill>.
      </LegalP>
    ),
  },
];

export default function TermsPage() {
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
        { name: "Terms & Conditions", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <LegalLayout
        kicker="Legal"
        title="Terms & Conditions"
        subtitle="The terms governing your use of this Website and any services agreement with Boost Web Digital."
        lastUpdated={LEGAL_LAST_UPDATED}
        sections={SECTIONS}
        intro={
          <LegalP>
            Please read these Terms carefully before using boostwebdigital.com or engaging Boost Web Digital for
            services. They apply to visitors of this Website and to clients under a signed proposal or client
            agreement, wherever in the world you are based.
          </LegalP>
        }
      />
    </>
  );
}

// LAWYER REVIEW REQUIRED before publishing: governing law/jurisdiction
// clause, the CAN-SPAM communications clause, and the cross-reference to the
// results-based refund term in Refund & Cancellation Policy (which needs a
// defined KPI — see that page — to be enforceable).
