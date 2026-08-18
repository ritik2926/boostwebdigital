"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/Reveal";

/** Thin fixed bar at the top of the viewport, fills with scroll progress. */
export function ReadingProgress() {
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  // Reduced motion: track raw scroll progress directly, no spring lag —
  // still reflects real position, just without the smoothing animation.
  const smoothed = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <div className="fixed inset-x-0 top-0 z-(--z-toast) h-[3px] bg-white/8" aria-hidden>
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: reducedMotion ? scrollYProgress : smoothed,
          background: "linear-gradient(90deg, rgb(var(--accent-rgb)), #8b9bff)",
        }}
      />
    </div>
  );
}
