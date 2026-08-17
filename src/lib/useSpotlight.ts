"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/Reveal";
import { SPRING } from "@/lib/tokens";

/**
 * Shared cursor-spotlight tracker: position (spring-smoothed, local to the
 * given element) plus a "presence" spring that's 1 while the cursor is
 * geometrically inside that element's rect and 0 otherwise — fades in/out
 * smoothly rather than snapping. Deliberately NOT mouseenter/mouseleave on
 * the tracked element itself: every consumer here is `pointer-events-none`
 * (so it doesn't block clicks on real content above it), and pointer-events
 * removes an element from hit-testing entirely, meaning it can never
 * receive its own enter/leave events. Bounds-checking inside a single
 * window-level mousemove sidesteps that.
 */
export function useSpotlight(
  ref: RefObject<HTMLElement | null>,
  presenceSpring: { stiffness: number; damping: number } = { stiffness: 70, damping: 22 }
) {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const presence = useMotionValue(0);
  const smx = useSpring(mx, SPRING.magnetic);
  const smy = useSpring(my, SPRING.magnetic);
  const sPresence = useSpring(presence, presenceSpring);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // §9 Accessibility: cursor-follow effects disable entirely under
    // reduced motion rather than resolving to a static position — every
    // consumer here (grid reveal, drifting glows) is purely decorative, so
    // simply never attaching the listener leaves presence/position at their
    // initial "not present" values, which is already the correct hidden
    // state.
    if (reducedMotion) return;
    function handleMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      presence.set(inside ? 1 : 0);
      if (inside) {
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }
    }
    function handleWindowLeave() {
      presence.set(0);
    }
    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleWindowLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleWindowLeave);
    };
  }, [ref, mx, my, presence, reducedMotion]);

  return { smx, smy, sPresence };
}
