"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem, usePrefersReducedMotion } from "@/components/Reveal";
import { GhostButton } from "@/components/Buttons";
import { cn, seeded } from "@/lib/utils";
import { EASE } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// Footer — "Premium Footer." Adapted from two pasted external references
// (a TextHoverEffect cursor-reveal wordmark, a FloatingPaths ambient
// background) rebuilt against this site's own system rather than either
// original: no rainbow gradient (accent+white only), no light/dark
// variants (permanent dark theme), no Helvetica (font-display/Switzer), and
// Math.random() replaced with the already-established seeded() helper —
// generative SVG paths computed with real randomness differ between server
// and client and break hydration.
//
// Deliberate exception to the locked footer spec: docs/12-DESIGN-STANDARDS.md
// §8 and the Scene 09 footer concept in 00-experience-blueprint.html both
// call for "zero ambient motion... the one scene genuinely allowed to be
// still." Ritik's explicit request here ("footer animation... make it more
// elegant and smooth") overrides that for this section — noted here and in
// both docs rather than silently dropped, per CLAUDE.md's decision
// hierarchy. The motion itself still stays inside every other §4 Lighting
// constraint (accent-hue-only, low-opacity, slow) — only the "none at all"
// rule for this one section changed.
//
// Content (CTA line, four-column nav, copyright bar) is the real footer
// that existed before the full-site reset (recovered from git history at
// src/components/Footer.tsx), rebuilt in the current design system with
// current URL-architecture-locked links — the newsletter-signup column
// (no real backend to submit to) and the two never-wired "#" social links
// were dropped rather than carried forward as fake functional UI; a real
// specialty-links column replaced them, serving the same "sitewide internal
// linking" SEO objective Scene 09 already calls for.
// ---------------------------------------------------------------------------

const FOOTER_NAV = {
  // Root-relative hrefs, not bare hashes — same cross-page anchor fix as
  // Navbar.tsx's NAV_LINKS, since this footer renders on every route too.
  company: [
    { label: "Blog", href: "/blogs/" },
    { label: "About", href: "/about/" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/pricing/" },
  ],
};

/** Deterministic — seeded(), not Math.random(); see the section comment
 * above. 32 gentle horizontal waves spread down the footer, each its own
 * seeded vertical position/amplitude/duration so they don't look tiled.
 * A subset also carries a traveling light pulse (stroke-dash segment
 * animated along the path) so the field reads as fiber-optic strands
 * rather than a flat wave pattern. */
const PATH_COUNT = 32;
const PULSE_INDICES = new Set([2, 6, 10, 13, 17, 21, 25, 29]);

const FOOTER_PATHS = Array.from({ length: PATH_COUNT }, (_, i) => {
  const seed = i * 3.7;
  const baseY = 10 + (i * 480) / (PATH_COUNT - 1);
  const amplitude = Math.round((18 + seeded(seed + 0.1) * 26) * 100) / 100;
  const phase = Math.round(seeded(seed + 0.2) * Math.PI * 200) / 100;
  const y1 = Math.round((baseY + Math.sin(phase) * amplitude) * 100) / 100;
  const y2 = Math.round((baseY + Math.sin(phase + Math.PI) * amplitude) * 100) / 100;
  const hasPulse = PULSE_INDICES.has(i);
  return {
    id: i,
    d: `M-100 ${baseY} C 300 ${y1}, 600 ${y2}, 900 ${baseY} C 1200 ${y1}, 1500 ${y2}, 1900 ${baseY}`,
    duration: Math.round((26 + seeded(seed + 0.3) * 18) * 100) / 100,
    delay: Math.round(seeded(seed + 0.4) * 4 * 100) / 100,
    peakOpacity: Math.round((0.03 + seeded(seed + 0.5) * 0.05) * 1000) / 1000,
    hasPulse,
    pulseDuration: Math.round((12 + seeded(seed + 0.6) * 12) * 100) / 100,
    pulseDelay: -Math.round(seeded(seed + 0.7) * 2400) / 100,
  };
});

function FooterPaths() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <svg viewBox="0 0 900 500" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="footerPathGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--accent-rgb))" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(var(--accent-rgb))" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(var(--accent-rgb))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {FOOTER_PATHS.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="url(#footerPathGradient)"
            strokeWidth={1}
            fill="none"
            initial={{ pathLength: reducedMotion ? 1 : 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: reducedMotion ? path.peakOpacity : [0, path.peakOpacity, path.peakOpacity * 1.5, path.peakOpacity],
            }}
            transition={{
              pathLength: { duration: reducedMotion ? 0 : 2.5, delay: path.delay, ease: EASE.primary },
              opacity: reducedMotion
                ? { duration: 0 }
                : { duration: path.duration, delay: path.delay, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}

        {!reducedMotion &&
          FOOTER_PATHS.filter((path) => path.hasPulse).map((path) => (
            <motion.path
              key={`pulse-${path.id}`}
              d={path.d}
              stroke="rgb(var(--accent-rgb))"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray="50 3000"
              fill="none"
              opacity={0.55}
              animate={{ strokeDashoffset: [0, -3000] }}
              transition={{ duration: path.pulseDuration, delay: path.pulseDelay, repeat: Infinity, ease: "linear" }}
            />
          ))}
      </svg>
    </div>
  );
}

/** Adapted from a pasted TextHoverEffect reference. Same mechanism (a
 * cursor-position-driven radialGradient mask revealing a solid fill over an
 * outline), restyled to the site's own palette: accent+white reveal
 * instead of a five-color rainbow, font-display instead of Helvetica, and
 * an accent stroke-draw instead of a fixed unrelated blue hex. This is the
 * same cursor-as-flashlight language already established by CursorGlow/
 * useSpotlight elsewhere, applied to a wordmark instead of ambient light. */
function BoostWordmark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setMaskPosition({
      cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    });
  }

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label="Boost Web Digital"
      width="100%"
      height="100%"
      viewBox="0 0 500 160"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none uppercase"
    >
      <defs>
        <radialGradient id="footerWordmarkGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="rgb(var(--accent-rgb))" />
        </radialGradient>
        <motion.radialGradient
          id="footerWordmarkReveal"
          gradientUnits="userSpaceOnUse"
          r="28%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="footerWordmarkMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#footerWordmarkReveal)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        className="fill-transparent stroke-white/10 font-display text-8xl font-bold sm:text-9xl"
      >
        Boost
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.6"
        stroke="rgb(var(--accent-rgb))"
        className="fill-transparent font-display text-8xl font-bold sm:text-9xl"
        initial={{ pathLength: reducedMotion ? 1 : 0, opacity: reducedMotion ? 0.7 : 0 }}
        whileInView={{ pathLength: 1, opacity: 0.7 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: reducedMotion ? 0 : 2.4, ease: EASE.primary }}
      />
      {!reducedMotion && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="url(#footerWordmarkGradient)"
          stroke="url(#footerWordmarkGradient)"
          strokeWidth="0.6"
          mask="url(#footerWordmarkMask)"
          className="font-display text-8xl font-bold sm:text-9xl"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }}
        >
          Boost
        </text>
      )}
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8">
      <FooterPaths />
      <Container className="relative">
        <RevealGroup as="div" className={cn("flex flex-col gap-8 py-16 sm:flex-row sm:items-end sm:justify-between")}>
          <RevealItem>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Let&apos;s Grow Your Practice.
            </h2>
          </RevealItem>
          <RevealItem>
            <GhostButton href="mailto:hello@boostwebdigital.com" className="inline-flex">
              Start a Conversation
            </GhostButton>
          </RevealItem>
        </RevealGroup>

        <RevealGroup as="div" className="grid gap-10 border-t border-white/8 py-14 sm:grid-cols-2 md:grid-cols-3">
          <RevealItem>
            <span className="font-display text-lg font-semibold text-white">Boost Web Digital</span>
            <p className="mt-3 max-w-xs text-sm text-white/50">
              A healthcare-only marketing agency for hair restoration, dental, med spa, dermatology, plastic surgery
              and orthodontic practices.
            </p>
          </RevealItem>

          <RevealItem>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">Company</span>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_NAV.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">Contact</span>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/contact/" className="text-sm text-white/70 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:hello@boostwebdigital.com" className="text-sm text-white/70 transition-colors hover:text-white">
                  hello@boostwebdigital.com
                </a>
              </li>
              <li>
                <Link href="/contact/" className="text-sm text-white/70 transition-colors hover:text-white">
                  Book a Call
                </Link>
              </li>
            </ul>
          </RevealItem>
        </RevealGroup>

        <Reveal className="border-t border-white/8 py-10">
          <div className="h-36 w-full sm:h-44 md:h-52">
            <BoostWordmark />
          </div>
        </Reveal>

        <div className="flex flex-col gap-4 border-t border-white/8 py-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Boost Web Digital. All rights reserved.</span>
          {/* TODO: add /privacy-policy/ and /terms/ links back once those pages exist */}
        </div>
      </Container>
    </footer>
  );
}
