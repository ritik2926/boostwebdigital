import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { MagneticButton } from "@/components/Buttons";
import { AmbientGlow } from "@/components/AmbientGlow";
import { StatementFade } from "./StatementFade";
import { LightBand } from "./LightBand";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, PERSON, WEBSITE, breadcrumb } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { REVEAL, SECTION_PADDING, STACK, GRID_GAP, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// About — rebuilt against docs/refs/eterna-about.webp's composition/density
// (centred rhythm, card-heavy sections, dark→light→dark colour blocking),
// not its literal colours. Every override below is explicit and scoped to
// this page only — see the note in docs/12-DESIGN-STANDARDS.md §1:
//   - the light flip on "Who we are"/"How we work" (LightBand.tsx)
//   - gradient text on the hero kicker and Section 6's H2 second line
//   - the "What you get" card's structure (icon/heading/body/corner arrow),
//     explicitly requested even though it echoes a pattern this site
//     otherwise avoids — kept honest: the arrow is decorative, not a fake
//     functional control
// Material rules NOT overridden: no glass/blur, no invented team members,
// no fabricated stats beyond the three given, no stock photography.
// ---------------------------------------------------------------------------

const SITE_URL = "https://boostwebdigital.com";
const ABOUT_URL = `${SITE_URL}/about/`;

const TITLE = "About Boost Web Digital | Ritik Malhotra, Founder";
const DESCRIPTION =
  "Ritik Malhotra founded Boost Web Digital because ranking stopped meaning found — a healthcare-only agency built for the AI-answer era.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about/",
    type: "profile",
  },
};

const aboutPage = {
  "@type": "AboutPage",
  "@id": `${ABOUT_URL}#webpage`,
  url: ABOUT_URL,
  name: TITLE,
  description: DESCRIPTION,
  isPartOf: { "@id": WEBSITE["@id"] },
  about: { "@id": ORGANIZATION["@id"] },
  mainEntity: { "@id": PERSON["@id"] },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    aboutPage,
    breadcrumb([
      { name: "Home", url: SITE_URL },
      { name: "About", url: ABOUT_URL },
    ]),
  ],
};

type StatId = "ai-overview" | "ai-tools" | "reviews";

// Word-for-word copy of value/headline/body from MARKET_STATS in
// HomePage.tsx — not imported, so that file stays untouched.
const WHAT_CHANGED: Array<{ id: StatId; value: string; heading: string; body: string }> = [
  {
    id: "ai-overview",
    value: "88%",
    heading: "of health searches open with an AI answer",
    body: "The highest of any industry, up from 72% a year earlier. On most health queries the blue links now sit below the answer, and below the fold.",
  },
  {
    id: "ai-tools",
    value: "36%",
    heading: "of patients use AI to find a provider",
    body: "Ahead of Google search at 34% and physician referrals at 32%. Twelve months earlier that number was 17%. It doubled.",
  },
  {
    id: "reviews",
    value: "75%",
    heading: "won't book a provider rated under 4.0",
    body: "55% have abandoned a provider over reviews, up fifteen points in a year. Reputation stopped being vanity and became a booking gate.",
  },
];

/** Concentric arcs — layered quarter-rings, matching the reference's
 * abstract card-top graphic without copying its literal starfield. */
function ConcentricArcsGraphic() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full text-white/10" fill="none">
      <circle cx="80" cy="130" r="40" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="130" r="65" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="130" r="90" stroke="rgb(var(--accent-rgb))" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

/** Radiating lines — a sunburst of rays from an off-canvas point. */
function RadiatingLinesGraphic() {
  const lines = Array.from({ length: 9 }, (_, i) => {
    const angle = (i / 8) * 70 - 35;
    const rad = (angle * Math.PI) / 180;
    const x2 = 20 + Math.sin(rad) * 150;
    const y2 = 20 + Math.cos(rad) * 150;
    return { x2, y2, accent: i === 4 };
  });
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" fill="none">
      {lines.map((l, i) => (
        <line
          key={i}
          x1="20"
          y1="20"
          x2={l.x2}
          y2={l.y2}
          stroke={l.accent ? "rgb(var(--accent-rgb))" : "currentColor"}
          strokeOpacity={l.accent ? 0.5 : 0.1}
          strokeWidth="1.5"
          className="text-white"
        />
      ))}
    </svg>
  );
}

/** Scatter field — a loose, deterministic dot field (seeded, not
 * Math.random(), so server/client markup matches). */
function ScatterFieldGraphic() {
  const dots = Array.from({ length: 22 }, (_, i) => {
    const seed = i * 7.31;
    const x = ((Math.sin(seed) * 10000) % 1 + 1) % 1;
    const y = ((Math.sin(seed * 1.7) * 10000) % 1 + 1) % 1;
    return { cx: 8 + x * 144, cy: 8 + y * 84, accent: i % 7 === 0 };
  });
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" fill="none">
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.accent ? 2.2 : 1.4}
          fill={d.accent ? "rgb(var(--accent-rgb))" : "currentColor"}
          className="text-white/15"
        />
      ))}
    </svg>
  );
}

const WHAT_CHANGED_GRAPHICS: Record<StatId, () => React.JSX.Element> = {
  "ai-overview": ConcentricArcsGraphic,
  "ai-tools": RadiatingLinesGraphic,
  reviews: ScatterFieldGraphic,
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        {/* 1. Hero — centred, full viewport, a rotating gradient ring as the
            page's focal point. Pure CSS animation (reuses the sitewide
            .orbit-ring keyframe/reduced-motion handling) — no client
            component needed for it. */}
        <section className="relative flex min-h-[calc(100vh-20rem)] flex-col items-center justify-center overflow-hidden text-center sm:min-h-[calc(100vh-8rem)]">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-95 w-95 -translate-x-1/2 -translate-y-1/2 sm:h-125 sm:w-125 lg:h-155 lg:w-155"
          >
            {/* ambient glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.4), transparent 70%)" }}
            />
            {/* the disc itself — subtle volumetric fill, not a flat void */}
            <div
              className="absolute inset-6 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.05), rgba(var(--accent-rgb),0.04) 45%, transparent 75%)",
              }}
            />
            {/* rotating crescent-lit rim — a moon's lit edge, not a hairline ring */}
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
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
                  <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85">
                    About Boost Web Digital
                  </span>
                </span>
              </RevealItem>
              <RevealItem className="mt-7">
                <h1 className="mx-auto max-w-3xl font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.5rem]">
                  We exist because ranking
                  <br />
                  stopped meaning found
                </h1>
              </RevealItem>
              <RevealItem className="mx-auto mt-7 max-w-xl">
                <p className="text-white/70">
                  A healthcare-only marketing agency built for the moment patients stopped scrolling to the blue
                  links and started asking an AI instead.
                </p>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>

        {/* 2. What changed — centred badge/heading, 3 tall cards, middle
            raised slightly */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
          <Container>
            <RevealGroup as="div" className="flex flex-col items-center text-center">
              <RevealItem>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
                  <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85">
                    What changed
                  </span>
                </span>
              </RevealItem>
              <RevealItem className={STACK.kickerToHeading}>
                <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
                  One shift, three numbers
                </h2>
              </RevealItem>
            </RevealGroup>

            <RevealGroup
              as="ul"
              trigger="viewport"
              stagger={REVEAL.cardStagger}
              className={cn(STACK.subToContent, "grid grid-cols-1", GRID_GAP.default, "lg:grid-cols-3")}
            >
              {WHAT_CHANGED.map((stat, i) => {
                const Graphic = WHAT_CHANGED_GRAPHICS[stat.id];
                return (
                  <RevealItem as="li" key={stat.id} className={cn(i === 1 && "lg:-mt-6 lg:mb-6")}>
                    <div
                      className={cn(
                        "group flex min-h-95 flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/4 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
                        CARD_RADIUS.standard,
                        i === 1 ? "border-white/15 bg-white/3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]" : "border-white/8 bg-white/2"
                      )}
                    >
                      <div className="h-38 shrink-0 border-b border-white/8 transition-transform duration-300 group-hover:scale-105">
                        <Graphic />
                      </div>
                      <div className={cn("flex flex-1 flex-col", CARD_PADDING.standard)}>
                        <div className="font-display text-4xl font-extrabold tracking-[-0.02em] text-accent tabular-nums">
                          {stat.value}
                        </div>
                        <h3 className="mt-3 font-display text-lg font-semibold text-white">{stat.heading}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{stat.body}</p>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </Container>
        </section>

        {/* 3. The statement — full-bleed, centred, scroll-linked fade */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
          <Container size="heading" className="mx-auto text-center">
            <StatementFade>
              A practice can hold position one on Google and never once be mentioned when a patient actually asks
              for a recommendation. Closing that gap is the entire reason this agency exists.
            </StatementFade>
          </Container>
        </section>

        {/* 4+5. Who we are / How we work — the one light flip, one
            continuous band. See src/app/about/LightBand.tsx. */}
        <LightBand />

        {/* 6. Work with us — flips back to dark */}
        <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
          <AmbientGlow corner="top-right" duration={70} />
          <AmbientGlow corner="bottom-left" duration={85} />
          <Container>
            <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <RevealItem>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
                  <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85">
                    Work with us
                  </span>
                </span>
              </RevealItem>
              <RevealItem className={STACK.kickerToHeading}>
                <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] sm:text-[2.5rem]">
                  <span className="text-white">Find out what AI says</span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(90deg, #8b9bff, rgb(var(--accent-rgb)))" }}
                  >
                    about your practice
                  </span>
                </h2>
              </RevealItem>
              <RevealItem className={STACK.headingToSub}>
                <p className="text-white/70">
                  We run fifteen patient questions across four AI engines, count how many times your practice gets
                  named, and send you the report. No call required.
                </p>
              </RevealItem>
            </RevealGroup>

            <RevealItem className={cn("mx-auto max-w-2xl", STACK.subToContent)}>
              <div className={cn("group relative border border-white/8 bg-white/3 transition-all duration-300 hover:border-white/20 hover:bg-white/5", CARD_RADIUS.feature, CARD_PADDING.feature)}>
                <div
                  aria-hidden
                  className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:text-accent"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M4 10L10 4M10 4H5M10 4V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex gap-5 pr-10">
                  <svg width="36" height="36" viewBox="0 0 28 28" fill="none" className="shrink-0 text-accent">
                    <rect x="6" y="4" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M10 10h8M10 14h8M10 18h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">What you get</h3>
                    <p className="mt-3 text-white/70">
                      Your citation count across ChatGPT, Perplexity, Google AI Overviews and Gemini. The
                      competitors being recommended instead of you. The three specific reasons why. You keep the
                      report whether or not you ever hire us.
                    </p>
                  </div>
                </div>
              </div>
            </RevealItem>

            <RevealItem className={cn("flex justify-center", STACK.contentToCta)}>
              <MagneticButton>Get My Free AI Visibility Report</MagneticButton>
            </RevealItem>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
