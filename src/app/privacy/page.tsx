import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb } from "@/lib/schema";
import { LegalLayout, LegalP, LegalH3, LegalUL, Fill, LEGAL_LAST_UPDATED, type LegalSection } from "@/components/legal/LegalLayout";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/privacy/`;

const TITLE = "Privacy Policy | Boost Web Digital";
const DESCRIPTION =
  "How Boost Web Digital collects, uses, and protects personal data, including analytics tools used, international transfers, and your rights under India's DPDP Act, GDPR, and U.S. state privacy laws.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy/", type: "website" },
  // Boilerplate legal text has no organic-search value of its own — noindex,
  // but still follow so outbound links keep passing link equity normally.
  robots: { index: false, follow: true },
};

const SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    content: (
      <LegalP>
        This Privacy Policy explains how Boost Web Digital collects, uses, discloses, and protects personal
        information when you visit boostwebdigital.com (the &quot;Website&quot;), submit a contact form, or engage
        us as a client. It applies to visitors and clients wherever you are located, including in India, the
        European Union, and the United States.
      </LegalP>
    ),
  },
  {
    id: "who-we-are",
    heading: "Who We Are",
    content: (
      <LegalP>
        Boost Web Digital is a sole proprietorship owned and operated by Ritik Malhotra, registered address 622,
        Near Beri Gate, Katra Bhai Sant Singh, Amritsar, District Amritsar, Punjab 143001, India (GSTIN
        03FYBPM7255M1Z2). Boost Web Digital is the entity responsible for the personal data described in this
        Policy.
      </LegalP>
    ),
  },
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    content: (
      <>
        <LegalP>We collect information in the following ways:</LegalP>
        <LegalUL>
          <li><strong className="text-white/85">Information you provide</strong> — name, email, phone number, practice name, and message content submitted through our contact form or by email.</li>
          <li><strong className="text-white/85">Information collected automatically</strong> — IP address, browser and device type, pages viewed, referring URL, and approximate location, collected via cookies and analytics tools described below.</li>
          <li><strong className="text-white/85">Information from clients</strong> — business details, account access, and performance data (e.g. search rankings, ad performance) provided or generated in the course of delivering Services.</li>
        </LegalUL>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    heading: "How We Use Your Information",
    content: (
      <LegalUL>
        <li>To respond to enquiries and provide requested information about our Services.</li>
        <li>To deliver, manage, and report on Services for clients.</li>
        <li>To operate, secure, and improve the Website, including understanding how visitors use it.</li>
        <li>To send service-related communications and, where you have opted in, marketing communications.</li>
        <li>To comply with legal, tax, and accounting obligations (including GST record-keeping).</li>
      </LegalUL>
    ),
  },
  {
    id: "ai-visibility-checker",
    heading: "AI Visibility Checker",
    content: (
      <LegalP>
        The AI Visibility Checker sends your business name, keyword and location to Exa, a third-party AI search
        provider, to retrieve a real AI-generated answer. We store your submission and the resulting report to
        provide the service and to contact you about it. Please do not submit confidential information.
      </LegalP>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies & Tracking Technologies",
    content: (
      <LegalP>
        The Website uses cookies and similar technologies for essential functionality, analytics, and (where
        applicable) advertising. Full detail on the specific cookies used, their purpose, and how to control them
        is set out in our{" "}
        <a href="/cookie-policy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Cookie Policy
        </a>
        , which forms part of this Privacy Policy.
      </LegalP>
    ),
  },
  {
    id: "analytics-tools",
    heading: "Analytics & Third-Party Tools",
    content: (
      <>
        <LegalP>We use the following third-party tools to understand Website usage and campaign performance:</LegalP>
        <LegalUL>
          <li><strong className="text-white/85">Google Analytics 4 (GA4)</strong> — usage analytics (pages viewed, session duration, traffic source).</li>
          <li><strong className="text-white/85">Meta (Facebook) Pixel</strong> — advertising measurement and retargeting; under the CCPA/CPRA, use of the Pixel may be considered a &quot;sharing&quot; of personal information for cross-context behavioral advertising — see U.S. State Privacy Rights below.</li>
          <li><strong className="text-white/85">Microsoft Clarity and/or Hotjar</strong> — session behavior analytics (e.g. scroll depth, click patterns) to improve the Website&apos;s usability.</li>
        </LegalUL>
        <LegalP>
          Each of these tools is operated by a U.S.-based company and may involve the transfer of data to the
          United States — see International Data Transfers below.
        </LegalP>
      </>
    ),
  },
  {
    id: "international-transfers",
    heading: "International Data Transfers",
    content: (
      <LegalP>
        Because we use Google, Meta, and Microsoft/Hotjar for analytics and advertising, and Stripe and PayPal to
        process international payments, personal data may be transferred to and processed in the United States and
        other countries outside your own. Where required, we rely on the standard contractual safeguards these
        providers make available (such as Standard Contractual Clauses) and on the fact that these are established
        providers with their own published privacy and security commitments. By using the Website or our Services,
        you acknowledge this transfer.
      </LegalP>
    ),
  },
  {
    id: "legal-bases-gdpr",
    heading: "Legal Bases for Processing (GDPR)",
    content: (
      <LegalP>
        If you are located in the European Economic Area or UK, we process your personal data on one or more of
        the following legal bases: your consent (e.g. for marketing emails or non-essential cookies), performance
        of a contract (e.g. delivering Services you have engaged us for), our legitimate interests (e.g. Website
        analytics, security, and responding to enquiries), and compliance with a legal obligation (e.g. tax
        records).
      </LegalP>
    ),
  },
  {
    id: "data-retention",
    heading: "Data Retention",
    content: (
      <LegalP>
        We retain personal data for as long as necessary to fulfil the purposes described in this Policy, including
        satisfying legal, accounting, or reporting requirements (for example, GST-related records). Contact form
        enquiries that do not become a client relationship are retained only as long as needed to respond and for a
        reasonable follow-up period, after which they are deleted or anonymized.
      </LegalP>
    ),
  },
  {
    id: "data-sharing",
    heading: "Data Sharing & Disclosure",
    content: (
      <>
        <LegalP>We do not sell personal information. We share personal data only with:</LegalP>
        <LegalUL>
          <li>The analytics, payment, and communications tools named in this Policy, strictly to operate the Website and deliver Services.</li>
          <li>Professional advisors (e.g. accountants) where necessary for our own legal and tax compliance.</li>
          <li>Authorities, where required by applicable law.</li>
        </LegalUL>
      </>
    ),
  },
  {
    id: "dpdp-rights",
    heading: "Your Rights Under India's DPDP Act",
    content: (
      <>
        <LegalP>
          If you are located in India, the Digital Personal Data Protection Act, 2023 gives you the right to obtain
          a summary of the personal data we hold about you and the processing activities undertaken, to seek
          correction and erasure of your personal data, to nominate another individual to exercise your rights in
          the event of death or incapacity, and to have readily available means to register a grievance with us.
        </LegalP>
        <LegalP>
          <strong className="text-white/85">Grievance Officer:</strong> Ritik Malhotra, Proprietor, Boost Web
          Digital. You may raise a grievance by emailing{" "}
          <a href="mailto:ritik@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
            ritik@boostwebdigital.com
          </a>
          . We will acknowledge and address grievances within the timelines required under applicable law.
        </LegalP>
      </>
    ),
  },
  {
    id: "gdpr-rights",
    heading: "Your Rights Under GDPR",
    content: (
      <LegalP>
        If you are located in the EEA or UK, you have the right to access, correct, delete, or restrict processing
        of your personal data, to object to processing based on legitimate interests, to data portability, to
        withdraw consent at any time, and to lodge a complaint with your local data protection authority. To
        exercise any of these rights, contact us at{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        .
      </LegalP>
    ),
  },
  {
    id: "us-state-privacy-rights",
    heading: "US State Privacy Rights (CCPA/CPRA & Other US States)",
    content: (
      <>
        <LegalP>
          Boost Web Digital is currently below the thresholds that make the California Consumer Privacy Act
          (CCPA), as amended by the CPRA, and comparable U.S. state privacy laws (e.g. Virginia, Colorado)
          mandatory for our business. We nonetheless offer the following rights to California and other U.S.
          residents as a matter of good practice:
        </LegalP>
        <LegalUL>
          <li><strong className="text-white/85">Right to know / access</strong> — what personal information we have collected about you and why.</li>
          <li><strong className="text-white/85">Right to delete</strong> — request deletion of personal information we hold about you, subject to legal exceptions.</li>
          <li><strong className="text-white/85">Right to correct</strong> — request correction of inaccurate personal information.</li>
          <li><strong className="text-white/85">Right to opt out of sale or sharing</strong> — we do not sell personal information; use of the Meta Pixel may constitute &quot;sharing&quot; for cross-context behavioral advertising under CPRA, and you may opt out as described below.</li>
          <li><strong className="text-white/85">Right to non-discrimination</strong> — we will not discriminate against you for exercising any of these rights.</li>
        </LegalUL>
        <LegalH3>Do Not Sell or Share My Personal Information</LegalH3>
        <LegalP>
          We do not sell personal information for money. To opt out of any &quot;sharing&quot; via advertising
          pixels such as the Meta Pixel, use the cookie controls described in our{" "}
          <a href="/cookie-policy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
            Cookie Policy
          </a>
          {" "}or email{" "}
          <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
            contact@boostwebdigital.com
          </a>
          {" "}with the subject line &quot;Do Not Sell or Share My Personal Information&quot;.
        </LegalP>
        <LegalP>
          We honor the Global Privacy Control (GPC) signal where technically supported: if your browser sends a GPC
          signal, we treat it as a valid opt-out-of-sharing request for that browser.
        </LegalP>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    heading: "Children's Privacy",
    content: (
      <LegalP>
        The Website and our Services are directed at healthcare businesses and professionals, not children. We do
        not knowingly collect personal information from anyone under 18. If you believe a child has provided us
        personal information, contact us and we will delete it.
      </LegalP>
    ),
  },
  {
    id: "data-security",
    heading: "Data Security",
    content: (
      <LegalP>
        We use reasonable technical and organizational measures to protect personal data against unauthorized
        access, alteration, or loss, including restricting access to client data to those who need it to deliver
        Services. No method of transmission or storage is completely secure, and we cannot guarantee absolute
        security.
      </LegalP>
    ),
  },
  {
    id: "privacy-changes",
    heading: "Changes to This Policy",
    content: (
      <LegalP>
        We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this
        page reflects the most recent revision. Significant changes will be highlighted on this page.
      </LegalP>
    ),
  },
  {
    id: "privacy-contact",
    heading: "Contact Us / Grievance Officer",
    content: (
      <LegalP>
        For any privacy question, request, or grievance: email{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        {" "}(general) or{" "}
        <a href="mailto:ritik@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          ritik@boostwebdigital.com
        </a>
        {" "}(Grievance Officer, DPDP Act), or write to Boost Web Digital, 622, Near Beri Gate, Katra Bhai Sant
        Singh, Amritsar, District Amritsar, Punjab 143001, India. Phone: <Fill>phone number — optional</Fill>.
      </LegalP>
    ),
  },
];

export default function PrivacyPage() {
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
        { name: "Privacy Policy", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <LegalLayout
        kicker="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal data — and how to exercise your rights, wherever you're located."
        lastUpdated={LEGAL_LAST_UPDATED}
        sections={SECTIONS}
        intro={
          <LegalP>
            This Policy applies to visitors of boostwebdigital.com and to clients of Boost Web Digital, whether
            you are located in India, the European Union, the United States, or elsewhere.
          </LegalP>
        }
      />
    </>
  );
}

// LAWYER REVIEW REQUIRED before publishing: DPDP Act grievance-officer
// clause, GDPR legal-bases section, US State Privacy Rights (CCPA/CPRA)
// section including the GPC-honoring commitment, and the international
// data transfer safeguards language.
