"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/Reveal";

/**
 * Renders the final value by default — correct and visible with no
 * animation ever required to run. A renderer that never scrolls, or
 * never runs JS at all, reads the true number; a wrong number sitting
 * there by default (previously: always started at 0) is worse than a
 * static one, since it's quotable.
 *
 * The reset-to-0 happens ONLY inside the IntersectionObserver callback,
 * not eagerly on mount — an earlier version of this fix reset to 0 as
 * soon as the effect ran and relied on the observer to count back up,
 * which reproduced the exact same bug for any renderer that runs JS but
 * never scrolls (the observer never fires, so it never recovers). If the
 * observer never fires here, `display` simply never leaves its correct
 * starting value. For a real visitor scrolling it into view, the reset
 * happens right as the element crosses into the viewport — it was never
 * visible before that moment anyway, so there's nothing to flash.
 */
export function StatCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const reducedMotion = usePrefersReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      // usePrefersReducedMotion() reports false on the server/first render
      // regardless of the real preference — this forces the correct value
      // on every render where it's confirmed true, not just once.
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;

        setDisplay(0);
        const duration = 1200;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, reducedMotion]);

  return (
    <span ref={ref} className="font-display text-5xl font-extrabold tabular-nums text-white sm:text-6xl">
      {display}
      {suffix}
    </span>
  );
}
