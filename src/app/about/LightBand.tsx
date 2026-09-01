"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { RevealGroup, RevealItem, usePrefersReducedMotion } from "@/components/Reveal";
import { EASE, REVEAL, SECTION_PADDING, STACK, GRID_GAP, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Sections 4+5 — the one light flip on this page, spanning "Who we are" and
// "How we work" as one continuous band (not two separate flips). Same
// mechanism as HomePage.tsx's WhyChooseUs/WhyChooseWhiteFade: the section's
// own background stays whatever it inherits (dark) and a separate
// absolutely-positioned white overlay + gradient wash fades in/out
// bidirectionally as the band crosses the 40% viewport threshold in either
// direction. Split into its own "use client" file so the rest of the About
// page stays a Server Component.
// ---------------------------------------------------------------------------

type WhoWeAreId = "ritik" | "hair-restoration" | "index";

const WHO_WE_ARE: Array<{ id: WhoWeAreId; title: string; role: string; body: string }> = [
  {
    id: "ritik",
    title: "Ritik Malhotra",
    role: "Founder",
    body: "8 years in SEO, now working on one problem. Every client works with me directly — there is no account manager, because there is no account team.",
  },
  {
    id: "hair-restoration",
    title: "Hair restoration first",
    role: "Our flagship specialty",
    body: "A $10.7 billion market growing 21% a year, where patients research privately for months and almost entirely through search and AI. One specialty done properly before we add a second.",
  },
  {
    id: "index",
    title: "The AI Visibility Index",
    role: "Published research",
    body: "We score real clinics on whether AI recommends them, and publish the whole table openly. Nothing we say about AI search is borrowed from someone else's blog post.",
  },
];

type HowIWorkId = "measured" | "direct" | "honest" | "unlocked";

const HOW_I_WORK: Array<{ id: HowIWorkId; heading: string; body: string }> = [
  {
    id: "measured",
    heading: "Measured",
    body: "Citations counted monthly — same fifteen questions, same four engines, so this month is directly comparable to last.",
  },
  {
    id: "direct",
    heading: "Direct",
    body: "No account managers, no ticket queue, no team you never meet.",
  },
  {
    id: "honest",
    heading: "Honest",
    body: "If a month doesn't move the number, we say so plainly. Flat months get published too.",
  },
  {
    id: "unlocked",
    heading: "Unlocked",
    body: "Month to month. If the citation count stops moving, you leave — no penalty, no notice period.",
  },
];

/** Radiating pulse — concentric rings emanating outward, matching the
 * "signal" motif already used for services elsewhere on the site. */
function HairRestorationGraphic() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full text-[#08080a]/12" fill="none">
      <circle cx="80" cy="50" r="14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="50" r="28" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="50" r="6" fill="rgb(var(--accent-rgb))" />
    </svg>
  );
}

/** Ascending bars — the same "research/data" motif as WhyChooseIcon's own
 * research mark, scaled up to fill a card top. */
function IndexGraphic() {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full text-[#08080a]/12" fill="none">
      <rect x="46" y="62" width="12" height="24" rx="2" fill="currentColor" />
      <rect x="74" y="42" width="12" height="44" rx="2" fill="currentColor" />
      <rect x="102" y="18" width="12" height="68" rx="2" fill="rgb(var(--accent-rgb))" />
    </svg>
  );
}

/** Simple line-art only, matching WhyChooseIcon's primitive-only style — no
 * circular badge wrapper. Always dark-on-light here. */
function HowIWorkIcon({ id, delay = 0 }: { id: HowIWorkId; delay?: number }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 28 28"
      fill="none"
      className="icon-pulse text-[#08080a]/70"
      style={{ animationDelay: `${delay}s` }}
    >
      {id === "measured" && (
        <>
          <rect x="5" y="14" width="4" height="8" rx="1.5" fill="currentColor" />
          <rect x="12" y="8" width="4" height="14" rx="1.5" fill="currentColor" />
          <rect x="19" y="4" width="4" height="18" rx="1.5" fill="rgb(var(--accent-rgb))" />
        </>
      )}
      {id === "direct" && (
        <>
          <circle cx="14" cy="9" r="5" stroke="currentColor" strokeWidth="1.75" />
          <path d="M4 24c0-5.5 4.5-9 10-9s10 3.5 10 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
      {id === "honest" && (
        <>
          <rect x="6" y="4" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M10 10h8M10 14h8M10 18h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
      {id === "unlocked" && (
        <>
          <rect x="6" y="13" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9 13V9a5 5 0 0 1 9-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function WhoWeAreCard({ item }: { item: (typeof WHO_WE_ARE)[number] }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#08080a]/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#08080a]/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-[#08080a]/5">
        {item.id === "ritik" ? (
          <Image
            src="/images/ritik-malhotra.webp"
            alt="Ritik Malhotra, founder of Boost Web Digital"
            fill
            sizes="(min-width: 1024px) 33vw, 90vw"
            className="object-cover grayscale contrast-125 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
            {item.id === "hair-restoration" ? <HairRestorationGraphic /> : <IndexGraphic />}
          </div>
        )}
      </div>
      <div className="bg-[#08080a]/[0.03] px-6 py-4">
        <h3 className="font-display text-lg font-semibold text-[#08080a]">{item.title}</h3>
        <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.14em] text-[#08080a]/50">{item.role}</p>
      </div>
      <div className="flex-1 bg-[#08080a]/[0.06] px-6 py-5">
        <p className="text-sm leading-relaxed text-[#08080a]/70">{item.body}</p>
      </div>
    </div>
  );
}

export function LightBand() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      {/* Purely decorative background wash — aria-hidden, carries no
          content, so it stays framer-motion-driven (RULE 5: no need to
          spend effort making decoration crawler-safe). The actual content
          wrapper below is the one that matters and is CSS-driven now. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-10% 0px" }}
        transition={{ duration: reducedMotion ? 0.4 : 1.4, ease: EASE.primary }}
      >
        <div className="absolute inset-0 bg-[#f2f2f5]" />
        <div
          className="absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(var(--accent-rgb),0.22), rgba(var(--accent-rgb),0.05) 55%, transparent 80%)",
          }}
        />
      </motion.div>

      {/* Real content (headings, cards, copy) — previously framer-motion
          `whileInView` with no fallback if the observer never fires (a
          renderer that doesn't scroll never sees it). `.scroll-fade-inout`
          (globals.css) drives the same fade-in/hold/fade-out natively via
          `animation-timeline: view()`, defaulting to opacity:1 outside
          `@supports` — never hidden regardless of JS/scroll support. */}
      <div className="scroll-fade-inout relative text-[#08080a]">
        <Container>
          <RevealGroup as="div" className="flex flex-col items-center text-center">
            <RevealItem>
              <span className="inline-flex items-center rounded-full border border-[#08080a]/15 bg-[#08080a]/5 px-4 py-1.5">
                <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#08080a]/85">
                  Who we are
                </span>
              </span>
            </RevealItem>
            <RevealItem className={STACK.kickerToHeading}>
              <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-[#08080a] sm:text-[2.5rem]">
                Small on purpose
              </h2>
            </RevealItem>
          </RevealGroup>

          <RevealGroup
            as="ul"
            trigger="viewport"
            stagger={REVEAL.cardStagger}
            className={cn(STACK.subToContent, "grid grid-cols-1", GRID_GAP.default, "sm:grid-cols-2 lg:grid-cols-3")}
          >
            {WHO_WE_ARE.map((item) => (
              <RevealItem as="li" key={item.id} className="h-full">
                <WhoWeAreCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>

        <Container className="mt-28 lg:mt-36">
          <RevealGroup as="div" className="flex flex-col items-center text-center">
            <RevealItem>
              <span className="inline-flex items-center rounded-full border border-[#08080a]/15 bg-[#08080a]/5 px-4 py-1.5">
                <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#08080a]/85">
                  How we work
                </span>
              </span>
            </RevealItem>
            <RevealItem className={STACK.kickerToHeading}>
              <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-[#08080a] sm:text-[2.5rem]">
                Four commitments
              </h2>
            </RevealItem>
          </RevealGroup>

          <RevealGroup
            as="ul"
            trigger="viewport"
            stagger={REVEAL.cardStagger}
            className={cn(STACK.subToContent, "grid grid-cols-1", GRID_GAP.default, "sm:grid-cols-2 lg:grid-cols-4")}
          >
            {HOW_I_WORK.map((item, i) => (
              <RevealItem as="li" key={item.id}>
                <div className={cn("flex min-h-55 flex-col rounded-2xl border border-[#08080a]/12 bg-[#08080a]/4 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#08080a]/25 hover:bg-[#08080a]/6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]", CARD_PADDING.standard)}>
                  <HowIWorkIcon id={item.id} delay={i * 0.3} />
                  <h3 className="mt-5 font-display text-lg font-semibold text-[#08080a]">{item.heading}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#08080a]/70">{item.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </div>
    </section>
  );
}
