"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One shared mousemove handler for an entire card grid (event delegation —
 * a single listener, not one per card) that writes `--mx`/`--my` directly
 * via `element.style.setProperty`, never through React state, so hovering
 * never triggers a re-render. Two things make this reflow-safe, which
 * matters specifically because this page previously had a mobile mount
 * freeze:
 *   1. Never attaches on touch — checked once via matchMedia before adding
 *      any listener, not just hidden via CSS.
 *   2. Each card's `getBoundingClientRect()` is read once per hover session
 *      (cached on first move over that card, cleared on mouseleave) rather
 *      than on every mousemove — a fresh read every event is exactly the
 *      forced-reflow-in-a-hot-path pattern the codebase has already been
 *      burned by (see ContactForm.tsx / TestimonialCarousel.tsx history).
 * Writes are also rAF-throttled so a burst of mousemove events collapses to
 * at most one style write per frame.
 */
export function SpotlightField({ children, className }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const container = containerRef.current;
    if (!container) return;

    const rects = new Map<HTMLElement, DOMRect>();
    let rafId: number | null = null;
    let pendingCard: HTMLElement | null = null;
    let pendingX = 0;
    let pendingY = 0;

    function flush() {
      rafId = null;
      if (!pendingCard) return;
      pendingCard.style.setProperty("--mx", `${pendingX}px`);
      pendingCard.style.setProperty("--my", `${pendingY}px`);
    }

    function handleMove(e: MouseEvent) {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      let rect = rects.get(card);
      if (!rect) {
        rect = card.getBoundingClientRect();
        rects.set(card, rect);
      }
      pendingCard = card;
      pendingX = e.clientX - rect.left;
      pendingY = e.clientY - rect.top;
      if (rafId === null) rafId = requestAnimationFrame(flush);
    }

    function handleLeave(e: MouseEvent) {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
      if (card) rects.delete(card); // invalidate — the layout may have shifted (scroll/resize) by the next hover
    }

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave, true);
    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave, true);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
