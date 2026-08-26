"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MAGNETIC, SPRING } from "@/lib/tokens";

const MotionLink = motion.create(Link);

/**
 * Primary CTA — validated in /design-lab, reused as-is. One per view (§2.1)
 * — never two solid CTAs competing. `href` is optional and new: when given,
 * renders as a real navigable link (`motion(Link)`) instead of a bare
 * `<button>` — needed so the Navbar's CTA can point at /contact/ without a
 * second, differently-styled button. Every existing call site omits `href`
 * and is unaffected. `onClick`/`disabled`/`type` are optional and new too
 * (newsletter subscribe/unsubscribe, both real actions not navigation) —
 * only meaningful on the no-`href` `<button>` branch; every existing
 * `href`-less call site already omitted them and is unaffected.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.magnetic);
  const springY = useSpring(y, SPRING.magnetic);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(relX, relY);
    if (dist < MAGNETIC.radiusPx) {
      const pull = (MAGNETIC.radiusPx - dist) / MAGNETIC.radiusPx;
      x.set((relX / (dist || 1)) * pull * MAGNETIC.maxDisplacementPx);
      y.set((relY / (dist || 1)) * pull * MAGNETIC.maxDisplacementPx);
    } else {
      x.set(0);
      y.set(0);
    }
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  if (href) {
    return (
      <MotionLink
        href={href}
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.97 }}
        className={cn("shiny-cta", className)}
      >
        <span>{children}</span>
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={cn("shiny-cta", className)}
    >
      <span>{children}</span>
    </motion.button>
  );
}

/**
 * Secondary CTA — quiet on purpose; the icon reveal is its one signature
 * move. Reused anywhere the site needs a supportive action next to a
 * primary MagneticButton (never a second solid-accent button, per §2.1).
 * `.ghost-cta` deliberately omits `display` in globals.css — every call
 * site must supply a Tailwind display utility via `className` (e.g.
 * `"inline-flex"` or `"hidden lg:inline-flex"`), or the button silently
 * falls back to `display: inline` and its flex layout breaks.
 */
export function GhostButton({ children, href = "#", className }: { children: ReactNode; href?: string; className?: string }) {
  return (
    <a href={href} className={cn("ghost-cta", className)}>
      <span>{children}</span>
      <svg className="icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
