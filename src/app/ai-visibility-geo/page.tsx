import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { MagneticButton, GhostButton } from "@/components/Buttons";
import { StatCounter } from "@/components/services/StatCounter";
import { AmbientGlow } from "@/components/AmbientGlow";
import { Sparkles } from "@/components/services/Sparkles";
import { HeroCursorGlow } from "@/components/services/HeroCursorGlow";
import { AnswerBlock } from "@/components/ai-visibility-geo/AnswerBlock";
import { GeoFaqAccordion, type GeoFaqItem } from "@/components/ai-visibility-geo/GeoFaqAccordion";
import { StickyMobileBar } from "@/components/ai-visibility-geo/StickyMobileBar";
import { ProcessProgressLine } from "@/components/ai-visibility-geo/ProcessProgressLine";
import { ORGANIZATION, WEBSITE, breadcrumb, faqPage } from "@/lib/schema";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const SITE_URL = "https://boostwebdigital.com";
const PAGE_URL = `${SITE_URL}/ai-visibility-geo/`;

// Single conversion destination for the whole page.
// When /free-ai-visibility-report/ ships, change this one line.
const CTA_HREF = "/contact/";

const TITLE = "AI Search Visibility for Healthcare Practices | GEO";
const DESCRIPTION =
  "Get named by ChatGPT, Google AI Overviews, Perplexity and Gemini when patients ask for a recommendation. Measured monthly in citations, not rankings.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/ai-visibility-geo/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/ai-visibility-geo/", type: "website" },
};

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STATS = [
  {
    value: 88,
    suffix: "%",
    label: "of health-related searches now trigger an AI Overview",
    sub: "Healthcare has the highest AI Overview prevalence of any industry.",
  },
  {
    value: 36,
    suffix: "%",
    label: "of patients now use AI tools to find a provider",
    sub: "Ahead of Google search at 34% and physician referrals at 32%.",
  },
  {
    value: 75,
    suffix: "%",
    label: "won't book a provider rated below 4.0 stars",
    sub: "The last gate, after the AI has already named you.",
  },
] as const;

const LEVERS = [
  {
    number: "01",
    name: "Entity consistency",
    body: "Your practice described identically across your website, your listings, your profiles and every third-party mention. Inconsistent entity data is the most common single reason an AI system cannot confidently name a practice.",
  },
  {
    number: "02",
    name: "Structured data",
    body: "Schema markup that lets a machine parse who you are, what you treat, where you operate and who runs the practice — without guessing.",
  },
  {
    number: "03",
    name: "Extractable content",
    body: "Answers written so an AI can lift them cleanly. Question-shaped headings, direct answers, and the point in the first sentence rather than paragraph four.",
  },
  {
    number: "04",
    name: "Third-party mentions",
    body: "The independent sources AI models actually pull from. Not link building. Citation building.",
  },
] as const;

const COMPARISON_ROWS: Array<[string, string]> = [
  ["Position for a keyword", "Times your practice was named"],
  ["Moves with the algorithm", "Moves with your entity data"],
  ["Says nothing about the AI answer", "Is the AI answer"],
  ["Quarterly, if you're lucky", "Monthly, same questions every time"],
];

const PROCESS_STEPS = [
  {
    number: "01",
    name: "Scan",
    when: "Week 1",
    body: "Fifteen patient-intent questions across four AI engines. We score where you stand today. Free, and it needs nothing from you but your practice name.",
  },
  {
    number: "02",
    name: "Diagnose",
    when: "Week 2",
    body: "Which competitors are being recommended instead of you, and the specific reasons why — entity gaps, missing structured data, review deficits, absent third-party mentions.",
  },
  {
    number: "03",
    name: "Fix",
    when: "Weeks 3 to 12",
    body: "Focused work across the four levers. You see exactly what changed and when.",
  },
  {
    number: "04",
    name: "Rescan",
    when: "Monthly, ongoing",
    body: "Same fifteen questions, same four engines. The citation count moves or it doesn't, and you see which.",
  },
] as const;

const WORKS_IF = [
  "You are a medical, dental, aesthetic, dermatology, plastic surgery, orthodontic or hair restoration practice",
  "Your highest-value procedures are researched online before anyone calls",
  "You want a number you can check yourself rather than a report you have to trust",
  "You can wait 30 to 60 days for the first movement",
];

const NOT_FOR_YOU = [
  {
    title: "You need results this month.",
    body: "AI citations typically move in 30 to 60 days. Nothing moves faster than that honestly.",
  },
  {
    title: "You want a rankings report.",
    body: "We report citations. If keyword positions are what your board wants to see, another agency will serve you better.",
  },
  {
    title: "You need patient data handled.",
    body: "We work exclusively with public data — your site, listings, reviews and public AI output. No records, no intake forms, no CRM access, so no business associate agreement is required.",
  },
];

/**
 * Verified 2026-08-24 against src/components/pricing/PricingPlansCards.tsx —
 * /pricing/ publishes real monthly/annual figures, not placeholder "contact
 * us" copy, so the pricing question below is a claim the linked page
 * actually supports. Remove this entry if that ever stops being true.
 */
const FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: "Is this just SEO with a new name?",
    answer:
      "No. SEO gets you ranked in a list of links. This gets you named inside the answer above those links. They overlap, but AI systems weight entity consistency, structured data and third-party mentions far more heavily than traditional rankings do. A practice can rank in position three and be cited zero times — that combination is now common.",
  },
  {
    question: "How do you actually measure it?",
    answer:
      "Fifteen patient-intent questions, four AI engines, the same questions every month. We count how many times your practice is named. The number is comparable month to month because nothing about the method changes.",
  },
  {
    question: "How long before anything moves?",
    answer:
      "AI citations typically move faster than rankings — often within 30 to 60 days — because the underlying signals can be corrected quickly. Traditional SEO gains usually take longer. We rescan monthly, so you see movement or its absence immediately rather than waiting a quarter.",
  },
  {
    question: "Do you need access to patient data?",
    answer:
      "No. Our work uses publicly available data only — your website, your listings, your reviews and public AI outputs. We don't access patient records, intake forms, call recordings or CRM data, so no business associate agreement is required.",
  },
  {
    question: "What if my current agency says they already do this?",
    answer:
      "Ask them for your citation count. Not your rankings, not your traffic — how many times an AI engine named your practice last month, and how that compares to the month before. If they can't produce that number, they aren't measuring it.",
  },
  {
    question: "Which specialties do you work with?",
    answer:
      "Medical, dental, aesthetic, dermatology, plastic surgery, orthodontic and hair restoration practices. Each gets a separate strategy, because patients in each of them search, compare and decide differently.",
  },
  {
    question: "What does it cost?",
    answer: "Pricing is published in full on our pricing page. You do not need to book a call to see it.",
  },
];

const FAQ_ACCORDION_ITEMS: GeoFaqItem[] = FAQ_ITEMS.map((item) =>
  item.question === "What does it cost?"
    ? {
        question: item.question,
        answer: (
          <>
            Pricing is published in full on our{" "}
            <Link href="/pricing/" className="text-accent underline-offset-4 hover:underline">
              pricing page
            </Link>
            . You do not need to book a call to see it.
          </>
        ),
      }
    : { question: item.question, answer: item.answer }
);

const webPage = {
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: TITLE,
  description: DESCRIPTION,
  isPartOf: { "@id": WEBSITE["@id"] },
  about: { "@id": ORGANIZATION["@id"] },
};

const service = {
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "AI Search Visibility (GEO) for Healthcare Practices",
  serviceType: "Healthcare Marketing",
  provider: { "@id": ORGANIZATION["@id"] },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    ORGANIZATION,
    webPage,
    service,
    faqPage(FAQ_ITEMS),
    breadcrumb([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services/` },
      { name: "AI Search Visibility", url: PAGE_URL },
    ]),
  ],
};

/** Connective tissue between two sections — never a section of its own, so
 * no chip, no heading, no border. Deliberately reuses <Reveal> (opacity +
 * a barely-there rise) rather than a bespoke no-translate fade, to avoid
 * a fifth "use client" component beyond the four PART 3 names explicitly. */
function Bridge({ children }: { children: ReactNode }) {
  return (
    <div className="py-10 lg:py-14">
      <Reveal>
        <p className="mx-auto max-w-xl px-6 text-center text-white/45">{children}</p>
      </Reveal>
    </div>
  );
}

export default function AiVisibilityGeoPage() {
  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        {/* ══ SECTION 1 · HERO — centred, tall ══ */}
        <section
          id="hero"
          className={cn(
            "relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center overflow-hidden text-center",
            SECTION_PADDING.default
          )}
        >
          <AmbientGlow corner="top-right" duration={68} />
          <AmbientGlow corner="bottom-left" duration={82} />
          <Sparkles seedOffset={7} />
          <HeroCursorGlow targetId="hero" />
          <Container>
            <RevealGroup as="div" trigger="mount" stagger={0.08} className="flex flex-col items-center">
              <RevealItem>
                <Kicker>Service 01 — AI Search Visibility</Kicker>
              </RevealItem>
              <RevealItem className={STACK.kickerToHeading}>
                <h1 className="mx-auto max-w-4xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
                  When a patient asks AI for a recommendation, does it say your name?
                </h1>
              </RevealItem>
              <RevealItem className={STACK.headingToSub}>
                <p className="mx-auto max-w-[620px] text-white/70">
                  88% of health searches now return an AI-generated answer before a single blue link. The patient
                  reads that answer, chooses one of the two or three practices named inside it, and never scrolls.
                  Your ranking is irrelevant if you are not in the answer.
                </p>
              </RevealItem>
              <RevealItem className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <MagneticButton href={CTA_HREF} dataCta="hero-primary">
                  Check my practice&rsquo;s AI visibility
                </MagneticButton>
                <GhostButton href="#measurement" className="inline-flex">
                  See how we measure it
                </GhostButton>
              </RevealItem>
              <RevealItem className="mt-4">
                <p className="text-sm text-white/45">Free. All we need is your practice name.</p>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>

        {/* ══ SECTION 2 · THE THREE NUMBERS — full-width row, left-aligned ══ */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <AmbientGlow corner="top-right" duration={78} />
          <Container>
            <Reveal>
              <Kicker>The Shift</Kicker>
            </Reveal>
            <Reveal className={STACK.kickerToHeading}>
              <h2 className={cn(H2, "max-w-3xl")}>Ranking and being recommended are now two different problems</h2>
            </Reveal>

            <RevealGroup
              as="ul"
              stagger={0.08}
              className="mt-14 grid grid-cols-1 divide-y divide-white/8 border-y border-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {STATS.map((stat) => (
                <RevealItem as="li" key={stat.label} className="flex flex-col gap-3 py-8 sm:px-8 sm:py-10 first:sm:pl-0">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                  <p className="max-w-xs text-white/70">{stat.label}</p>
                  <p className="text-sm text-white/45">{stat.sub}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className={STACK.subToContent}>
              <p className="max-w-2xl text-white/70">
                Most agencies still measure only the first problem. A practice can rank in position three and be
                cited zero times, and no rank tracker will ever show it to you.
              </p>
            </Reveal>
          </Container>
        </section>

        <Bridge>So here is what that answer actually looks like.</Bridge>

        {/* ══ SECTION 3 · THE ANSWER BLOCK — centred, narrow, the peak ══ */}
        <section id="answer" className={cn("relative overflow-hidden", SECTION_PADDING.spacious)}>
          <AmbientGlow corner="top-left" duration={60} />
          <AmbientGlow corner="bottom-right" duration={72} />
          <Container size="prose" className="text-center">
            <Reveal className="flex justify-center">
              <Kicker>What A Patient Sees</Kicker>
            </Reveal>
            <Reveal className={STACK.kickerToHeading}>
              <h2 className={cn(H2, "mx-auto max-w-2xl")}>This is the moment that decides the booking</h2>
            </Reveal>
          </Container>
          <Container size="prose" className={STACK.subToContent}>
            <AnswerBlock ctaHref={CTA_HREF} />
          </Container>
        </section>

        {/* ══ SECTION 4 · WHAT IT ACTUALLY IS — asymmetric split ══ */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.spacious)}>
          <AmbientGlow corner="bottom-right" duration={90} />
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <Reveal>
                  <Kicker>The Definition</Kicker>
                </Reveal>
                <Reveal className={STACK.kickerToHeading}>
                  <h2 className={H2}>What AI search visibility means</h2>
                </Reveal>
              </div>
              <RevealGroup as="div" className="flex max-w-2xl flex-col gap-5 text-white/70 lg:col-span-8">
                <RevealItem>
                  <p>
                    AI search visibility is how often AI systems name your practice when a patient asks them for a
                    recommendation. It is counted in citations, not positions.
                  </p>
                </RevealItem>
                <RevealItem>
                  <p>
                    It overlaps with SEO but is optimised differently. AI systems weight three things far more
                    heavily than traditional rankings do: whether your practice is described identically everywhere,
                    whether a machine can parse who you are and what you treat, and whether independent sources talk
                    about you.
                  </p>
                </RevealItem>
                <RevealItem>
                  <p>
                    Generative Engine Optimisation — GEO — is the work of fixing those three. It is not SEO with a
                    new name, and it is not something your current agency is doing unless they can show you a
                    citation count.
                  </p>
                </RevealItem>
              </RevealGroup>
            </div>
          </Container>
        </section>

        <Bridge>Which raises the only question that matters — what do you actually change?</Bridge>

        {/* ══ SECTION 5 · THE FOUR LEVERS — left-aligned numbered list ══ */}
        <section className={SECTION_PADDING.default}>
          <Container>
            <Reveal>
              <Kicker>The Work</Kicker>
            </Reveal>
            <Reveal className={STACK.kickerToHeading}>
              <h2 className={cn(H2, "max-w-2xl")}>What we actually change</h2>
            </Reveal>

            <RevealGroup
              as="ul"
              stagger={0.12}
              className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}
            >
              {LEVERS.map((lever) => (
                <RevealItem key={lever.number} as="li" className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-6">
                  <span aria-hidden className="font-display text-4xl font-extrabold text-white/15 sm:col-span-2 sm:text-5xl">
                    {lever.number}
                  </span>
                  <div className="sm:col-span-10">
                    <p className="text-lg font-semibold text-white">{lever.name}</p>
                    <p className="mt-2 max-w-2xl text-white/70">{lever.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className={STACK.subToContent}>
              <div className="flex flex-col items-center gap-5 border-y border-white/8 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <p className="text-white">We run all four checks on your practice before you pay anything.</p>
                  <p className="mt-1 text-sm text-white/45">Fifteen questions, four engines, three specific fixes. Free.</p>
                </div>
                <MagneticButton href={CTA_HREF} dataCta="levers-band">
                  See where my practice stands
                </MagneticButton>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ══ SECTION 6 · MEASUREMENT — asymmetric, prose left / table right ══ */}
        <section id="measurement" className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <AmbientGlow corner="bottom-left" duration={80} />
          <Container>
            <Reveal>
              <Kicker>The Number</Kicker>
            </Reveal>
            <Reveal className={STACK.kickerToHeading}>
              <h2 className={cn(H2, "max-w-2xl")}>Fifteen questions. Four engines. Every month.</h2>
            </Reveal>

            <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10")}>
              <RevealGroup as="div" className="flex flex-col gap-5 text-white/70 lg:col-span-5">
                <RevealItem>
                  <p>
                    We ask fifteen patient-intent questions across ChatGPT, Google AI Overviews, Perplexity and
                    Gemini, and count how many times your practice is named.
                  </p>
                </RevealItem>
                <RevealItem>
                  <p>
                    The same questions run against the same engines every month, so the number is directly comparable
                    over time rather than a screenshot of one good result.
                  </p>
                </RevealItem>
                <RevealItem>
                  <p className="text-white">You get a citation count that went up or didn&rsquo;t. Not a rankings report.</p>
                </RevealItem>
              </RevealGroup>

              <div className="overflow-x-auto lg:col-span-7">
                <table className="w-full min-w-115 border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th scope="col" className="pb-3 pr-4 text-sm font-semibold text-white/50">
                        A rankings report
                      </th>
                      <th scope="col" className="pb-3 text-sm font-semibold text-white">
                        A citation report
                      </th>
                    </tr>
                  </thead>
                  <RevealGroup as="tbody" stagger={0.06}>
                    {COMPARISON_ROWS.map((row) => (
                      <RevealItem key={row[0]} as="tr" className="border-b border-white/8">
                        <td className="py-4 pr-4 text-white/55">{row[0]}</td>
                        <td className="py-4 text-white">{row[1]}</td>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </table>
              </div>
            </div>
          </Container>
        </section>

        <Bridge>Here is how that runs, week by week.</Bridge>

        {/* ══ SECTION 7 · PROCESS — horizontal desktop, vertical mobile ══ */}
        <section id="process" className={SECTION_PADDING.default}>
          <Container>
            <Reveal>
              <Kicker>How It Runs</Kicker>
            </Reveal>
            <Reveal className={STACK.kickerToHeading}>
              <h2 className={cn(H2, "max-w-2xl")}>What the first ninety days look like</h2>
            </Reveal>

            <div className={STACK.subToContent}>
              <ProcessProgressLine sectionId="process" />
              <RevealGroup as="div" stagger={0.1} className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-6">
                {PROCESS_STEPS.map((step) => (
                  <RevealItem key={step.number} className="flex flex-col gap-2">
                    <span aria-hidden className="font-display text-3xl font-extrabold text-white/20">
                      {step.number}
                    </span>
                    <p className="font-semibold text-white">{step.name}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/45">{step.when}</p>
                    <p className="mt-1 text-white/70">{step.body}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal className="mt-8">
              <Link
                href={CTA_HREF}
                data-cta="process-inline"
                className="group inline-flex items-center gap-2 font-medium text-accent underline-offset-4 hover:underline"
              >
                Step one is free and it starts today
                <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </Container>
        </section>

        {/* ══ SECTION 8 · FIT — two columns ══ */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <AmbientGlow corner="top-right" duration={74} />
          <Container>
            <Reveal>
              <Kicker>Fit</Kicker>
            </Reveal>
            <Reveal className={STACK.kickerToHeading}>
              <h2 className={cn(H2, "max-w-2xl")}>When this works, and when it doesn&rsquo;t</h2>
            </Reveal>

            <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16")}>
              <div>
                <Reveal>
                  <p className="font-semibold text-white">This works if:</p>
                </Reveal>
                <RevealGroup as="ul" className="mt-4 flex flex-col gap-3">
                  {WORKS_IF.map((item) => (
                    <RevealItem key={item} as="li" className="flex gap-3 text-white/70">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                      <span>{item}</span>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>

              <div>
                <Reveal>
                  <p className="font-semibold text-white">This is not for you if:</p>
                </Reveal>
                <RevealGroup as="ul" className="mt-4 flex flex-col gap-4">
                  {NOT_FOR_YOU.map((item) => (
                    <RevealItem key={item.title} as="li" className="flex gap-3 text-white/70">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                      <span>
                        <span className="text-white">{item.title}</span> {item.body}
                      </span>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </div>
          </Container>
        </section>

        {/* ══ SECTION 9 · FAQ — accordion ══ */}
        <section className={SECTION_PADDING.default}>
          <Container size="prose">
            <Reveal className="flex justify-center">
              <Kicker>Questions</Kicker>
            </Reveal>
            <Reveal className={cn(STACK.kickerToHeading, "text-center")}>
              <h2 className={H2}>Before you ask</h2>
            </Reveal>
            <div className={STACK.subToContent}>
              <GeoFaqAccordion items={FAQ_ACCORDION_ITEMS} />
            </div>
          </Container>
        </section>

        {/* ══ SECTION 10 · CLOSING CTA — centred ══ */}
        <section id="closing-cta" className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <AmbientGlow corner="top-right" duration={72} />
          <AmbientGlow corner="bottom-left" duration={85} />
          <Sparkles seedOffset={41} />
          <Container>
            <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <RevealItem>
                <h2 className={H2}>See what AI says about your practice</h2>
              </RevealItem>
              <RevealItem className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
                <p>
                  Fifteen questions, four AI engines, one free report. No call required, and you&rsquo;ll get three
                  specific fixes even if you never hire us.
                </p>
              </RevealItem>
              <RevealItem className="mt-10">
                <MagneticButton href={CTA_HREF} dataCta="closing">
                  Get my free report
                </MagneticButton>
              </RevealItem>
              <RevealItem className="mt-4">
                <p className="text-sm text-white/45">No credit card. No call. Nothing gated.</p>
              </RevealItem>
              <RevealItem className="mt-2">
                <p className="text-sm text-white/35">If we find nothing wrong, we&rsquo;ll tell you that.</p>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>
      </main>
      <Footer />
      <StickyMobileBar href={CTA_HREF} label="Check my AI visibility" closingSectionId="closing-cta" />
    </>
  );
}
