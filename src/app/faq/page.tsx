import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { MagneticButton } from "@/components/Buttons";
import { Sparkles } from "@/components/services/Sparkles";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb, faqPage } from "@/lib/schema";
import { FAQ_CLUSTERS, type FaqCluster } from "@/lib/faqs";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * CSS Grid locks same-row items to a shared row height — with clusters
 * ranging from 2 to 14 questions, that left large dead gaps under whichever
 * column's cluster happened to be shorter than its row partner. Splitting
 * into independent column arrays up front (largest-cluster-first, always
 * placed into whichever column currently has fewer total questions) gives
 * each column its own natural height instead, the way a real masonry layout
 * would. Plain server-side array math — no client JS, no layout library.
 */
function splitIntoBalancedColumns(clusters: FaqCluster[], columnCount: number): FaqCluster[][] {
  const columns: FaqCluster[][] = Array.from({ length: columnCount }, () => []);
  const weights = Array<number>(columnCount).fill(0);
  const byLargestFirst = [...clusters].sort((a, b) => b.items.length - a.items.length);
  for (const cluster of byLargestFirst) {
    const target = weights.indexOf(Math.min(...weights));
    columns[target].push(cluster);
    weights[target] += cluster.items.length;
  }
  return columns;
}

function FaqClusterBox({ cluster, defaultOpenFirst }: { cluster: FaqCluster; defaultOpenFirst: boolean }) {
  return (
    <div className="gradient-border-drift overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-white sm:text-2xl">{cluster.category}</h2>
      <div className={cn(STACK.kickerToHeading, "flex flex-col")}>
        {cluster.items.map((item, itemIndex) => (
          <details
            key={item.q}
            open={defaultOpenFirst && itemIndex === 0}
            className="faq-row group border-b border-white/8 py-5 first:pt-0 last:border-b-0"
          >
            <summary className="flex w-full cursor-pointer items-center justify-between gap-4 text-left">
              <h3 className="text-[15px] font-medium text-white/85 transition-colors group-hover:text-white group-open:text-accent sm:text-base">
                {item.q}
              </h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="faq-chevron shrink-0 text-white/50 transition-colors group-hover:text-white/80 group-open:text-accent"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ — hero reuses About page's exact ring treatment (src/app/about/page.tsx
// §1; not an extractable component there, so replicated verbatim rather than
// imported) and the clustered accordion is native <details>/<summary> — zero
// JavaScript, so this entire page stays a Server Component. `faqPage()` in
// lib/schema.ts already exists (used by Contact/Pricing/Home) and takes
// {question, answer} — kept as-is rather than changed to {q, a}, since
// changing its signature would mean editing those three other pages' call
// sites too. Mapped at the call site below instead.
// ---------------------------------------------------------------------------

const SITE_URL = "https://boostwebdigital.com";
const FAQ_URL = `${SITE_URL}/faq/`;

const TITLE = "Healthcare Marketing FAQ";
const DESCRIPTION =
  "Straight answers on AI search visibility, local SEO, reviews, ads and working with a healthcare marketing agency.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/faq/", type: "website" },
};

export default function FaqPage() {
  const faqWebPage = {
    "@type": "WebPage",
    "@id": `${FAQ_URL}#webpage`,
    url: FAQ_URL,
    name: TITLE,
    description: DESCRIPTION,
    about: { "@id": ORGANIZATION["@id"] },
  };

  const allFaqs = FAQ_CLUSTERS.flatMap((cluster) => cluster.items);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      faqWebPage,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "FAQ", url: FAQ_URL },
      ]),
      faqPage(allFaqs.map(({ q, a }) => ({ question: q, answer: a }))),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        {/* 1. Hero — identical ring treatment to /about/'s hero (verbatim
            values: same sizes, same conic-gradient stops, same .orbit-ring
            class) — pure CSS, no JS. */}
        <section className="relative flex min-h-[calc(100vh-20rem)] flex-col items-center justify-center overflow-hidden text-center sm:min-h-[calc(100vh-8rem)]">
          <Sparkles seedOffset={17} />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-95 w-95 -translate-x-1/2 -translate-y-1/2 sm:h-125 sm:w-125 lg:h-155 lg:w-155"
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.4), transparent 70%)" }}
            />
            <div
              className="absolute inset-6 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.05), rgba(var(--accent-rgb),0.04) 45%, transparent 75%)",
              }}
            />
            <div
              className="orbit-ring absolute inset-0 rounded-full blur-md"
              style={{
                animationDuration: "26s",
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 245deg, rgba(var(--accent-rgb),0.85) 295deg, rgba(255,255,255,0.7) 320deg, rgba(var(--accent-rgb),0.85) 345deg, transparent 360deg)",
              }}
            />
            <div className="absolute inset-3 rounded-full bg-[#08080a]" />
          </div>

          <Container className="relative z-10 flex flex-col items-center">
            <RevealGroup as="div" trigger="mount" stagger={0.1} delay={0.1}>
              <RevealItem>
                <Kicker>Questions, answered</Kicker>
              </RevealItem>
              <RevealItem className="mt-7">
                <h1 className="mx-auto max-w-3xl font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.5rem]">
                  Everything a practice asks
                  <br />
                  before it gets found
                </h1>
              </RevealItem>
              <RevealItem className="mx-auto mt-7 max-w-xl">
                <p className="text-white/70">
                  Straight answers on getting your practice seen — in Google, in the map pack, and in the AI tools
                  patients now ask before they ever book.
                </p>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>

        {/* 2. FAQ — clustered accordion, native <details>/<summary>. Each
            cluster is its own bordered box, pre-split into two independent
            columns (see splitIntoBalancedColumns above) so column height is
            never locked to a same-row partner's height — no dead gaps. */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.spacious)}>
          <Sparkles seedOffset={62} />
          <Container className="relative mx-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              {splitIntoBalancedColumns(FAQ_CLUSTERS, 2).map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-6">
                  {column.map((cluster) => (
                    <FaqClusterBox key={cluster.category} cluster={cluster} defaultOpenFirst={cluster.category === FAQ_CLUSTERS[0].category} />
                  ))}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 3. Closing CTA — dark, centred, same visual register as every
            other page's closing band. Bespoke copy (not the shared FinalCTA
            component, whose heading is fixed to different text) kept
            deliberately light — no card, matching the brief's "optional,
            simple" framing. */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
          <Container>
            <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <RevealItem>
                <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
                  Still not sure if patients can find you?
                </h2>
              </RevealItem>
              <RevealItem className={STACK.headingToSub}>
                <p className="text-white/70">
                  We&apos;ll run your practice through the AI engines patients use and send you the report — no call
                  required.
                </p>
              </RevealItem>
              <RevealItem className={STACK.contentToCta}>
                <MagneticButton href="/contact/">Get My Free Visibility Report</MagneticButton>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
