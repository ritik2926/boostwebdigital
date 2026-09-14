import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { StaticGlow } from "@/components/StaticGlow";
import { PrimaryCta } from "@/components/StaticCta";
import { ORGANIZATION, WEBSITE, breadcrumb } from "@/lib/schema";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/tools/`;

const TITLE = "Free Tools for Healthcare Practices";
const DESCRIPTION =
  "One live tool right now: check whether an AI answer engine actually names your practice when a patient asks it a real question. Free, no signup.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/tools/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/", type: "website" },
};

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Index for /tools/, which previously 404'd while linked from nearly every
 * page (nav, footer, every service/specialty hub's hero and closing CTA all
 * point at /tools/ai-visibility-checker/ directly, but a visitor who trims
 * the URL to its parent hit a dead end).
 *
 * Deliberately short (see body-word-count target below) and lists exactly
 * one entry: /tools/ai-visibility-checker/, the only tool that actually
 * exists. /research/ and /compare/ are NOT built and are not mentioned here
 * at all — both have zero children, and per this task's own instruction an
 * index page for an empty directory is a thin page not worth shipping.
 * Nothing on this page implies a second tool exists yet.
 *
 * No comparison table / second list forced in here (see the shared writing
 * checklist) — there is exactly one tool to describe, and inventing a
 * table or a second list to compare it against nothing would be the kind
 * of padding this same brief tells this page specifically to avoid ("do
 * not pad it to look substantial"). Flagged in the task report.
 */
export default function ToolsIndexPage() {
  const webPage = {
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE["@id"] },
    about: { "@id": ORGANIZATION["@id"] },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      webPage,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Tools", url: PAGE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <section id="hero" className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <StaticGlow corner="top-right" />
          <Container>
            <div className="max-w-2xl">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
                <Link href="/" className="transition-colors hover:text-white/80">
                  Home
                </Link>
                <span aria-hidden>›</span>
                <span className="text-white/70">Tools</span>
              </nav>
              <Kicker className="mt-6">Free Tools</Kicker>
              <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2rem,4.4vw,3.05rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
                Free Tools, Not Lead Magnets
              </h1>
              <p className="mt-6 max-w-[58ch] text-white/70">
                Most &ldquo;free tools&rdquo; on a marketing site collect an email address before showing you
                anything. Ours answer one specific, checkable question, in the open, before you talk to us at all.
              </p>
              <p className="mt-4 max-w-[58ch] text-white/70">
                Right now there is exactly one. It checks whether a live AI answer engine actually names your
                practice when a patient asks it a real question. Run it, read the exact answer, and decide what to
                do with it yourself.
              </p>
              <p className="mt-4 max-w-[58ch] text-white/70">
                We sell AI visibility work, so a tool that only told you what we wanted you to hear would not be
                worth publishing. This one shows the same raw answer either way.
              </p>
            </div>
          </Container>
        </section>

        <section className={cn("relative", SECTION_PADDING.default)}>
          <Container>
            <Kicker>What&rsquo;s Live Right Now</Kicker>
            <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>One Tool, and What It Actually Does</h2>
            <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
              36% of patients now use an AI tool to choose a provider before they ever search Google by name. The
              checker below tells you whether yours is one of the practices that gets named.
            </p>

            <div className={cn(STACK.subToContent, "rounded-2xl border border-white/8 bg-white/[0.02] p-8")}>
              <h3 className="font-display text-xl font-semibold text-white">AI Visibility Checker</h3>
              <p className="mt-3 max-w-2xl text-white/70">
                We send three real patient questions to a live AI answer engine. We show you its exact answers —
                whether your practice gets named, and which pages it reads instead when it does not.
              </p>
              <ul className="mt-4 flex max-w-2xl flex-col gap-2 text-sm text-white/60">
                <li>The exact question we asked, word for word.</li>
                <li>Whether your practice was named, or which competitor was named instead.</li>
                <li>The source page the answer actually cited, if it named one.</li>
                <li>Nothing scored, ranked, or averaged — three answers, shown as given.</li>
              </ul>
              <p className="mt-4 text-white/70">
                Three questions are a sample, not a full picture. A practice not named once is not automatically
                failing. A practice named every time is not automatically safe either.
              </p>
              <p className="mt-3 text-white/70">
                What it gives you instead is a real, current answer. Not a guess about whether AI search is
                something worth thinking about yet, and not a score built to nudge you toward calling us.
              </p>
              <p className="mt-4 text-sm font-semibold text-white">
                We&rsquo;re telling you what we&rsquo;ve observed, not what any vendor has confirmed. This checks one
                live engine, not every AI tool a patient might use.
              </p>
              <div className="mt-6">
                <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="tools-index-checker">
                  Run the Free AI Visibility Check
                </PrimaryCta>
              </div>
              <p className="mt-3 text-sm text-white/45">Free. No card. About 40 seconds.</p>
            </div>
          </Container>
        </section>

        <section className={cn("relative", SECTION_PADDING.compact)}>
          <Container>
            <p className="max-w-2xl text-white/70">
              This is the only tool live today. Nothing else on this page is coming soon or in progress. We will
              add to this page the day a second tool is genuinely live, not before.
            </p>
            <p className="mt-4 max-w-2xl text-white/70">
              For a fuller diagnosis than one tool can give, the two-minute table on{" "}
              <Link href="/services/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
                our services page
              </Link>{" "}
              points at what to fix first, based on what you are actually seeing. Or start from{" "}
              <Link href="/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
                the homepage
              </Link>{" "}
              if you are not sure yet.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
