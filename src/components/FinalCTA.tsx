import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { MagneticButton } from "@/components/Buttons";
import { AmbientGlow } from "@/components/AmbientGlow";

/**
 * The site's one "Work with us" CTA band — extracted verbatim from
 * src/app/about/page.tsx's Section 6 so every page that wants this exact
 * band (About, /blogs/, now /pricing/) shares one implementation instead
 * of drifting copies. About's own inline section was left as-is rather than
 * refactored to import this, per minimal-diff scope discipline.
 *
 * Every prop is optional with a default matching the original hardcoded
 * copy exactly, so existing call sites (About, Blogs) render byte-for-byte
 * identical to before — only a call site that explicitly wants different
 * copy (e.g. /pricing/'s "Not sure which plan?" framing) passes anything.
 */
export function FinalCTA({
  kicker = "Work with us",
  body = "We run fifteen patient questions across four AI engines, count how many times your practice gets named, and send you the report. No call required.",
  cardHeading = "What you get",
  cardBody = "Your citation count across ChatGPT, Perplexity, Google AI Overviews and Gemini. The competitors being recommended instead of you. The three specific reasons why. You keep the report whether or not you ever hire us.",
  ctaLabel = "Get My Free AI Visibility Report",
}: {
  kicker?: string;
  body?: ReactNode;
  cardHeading?: string;
  cardBody?: ReactNode;
  ctaLabel?: string;
} = {}) {
  return (
    <section className="relative overflow-hidden py-32 lg:py-40">
      <AmbientGlow corner="top-right" duration={70} />
      <AmbientGlow corner="bottom-left" duration={85} />
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
              <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85">
                {kicker}
              </span>
            </span>
          </RevealItem>
          <RevealItem className="mt-6">
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
          <RevealItem className="mt-6">
            <p className="text-white/70">{body}</p>
          </RevealItem>
        </RevealGroup>

        <RevealItem className="mx-auto mt-12 max-w-2xl">
          <div className="group relative rounded-2xl border border-white/8 bg-white/3 p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/5 sm:p-10">
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
                <h3 className="font-display text-xl font-semibold text-white">{cardHeading}</h3>
                <p className="mt-3 text-white/70">{cardBody}</p>
              </div>
            </div>
          </div>
        </RevealItem>

        <RevealItem className="mt-10 flex justify-center">
          <MagneticButton>{ctaLabel}</MagneticButton>
        </RevealItem>
      </Container>
    </section>
  );
}
