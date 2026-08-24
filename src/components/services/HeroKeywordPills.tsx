"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { Z_INDEX } from "@/lib/tokens";
import { seeded } from "@/lib/utils";

/**
 * Same floating-pill mechanism as HomePage.tsx's KeywordPill/HERO_KEYWORDS
 * (frosted-glass pill, cursor-proximity opacity, idle GSAP float) — service
 * names here instead of Home's patient-facing phrases, since these are the
 * page's own content. One real difference from Home's version: `handleMove`
 * there calls `getBoundingClientRect()` on every mousemove (a forced-reflow
 * pattern this page's own performance rules exist specifically to avoid —
 * see ContactForm.tsx/TestimonialCarousel.tsx's history). Rect is cached
 * here instead and only re-measured on resize.
 */
/**
 * Text pulled verbatim from the three services' own "what we do" sub-item
 * titles (src/lib/services.ts) — real page content, not invented keywords.
 */
const SERVICE_KEYWORDS: Array<{ text: string; top: string; left: string }> = [
  { text: "Entity Consistency", top: "9%", left: "9%" },
  { text: "Structured Data", top: "6%", left: "60%" },
  { text: "Third-Party Mentions", top: "15%", left: "89%" },
  { text: "Technical Foundations", top: "52%", left: "4%" },
  { text: "Specialty-Specific Content", top: "58%", left: "92%" },
  { text: "Local Visibility", top: "80%", left: "16%" },
  { text: "Review Velocity", top: "83%", left: "66%" },
  { text: "Rating Trajectory", top: "78%", left: "88%" },
];

function KeywordPill({ text, top, left, seed }: { text: string; top: string; left: string; seed: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
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

    const tween = gsap.to(el, { y, rotation, duration, delay, repeat: -1, yoyo: true, ease: "sine.inOut" });
    return () => {
      tween.kill();
    };
  }, [seed]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function measure() {
      rectRef.current = el!.getBoundingClientRect();
    }
    measure();
    window.addEventListener("resize", measure);

    function handleMove(e: MouseEvent) {
      const rect = rectRef.current;
      if (!rect) return;
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      proximity.set(Math.max(0, 1 - dist / 240));
    }
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", measure);
    };
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

export function HeroKeywordPills() {
  return (
    <div className="absolute inset-0" style={{ zIndex: Z_INDEX.ambient }}>
      {SERVICE_KEYWORDS.map((k, i) => (
        <KeywordPill key={k.text} text={k.text} top={k.top} left={k.left} seed={i} />
      ))}
    </div>
  );
}
