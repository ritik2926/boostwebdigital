"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { blurPx } from "@/lib/tokens";
import { usePrefersReducedMotion } from "@/components/Reveal";

/**
 * Shared ambient background — docs/12-DESIGN-STANDARDS.md §4's Lighting
 * System "breathing glow": one off-center radial accent gradient, 60-90s
 * drift loop, present on every signal scene. One shared implementation
 * rather than a near-duplicate per section; each call site only picks a
 * corner + duration so repeated sections don't read as an identical blob
 * down the page.
 *
 * Tuned to a ~0.2 peak alpha baked directly into a single gradient stop
 * (no separate opacity multiplier), fully faded to transparent by 65% of
 * its OWN radius — well inside its own box — and positioned flush at the
 * corner (`top-0`/`right-0`, no negative outside-offset) so nothing
 * depends on the section's `overflow-hidden` clip to look soft. Still a
 * slow GSAP drift loop, still accent-hue-only, still one per section.
 */
export function AmbientGlow({
  corner,
  duration = 75,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  duration?: number;
}) {
  const driftRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = driftRef.current;
    if (!el) return;
    const tween = gsap.to(el, {
      xPercent: corner.includes("right") ? -15 : 15,
      yPercent: corner.includes("bottom") ? -12 : 12,
      scale: 1.15,
      duration,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion, corner, duration]);

  const position = {
    "top-left": "left-0 top-0",
    "top-right": "right-0 top-0",
    "bottom-left": "left-0 bottom-0",
    "bottom-right": "right-0 bottom-0",
  }[corner];

  return (
    <div
      ref={driftRef}
      aria-hidden
      className={cn("pointer-events-none absolute h-72 w-72 rounded-full sm:h-100 sm:w-100 lg:h-140 lg:w-140", position)}
      style={{
        background: "radial-gradient(circle, rgba(var(--accent-rgb),0.2), transparent 65%)",
        filter: blurPx(70),
      }}
    />
  );
}
