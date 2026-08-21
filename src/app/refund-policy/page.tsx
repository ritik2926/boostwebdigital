import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb } from "@/lib/schema";
import { LegalLayout, LegalP, Fill, LEGAL_LAST_UPDATED, type LegalSection } from "@/components/legal/LegalLayout";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/refund-policy/`;

const TITLE = "Refund & Cancellation Policy | Boost Web Digital";
const DESCRIPTION =
  "Payment, cancellation, and refund terms for Boost Web Digital engagements, including the conditional results-based refund and third-party cost handling.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/refund-policy/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/refund-policy/", type: "website" },
  // Boilerplate legal text has no organic-search value of its own — noindex,
  // but still follow so outbound links keep passing link equity normally.
  robots: { index: false, follow: true },
};

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "Overview",
    content: (
      <LegalP>
        This policy explains how payment, cancellation, and refunds work for engagements with Boost Web Digital
        (proprietor: Ritik Malhotra, GSTIN 03FYBPM7255M1Z2). It applies alongside the{" "}
        <a href="/terms/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Terms &amp; Conditions
        </a>
        {" "}and the specific fees/scope stated in your signed proposal or client agreement, which take precedence
        over this general policy where they conflict.
      </LegalP>
    ),
  },
  {
    id: "engagement-model",
    heading: "Engagement Model",
    content: (
      <LegalP>
        Services are provided on either a project basis (fixed scope, fixed fee) or a monthly retainer basis
        (ongoing services, recurring fee), as specified in your agreement. Month-to-month retainer clients are not
        locked into a long-term contract; cancellation terms are described below.
      </LegalP>
    ),
  },
  {
    id: "payment-terms",
    heading: "Payment Terms",
    content: (
      <LegalP>
        Fees are invoiced upfront or on the milestone/monthly schedule stated in your agreement, and are exclusive
        of GST unless stated otherwise. Indian clients may pay via Razorpay, UPI, or bank transfer; international
        clients may pay via Stripe or PayPal. Work generally begins once the initial invoice is paid.
      </LegalP>
    ),
  },
  {
    id: "general-refund-policy",
    heading: "General Refund Policy",
    content: (
      <LegalP>
        Because our fees cover labor already performed — strategy, research, content, campaign setup and
        management — fees for work already completed are generally non-refundable. This reflects the real cost of
        delivering the Service, not a penalty. The specific, limited exception is the results-based refund term
        below.
      </LegalP>
    ),
  },
  {
    id: "results-based-refund",
    heading: "Results-Based Refund Term",
    content: (
      <>
        <LegalP>
          Where a client agreement includes pre-agreed, specific performance targets (&quot;KPIs&quot;) signed by
          both parties, and Boost Web Digital does not meet those KPIs within the agreed 3–4 month period stated in
          that agreement, the client may request to cancel the engagement and receive a refund of 50% of the fees
          paid for that period, subject to the conditions stated in the agreement (for example, timely client
          cooperation and approvals, and no material change in scope).
        </LegalP>
        <LegalP>
          The specific result or KPI that triggers this refund is defined per client agreement, not by this general
          policy:{" "}
          <Fill>exact result/KPI that triggers the 50% refund</Fill>. This term is only enforceable where the
          triggering KPI is defined in writing and signed by both parties before the engagement begins.
        </LegalP>
      </>
    ),
  },
  {
    id: "cancellation-by-client",
    heading: "Cancellation by Client",
    content: (
      <LegalP>
        Month-to-month retainer clients may cancel with the notice period stated in their agreement (typically 30
        days), effective at the end of the current billing cycle. Fees already paid for work performed or in
        progress during the notice period are not refunded, except as provided under the Results-Based Refund Term
        above.
      </LegalP>
    ),
  },
  {
    id: "cancellation-by-us",
    heading: "Cancellation/Termination by Boost Web Digital",
    content: (
      <LegalP>
        We may cancel or pause an engagement for non-payment, for a client&apos;s violation of applicable law or a
        third-party platform&apos;s policies, or for conduct that makes the engagement unworkable. Where we cancel
        without cause, any prepaid fees for Services not yet delivered will be refunded on a pro-rata basis.
      </LegalP>
    ),
  },
  {
    id: "third-party-costs",
    heading: "Third-Party Costs & Ad Spend",
    content: (
      <LegalP>
        Advertising spend (Google Ads, Meta Ads), domain registration, hosting, licensed software, and stock
        assets are third-party, pass-through costs. Once spent with the third-party platform or vendor, these
        amounts are non-refundable by Boost Web Digital, since they are paid onward to that platform or vendor and
        not retained as our fee.
      </LegalP>
    ),
  },
  {
    id: "refund-method",
    heading: "Refund Method & Timeline",
    content: (
      <LegalP>
        Approved refunds are returned using the original payment method (Razorpay/UPI/bank transfer for India;
        Stripe/PayPal for international payments) within a reasonable timeframe, typically within 14 business days
        of approval, subject to the processing times of the relevant payment provider.
      </LegalP>
    ),
  },
  {
    id: "international-refunds",
    heading: "International Clients",
    content: (
      <LegalP>
        For payments made via Stripe or PayPal, refunds are processed back through the same provider and may be
        subject to that provider&apos;s own processing timelines and any currency-conversion difference between
        the original payment and the refund.
      </LegalP>
    ),
  },
  {
    id: "refund-governing-law",
    heading: "Governing Law",
    content: (
      <LegalP>
        This policy is governed by the laws of India, subject to the international-clients note in our{" "}
        <a href="/terms/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Terms &amp; Conditions
        </a>
        {" "}regarding mandatory consumer-protection rights in your own jurisdiction.
      </LegalP>
    ),
  },
  {
    id: "refund-contact",
    heading: "Contact Us",
    content: (
      <LegalP>
        To request a refund or discuss cancellation, email{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        {" "}with your invoice or agreement reference. Phone: <Fill>phone number — optional</Fill>.
      </LegalP>
    ),
  },
];

export default function RefundPolicyPage() {
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
        { name: "Refund & Cancellation Policy", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <LegalLayout
        kicker="Legal"
        title="Refund & Cancellation Policy"
        subtitle="How payment, cancellation, and the conditional results-based refund work for engagements with us."
        lastUpdated={LEGAL_LAST_UPDATED}
        sections={SECTIONS}
        intro={
          <LegalP>
            This policy sits alongside your signed proposal or client agreement, which always controls on scope
            and fees specific to your engagement.
          </LegalP>
        }
      />
    </>
  );
}

// LAWYER REVIEW REQUIRED before publishing: the results-based 50% refund
// term is NOT enforceable as written without a defined KPI in each signed
// client agreement — see the Results-Based Refund Term section above.
