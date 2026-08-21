import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// LegalLayout — shared shell for the five legal/policy pages (Terms,
// Privacy, Refund & Cancellation, Disclaimer, Cookie Policy). Deliberately
// lighter than every other page's hero (no Sparkles, no rotating .orbit-ring
// — a single static gradient wash) since a legal document isn't a landing
// moment; the body is a narrow ~744px reading column (between the
// --container-prose and --container-heading tokens — neither matches this
// page type exactly, so a local max-width is used here rather than adding a
// third global Container size for one page family) with a page-top table of
// contents built from the same `sections` array that renders the body —
// single source of truth, same pattern as FAQ_ITEMS on /faq/.
//
// `.legal-print-doc` (globals.css) inverts to a plain black-on-white
// document under `@media print`; chrome (Navbar/Footer/hero glow/ToC) is
// dropped via Tailwind's `print:hidden` instead of new global CSS.
// ---------------------------------------------------------------------------

export type LegalSection = {
  id: string;
  heading: string;
  content: ReactNode;
};

/** Fixed string, not a runtime date — hand-update this the day any of the
 * five legal pages' content actually changes (same discipline as
 * sitemap.ts's LAST_UPDATED). Single source shared by all five pages. */
export const LEGAL_LAST_UPDATED = "August 21, 2026";

/** Visually flags a genuinely unresolved fact so it can't be mistaken for
 * real copy pre-launch — matches this task's [FILL: ...] convention. */
export function Fill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.8em] text-accent">
      [FILL: {children}]
    </span>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-white/70">{children}</p>;
}

export function LegalH3({ children }: { children: ReactNode }) {
  return <h3 className="mt-2 font-display text-base font-semibold text-white sm:text-[1.05rem]">{children}</h3>;
}

export function LegalOL({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-white/70 marker:text-white/35">
      {children}
    </ol>
  );
}

export function LegalUL({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-white/70 marker:text-white/35">
      {children}
    </ul>
  );
}

function LegalHero({
  kicker,
  title,
  subtitle,
  lastUpdated,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
}) {
  return (
    <section className="relative overflow-hidden pt-40 pb-16 text-center lg:pt-48 lg:pb-20">
      <div
        aria-hidden
        className="print:hidden pointer-events-none absolute left-1/2 top-0 h-140 w-140 -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.16), transparent 70%)" }}
      />
      <Container size="heading" className="relative z-10 mx-auto flex flex-col items-center">
        <RevealGroup as="div" trigger="mount" stagger={0.08}>
          <RevealItem>
            <Kicker>{kicker}</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h1 className="mx-auto max-w-2xl font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl">
              {title}
            </h1>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="mx-auto max-w-lg text-white/65">{subtitle}</p>
          </RevealItem>
          <RevealItem className="mt-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/35">Last updated: {lastUpdated}</p>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}

function LegalToc({ sections }: { sections: LegalSection[] }) {
  return (
    <nav aria-label="Table of contents" className="print:hidden mb-12 rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:p-7">
      <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/40">On this page</span>
      <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="group flex gap-2.5 text-sm text-white/65 transition-colors hover:text-white">
              <span className="font-mono text-white/30">{String(index + 1).padStart(2, "0")}</span>
              <span className="transition-colors group-hover:text-accent">{section.heading}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function LegalSectionBlock({ id, heading, index, children }: { id: string; heading: string; index: number; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/8 pt-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-white sm:text-[1.75rem]">
        <span className="mr-3 font-mono text-base font-normal text-white/30">{String(index + 1).padStart(2, "0")}</span>
        {heading}
      </h2>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function LegalLayout({
  kicker,
  title,
  subtitle,
  lastUpdated,
  intro,
  sections,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="legal-print-doc">
      <div className="print:hidden">
        <Navbar />
      </div>
      <main>
        <LegalHero kicker={kicker} title={title} subtitle={subtitle} lastUpdated={lastUpdated} />

        <section className={cn("relative", SECTION_PADDING.default)}>
          <Container size="heading">
            <div className="mx-auto max-w-[46.5rem]">
              {intro && <div className="mb-12 flex flex-col gap-4">{intro}</div>}
              <LegalToc sections={sections} />
              <div className="flex flex-col gap-10">
                {sections.map((section, index) => (
                  <LegalSectionBlock key={section.id} id={section.id} heading={section.heading} index={index}>
                    {section.content}
                  </LegalSectionBlock>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
