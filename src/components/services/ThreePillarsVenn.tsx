"use client";

import { motion } from "framer-motion";
import { CARD_PADDING, CARD_RADIUS, EASE } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * The reference's Venn composition, our tokens/colours. A client component
 * (per spec's "use client" whitelist) because the scroll-in entrance is
 * bespoke — circles scale up from center + fade, callout rises last — a
 * one-signature-per-scene moment distinct enough that reusing the shared
 * Reveal component's default subtle rise+fade would undersell it. Circles
 * themselves breathe via pure CSS (`.pillar-circle`, globals.css,
 * transform-only, staggered per-instance delay) — no JS needed for that
 * part, only for the entrance.
 */
const CIRCLE_STYLE = "pillar-circle absolute h-44 w-44 rounded-full sm:h-64 sm:w-64";
const CIRCLE_BG = "radial-gradient(circle, rgba(var(--accent-rgb),0.65), transparent 72%)";
const CIRCLE_RING = "0 0 0 1px rgba(var(--accent-rgb),0.35)";

export function ThreePillarsVenn() {
  return (
    <div className="relative mx-auto flex h-72 w-full max-w-xs items-center justify-center sm:h-90 sm:max-w-2xl">
      {/* Left circle — AI Search Visibility (GEO). A thin inset ring
          (box-shadow, not border, so it doesn't affect layout) keeps each
          circle's own boundary legible even where fills overlap and blend
          together. */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE.primary }}
        className={cn(CIRCLE_STYLE, "left-[6%] top-[10%] sm:left-[16%] sm:top-[8%]")}
        style={{ background: CIRCLE_BG, boxShadow: CIRCLE_RING, mixBlendMode: "screen", "--pillar-delay": "0s" } as React.CSSProperties}
      />
      {/* Right circle — Healthcare SEO */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.12, ease: EASE.primary }}
        className={cn(CIRCLE_STYLE, "right-[6%] top-[10%] sm:right-[16%] sm:top-[8%]")}
        style={{ background: CIRCLE_BG, boxShadow: CIRCLE_RING, mixBlendMode: "screen", "--pillar-delay": "3.4s" } as React.CSSProperties}
      />
      {/* Bottom-center circle — Reputation Management (the callout card sits above it) */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.24, ease: EASE.primary }}
        className={cn(CIRCLE_STYLE, "bottom-0 left-1/2 -translate-x-1/2")}
        style={{ background: CIRCLE_BG, boxShadow: CIRCLE_RING, mixBlendMode: "screen", "--pillar-delay": "6.8s" } as React.CSSProperties}
      />

      {/* Outer labels, vertically aligned with their circle's own center —
          the three real services (src/lib/services.ts), not the earlier
          placeholder "Technical Expertise"/"Strategic Focus" pair. "AI
          Search Visibility (GEO)" is longer than the placeholder it
          replaced, so it wraps to more lines at the old top-[26%]/max-w-24
          geometry and collides with the callout card on narrow viewports —
          raised and widened at the base breakpoint to clear it; sm+ was
          already fine and is unchanged. */}
      <span className="absolute left-0 top-[8%] max-w-28 text-center font-mono text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/70 sm:top-[18%] sm:max-w-28 sm:text-left sm:text-xs">
        AI Search Visibility (GEO)
      </span>
      <span className="absolute right-0 top-[8%] max-w-28 text-center font-mono text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/70 sm:top-[18%] sm:max-w-28 sm:text-right sm:text-xs">
        Healthcare SEO
      </span>

      {/* Raised callout card over the center overlap — real card styling,
          lifted above the circles both visually (z-index) and literally
          (rises last on scroll-in). */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE.primary }}
        className={cn(
          "card-hairline relative z-10 max-w-64 bg-[#0b0b0f]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
          CARD_RADIUS.standard,
          CARD_PADDING.standard
        )}
      >
        <h3 className="font-display text-base font-semibold text-white">Reputation Management</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          The last gate before a booking, and the one most practices leave to chance.
        </p>
      </motion.div>
    </div>
  );
}
