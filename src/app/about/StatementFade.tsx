"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/Reveal";

/**
 * Section 3's signature move: as the statement scrolls through the
 * viewport, a mask boundary sweeps up the text — solid white where the
 * scroll hasn't reached yet, dissolving to transparent above that line.
 * Reduced motion: render fully opaque, no mask at all.
 */
export function StatementFade({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Entrance: dims at 0.2 while approaching, ramps to full opacity by the
  // time it's centred in view.
  const { scrollYProgress: enterProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.4"] });
  const opacity = useTransform(enterProgress, [0, 1], [0.2, 1]);

  // Exit: the mask boundary sweeps up the text as it's scrolled past —
  // solid where the scroll hasn't reached yet, dissolved above that line.
  const { scrollYProgress: exitProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.15"] });
  const fadeStop = useTransform(exitProgress, [0, 1], ["92%", "8%"]);
  const maskImage = useMotionTemplate`linear-gradient(to bottom, white 0%, white ${fadeStop}, transparent 100%)`;

  return (
    <motion.p
      ref={ref}
      style={reducedMotion ? undefined : { opacity, WebkitMaskImage: maskImage, maskImage }}
      className="text-balance font-display text-[2rem] font-semibold leading-[1.2] tracking-[-0.01em] text-white sm:text-[2.75rem] lg:text-[3.5rem]"
    >
      {children}
    </motion.p>
  );
}
