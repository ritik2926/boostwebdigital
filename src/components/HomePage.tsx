"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem, useBidirectionalViewportFallback, usePrefersReducedMotion } from "@/components/Reveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
import { Founder } from "@/components/Founder";
import { MagneticButton } from "@/components/Buttons";
import { Kicker } from "@/components/Kicker";
import { AmbientGlow } from "@/components/AmbientGlow";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Sparkles } from "@/components/services/Sparkles";
import { SPECIALTIES } from "@/lib/specialties";
import { useSpotlight } from "@/lib/useSpotlight";
import { cn, seeded } from "@/lib/utils";
import { EASE, SPRING, REVEAL, Z_INDEX, CURSOR_GLOW, OPACITY, DURATION, SECTION_PADDING, STACK, blurPx } from "@/lib/tokens";

/** Registered once, guarded for SSR (ScrollTrigger needs the DOM) — the
 * Process section is the one reserved scroll-pin slot sitewide
 * (docs/12-DESIGN-STANDARDS.md §7), the only ScrollTrigger usage this
 * session; everywhere else deliberately stayed passive (whileInView). */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------------------------------------------------------------------------
// Ambient background system — grain, bokeh, particles (validated in
// /design-lab §5 Background System — reused as-is).
// ---------------------------------------------------------------------------

function CursorGlow() {
  // Global (mounted once at the page root, follows the cursor everywhere),
  // but its own visibility is scoped to the Hero specifically — found via
  // id="hero" since this component isn't a descendant of Hero and has
  // no ref to it. Presence uses the same bounds-check + soft-spring shape as
  // useSpotlight, but computed inline rather than via that hook: the glow
  // needs raw viewport coordinates (it's `position: fixed`), not the local,
  // hero-relative coordinates useSpotlight returns — pulling the hook in
  // just for its presence boolean would mean two separate `window` mousemove
  // listeners doing a getBoundingClientRect on every move instead of one.
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    heroRef.current = document.getElementById("hero");
  }, []);

  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const presence = useMotionValue(0);
  const springX = useSpring(x, SPRING.cursor);
  const springY = useSpring(y, SPRING.cursor);
  const sPresence = useSpring(presence, SPRING.presenceFade);
  const glowOpacity = useTransform(sPresence, [0, 1], [0, 0.5]);
  const size = CURSOR_GLOW.minDiameterPx;
  const left = useTransform(springX, (v) => v - size / 2);
  const top = useTransform(springY, (v) => v - size / 2);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      presence.set(inside ? 1 : 0);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y, presence]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed rounded-full"
      style={{
        left,
        top,
        width: size,
        height: size,
        opacity: glowOpacity,
        background:
          "radial-gradient(circle, rgba(255,255,255,0.14), transparent 25%), radial-gradient(circle, rgba(var(--accent-rgb),0.38), transparent 50%), radial-gradient(circle, rgba(var(--accent-rgb),0.14), transparent 75%)",
        zIndex: Z_INDEX.cursorFx,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Hero — clean SaaS-premium register (Linear/Stripe/Framer mindset, not a
// futuristic/cyberpunk one). Nothing decorative is visible at rest; the
// cursor is a flashlight that reveals a hidden layer beneath the surface,
// and everything fades fully back to zero the moment it leaves. Three
// systems share this "presence" (0 outside the container, spring-eased to
// 1 while the cursor is inside) — each tracks its own container/element
// independently rather than through shared state, matching how every
// other cursor-reactive piece in this file is already built:
// 1) HeroMist — a slow drifting blue haze (always faintly alive) plus a
//    presence-gated cursor-follow glow that brightens locally.
// 2) ArchitecturalGrid — a continuous fine grid of connected cells, 0
//    opacity until the cursor is present, then a mask reveals nearby cells.
// 3) Keyword pills — real capabilities, invisible until the spotlight is
//    near; each still floats gently via GSAP even while unseen.
// ---------------------------------------------------------------------------

function HeroMist() {
  const ref = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  // Softer/slower presence spring than the shared default — the blue glow
  // should ease out gracefully when the cursor crosses into the navbar,
  // not snap. The grid (default spring) is intentionally left untouched.
  const { smx, smy, sPresence } = useSpotlight(ref, SPRING.presenceFade);
  const glowLeft = useTransform(smx, (v) => v - 380);
  const glowTop = useTransform(smy, (v) => v - 380);
  const glowOpacity = useTransform(sPresence, [0, 1], [0, 0.12]);

  useEffect(() => {
    const el = driftRef.current;
    if (!el) return;
    const tween = gsap.to(el, {
      xPercent: -150,
      scale: 1.1,
      duration: 60,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: REVEAL.duration, ease: EASE.primary }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: Z_INDEX.ambient }}
    >
      {/*
        A contained band, not a hero-spanning wash — the earlier version was
        so oversized (140%/80% of the hero) that its own drift was invisible
        relative to its size, even though the GSAP tween was genuinely
        running (verified via computed transform). Smaller shape + a much
        larger relative xPercent swing makes the right-to-left sweep real.
      */}
      <div
        ref={driftRef}
        className="absolute top-[8%] right-[-25%] h-[42%] w-[58%] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.2), transparent 65%)", filter: blurPx(70) }}
      />
      <motion.div
        className="absolute h-190 w-190 rounded-full"
        style={{
          left: glowLeft,
          top: glowTop,
          opacity: glowOpacity,
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.7), transparent 70%)",
          filter: blurPx(60),
        }}
      />
    </motion.div>
  );
}

/**
 * Continuous fine grid — "connected square cells," not a sparse layout
 * grid. Fully invisible at rest; a cursor-following mask reveals nearby
 * cells only while the cursor is inside the container (SPRING.magnetic —
 * immediate, not the dreamy lag CursorGlow uses), gated by the same
 * presence spring so it can never be "stuck" visible.
 * Mounted once at the HomePage root wrapping Navbar+Hero (not inside
 * Hero) so it spans the whole first screen, including behind the
 * navbar's own transparent-at-rest chrome.
 */
const GRID_CELL_PX = 36;
const GRID_PATTERN_STYLE = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
  backgroundSize: `${GRID_CELL_PX}px ${GRID_CELL_PX}px`,
};

function ArchitecturalGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const { smx, smy, sPresence } = useSpotlight(ref);
  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${smx}px ${smy}px, black 0%, transparent 75%)`;
  const revealOpacity = useTransform(sPresence, [0, 1], [0, 0.5]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: Z_INDEX.ambient }}>
      {/* Vertical fade so the grid dissolves into the next section instead of
          cutting off at a hard edge — composes with the cursor mask below via
          ancestor masking (a pixel must pass both to be visible). */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 72%, transparent 96%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 72%, transparent 96%)",
        }}
      >
        <motion.div className="absolute inset-0" style={{ ...GRID_PATTERN_STYLE, opacity: revealOpacity, WebkitMaskImage: maskImage, maskImage }} />
      </div>
    </div>
  );
}

/**
 * Keyword pills — real capabilities, scattered into corners/edges so they
 * feel embedded in the composition rather than lined up beneath the
 * headline. Fully invisible at rest — opacity is entirely proximity-driven
 * (spring-eased 0→0.9 as the cursor nears each pill's own position), never
 * a static baseline. GSAP owns only the idle float (vertical + tiny
 * rotation) so it never fights the Framer-driven opacity over a property.
 */
const HERO_KEYWORDS: Array<{ text: string; top: string; left: string }> = [
  { text: "Patient Growth", top: "9%", left: "9%" },
  { text: "Healthcare SEO", top: "6%", left: "60%" },
  { text: "AI Visibility", top: "15%", left: "89%" },
  { text: "More Bookings", top: "52%", left: "4%" },
  { text: "Local Rankings", top: "58%", left: "92%" },
  { text: "Reputation", top: "80%", left: "16%" },
  { text: "Practice Growth", top: "83%", left: "66%" },
  { text: "Smart Automation", top: "78%", left: "88%" },
];

function KeywordPill({ text, top, left, seed }: { text: string; top: string; left: string; seed: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const proximity = useMotionValue(0);
  const sProximity = useSpring(proximity, { stiffness: 90, damping: 22 });
  const opacity = useTransform(sProximity, [0, 1], [0.1, 0.9]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const y = 8 + seeded(seed + 0.2) * 12;
    const rotation = (seeded(seed + 0.3) - 0.5) * 4;
    const duration = 8 + seeded(seed + 0.4) * 6;
    const delay = seeded(seed + 0.5) * 5;

    const tween = gsap.to(el, {
      y,
      rotation,
      duration,
      delay,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [seed]);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      proximity.set(Math.max(0, 1 - dist / 240));
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [proximity]);

  return (
    <motion.span
      ref={ref}
      style={{ top, left, opacity }}
      className="absolute hidden select-none whitespace-nowrap rounded-xl border border-white/15 bg-white/6 px-4 py-2.5 font-sans text-sm text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md xl:block"
    >
      {text}
    </motion.span>
  );
}

/**
 * Hero entrance — one mount-triggered layered reveal (§6 Motion System):
 * Background (HeroMist) → Badge → Heading → Description → CTA → Decorative
 * (keyword pills), each ~80ms after the last. A CTA layer was added here —
 * a deliberate reversal of the earlier locked Experience Blueprint's "no
 * CTA, this scene earns attention not clicks" (docs/00-experience-
 * blueprint.html §Scene 01), per explicit instruction; that doc's CTA
 * objective field has been updated to match. Each cursor-reactive system
 * (HeroMist's own glow, the pills' proximity opacity, GSAP float) is
 * untouched — this only adds an outer mount fade in front of what was
 * already there.
 */
const HERO_REVEAL_STAGGER = 0.08;

/**
 * Height math for the first-screen composition: Navbar (~5.5rem measured) +
 * Hero + half the Logo Marquee's own height (~2.5rem) should sum to exactly
 * 100vh, so the marquee's top half is visible at rest and its bottom half
 * only appears on the first small scroll — a deliberate "there's more"
 * hint, not an accident of Hero being sized independently of what follows.
 * `min-h`, not `h` — Hero's copy grew (stat + two paragraphs + a CTA); a
 * hard-capped height combined with `overflow-hidden` would silently clip
 * content on short viewports instead of ever growing to fit it. The exact
 * 100vh composition still holds wherever the content already fits (every
 * viewport this was checked against except very short mobile landscape).
 */
function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[calc(100vh-8rem)] flex-col overflow-hidden">
      <HeroMist />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: REVEAL.duration, ease: EASE.primary, delay: HERO_REVEAL_STAGGER * 5 }}
        className="absolute inset-0"
        style={{ zIndex: Z_INDEX.ambient }}
      >
        {HERO_KEYWORDS.map((k, i) => (
          <KeywordPill key={k.text} text={k.text} top={k.top} left={k.left} seed={i} />
        ))}
      </motion.div>

      <div className="relative flex flex-1 items-center" style={{ zIndex: Z_INDEX.base }}>
        <Container className="flex flex-col items-center text-center">
          <RevealGroup as="div" trigger="mount" stagger={HERO_REVEAL_STAGGER} delay={HERO_REVEAL_STAGGER} className="contents">
            <RevealItem>
              <Kicker>Services</Kicker>
            </RevealItem>
            <RevealItem className="mt-7">
              <h1 className="max-w-6xl font-display text-[2.25rem] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
                Healthcare Marketing Agency That{" "}
                <br className="hidden lg:inline" />
                Gets Practices Recommended by AI
              </h1>
            </RevealItem>
            <RevealItem className="mt-8 max-w-2xl space-y-4">
              <p className="text-sm text-white/60 sm:text-base">
                88% of health-related searches now show an AI answer before a single blue link. If ChatGPT, Google AI
                Overviews and Perplexity aren&apos;t naming your practice inside that answer, patients never reach
                your website — no matter where you rank.
              </p>
              <p className="text-sm text-white/60 sm:text-base">
                Boost Web Digital is a healthcare-only marketing agency built for how patients actually search in
                2026. We work with medical, dental, aesthetic and hair restoration practices to make sure that when a
                patient asks an AI for a recommendation, it says your name.
              </p>
            </RevealItem>
            <RevealItem className="mt-10">
              <MagneticButton>Check My Practice&apos;s AI Visibility →</MagneticButton>
            </RevealItem>
          </RevealGroup>
        </Container>
      </div>
    </section>
  );
}

/**
 * Client Logos Marquee — a quiet trust signal, not a focal element. No
 * card/border/shadow/glass/hover — just small monochrome marks drifting on
 * the bare page background between Hero and the next section. Placeholder
 * abstract SVG marks for now; swap `LOGO_SVGS` for real client logo SVGs
 * later, same layout (each just needs to accept `currentColor`).
 */
const LOGO_SVGS: Array<() => React.JSX.Element> = [
  () => (
    <svg width="90" height="20" viewBox="0 0 90 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="7" width="56" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
  () => (
    <svg width="84" height="20" viewBox="0 0 84 20" fill="none">
      <path d="M10 2L18 18H2L10 2Z" fill="currentColor" />
      <rect x="28" y="7" width="50" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
  () => (
    <svg width="96" height="20" viewBox="0 0 96 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" fill="currentColor" transform="rotate(45 10 10)" />
      <rect x="30" y="7" width="60" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
  () => (
    <svg width="88" height="20" viewBox="0 0 88 20" fill="none">
      <path d="M10 1L18 6V14L10 19L2 14V6L10 1Z" stroke="currentColor" strokeWidth="2" />
      <rect x="28" y="7" width="54" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
  () => (
    <svg width="92" height="20" viewBox="0 0 92 20" fill="none">
      <circle cx="8" cy="10" r="7" fill="currentColor" opacity="0.8" />
      <circle cx="18" cy="10" r="7" fill="currentColor" opacity="0.5" />
      <rect x="34" y="7" width="52" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
  () => (
    <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="10" cy="10" r="3" fill="currentColor" />
      <rect x="26" y="7" width="48" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
  () => (
    <svg width="86" height="20" viewBox="0 0 86 20" fill="none">
      <path d="M2 12C4 6 8 6 10 12C12 18 16 18 18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="28" y="7" width="52" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
  () => (
    <svg width="82" height="20" viewBox="0 0 82 20" fill="none">
      <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="28" y="7" width="46" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
];

function LogoMarqueeRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 animate-[marquee_52s_linear_infinite] items-center gap-16 pr-16 sm:gap-20 sm:pr-20" aria-hidden={ariaHidden}>
      {LOGO_SVGS.map((Mark, i) => (
        <span key={i} className="flex shrink-0 items-center text-white/55">
          <Mark />
        </span>
      ))}
    </div>
  );
}

function LogoMarquee() {
  return (
    <Reveal>
      <Container>
        <div className="relative flex h-17.5 w-full items-center overflow-hidden sm:h-20">
          <div
            className="flex w-full"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 13%, black 87%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 13%, black 87%, transparent)",
            }}
          >
            <LogoMarqueeRow />
            <LogoMarqueeRow ariaHidden />
          </div>
        </div>
      </Container>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Market Shift — the Hero claims "recommended by AI"; this section is the
// receipt. Three independently-reported numbers, presented as a
// single-select accordion (exactly one item open at a time — clicking the
// already-open item is a harmless no-op, never collapses to nothing, since
// the right side always needs something to show). Slots between the Client
// Logo Marquee and Who We Serve. Numbers draw in as a live line/arc/bar
// rather than counting up. Rebuilt flat/editorial — no glass card, no glow,
// no InFocusMarker/DashboardBackdrop — per feedback_avoid_ai_generated_look:
// scale and weight carry the numerals, not lighting; the arc/bar/threshold
// shapes are plain data-graphics (a legitimate editorial device), not
// dashboard widgets in a glowing box.
// ---------------------------------------------------------------------------

type StatId = "ai-overview" | "ai-tools" | "reviews";

const MARKET_STATS: Array<{
  id: StatId;
  value: string;
  headline: string;
  body: string;
  caption: string;
}> = [
  {
    id: "ai-overview",
    value: "88%",
    headline: "of health searches now trigger an AI Overview",
    body: "Healthcare has the highest AI Overview prevalence of any industry — up from 72% a year earlier. E-commerce sits between 14% and 23%. Medical queries are effectively saturated.",
    caption: "AI Overview Prevalence",
  },
  {
    id: "ai-tools",
    value: "36%",
    headline: "of patients now use AI tools to find a provider",
    body: "That's ahead of Google search at 34% and physician referrals at 32% — and it doubled from 17% a year earlier. Adoption is highest among patients aged 45 to 60, at 64%.",
    caption: "Provider Discovery Channel",
  },
  {
    id: "reviews",
    value: "75%",
    headline: "won't book a provider rated below 4.0 stars",
    body: "55% of patients have abandoned a provider because of online reviews, up fifteen points year over year. 66% say the way a provider responds to reviews affects whether they trust them.",
    caption: "Review Trust Threshold",
  },
];

/** Flat white numeral, dimmed when inactive — size and weight are the whole
 * device, no glow/text-shadow, no corner marker. */
function StatNumeral({ value, isOpen }: { value: string; isOpen: boolean }) {
  return (
    <span
      className={cn(
        "font-display text-5xl font-bold tabular-nums transition-colors duration-300 sm:text-6xl",
        isOpen ? "text-white" : "text-white/30"
      )}
    >
      {value}
    </span>
  );
}

/** Radial arc gauge for "88%" — a plain data-graphic (the editorial/
 * data-journalism vocabulary, not a dashboard gauge): flat accent arc, no
 * glow filter, no rounded soft cap, sized large enough that scale carries
 * the visual weight instead of lighting. */
function ArcGauge({ percent, previousPercent }: { percent: number; previousPercent: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const size = 240;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgb(var(--accent-rgb))"
            strokeWidth={stroke}
            strokeDasharray={c}
            initial={{ strokeDashoffset: reducedMotion ? offset : c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: reducedMotion ? 0 : 1.2, ease: EASE.primary, delay: reducedMotion ? 0 : 0.1 }}
          />
        </svg>
        <span className="absolute font-display text-4xl font-bold tabular-nums text-white">{percent}%</span>
      </div>
      <p className="font-mono text-xs uppercase tracking-wide text-white/40">Up from {previousPercent}% last year</p>
    </div>
  );
}

function StatBar({
  label,
  percent,
  maxPercent,
  emphasis,
  reducedMotion,
}: {
  label: string;
  percent: number;
  maxPercent: number;
  emphasis?: boolean;
  reducedMotion: boolean;
}) {
  const width = `${(percent / maxPercent) * 100}%`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={emphasis ? "text-white" : "text-white/50"}>{label}</span>
        <span className={cn("font-mono tabular-nums", emphasis ? "text-white" : "text-white/40")}>{percent}%</span>
      </div>
      <div className="h-3 w-full bg-white/8">
        <motion.div
          className={emphasis ? "h-full bg-accent" : "h-full bg-white/20"}
          initial={{ width: reducedMotion ? width : 0 }}
          animate={{ width }}
          transition={{ duration: reducedMotion ? 0 : 0.9, ease: EASE.primary }}
        />
      </div>
    </div>
  );
}

/** Three bars drawing to width in parallel — the point isn't any one number,
 * it's that AI tools now edge out Google search and physician referral.
 * Sharp rectangular bars, not pill-rounded progress bars. */
function AiToolBarChart({ percent }: { percent: number }) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div className="flex w-full flex-col gap-7">
      <span className="font-display text-4xl font-bold tabular-nums text-white">{percent}%</span>
      <div className="flex w-full flex-col gap-4">
        <StatBar label="AI tools" percent={36} maxPercent={40} emphasis reducedMotion={reducedMotion} />
        <StatBar label="Google search" percent={34} maxPercent={40} reducedMotion={reducedMotion} />
        <StatBar label="Physician referral" percent={32} maxPercent={40} reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}

/** A 0–5 star track marking where the 4.0 threshold sits — context only, not
 * a spatial encoding of the 75% figure (a different unit entirely: percent
 * of patients vs. a star-rating scale). "Rejected" reads purely through
 * brightness (dim below the line, bright above) — no red/warning hue; the
 * single-accent-color rule stays intact. */
function ReviewThresholdGauge({ percent, threshold, max = 5 }: { percent: number; threshold: number; max?: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const pct = (threshold / max) * 100;
  return (
    <div className="flex w-full flex-col gap-7">
      <span className="font-display text-4xl font-bold tabular-nums text-white">{percent}%</span>
      <div className="w-full">
        <div className="relative h-3 w-full overflow-hidden bg-white/8">
          <div className="absolute inset-y-0 left-0 bg-white/6" style={{ width: `${pct}%` }} />
          <motion.div
            className="absolute inset-y-0 right-0 bg-accent"
            initial={{ width: reducedMotion ? `${100 - pct}%` : 0 }}
            animate={{ width: `${100 - pct}%` }}
            transition={{ duration: reducedMotion ? 0 : 0.9, ease: EASE.primary }}
          />
          <motion.div
            aria-hidden
            className="absolute top-0 h-full w-px bg-white"
            initial={{ left: reducedMotion ? `${pct}%` : "0%" }}
            animate={{ left: `${pct}%` }}
            transition={{ duration: reducedMotion ? 0 : 1, ease: EASE.primary, delay: reducedMotion ? 0 : 0.1 }}
          />
        </div>
        <div className="relative mt-2 h-4 font-mono text-xs uppercase tracking-wide text-white/40">
          <span className="absolute left-0">0★</span>
          <motion.span
            className="absolute -translate-x-1/2 text-white/70"
            initial={{ left: reducedMotion ? `${pct}%` : "0%" }}
            animate={{ left: `${pct}%` }}
            transition={{ duration: reducedMotion ? 0 : 1, ease: EASE.primary, delay: reducedMotion ? 0 : 0.1 }}
          >
            {threshold.toFixed(1)}★
          </motion.span>
          <span className="absolute right-0">{max}★</span>
        </div>
      </div>
    </div>
  );
}

function StatGraphic({ id, percent }: { id: StatId; percent: number }) {
  if (id === "ai-overview") return <ArcGauge percent={percent} previousPercent={72} />;
  if (id === "ai-tools") return <AiToolBarChart percent={percent} />;
  return <ReviewThresholdGauge percent={percent} threshold={4.0} />;
}

function MarketStatAccordionItem({
  stat,
  isOpen,
  onSelect,
}: {
  stat: (typeof MARKET_STATS)[number];
  isOpen: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="border-t border-white/8 py-6 first:border-t-0 md:py-7">
      <h3 className="leading-none">
        <button type="button" onClick={onSelect} aria-expanded={isOpen} className="flex w-full items-center gap-5 text-left sm:gap-7">
          <StatNumeral value={stat.value} isOpen={isOpen} />
          <span
            className={cn(
              "text-lg leading-snug transition-colors duration-300 sm:text-xl",
              isOpen ? "text-white" : "text-white/40"
            )}
          >
            {stat.headline}
          </span>
        </button>
      </h3>
      <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0 }} transition={{ duration: 0.4, ease: EASE.primary }} className="overflow-hidden">
        <div className="pt-5 pl-[calc(3.5rem+1.25rem)] sm:pl-[calc(4.25rem+1.75rem)]">
          {/* Always rendered — collapsed visually via the outer motion.div's
              height:0 + overflow-hidden above, not via unmounting. A
              non-JS crawler never fires onSelect, so conditionally
              rendering this per-panel (as the other two stats' bodies
              previously were) left their explanatory text out of the
              server HTML entirely. */}
          <motion.p
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: DURATION.reveal, ease: EASE.primary }}
            className="max-w-xl text-white/70"
          >
            {stat.body}
          </motion.p>
          {/* Mobile/tablet — no separate side panel (no cursor, and it would
              just add scroll length), so the graphic renders small and inline
              here instead, directly on the page background, no card. */}
          <div className="mt-8 max-w-xs lg:hidden">
            <StatGraphic id={stat.id} percent={Number.parseInt(stat.value, 10)} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MarketShift() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = MARKET_STATS[activeIndex];

  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="top-right" duration={65} />
      <Container>
        <RevealGroup as="div">
          <RevealItem>
            <Kicker>The Shift</Kicker>
          </RevealItem>
          <RevealItem className={cn(STACK.kickerToHeading, "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between")}>
            <h2 className="max-w-2xl font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Why Healthcare Marketing Changed in 2026
            </h2>
            <p className="max-w-sm text-white/60">
              Patient search behaviour moved further in eighteen months than in the previous ten years. Three numbers
              explain what happened.
            </p>
          </RevealItem>
        </RevealGroup>

        <Reveal className={STACK.subToContent}>
          <div className="grid gap-10 lg:grid-cols-[7fr_3fr] lg:gap-16">
            <div>
              {MARKET_STATS.map((stat, i) => (
                <MarketStatAccordionItem key={stat.id} stat={stat} isOpen={activeIndex === i} onSelect={() => setActiveIndex(i)} />
              ))}
            </div>

            <div className="hidden lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-white/8 lg:pl-12">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">{active.caption}</p>
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE.primary }}
                  >
                    <StatGraphic id={active.id} percent={Number.parseInt(active.value, 10)} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12 max-w-3xl text-lg text-white/70 sm:text-xl">
          <p>
            The consequence: your rankings can be perfect and your practice can still be invisible.{" "}
            <span className="text-white">Ranking and being recommended have become two separate problems</span>, and
            most agencies still only measure the first.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// AI Visibility Explainer — text explaining, one editorial pull-quote
// demonstrating. Rebuilt per feedback_avoid_ai_generated_look: the earlier
// pass built a simulated AI-chat mockup with cycling tabs and checkmark-pill
// chips — a "fake product interface" at its core, not a badly-dressed one,
// so it's replaced rather than re-skinned. The same information (which AI
// systems, which factors) now reads as plain typographic lists, and the
// illustrative answer is set as a large italic magazine pull-quote.
// ---------------------------------------------------------------------------

const AI_PROVIDERS = ["ChatGPT", "Google AI Overviews", "Perplexity", "Gemini"];

function AiAnswerQuote() {
  return (
    <Reveal className="relative flex flex-col gap-8 lg:justify-center lg:border-l lg:border-white/8 lg:pl-12">
      <span aria-hidden className="font-display text-7xl leading-none text-white/15 sm:text-8xl">
        &ldquo;
      </span>
      <p className="-mt-10 font-display text-2xl italic leading-snug text-white/85 sm:text-3xl">
        Based on their reviews, specialty pages, and how consistently they&apos;re mentioned elsewhere, I&apos;d
        recommend <span className="not-italic text-white">Your Practice</span> for this.
      </p>
      <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wide text-white/40">
        <p>{AI_PROVIDERS.join(" · ")}</p>
        <p className="text-white/30">Entity consistency — Structured data — Third-party mentions</p>
      </div>
    </Reveal>
  );
}

function AiVisibilityExplainer() {
  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="bottom-left" duration={78} />
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <RevealGroup as="div">
            <RevealItem>
              <Kicker>The New Metric</Kicker>
            </RevealItem>
            <RevealItem className={STACK.kickerToHeading}>
              <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
                What Is AI Visibility, and Why Does It Matter for Medical Practices?
              </h2>
            </RevealItem>
            <RevealItem className={cn(STACK.subToContent, "max-w-xl space-y-4 text-white/70")}>
              <p>
                AI visibility is how often AI systems — ChatGPT, Google AI Overviews, Perplexity and Gemini — name
                your practice when a patient asks them for a recommendation. It is measured in citations, not
                rankings.
              </p>
              <p>
                It matters because the AI answer now sits above the search results on the overwhelming majority of
                health queries. A patient reads that answer, picks one of the two or three practices named inside
                it, and never scrolls. If you aren&apos;t in the answer, you aren&apos;t in consideration.
              </p>
              <p>
                AI visibility overlaps with SEO but is optimised differently. AI systems weight three things far
                more heavily than traditional rankings do: <span className="font-semibold text-white">entity
                consistency</span> (is your practice described identically everywhere),{" "}
                <span className="font-semibold text-white">structured data</span> (can a machine parse who you are
                and what you treat), and <span className="font-semibold text-white">third-party mentions</span> (do
                independent sources talk about you). A practice can rank in position three and be cited zero times,
                and that combination is now common.
              </p>
            </RevealItem>
          </RevealGroup>

          <AiAnswerQuote />
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Who We Serve — full-width intro, then a 2-col grid of specialty cards.
// Hover lifts + dims siblings (opacity only, no blur — an explicit exception
// requested for this section; Depth-of-Field's blur stays the default
// elsewhere per §8 Component Personality). Each card's visual is a real,
// self-hosted stock video (public/videos/) — an explicit, requested
// exception to the site's no-stock-imagery pattern elsewhere (see
// docs/02-BRAND.md) — lazy-loaded via `useInView` so six videos never all
// start downloading at page mount.
// ---------------------------------------------------------------------------

/**
 * Mounts a <video>'s `src` only once its container nears the viewport —
 * six real video files loading at page mount would be a real Core Web
 * Vitals hit. Mirrors `usePrefersReducedMotion`'s plain-browser-API style
 * rather than reaching for a dependency for this.
 */
function useInView<T extends HTMLElement>(margin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), { rootMargin: margin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, margin]);

  return { ref, inView };
}

/**
 * A plain motion.div, not a link — these six specialty pages
 * (/hair-restoration-marketing/ etc.) don't exist yet, and a card that
 * looks clickable and 404s is worse than a card that's plainly not
 * clickable. Was `motion.create(Link)` wrapping `specialty.href`; keep the
 * class name "group" for the hover-driven video/label states, they don't
 * depend on the element being a link. Do not re-add navigation here without
 * building the destination page first.
 */
function SpecialtyCard({
  specialty,
  index,
  hoveredIndex,
  onHover,
  onLeave,
}: {
  specialty: (typeof SPECIALTIES)[number];
  index: number;
  hoveredIndex: number | null;
  onHover: () => void;
  onLeave: () => void;
}) {
  const isHovered = hoveredIndex === index;
  const siblingHovered = hoveredIndex !== null && !isHovered;
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <motion.div
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      animate={{
        opacity: isHovered ? OPACITY.full : siblingHovered ? OPACITY.muted : OPACITY.visible,
        y: isHovered ? -4 : 0,
      }}
      transition={{ duration: DURATION.reveal, ease: EASE.primary }}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-white/8 bg-white/3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-shadow duration-300",
        isHovered && "border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
      )}
    >
      <div ref={ref} className="relative m-3 aspect-video overflow-hidden rounded-xl bg-white/5">
        {inView && (
          <video
            className={cn("h-full w-full object-cover transition-transform duration-500", isHovered && "scale-105")}
            src={`/videos/${specialty.id}.mp4`}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay
          />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/20" />
      </div>
      <div className="px-6 pb-6">
        <h3 className="font-display text-xl font-semibold text-white">{specialty.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{specialty.desc}</p>
      </div>
    </motion.div>
  );
}

function WhoWeServe() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="specialties" className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="top-left" duration={84} />
      <Container>
        <RevealGroup as="div">
          <RevealItem>
            <Kicker>Who We Serve</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="max-w-3xl font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Healthcare Specialties We Serve
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.subToContent, "max-w-2xl space-y-4")}>
            <p className="text-white/70">
              Each specialty gets its own strategy, because a hair restoration patient and an orthodontic patient
              don&apos;t search, compare or decide anything alike.
            </p>
            <p className="text-white/70">
              Our deepest work today is in hair transplant and hair restoration —{" "}
              <span className="font-semibold text-white">a $10.7 billion market growing at 21% a year</span>, where
              patients research privately for months, almost entirely through search and AI. It is also the
              specialty where we have a <span className="font-semibold text-white">live client and published data</span>.
            </p>
          </RevealItem>

          <RevealGroup
            as="ul"
            trigger="inherit"
            stagger={REVEAL.cardStagger}
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
          >
            {SPECIALTIES.map((specialty, i) => (
              <RevealItem as="li" key={specialty.id} className={i % 2 === 1 ? "lg:mt-10" : undefined}>
                <SpecialtyCard
                  specialty={specialty}
                  index={i}
                  hoveredIndex={hoveredIndex}
                  onHover={() => setHoveredIndex(i)}
                  onLeave={() => setHoveredIndex(null)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Services — a full-width hover-reveal list, not cards and not the earlier
// sticky-panel layout (both superseded). Eyebrow pill → H2 left / "View All
// Services" right → four full-width rows (name left, description right,
// hidden until that row is hovered or focused), divided by a hairline. On
// hover a floating image also trails the cursor across the whole list — a
// distinct abstract graphic per service, reused verbatim from the prior
// build. Each row is a plain <div>, not a link (2026-08-22, correcting
// this comment to match — it previously said "a real <a>", which stopped
// being true once these four individual service pages were decided
// against; SERVICES' own `href` field is unused dead data, kept only as a
// forward reference for whoever eventually builds
// /ai-visibility-geo/, /healthcare-seo/, etc. Do not wire it back into a
// link without building the destination page first — see /services/ for
// the current real linking destination for "Services" generally.
// ---------------------------------------------------------------------------

type ServiceId = "ai-visibility-geo" | "seo" | "reputation" | "paid-search";

const SERVICES: Array<{
  id: ServiceId;
  mark: string;
  name: string;
  hook: string;
  body: string;
  cta: string;
  href: string;
}> = [
  {
    id: "ai-visibility-geo",
    mark: "01",
    name: "AI Visibility (GEO) for Healthcare Practices",
    hook: "We get your practice named by ChatGPT, Google AI Overviews, Perplexity and Gemini.",
    body: "That means fixing entity consistency across every place your practice is described, implementing the structured data AI systems parse, restructuring content so answers are extractable, and building the third-party mentions AI models actually pull from. Measured with a monthly rescan, not a rank report.",
    cta: "See how we approach AI visibility",
    href: "/ai-visibility-geo/",
  },
  {
    id: "seo",
    mark: "02",
    name: "Healthcare SEO",
    hook: "Technical foundations, specialty-specific content, local visibility and Google Business Profile optimisation.",
    body: "Traditional SEO still matters — it's the base layer AI systems read before deciding who to recommend. It is no longer sufficient on its own.",
    cta: "See how we approach SEO",
    href: "/healthcare-seo/",
  },
  {
    id: "reputation",
    mark: "03",
    name: "Reputation Management for Medical Practices",
    hook: "75% of patients won't book below 4.0 stars, and 66% say your replies to reviews affect their trust.",
    body: "We fix review velocity, response rate and rating trajectory — and because review content is one of the strongest signals AI systems use to judge a provider, this work compounds directly into AI visibility.",
    cta: "See how we approach reputation",
    href: "/healthcare-reputation-management/",
  },
  {
    id: "paid-search",
    mark: "04",
    name: "Paid Search & Social for Healthcare",
    hook: "Google Ads and Meta campaigns for specialties where the unit economics work, run inside healthcare ad policy so your account doesn't get suspended.",
    body: "If paid won't work at your budget, we'll tell you before you sign.",
    cta: "See how we approach paid search",
    href: "/healthcare-paid-search/",
  },
];

/**
 * One abstract, art-directed mark per service — no stock photography or UI
 * mockups (the site has none anywhere; introducing it here would be a
 * bigger visual-language call than this section needs). SEO's ascending
 * trace reuses the "Vital Signal" motif already named in
 * docs/00-creative-direction.html, not invented for this section.
 */
const REPUTATION_MARKS = [
  { x: 38, y: 28 },
  { x: 92, y: 18 },
  { x: 122, y: 46 },
  { x: 58, y: 66 },
  { x: 102, y: 76 },
];

function ServiceGraphic({ id }: { id: ServiceId }) {
  return (
    <svg viewBox="0 0 160 100" className="h-40 w-64 text-accent sm:h-48 sm:w-80" fill="none">
      {id === "seo" && (
        <>
          <motion.path
            d="M4,80 L40,68 L70,72 L96,40 L124,26 L156,10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE.primary }}
          />
          <motion.circle
            cx="156"
            cy="10"
            r="4"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.3, ease: EASE.primary }}
          />
        </>
      )}

      {id === "ai-visibility-geo" && (
        <>
          <circle cx="80" cy="50" r="4" fill="currentColor" />
          {[18, 32, 46].map((r, i) => (
            <motion.circle
              key={r}
              cx="80"
              cy="50"
              r={r}
              stroke="currentColor"
              strokeOpacity={0.45 - i * 0.12}
              strokeWidth="1.5"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: EASE.primary }}
            />
          ))}
        </>
      )}

      {id === "reputation" &&
        REPUTATION_MARKS.map((m, i) => (
          <motion.circle
            key={i}
            cx={m.x}
            cy={m.y}
            r="5"
            fill="currentColor"
            initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10, y: -8 }}
            animate={{ opacity: 0.85, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE.primary }}
          />
        ))}

      {id === "paid-search" && (
        <>
          {/* Equal-opacity rings (unlike GEO's fading-outward pulse) plus a
              dart landing on the center — "aiming at a specific audience,"
              not GEO's "broadcasting outward." */}
          {[42, 28, 14].map((r, i) => (
            <motion.circle
              key={r}
              cx="80"
              cy="50"
              r={r}
              stroke="currentColor"
              strokeOpacity={0.5}
              strokeWidth="1.5"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE.primary }}
            />
          ))}
          <motion.path
            d="M132,14 L85,46"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: EASE.primary }}
          />
          <motion.circle
            cx="80"
            cy="50"
            r="5"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.3, ease: EASE.primary }}
          />
        </>
      )}
    </svg>
  );
}

/**
 * Cursor-follow image trail for the Services row list. Tracks the mouse
 * relative to the list container (not `window`) so it's only meaningful
 * while hovering the rows; a small offset (+24/-30) keeps it near the
 * cursor without sitting directly on top of it. The tilt is the one
 * "physical" touch — derived from horizontal velocity via useVelocity, so
 * the image leans into the direction of travel instead of just fading in
 * flat. SPRING.trail (tokens.ts) is deliberately snappier than the ambient
 * cursor-glow spring since a 280px image reads as disconnected if it lags
 * as slowly as a soft background glow.
 */
function useServiceCursorTrail(containerRef: React.RefObject<HTMLDivElement | null>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reducedMotion = usePrefersReducedMotion();
  const springX = useSpring(x, SPRING.trail);
  const springY = useSpring(y, SPRING.trail);
  const velocityX = useVelocity(springX);
  const rotate = useTransform(velocityX, [-1200, 0, 1200], [-8, 0, 8]);

  useEffect(() => {
    if (reducedMotion) return;
    function handleMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left + 24);
      y.set(e.clientY - rect.top - 30);
    }
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, [containerRef, x, y, reducedMotion]);

  return { springX, springY, rotate };
}

/**
 * z-20, one below the row list's z-30 (set on the RevealGroup `<ul>` in
 * Services — not on the individual `<a>`, since each RevealItem gets its own
 * `filter`/`transform` from Framer Motion and that opens a fresh stacking
 * context, trapping a row-level z-index instead of letting it compete with
 * this sibling). Each row is a single full-width link, so the cursor (and
 * therefore this trailing image) regularly passes directly over the hook
 * text/chips it's meant to accompany — sitting behind the list's content
 * means it's still visible in the surrounding whitespace but never occludes
 * the words it's supposed to sit alongside.
 */
function FloatingServiceImage({
  activeId,
  springX,
  springY,
  rotate,
}: {
  activeId: ServiceId | null;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  rotate: MotionValue<number>;
}) {
  const visible = activeId !== null;
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  /** Idle "breathing" scale while the card is visible — GSAP owns this idle
   * loop (same role as KeywordPill's float), applied to the inner card div
   * rather than the outer motion.div, since Framer already owns that
   * element's own `scale` for the visible/hidden transition; two systems
   * animating the same property on the same element would fight. */
  useEffect(() => {
    if (reducedMotion || !visible) return;
    const el = cardRef.current;
    if (!el) return;
    const tween = gsap.to(el, { scale: 1.02, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
    return () => {
      tween.kill();
      gsap.set(el, { scale: 1 });
    };
  }, [visible, reducedMotion]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
      style={{ x: springX, y: springY, rotate }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85 }}
      transition={{ duration: 0.3, ease: EASE.primary }}
    >
      <div
        ref={cardRef}
        className="flex h-52 w-70 items-center justify-center overflow-hidden rounded-3xl border border-white/8 bg-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          {activeId && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: EASE.primary }}
            >
              <ServiceGraphic id={activeId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ServiceRow({
  service,
  isActive,
  onHoverStart,
  onHoverEnd,
}: {
  service: (typeof SERVICES)[number];
  isActive: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const content = (
    <>
      {/* Gradient hairline overlaying the plain border — same accent-fade
          language as /services/'s card treatment, adapted for a full-width
          row (a boxed border would fight the "list, not cards" shape this
          section deliberately kept). */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.4) 30%, transparent 75%)" }}
      />

      {/* Tonal wash, not a card/pill — extra hierarchy on the active row
          without reintroducing bordered-box decoration. Accent-tinted now
          instead of flat white, so hover reads as light landing on the row
          rather than a plain highlight. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(120deg, rgba(var(--accent-rgb),0.06), transparent 70%)" }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE.primary }}
      />

      <div className="relative z-10 grid items-center gap-4 md:grid-cols-[minmax(0,400px)_1fr_auto] md:gap-8">
        <div className="flex items-baseline gap-4">
          <span
            className={cn(
              "font-mono text-xs transition-colors duration-300",
              isActive ? "text-accent" : "text-white/40"
            )}
          >
            {service.mark}
          </span>
          <span
            className={cn(
              "font-display text-3xl font-semibold leading-[1.1] transition-colors duration-300 sm:text-4xl",
              isActive ? "text-white" : "text-white/55"
            )}
          >
            {service.name}
          </span>
        </div>

        {/* Hook is always at least dimly readable — hidden entirely until
            hover made this section read as near-empty at rest (heading +
            a bare list of names, no supporting copy visible anywhere). */}
        <motion.div
          animate={{ opacity: isActive ? 1 : 0.45 }}
          transition={{ duration: 0.35, ease: EASE.primary }}
          className="hidden min-h-16 max-w-lg flex-col justify-center md:flex"
        >
          <p className="text-white/70">
            <span className="text-white">{service.hook}</span> {service.body}
          </p>
        </motion.div>

        {/* Mobile/tablet — always visible, no hover-gating (no cursor to hover with) */}
        <div className="md:hidden">
          <p className="text-white/70">
            <span className="text-white">{service.hook}</span> {service.body}
          </p>
        </div>

        <span
          aria-hidden
          className={cn(
            "hidden h-9 w-9 shrink-0 items-center justify-center justify-self-end rounded-full border text-sm transition-all duration-300 md:flex",
            isActive ? "translate-x-1 border-accent/40 text-white shadow-[0_0_16px_rgba(var(--accent-rgb),0.35)]" : "border-white/15 text-white/40"
          )}
        >
          →
        </span>
      </div>
    </>
  );

  const sharedProps = {
    "aria-label": service.cta,
    onMouseEnter: onHoverStart,
    onMouseLeave: onHoverEnd,
    onFocus: onHoverStart,
    onBlur: onHoverEnd,
    className: "group relative block border-t border-white/8 py-8 last:border-b md:py-10",
  };

  // Only ai-visibility-geo has a real destination today — see the SERVICES
  // comment above. The other three rows stay plain <div>s until their pages
  // exist.
  if (service.id === "ai-visibility-geo") {
    return (
      <Link href={service.href} {...sharedProps}>
        {content}
      </Link>
    );
  }

  return <div {...sharedProps}>{content}</div>;
}

function Services() {
  const [hoveredId, setHoveredId] = useState<ServiceId | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { springX, springY, rotate } = useServiceCursorTrail(listRef);

  return (
    <section id="services" className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="bottom-right" duration={70} />
      <Sparkles seedOffset={83} />
      <Container>
        <RevealGroup as="div">
          <RevealItem>
            <Kicker>Our Services</Kicker>
          </RevealItem>
          <RevealItem className={cn(STACK.kickerToHeading, "flex items-end justify-between gap-6")}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Our Healthcare Marketing <span className="text-shimmer">Services</span>
            </h2>
            <div className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-white/85 sm:inline-flex">
              View All Services
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </RevealItem>
        </RevealGroup>

        <div ref={listRef} className={cn("relative", STACK.subToContent)}>
          <FloatingServiceImage activeId={hoveredId} springX={springX} springY={springY} rotate={rotate} />
          <RevealGroup as="ul" trigger="viewport" stagger={REVEAL.cardStagger} className="relative z-30">
            {SERVICES.map((service) => (
              <RevealItem as="li" key={service.id}>
                <ServiceRow
                  service={service}
                  isActive={hoveredId === service.id}
                  onHoverStart={() => setHoveredId(service.id)}
                  onHoverEnd={() => setHoveredId(null)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why Choose Us — "solar system" composition: rotating orbit rings behind a
// centered H2, 5 accent nodes on the outer ring matching the 5 differentiator
// items below. THE ONE DELIBERATE EXCEPTION to the permanent-dark-theme hard
// rule on this entire site — explicitly requested and confirmed, not an
// oversight (see CLAUDE.md's footnote on that rule). Colors here are a
// literal inversion of the site's own two core tokens (`--foreground` becomes
// this section's background, `--background` becomes its text) rather than
// invented new ones, and are hardcoded locally — this is not a theme system,
// no toggle, not reusable elsewhere. Real content never sits curved around
// the ring itself (illegible, unworkable responsively) — the ring establishes
// the concept visually, the grid below is where the actual reading happens.
// ---------------------------------------------------------------------------

type WhyChooseId = "citations" | "founder" | "research" | "say-no" | "no-lockin";

const WHY_CHOOSE_US: Array<{ id: WhyChooseId; heading: string; body: string }> = [
  {
    id: "citations",
    heading: "We measure citations, not just rankings",
    body: "Your current agency reports keyword positions. We report how many times AI named your practice this month compared to last. Different number, and the one that now drives bookings.",
  },
  {
    id: "founder",
    heading: "You work with the founder directly",
    body: "No account manager, no ticket queue, no team you never meet. You have my number and you use it.",
  },
  {
    id: "research",
    heading: "We publish our own research",
    body: "The Hair Transplant AI Visibility Index scores real clinics on real data. Nothing we tell you about AI search is borrowed from someone else's blog post.",
  },
  {
    id: "say-no",
    heading: "We say no",
    body: "If paid ads won't work for your specialty at your budget, we say so before you sign — not in month four when the spend is gone.",
  },
  {
    id: "no-lockin",
    heading: "Month to month, no lock-in",
    body: "No twelve-month contract. If the citation count doesn't move, you leave.",
  },
];

/** Simple line-drawn marks only (strokes/circles/rects) — matches
 * ServiceGraphic's own primitive-only style. No circular badge/container
 * wraps these (that's exactly the "icon inside a circle" pattern
 * feedback_avoid_ai_generated_look rules out) — the "say-no" prohibited-sign
 * circle is part of that icon's own meaning, not a decorative wrapper. */
function WhyChooseIcon({ id }: { id: WhyChooseId }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[#08080a]">
      {id === "citations" && (
        <>
          <rect x="6" y="10" width="4" height="10" rx="1.5" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" rx="1.5" fill="currentColor" />
        </>
      )}
      {id === "founder" && (
        <>
          <circle cx="14" cy="9" r="5" stroke="currentColor" strokeWidth="1.75" />
          <path d="M4 24c0-5.5 4.5-9 10-9s10 3.5 10 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
      {id === "research" && (
        <>
          <rect x="5" y="16" width="4" height="8" rx="1" fill="currentColor" />
          <rect x="12" y="10" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="19" y="4" width="4" height="20" rx="1" fill="rgb(var(--accent-rgb))" />
        </>
      )}
      {id === "say-no" && (
        <>
          <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path d="M8 8L20 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
      {id === "no-lockin" && (
        <>
          <rect x="6" y="13" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9 13V9a5 5 0 0 1 9-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** The orbit rings + 5 accent nodes — decorative background layer behind the
 * eyebrow/H2, absolutely positioned so real text isn't clipped to the
 * ring's circular boundary. Node angles computed via trigonometry, same
 * technique as ArcGauge's tip-dot earlier this session. Desktop only — an
 * orbit graphic has no legible mobile equivalent at that scale. */
function OrbitRing({ count }: { count: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const size = 560;
  const center = size / 2;
  const ringRadii = [110, 160, 210];
  const nodeRadius = 210;

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block",
        !reducedMotion && "orbit-ring"
      )}
    >
      {ringRadii.map((r) => (
        <circle key={r} cx={center} cy={center} r={r} stroke="#08080a" strokeOpacity={0.1} strokeWidth="1" />
      ))}
      {Array.from({ length: count }).map((_, i) => {
        // Rounded to 2dp — Math.cos/sin aren't guaranteed bit-identical
        // between Node's SSR and the browser's V8 (only +-*/ and sqrt are
        // correctly-rounded per IEEE 754; transcendental functions aren't),
        // so an unrounded value here causes a hydration mismatch on the
        // rare tick where server and client resolve the last bit
        // differently — same fix as `seeded()`'s rounding, above.
        const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
        const x = Math.round((center + nodeRadius * Math.cos(angle)) * 100) / 100;
        const y = Math.round((center + nodeRadius * Math.sin(angle)) * 100) / 100;
        return <circle key={i} cx={x} cy={y} r="6" fill="rgb(var(--accent-rgb))" />;
      })}
    </svg>
  );
}

/** Slow-drifting radial gradient, "like air" — same GSAP drift technique
 * already validated for HeroMist, tuned down to 0.2 opacity for the light
 * background here. */
function WhyChooseAmbientDrift() {
  const driftRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = driftRef.current;
    if (!el) return;
    const tween = gsap.to(el, { xPercent: 35, yPercent: 25, scale: 1.15, duration: 50, yoyo: true, repeat: -1, ease: "sine.inOut" });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={driftRef}
      aria-hidden
      className="pointer-events-none absolute -left-1/4 top-0 h-160 w-160 rounded-full opacity-20"
      style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb),0.5), transparent 70%)", filter: blurPx(90) }}
    />
  );
}

/**
 * The white itself has to be the thing that triggers, not a permanently-set
 * background with only the content on top of it (tried first — didn't read
 * as scroll-triggered at all, the section just *was* white the whole time).
 * So the section's own background stays whatever the page already is (dark,
 * inherited, no class needed) and this overlay — an absolutely-positioned
 * white layer — is what fades in as the section scrolls into view, and back
 * out as it scrolls past (`once: false`, not a one-shot reveal — a plain
 * slow cross-fade, not a strobing flicker, per the follow-up correction).
 * The content wrapper right below plays the identical fade on the same
 * trigger, so text and background always arrive/leave together.
 *
 * Fallback: `whileInView` never fires for a renderer that doesn't scroll
 * (see Reveal.tsx), and this section can't use that fix as-is — it's
 * bidirectional (`once: false`), so a permanent `animate="visible"` lock
 * would stop it fading back out once a real visitor scrolls past.
 * `useBidirectionalViewportFallback` (Reveal.tsx) only forces `animate`
 * while the real IntersectionObserver has never once reported in *or* out;
 * the moment it does, the override drops out on that same render and
 * whileInView runs exactly as it always has.
 */
function WhyChooseWhiteFade() {
  const reducedMotion = usePrefersReducedMotion();
  const fallback = useBidirectionalViewportFallback();
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 bg-[#f2f2f5]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: reducedMotion ? 0.4 : 1.4, ease: EASE.primary }}
      {...fallback}
    />
  );
}

function WhyChooseUs() {
  const reducedMotion = usePrefersReducedMotion();
  const fallback = useBidirectionalViewportFallback();

  return (
    <section className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <WhyChooseWhiteFade />
      <WhyChooseAmbientDrift />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: reducedMotion ? 0.4 : 1.4, ease: EASE.primary }}
          {...fallback}
          className="relative text-[#08080a]"
        >
          <div className="relative mx-auto flex max-w-2xl flex-col items-center py-16 text-center lg:py-24">
            <OrbitRing count={WHY_CHOOSE_US.length} />
            <div className="relative z-10">
              <span className="inline-flex items-center rounded-full border border-[#08080a]/15 bg-[#08080a]/5 px-4 py-1.5">
                <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#08080a]/85">
                  Why Boost Web Digital
                </span>
              </span>
              <h2 className={cn(STACK.kickerToHeading, "max-w-lg font-display text-[1.875rem] font-extrabold leading-[1.1] tracking-[-0.01em] sm:text-[2.5rem]")}>
                Why Practices Choose Boost Web Digital Over a Traditional Agency
              </h2>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-x-8 gap-y-12 lg:mt-4">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.id} className="w-full text-center sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
                <div className="flex justify-center">
                  <WhyChooseIcon id={item.id} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{item.heading}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#08080a]/70">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Process — "How We Work." The one reserved scroll-pin slot sitewide
// (docs/12-DESIGN-STANDARDS.md §7) — desktop pins the section for ~300% of
// viewport scroll while a compact numbered rail tracks progress and the
// step copy (left) plus a live citation-network diagram (right) advance in
// lockstep with scroll position. The diagram is the section's signature
// move: the same node/trigonometry motif already used for Market Shift's
// gauges and Why Choose Us's orbit rings, restaged here as the literal
// "your visibility across AI engines" story the copy is describing — not a
// generic dashboard mockup. Mobile and reduced motion get a plain stacked
// list instead — scroll-jacking on touch is a real UX hazard, not just a
// style call, and reduced-motion users shouldn't have scroll hijacked at
// all.
// ---------------------------------------------------------------------------

type ProcessStepId = "scan" | "diagnose" | "fix" | "rescan";

const PROCESS_STEPS: Array<{ id: ProcessStepId; name: string; body: string }> = [
  {
    id: "scan",
    name: "Scan",
    body: "We run fifteen patient-intent questions across four AI engines and score your current visibility. Free, and it needs nothing from you but your practice name.",
  },
  {
    id: "diagnose",
    name: "Diagnose",
    body: "We show you which competitors are being recommended instead of you and the specific, fixable reasons why — entity gaps, missing structured data, review deficits, absent third-party mentions.",
  },
  {
    id: "fix",
    name: "Fix",
    body: "Sixty to ninety days of focused work on entity, schema, reputation and content structure. You see exactly what changed and when.",
  },
  {
    id: "rescan",
    name: "Rescan",
    body: "Same fifteen questions, same four engines, every month. The citation count moves or it doesn't, and you see which.",
  },
];

/** Simple line-art, matching ServiceGraphic/WhyChooseIcon's primitive-only
 * style — no circular badge wrapper. `active` swaps stroke color dim→accent
 * AND draws the mark in (`pathLength`/`strokeDasharray`, the same technique
 * ServiceGraphic/Market Shift's gauges already use for "this just became
 * real/current") rather than a flat color swap — the literal "animated icon
 * that draws" the follow-up feedback asked for. Skips the draw under
 * reduced motion (resolves straight to the end state). */
function ProcessIcon({ id, active, size = 26 }: { id: ProcessStepId; active: boolean; size?: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const color = active ? "rgb(var(--accent-rgb))" : "rgba(255,255,255,0.25)";
  const draw = {
    initial: { pathLength: reducedMotion ? 1 : 0 },
    animate: { pathLength: active ? 1 : reducedMotion ? 1 : 0.001 },
    transition: { duration: reducedMotion ? 0 : 0.5, ease: EASE.primary },
  };
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {id === "scan" && (
        <>
          <motion.circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.75" {...draw} />
          <motion.path d="M17 17L23 23" stroke={color} strokeWidth="1.75" strokeLinecap="round" {...draw} />
        </>
      )}
      {id === "diagnose" && (
        <>
          <motion.path d="M5 8H16M5 14H13M5 20H10" stroke={color} strokeWidth="1.75" strokeLinecap="round" {...draw} />
          <motion.path d="M18 18L21 21L26 14" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...draw} />
        </>
      )}
      {id === "fix" && (
        <>
          <motion.circle cx="14" cy="14" r="5" stroke={color} strokeWidth="1.75" {...draw} />
          {Array.from({ length: 6 }).map((_, i) => {
            // Rounded to 2dp — same hydration-mismatch fix as OrbitRing's
            // nodes (Math.cos/sin aren't guaranteed bit-identical between
            // Node's SSR and the browser's V8).
            const angle = (i * Math.PI) / 3;
            const x1 = Math.round((14 + 7 * Math.cos(angle)) * 100) / 100;
            const y1 = Math.round((14 + 7 * Math.sin(angle)) * 100) / 100;
            const x2 = Math.round((14 + 11 * Math.cos(angle)) * 100) / 100;
            const y2 = Math.round((14 + 11 * Math.sin(angle)) * 100) / 100;
            return <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" {...draw} />;
          })}
        </>
      )}
      {id === "rescan" && (
        <>
          <motion.path d="M22 14a8 8 0 1 1-2.4-5.7" stroke={color} strokeWidth="1.75" strokeLinecap="round" {...draw} />
          <motion.path d="M22 4v5h-5" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...draw} />
        </>
      )}
    </svg>
  );
}

/** Fixed node field for ProcessGraphic — two rings of "AI engine citation"
 * nodes around a center "your practice" node. Coordinates are rounded to 2dp,
 * same hydration-mismatch fix as OrbitRing/ProcessIcon's gear (Math.cos/sin
 * aren't guaranteed bit-identical between Node's SSR and the browser's V8). */
const PROCESS_GRAPHIC_CENTER = 160;
const PROCESS_NODES: Array<{ x: number; y: number; competitor: boolean }> = (() => {
  const nodes: Array<{ x: number; y: number; competitor: boolean }> = [];
  const outerCount = 10;
  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      x: Math.round((PROCESS_GRAPHIC_CENTER + 130 * Math.cos(angle)) * 100) / 100,
      y: Math.round((PROCESS_GRAPHIC_CENTER + 130 * Math.sin(angle)) * 100) / 100,
      competitor: i % 3 === 0,
    });
  }
  const innerCount = 6;
  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2 - Math.PI / 2 + 0.3;
    nodes.push({
      x: Math.round((PROCESS_GRAPHIC_CENTER + 74 * Math.cos(angle)) * 100) / 100,
      y: Math.round((PROCESS_GRAPHIC_CENTER + 74 * Math.sin(angle)) * 100) / 100,
      competitor: i === 1,
    });
  }
  return nodes;
})();
const PROCESS_COMPETITOR_LOOP: Array<[number, number]> = [
  [0, 3],
  [3, 6],
  [6, 9],
  [9, 0],
];

/**
 * The "explanation motion graphic" — a live diagram of AI-engine citation
 * nodes that tells the actual Scan → Diagnose → Fix → Rescan story rather
 * than illustrating it with generic bars or a fake dashboard:
 *   Scan     — a rotating sweep reveals a field of dim, unconnected nodes.
 *   Diagnose — the competitor nodes solidify and link to each other; your
 *              center node stays small and disconnected — the gap.
 *   Fix      — lines draw outward from your center node to the competitor
 *              nodes as it grows and turns accent-colored.
 *   Rescan   — every node connects to center, which now pulses steadily —
 *              the confirmed, monitored state.
 */
function ProcessGraphic({ activeIndex }: { activeIndex: number }) {
  const centerConnected = activeIndex === 3 ? PROCESS_NODES.map((_, i) => i) : activeIndex === 2 ? PROCESS_NODES.map((n, i) => (n.competitor ? i : -1)).filter((i) => i >= 0) : [];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* aspect-square + flex-1/min-h-0 so the graphic shrinks to whatever
          vertical room is actually available (short viewports, laptop
          window heights) instead of a flat px cap that could overflow
          the pinned frame — width follows height via the aspect ratio. */}
      <div className="relative aspect-square max-h-125 w-auto max-w-125 flex-1 min-h-0">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 0deg, transparent 0deg, rgba(var(--accent-rgb),0.4) 30deg, transparent 80deg)" }}
          animate={{ opacity: activeIndex === 0 ? 1 : 0, rotate: 360 }}
          transition={{
            opacity: { duration: 0.6, ease: EASE.primary },
            rotate: { duration: 7, repeat: Infinity, ease: "linear" },
          }}
        />
        <svg viewBox="0 0 320 320" className="relative h-full w-full" aria-hidden>
          {activeIndex === 1 &&
            PROCESS_COMPETITOR_LOOP.map(([a, b], i) => (
              <motion.path
                key={`loop-${a}-${b}`}
                d={`M ${PROCESS_NODES[a].x} ${PROCESS_NODES[a].y} L ${PROCESS_NODES[b].x} ${PROCESS_NODES[b].y}`}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE.primary }}
              />
            ))}

          {activeIndex >= 2 &&
            centerConnected.map((idx, i) => (
              <motion.path
                key={`center-${idx}`}
                d={`M ${PROCESS_GRAPHIC_CENTER} ${PROCESS_GRAPHIC_CENTER} L ${PROCESS_NODES[idx].x} ${PROCESS_NODES[idx].y}`}
                stroke="rgb(var(--accent-rgb))"
                strokeOpacity={0.45}
                strokeWidth={1}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: i * 0.035, ease: EASE.primary }}
              />
            ))}

          {PROCESS_NODES.map((node, i) => {
            const connected = activeIndex === 3 || (activeIndex === 2 && node.competitor);
            const fill = connected
              ? "rgb(var(--accent-rgb))"
              : node.competitor && activeIndex === 1
                ? "rgba(255,255,255,0.9)"
                : node.competitor
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(255,255,255,0.28)";
            return (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r={node.competitor ? 4.5 : 3.5}
                fill={fill}
                animate={activeIndex === 0 ? { opacity: [0.25, 0.9, 0.25] } : { opacity: 1 }}
                transition={
                  activeIndex === 0
                    ? { duration: 2.2, repeat: Infinity, delay: (i % 7) * 0.2, ease: "easeInOut" }
                    : { duration: 0.4 }
                }
              />
            );
          })}

          <motion.circle
            cx={PROCESS_GRAPHIC_CENTER}
            cy={PROCESS_GRAPHIC_CENTER}
            fill={activeIndex >= 2 ? "rgb(var(--accent-rgb))" : "rgba(255,255,255,0.45)"}
            animate={{ r: activeIndex === 3 ? [9, 11, 9] : activeIndex >= 2 ? 9 : 6 }}
            transition={{
              duration: activeIndex === 3 ? 1.8 : 0.4,
              repeat: activeIndex === 3 ? Infinity : 0,
              ease: activeIndex === 3 ? "easeInOut" : EASE.primary,
            }}
          />
        </svg>
      </div>
      <p className="mt-6 shrink-0 text-center font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/30">
        Your visibility across AI engines
      </p>
    </div>
  );
}

function Process() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * gsap.matchMedia() gates the pin to lg+ only (auto-reverts below that —
   * no manual breakpoint bookkeeping needed) and gsap.context() gives a
   * single .revert() that kills the ScrollTrigger cleanly on unmount and on
   * React Strict Mode's double-invoked dev effect. GSAP owns the continuous
   * scrub (the rail's fill bar, scaleX tracking raw scroll progress rather
   * than jumping in quarter-steps — the smoothness the thread is for);
   * React state (fed from onUpdate) owns the discrete step index so the
   * copy/graphic can crossfade declaratively — the same GSAP-drives-
   * continuous / Framer-drives-discrete split already used for Services'
   * cursor trail.
   */
  useEffect(() => {
    if (reducedMotion) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            if (threadRef.current) gsap.set(threadRef.current, { scaleX: self.progress });
            const idx = Math.min(PROCESS_STEPS.length - 1, Math.floor(self.progress * PROCESS_STEPS.length));
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden",
        SECTION_PADDING.compact,
        !reducedMotion && "lg:flex lg:min-h-screen lg:flex-col"
      )}
    >
      <AmbientGlow corner="top-right" duration={90} />
      <Container className={cn(!reducedMotion && "lg:flex lg:flex-1 lg:flex-col")}>
        <RevealGroup as="div">
          <RevealItem>
            <Kicker>The Process</Kicker>
          </RevealItem>
          <RevealItem className={cn(STACK.kickerToHeading, "max-w-2xl")}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              How We Work
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "max-w-2xl")}>
            <p className="text-white/70">
              A transparent, measurable process built around real patient questions. We identify where your practice
              is invisible, uncover why competitors are being recommended, fix the underlying gaps, and continuously
              rescan to prove whether your AI visibility is improving.
            </p>
          </RevealItem>
        </RevealGroup>

        {/* Desktop — pinned rail + copy (left) crossfading in lockstep with
            the live citation-network graphic (right). Both sides are
            permanently-mounted, independently-toggled panels rather than
            AnimatePresence — mode="wait" tied to a value that can change
            every scroll tick caused overlapping mount/unmount cycles that
            never resolved (found via inspecting the actual computed
            opacity, not assumed). Not rendered at all under reduced
            motion — with no scroll-scrub and no click interaction, a
            frozen pin would permanently hide steps 2-4's body copy from a
            reduced-motion desktop visitor; the plain list below covers
            that case instead. */}
        {!reducedMotion && (
          <div className="mt-10 hidden lg:grid lg:flex-1 lg:grid-cols-[minmax(0,420px)_minmax(0,540px)] lg:justify-center lg:gap-16">
            <div className="relative flex h-full flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {PROCESS_STEPS.map((step, i) => (
                    <motion.span
                      key={step.id}
                      animate={{
                        color:
                          activeIndex === i
                            ? "rgb(var(--accent-rgb))"
                            : activeIndex > i
                              ? "rgba(255,255,255,0.55)"
                              : "rgba(255,255,255,0.25)",
                      }}
                      transition={{ duration: 0.35, ease: EASE.primary }}
                      className="font-mono text-sm tabular-nums"
                    >
                      0{i + 1}
                    </motion.span>
                  ))}
                </div>
                {/* The thread — one continuous bar, GSAP-scrubbed directly
                    off raw scroll progress (not stepped per quarter-mark),
                    the same "smooth, physical" motion the vertical version
                    was always meant to read as. */}
                <div className="relative mt-3 h-px w-full bg-white/10">
                  <div
                    ref={threadRef}
                    aria-hidden
                    className="absolute inset-y-0 left-0 h-px w-full origin-left bg-accent"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
              </div>

              <div className="relative min-h-44">
                {PROCESS_STEPS.map((step, i) => (
                  <motion.div
                    key={step.id}
                    animate={{
                      opacity: activeIndex === i ? 1 : 0,
                      y: activeIndex === i ? 0 : activeIndex > i ? -18 : 18,
                    }}
                    transition={{ duration: 0.5, ease: EASE.primary }}
                    className="absolute inset-0"
                    style={{ pointerEvents: activeIndex === i ? "auto" : "none" }}
                  >
                    <div className="flex items-center gap-3">
                      <ProcessIcon id={step.id} active={activeIndex >= i} size={24} />
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">
                        Step {i + 1} of {PROCESS_STEPS.length}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">{step.name}</h3>
                    <p className="mt-3 max-w-md text-white/70">{step.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex h-full items-center justify-center">
              <ProcessGraphic activeIndex={activeIndex} />
            </div>
          </div>
        )}

        {/* Mobile/tablet + reduced motion — plain stacked list, no pin */}
        <RevealGroup
          as="ul"
          trigger="viewport"
          stagger={REVEAL.cardStagger}
          className={cn("mt-16 flex flex-col gap-10", !reducedMotion && "lg:hidden")}
        >
          {PROCESS_STEPS.map((step, i) => (
            <RevealItem as="li" key={step.id}>
              <div className="flex items-center gap-4">
                <ProcessIcon id={step.id} active />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">
                  Step {i + 1} of {PROCESS_STEPS.length}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">{step.name}</h3>
              <p className="mt-2 max-w-md text-white/70">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ — "Frequently Asked Questions About Healthcare Marketing." Five
// questions maximum on the homepage (deeper FAQs belong on each specialty
// hub, per the content brief). Mirrors the established text-left/content-
// right shape already used by AI Visibility Explainer, Process and
// About/Founder — the distinctiveness here comes from execution (the
// accordion's own craft, a sticky CTA column, the plus→× draw) rather than
// a new macro-layout, matching `docs/12-DESIGN-STANDARDS.md` §8's locked
// FAQ personality: "Plain-spoken — accordion only, zero blur/focus
// effects." That's why answers fade on plain opacity/height, not the
// blur-resolve Market Shift's own accordion uses — a deliberate difference,
// not an oversight. FAQPage JSON-LD is generated straight from FAQ_ITEMS
// (single source of truth) for AI Overview/GEO extraction, per the brief.
// The CTA reuses the exact same free-scan offer Process's "Scan" step and
// Pricing's own CTA already describe — one lead-magnet, not a new path.
// ---------------------------------------------------------------------------

const FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: "What is AI visibility, and how is it different from SEO?",
    answer:
      "SEO gets you ranked in a list of links. AI visibility gets you named inside the AI-generated answer that now appears above those links on 88% of health searches. They overlap, but they're optimised differently — AI systems weight entity consistency, structured data and third-party mentions far more heavily than traditional rankings do.",
  },
  {
    question: "How do you measure AI visibility?",
    answer:
      "We ask fifteen patient-intent questions across ChatGPT, Perplexity, Google AI Overviews and Gemini, and count how many times your practice is named. The same questions run against the same engines every month, so the number is directly comparable over time.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "AI citations typically move faster than rankings — often within 30 to 60 days — because the underlying signals can be corrected quickly. Traditional SEO gains usually take longer. We rescan monthly, so you see movement or its absence immediately rather than waiting a quarter.",
  },
  {
    question: "Do you handle patient data? Is this HIPAA-relevant?",
    answer:
      "No. Our work uses publicly available data only — your website, your listings, your reviews and public AI outputs. We don't access patient records, intake forms, call recordings or CRM data, so no business associate agreement is required.",
  },
  {
    question: "Which healthcare specialties do you work with?",
    answer:
      "Hair transplant and restoration is our deepest specialty and where we have a live client. We also work with dental practices, med spas, dermatology clinics, plastic surgery practices and orthodontists, with a separate strategy built for each.",
  },
];

/** Plain plus → × toggle, no circular badge wrapper — matches the
 * ProcessIcon/WhyChooseIcon line-art convention. Draws via rotation, not
 * pathLength, since there's nothing to "arrive" here — it's a persistent
 * control, not a one-time reveal. */
function FaqToggleIcon({ isOpen }: { isOpen: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <motion.line
        x1="10"
        y1="4"
        x2="10"
        y2="16"
        stroke={isOpen ? "rgb(var(--accent-rgb))" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.35, ease: EASE.primary }}
        style={{ transformOrigin: "10px 10px" }}
      />
      <line x1="4" y1="10" x2="16" y2="10" stroke={isOpen ? "rgb(var(--accent-rgb))" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FaqAccordionItem({
  index,
  item,
  isOpen,
  onToggle,
}: {
  index: number;
  item: (typeof FAQ_ITEMS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div className="border-t border-white/8 first:border-t-0">
      <h3 className="leading-none">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="flex gap-5">
            <span className={cn("font-mono text-sm tabular-nums transition-colors duration-300", isOpen ? "text-accent" : "text-white/35")}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={cn("font-display text-lg font-semibold transition-colors duration-300 sm:text-xl", isOpen ? "text-white" : "text-white/70")}>
              {item.question}
            </span>
          </span>
          <span className="text-white/50">
            <FaqToggleIcon isOpen={isOpen} />
          </span>
        </button>
      </h3>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE.primary }}
        className="overflow-hidden"
      >
        <p className="max-w-xl pb-6 pl-11 text-white/60">{item.answer}</p>
      </motion.div>
    </div>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="bottom-left" duration={72} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <div className="lg:flex lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:max-w-sm lg:shrink-0">
            <RevealGroup as="div">
              <RevealItem>
                <Kicker>FAQ</Kicker>
              </RevealItem>
              <RevealItem className={STACK.kickerToHeading}>
                <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
                  Frequently Asked Questions About Healthcare Marketing
                </h2>
              </RevealItem>
              <RevealItem className={cn(STACK.headingToSub, "max-w-sm")}>
                <p className="text-white/60">
                  Can&apos;t find your answer here? Every engagement starts with the same free scan — fifteen
                  patient-intent questions, four AI engines, no call required.
                </p>
              </RevealItem>
              <RevealItem className="mt-8">
                <MagneticButton>Get Your Free AI Visibility Scan</MagneticButton>
              </RevealItem>
            </RevealGroup>
          </div>

          <RevealGroup as="div" className="mt-14 min-w-0 flex-1 lg:mt-0" trigger="viewport" stagger={REVEAL.cardStagger}>
            {FAQ_ITEMS.map((item, i) => (
              <RevealItem key={item.question}>
                <FaqAccordionItem index={i} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page — the complete homepage: Navbar → Hero → Market Shift → AI
// Visibility Explainer → Who We Serve → Services → Why Choose Us → Process
// → Founder → Pricing → FAQ → Footer. LogoMarquee and Testimonials are
// built (kept as components, see their own files) but not rendered here —
// honesty gate: abstract logo marks and testimonial copy would imply real
// clients/quotes we don't have yet.
// ---------------------------------------------------------------------------

export function HomePage() {
  return (
    <>
      <main>
        <GrainOverlay />
        <CursorGlow />
        <div className="relative">
          <ArchitecturalGrid />
          <Navbar />
          <Hero />
        </div>
        <MarketShift />
        <AiVisibilityExplainer />
        <WhoWeServe />
        <Services />
        <WhyChooseUs />
        <Process />
        <Founder />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
