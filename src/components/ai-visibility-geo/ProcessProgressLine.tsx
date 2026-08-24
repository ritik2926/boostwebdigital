"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/components/Reveal";

/**
 * Thin scroll-scrubbed progress line for Section 7 (Process). Deliberately
 * NOT a pin — homepage's Process section is the one reserved scroll-pin
 * slot sitewide (docs/12-DESIGN-STANDARDS.md §7). Same scrub+onUpdate
 * pattern as that section, minus `pin: true`: transform-only (`scaleX`),
 * never width, so it never triggers layout.
 */
export function ProcessProgressLine({ sectionId }: { sectionId: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
    const trigger = document.getElementById(sectionId);
    if (!trigger || !lineRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger,
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1,
        onUpdate: (self) => {
          if (lineRef.current) gsap.set(lineRef.current, { scaleX: self.progress });
        },
      });
    });
    return () => ctx.revert();
  }, [reducedMotion, sectionId]);

  return (
    <div className="h-px w-full bg-white/10">
      <div
        ref={lineRef}
        className="h-px w-full origin-left bg-accent"
        style={{ transform: reducedMotion ? "scaleX(1)" : "scaleX(0)" }}
      />
    </div>
  );
}
