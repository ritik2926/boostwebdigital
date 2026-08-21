import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb } from "@/lib/schema";
import { LegalLayout, LegalP, LegalUL, Fill, LEGAL_LAST_UPDATED, type LegalSection } from "@/components/legal/LegalLayout";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/cookie-policy/`;

const TITLE = "Cookie Policy | Boost Web Digital";
const DESCRIPTION =
  "The cookies and tracking tools boostwebdigital.com uses, why, and how to control them under GDPR opt-in and US opt-out/GPC rules.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cookie-policy/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/cookie-policy/", type: "website" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "what-are-cookies",
    heading: "What Are Cookies",
    content: (
      <LegalP>
        Cookies are small text files placed on your device when you visit a website. They let a site remember
        information about your visit, such as preferences and how you interact with pages, and are used alongside
        similar technologies like pixels and local storage.
      </LegalP>
    ),
  },
  {
    id: "how-we-use-cookies",
    heading: "How We Use Cookies",
    content: (
      <LegalP>
        We use cookies to keep the Website functioning correctly, to understand how visitors use it so we can
        improve it, and to measure the performance of our own advertising. This Cookie Policy should be read
        together with our{" "}
        <a href="/privacy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Privacy Policy
        </a>
        .
      </LegalP>
    ),
  },
  {
    id: "types-of-cookies",
    heading: "Types of Cookies We Use",
    content: (
      <LegalUL>
        <li><strong className="text-white/85">Essential</strong> — required for core Website functionality (e.g. security, load balancing). These cannot be switched off.</li>
        <li><strong className="text-white/85">Analytics</strong> — help us understand how visitors use the Website (pages viewed, session length, traffic source).</li>
        <li><strong className="text-white/85">Advertising / marketing</strong> — used to measure and improve the performance of our own ad campaigns and, for visitors who arrived via an ad, to avoid showing the same ad repeatedly.</li>
      </LegalUL>
    ),
  },
  {
    id: "third-party-cookies",
    heading: "Third-Party Cookies & Tools",
    content: (
      <LegalUL>
        <li><strong className="text-white/85">Google Analytics 4 (GA4)</strong> — analytics cookies; data is processed by Google, including in the United States.</li>
        <li><strong className="text-white/85">Meta (Facebook) Pixel</strong> — advertising cookies used for campaign measurement and retargeting; data is processed by Meta, including in the United States, and may constitute a &quot;sharing&quot; of personal information under CCPA/CPRA (see below).</li>
        <li><strong className="text-white/85">Microsoft Clarity and/or Hotjar</strong> — session-behavior analytics cookies (e.g. scroll depth, click patterns); data is processed by Microsoft/Hotjar, including in the United States.</li>
      </LegalUL>
    ),
  },
  {
    id: "your-choices",
    heading: "Your Choices — India/GDPR vs. US",
    content: (
      <>
        <LegalP>
          Cookie consent rules differ by where you are located. If you are in the European Economic Area or UK,
          non-essential cookies (analytics, advertising) are set only after you opt in via a consent mechanism —
          an affirmative &quot;opt-in&quot; standard. If you are in the United States, non-essential cookies may be
          set by default, and you are instead offered a clear way to opt out, consistent with the CCPA/CPRA&apos;s
          &quot;opt-out&quot; standard.
        </LegalP>
        <LegalP>
          Wherever you are, you can also control cookies directly through your browser settings, which let you
          block or delete cookies at any time (see below).
        </LegalP>
      </>
    ),
  },
  {
    id: "gpc-and-pixel",
    heading: "Global Privacy Control & Meta Pixel Sharing",
    content: (
      <LegalP>
        We honor the Global Privacy Control (GPC) signal where technically supported: if your browser sends a GPC
        signal, we treat it as an opt-out of any advertising &quot;sharing&quot; (such as via the Meta Pixel) for
        that browser. You can also opt out directly by emailing{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        {" "}with the subject line &quot;Do Not Sell or Share My Personal Information&quot; — see also our{" "}
        <a href="/privacy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          Privacy Policy
        </a>
        .
      </LegalP>
    ),
  },
  {
    id: "control-cookies",
    heading: "How to Control or Delete Cookies",
    content: (
      <LegalP>
        Most browsers let you view, block, and delete cookies through their settings menu. Blocking essential
        cookies may affect how the Website functions. Because browser settings vary, consult your browser&apos;s
        own help documentation for exact steps (for example, searching &quot;manage cookies&quot; plus your
        browser&apos;s name).
      </LegalP>
    ),
  },
  {
    id: "cookie-changes",
    heading: "Changes to This Policy",
    content: (
      <LegalP>
        We may update this Cookie Policy as our use of cookies and tracking tools changes. The &quot;Last
        updated&quot; date at the top of this page reflects the most recent revision.
      </LegalP>
    ),
  },
  {
    id: "cookie-contact",
    heading: "Contact Us",
    content: (
      <LegalP>
        Questions about this Cookie Policy can be sent to{" "}
        <a href="mailto:contact@boostwebdigital.com" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
          contact@boostwebdigital.com
        </a>
        . Phone: <Fill>phone number — optional</Fill>.
      </LegalP>
    ),
  },
];

export default function CookiePolicyPage() {
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
        { name: "Cookie Policy", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <LegalLayout
        kicker="Legal"
        title="Cookie Policy"
        subtitle="The cookies and tracking tools this Website uses, and how to control them wherever you're located."
        lastUpdated={LEGAL_LAST_UPDATED}
        sections={SECTIONS}
        intro={
          <LegalP>
            This Cookie Policy forms part of our{" "}
            <a href="/privacy/" className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-accent">
              Privacy Policy
            </a>
            {" "}and explains the specific tools listed there in more detail.
          </LegalP>
        }
      />
    </>
  );
}

// LAWYER REVIEW REQUIRED before publishing: the GDPR opt-in vs. US
// opt-out distinction and the GPC-honoring commitment should be checked
// against whatever cookie-consent mechanism (if any) is actually
// implemented on the Website — this page currently describes policy intent,
// not a verified live consent-banner implementation.
