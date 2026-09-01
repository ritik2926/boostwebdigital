import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { CheckerWidget } from "@/components/checker/CheckerWidget";
import { ORGANIZATION, WEBSITE, breadcrumb } from "@/lib/schema";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/tools/ai-visibility-checker/`;

const TITLE = "Free AI Visibility Checker | Boost Web Digital";
const DESCRIPTION =
  "Send one real search to a live AI answer engine and see whether your practice gets named. Free, and it takes about 30 seconds.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/ai-visibility-checker/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/ai-visibility-checker/", type: "website" },
};

export default function AiVisibilityCheckerPage() {
  const webPage = {
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE["@id"] },
    about: { "@id": ORGANIZATION["@id"] },
  };

  // WebApplication only — no AggregateRating, no Review, ever (this tool
  // has no ratings or reviews to publish honestly, so none are claimed).
  const webApplication = {
    "@type": "WebApplication",
    "@id": `${PAGE_URL}#webapplication`,
    name: "AI Visibility Checker",
    url: PAGE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@id": ORGANIZATION["@id"] },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      webPage,
      webApplication,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "AI Visibility Checker", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <div className="print:hidden">
        <Navbar />
      </div>
      <main>
        <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <Container size="prose" className="checker-print-doc">
            <Kicker>Free Tool</Kicker>
            <h1 className={cn(STACK.kickerToHeading, "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]")}>
              AI Visibility Checker
            </h1>
            <p className={cn(STACK.headingToSub, "text-white/70")}>
              We send one real patient question to a live AI search engine and show you the exact answer it gives —
              including whether your practice is named.
            </p>
            <p className="mt-2 text-white/70">It&rsquo;s free, and it takes about 30 seconds.</p>

            <div className={STACK.subToContent}>
              <CheckerWidget />
            </div>
          </Container>
        </section>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
