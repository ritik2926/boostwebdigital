"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem, usePrefersReducedMotion } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { AmbientGlow } from "@/components/AmbientGlow";
import { cn } from "@/lib/utils";
import { EASE, SPRING, SECTION_PADDING, STACK } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// About / Founder — "The Founder." The site's second exception to "no
// photography anywhere" (Who We Serve's video is the first) — but unlike a
// stock clip, this is a real photo of the real person Ritik, so it's the
// most direct trust signal on the page, not a clichéd placeholder. Treated
// (grayscale + accent-tinted overlay, blend-mode over the desaturated
// photo, soft gradient fade to the section's own background) so a
// studio-lit photo integrates into the dark palette instead of sitting on
// it like a pasted-in headshot. A thin accent corner-frame draws in on
// reveal (the same pathLength "arrival" grammar as ProcessIcon and Market
// Shift's gauges) and the photo drifts a few px on scroll — restrained
// parallax, not a gimmick. Text side mirrors AI Visibility Explainer's
// shape (kicker+H2+copy in one column beside a single visual column) but
// mirrored left/right for rhythm, and the crux line — "does it say your
// name?" — gets its own oversized, bold breakout so scale carries the
// boldness rather than added motion. The 88% stat matches Market Shift's
// own locked figure exactly — the founder's origin story and the site's
// proof point are the same fact, not two claims to reconcile.
// ---------------------------------------------------------------------------

const FOUNDER_YEARS_IN_SEO = "8";

function FounderPhoto() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start end", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const y = useSpring(rawY, SPRING.presenceFade);

  return (
    <Reveal className="relative mx-auto aspect-4/5 w-full max-w-110">
      <div ref={trackRef} className="absolute inset-0">
        <motion.div style={{ y: reducedMotion ? 0 : y }} className="relative h-full w-full">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/ritik-malhotra.webp"
              alt="Ritik Malhotra, founder of Boost Web Digital"
              fill
              sizes="(min-width: 1024px) 440px, 90vw"
              className="object-cover grayscale contrast-125 brightness-90"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#08080a] via-[#08080a]/10 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-overlay"
              style={{ background: "radial-gradient(circle at 50% 32%, transparent 45%, rgba(var(--accent-rgb),0.22) 100%)" }}
            />
          </div>
          <svg viewBox="0 0 80 100" preserveAspectRatio="none" className="pointer-events-none absolute -inset-3" aria-hidden>
            <motion.path
              d="M1 19 V1 H19"
              stroke="rgb(var(--accent-rgb))"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE.primary, delay: reducedMotion ? 0 : 0.4 }}
            />
            <motion.path
              d="M79 81 V99 H61"
              stroke="rgb(var(--accent-rgb))"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE.primary, delay: reducedMotion ? 0 : 0.6 }}
            />
          </svg>
        </motion.div>
      </div>
    </Reveal>
  );
}

export function Founder() {
  return (
    <section id="about" className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="bottom-left" duration={74} />
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,440px)_minmax(0,600px)] lg:items-center lg:justify-center lg:gap-20">
          <FounderPhoto />

          <RevealGroup as="div">
            <RevealItem>
              <Kicker>The Founder</Kicker>
            </RevealItem>
            <RevealItem className={STACK.kickerToHeading}>
              <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
                Ritik Malhotra
              </h2>
              <span className="mt-3 block font-mono text-xs uppercase tracking-[0.16em] text-white/40">
                Founder · {FOUNDER_YEARS_IN_SEO}+ Years in SEO
              </span>
            </RevealItem>

            <RevealItem className="mt-8 max-w-xl">
              <p className="text-white/70">
                I&apos;m Ritik Malhotra. I&apos;ve spent {FOUNDER_YEARS_IN_SEO}+ years in SEO.
              </p>
            </RevealItem>
            <RevealItem className="mt-5 max-w-xl">
              <p className="text-white/70">
                In 2026 I watched{" "}
                <span className="font-semibold text-white">88% of health searches start showing an AI answer</span>{" "}
                above the results, and realised the ranking reports our entire industry sells had stopped describing
                reality. A practice could hold position one and still never be mentioned to the patient.
              </p>
            </RevealItem>
            <RevealItem className="mt-5 max-w-xl">
              <p className="text-white/70">So I rebuilt what an agency does around a different question:</p>
            </RevealItem>

            <RevealItem className="mt-6 max-w-2xl">
              <p className="text-balance font-display text-3xl font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl lg:text-[2.75rem]">
                When a patient asks an AI for a recommendation, does it say your name?
              </p>
            </RevealItem>

            <RevealItem className="mt-8 max-w-xl">
              <p className="text-white/70">
                I work with a small number of practices directly.{" "}
                <span className="font-semibold text-white">
                  You&apos;ll never be handed to an account manager, because there isn&apos;t one.
                </span>
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
