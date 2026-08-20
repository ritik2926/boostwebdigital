"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE, REVEAL } from "@/lib/tokens";

/**
 * The one entrance motion every section on the site uses — a soft rise +
 * scale fade (§6 Motion System). Previously also included a blur→sharp
 * resolve, removed 2026-08-20: `filter: blur()` is only ever rendered
 * correctly once React hydrates and hides it, but the server always ships
 * the blurred "hidden" state regardless of trigger type — mount or
 * viewport, it doesn't matter, since a fast-scrolling user can reach a
 * viewport-triggered section before hydration finishes just as easily as a
 * mount-triggered Hero is visible before it. On a slow connection or a slow
 * phone, that gap is a multi-second visible stuck-blur, and every targeted
 * per-section fix just moved the bug to the next section down. Removing
 * blur from the reveal entirely is the only version of this that's
 * correct regardless of hydration speed, trigger type, or device. Three
 * pieces, composed:
 *
 *   <Reveal>       — standalone; triggers itself (on scroll, or on mount for
 *                    above-the-fold content like the Hero).
 *   <RevealGroup>  — wraps a section; on its own trigger it stagger-triggers
 *                    its direct <RevealItem>/<RevealGroup> children.
 *   <RevealItem>   — a child of RevealGroup; defines no trigger of its own,
 *                    purely inherits the "hidden"/"visible" state.
 *
 * Nest a `<RevealGroup trigger="inherit">` inside another RevealGroup (e.g.
 * a card row) to get a second, tighter stagger among its own children once
 * the outer sequence reaches it — it inherits "visible" instead of
 * self-triggering, so it stays in step with the outer stagger clock.
 */

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

const VIEWPORT = { once: true, margin: "-10% 0px" } as const;

export type RevealTrigger = "viewport" | "mount" | "inherit";

function triggerProps(trigger: RevealTrigger) {
  if (trigger === "inherit") return {};
  if (trigger === "mount") return { initial: "hidden", animate: "visible" };
  return { initial: "hidden", whileInView: "visible", viewport: VIEWPORT };
}

/**
 * Reduced motion drops the y/scale too, per docs/12-DESIGN-STANDARDS.md §9
 * ("resolves to opacity-only"). Full motion keeps the rise + scale — blur
 * is gone from both (see file header).
 */
function useReveal(delay = 0) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = reduced
    ? { hidden: { opacity: 0, y: 0, scale: 1 }, visible: { opacity: 1, y: 0, scale: 1 } }
    : { hidden: { opacity: 0, y: REVEAL.y, scale: REVEAL.scale }, visible: { opacity: 1, y: 0, scale: 1 } };

  const transition = reduced
    ? { duration: 0.5, ease: EASE.primary, delay }
    : { duration: REVEAL.duration, ease: EASE.primary, delay };

  return { variants, transition };
}

export function Reveal({
  children,
  className,
  delay = 0,
  trigger = "viewport",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  trigger?: Exclude<RevealTrigger, "inherit">;
}) {
  const { variants, transition } = useReveal(delay);
  return (
    <motion.div {...triggerProps(trigger)} variants={variants} transition={transition} className={className}>
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = REVEAL.stagger,
  delay = 0,
  trigger = "viewport",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
  stagger?: number;
  delay?: number;
  trigger?: RevealTrigger;
}) {
  const MotionTag = as === "section" ? motion.section : as === "ul" ? motion.ul : motion.div;
  const groupVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <MotionTag {...triggerProps(trigger)} variants={groupVariants} className={className}>
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const { variants, transition } = useReveal();
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag variants={variants} transition={transition} className={className}>
      {children}
    </MotionTag>
  );
}
