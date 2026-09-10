import { blurPx } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * A static (non-animated) stand-in for AmbientGlow.tsx, for pages that must
 * not import framer-motion at all (currently: /dermatology-marketing/,
 * /dental-marketing/ — see those pages' own comments). AmbientGlow itself
 * pulls in framer-motion transitively (via Reveal.tsx's usePrefersReducedMotion,
 * imported for the reduced-motion check) plus GSAP for the drift loop, so it
 * isn't safe to reuse on a route where the animation library itself is the
 * thing being avoided, not just visible motion. Same visual (one off-center
 * radial accent gradient, ~0.2 peak alpha, flush at the corner, per
 * docs/12-DESIGN-STANDARDS.md §4), just held still — a plain <div>, zero JS,
 * zero animation, fully Server-Component-safe.
 */
export function StaticGlow({
  corner,
  className,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const position = {
    "top-left": "left-0 top-0",
    "top-right": "right-0 top-0",
    "bottom-left": "left-0 bottom-0",
    "bottom-right": "right-0 bottom-0",
  }[corner];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute h-72 w-72 rounded-full sm:h-100 sm:w-100 lg:h-140 lg:w-140", position, className)}
      style={{
        background: "radial-gradient(circle, rgba(var(--accent-rgb),0.2), transparent 65%)",
        filter: blurPx(70),
      }}
    />
  );
}
