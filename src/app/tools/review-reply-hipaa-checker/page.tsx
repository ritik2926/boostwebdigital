import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { ReviewReplyChecker } from "@/components/tools/ReviewReplyChecker";
import { SAFE_REPLY_TEMPLATE } from "@/lib/reviewReplyPatterns";
import { ORGANIZATION, WEBSITE, breadcrumb } from "@/lib/schema";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/tools/review-reply-hipaa-checker/`;

const TITLE = "Free Review Reply HIPAA Checker | Boost Web Digital";
const DESCRIPTION =
  "Paste a draft reply to a patient review and see which phrases could create HIPAA exposure. Runs entirely in your browser — nothing is sent to us.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/tools/review-reply-hipaa-checker/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/review-reply-hipaa-checker/", type: "website" },
};

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const NEVER_CONTAIN = [
  {
    name: "Confirmation this person is a patient",
    body: "\"Our patient\", \"your appointment\", \"you were seen\" — each one confirms a relationship with a specific, identifiable person, which is itself protected information.",
  },
  {
    name: "Any clinical detail",
    body: "A condition, a treatment, a medication — even one the reviewer named first. Their disclosure isn't permission for your practice to confirm it.",
  },
  {
    name: "Any date, time, or visit detail",
    body: "A specific day or appointment time can identify a person almost as precisely as a name, especially alongside other public details.",
  },
  {
    name: "Anything about payment or billing",
    body: "Balances, insurance, and charges are protected the same way clinical information is.",
  },
];

export default function ReviewReplyHipaaCheckerPage() {
  const webPage = {
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE["@id"] },
    about: { "@id": ORGANIZATION["@id"] },
  };

  // WebApplication only — no AggregateRating, no Review, ever.
  const webApplication = {
    "@type": "WebApplication",
    "@id": `${PAGE_URL}#webapplication`,
    name: "Review Reply HIPAA Checker",
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
        { name: "Tools", url: `${SITE_URL}/tools/` },
        { name: "Review Reply Checker", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <Container size="prose">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-white/80">
                Home
              </Link>
              <span aria-hidden>›</span>
              <Link href="/tools/" className="transition-colors hover:text-white/80">
                Tools
              </Link>
              <span aria-hidden>›</span>
              <span className="text-white/70">Review Reply Checker</span>
            </nav>
            <Kicker className="mt-6">Free Tool</Kicker>
            <h1 className={cn(STACK.kickerToHeading, "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]")}>
              Review Reply HIPAA Checker
            </h1>
            <p className={cn(STACK.headingToSub, "text-white/70")}>
              Paste a draft reply to a patient review. We flag the phrases that could create HIPAA exposure, and we
              show you why each one is flagged.
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              Your text never leaves this browser. Nothing is sent to us, stored, or logged.
            </p>
            <p className="mt-3 text-sm text-white/50">
              This is not legal advice, and it is not a compliance guarantee. It checks for common patterns only. A
              clean result doesn&apos;t mean a reply is compliant. A flagged result doesn&apos;t mean it definitely
              isn&apos;t. Confirm anything specific with your own counsel.
            </p>

            <div className={STACK.subToContent}>
              <ReviewReplyChecker />
            </div>
          </Container>
        </section>

        <section className={SECTION_PADDING.default}>
          <Container size="prose">
            <Kicker>What It Does</Kicker>
            <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Six Pattern Checks, Run on Your Draft</h2>
            <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
              The tool above runs six checks. Four run on your draft reply alone. Two — whether it repeats a clinical
              detail the reviewer already disclosed, and whether it names the reviewer beyond what they posted — get
              sharper if you also paste the original review. That second field is optional, and the four main checks
              run either way.
            </p>
            <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
              Every match gets highlighted directly in your draft, with the specific category and a one-line reason
              underneath. Nothing here is scored, ranked, or averaged into a single number — you see the exact
              phrase, and you decide what to do with it.
            </p>

            <h2 className={cn(H2, STACK.subToContent, "max-w-2xl")}>What It Does Not Do</h2>
            <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
              It doesn&apos;t read your state&apos;s specific rules, your practice&apos;s specific risk, or the
              original platform&apos;s own policies. It doesn&apos;t catch every possible phrasing — six pattern
              categories can&apos;t cover every way a reply might drift into risky territory. And it never tells you
              a reply is safe to post. It only tells you what it found, and why that specific phrase is worth a
              second look.
            </p>

            <h2 className={cn(H2, STACK.subToContent, "max-w-2xl")}>Four Things a Reply Must Never Contain</h2>

            <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}>
              {NEVER_CONTAIN.map((item) => (
                <li key={item.name} className="flex flex-col gap-2 py-6">
                  <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-white/60">{item.body}</p>
                </li>
              ))}
            </ul>

            <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
              A safe reply does the opposite of all four. It acknowledges the feedback, invites the person to a
              private channel, and stops there. Below is that template. It is general enough to adapt, and specific
              enough to actually use — shown here directly, not locked behind running the checker above.
            </p>

            <div className={cn(STACK.subToContent, "max-w-2xl rounded-lg border border-white/8 bg-white/[0.02] p-5")}>
              <p className="text-[15px] leading-relaxed text-white/75">{SAFE_REPLY_TEMPLATE}</p>
            </div>

            <p className={cn(STACK.subToContent, "max-w-2xl text-sm text-white/50")}>
              Review replies are one of the more common, avoidable ways a practice creates its own HIPAA exposure.
              See the real enforcement context on{" "}
              <Link href="/healthcare-reputation-management/" className="text-white/70 underline-offset-4 hover:text-accent hover:underline">
                our reputation management page
              </Link>
              .
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
