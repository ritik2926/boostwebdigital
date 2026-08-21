"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SPRING, CURSOR_GLOW, Z_INDEX } from "@/lib/tokens";

/**
 * Same mechanism as HomePage.tsx's CursorGlow — a soft accent+white radial
 * glow that trails the cursor (spring-smoothed) while it's over the hero,
 * fading in/out at the section's edges rather than snapping. Home's version
 * calls `getBoundingClientRect()` on every mousemove to test "is the cursor
 * inside the hero"; that's a forced-reflow-in-a-hot-path pattern this page's
 * own performance rules exist to avoid, so the rect is cached here instead
 * and only re-measured on scroll/resize (both far lower-frequency than
 * mousemove, and the hero's viewport position can only change via one of
 * those two).
 */
export function HeroCursorGlow() {
  const heroRef = useRef<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

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
    heroRef.current = document.getElementById("services-hero");
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function measure() {
      rectRef.current = heroRef.current?.getBoundingClientRect() ?? null;
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const rect = rectRef.current;
      if (!rect) return;
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      presence.set(inside ? 1 : 0);
    }
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
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
