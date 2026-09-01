import type { ReactNode } from "react";

/**
 * Section 3's signature move: as the statement scrolls through the
 * viewport, a mask boundary sweeps up the text — solid white where the
 * scroll hasn't reached yet, dissolving to transparent above that line.
 *
 * Previously framer-motion's `useScroll`, entirely JS-driven — invisible
 * (opacity 0.2, never higher) for any renderer that never scrolls, which
 * is exactly what Google's Test Live URL renderer does. Now
 * `.scroll-statement-fade` (globals.css): `animation-timeline: view()`
 * drives the same enter-fade/exit-mask shape natively, and the class's
 * own base rule is `opacity: 1` outside the `@supports` block — a
 * renderer without scroll-timeline support, or one that never scrolls at
 * all, sees the full statement at full opacity, unanimated. No JS, no
 * "use client" needed for this component anymore.
 */
export function StatementFade({ children }: { children: ReactNode }) {
  return (
    <p className="scroll-statement-fade text-balance font-display text-[2rem] font-semibold leading-[1.2] tracking-[-0.01em] text-white sm:text-[2.75rem] lg:text-[3.5rem]">
      {children}
    </p>
  );
}
