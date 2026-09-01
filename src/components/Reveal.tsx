"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE, REVEAL } from "@/lib/tokens";

/**
 * The one entrance motion every section on the site uses — a soft rise +
 * scale arrival (§6 Motion System). Content is visible by default; the
 * animation is a layer on top of that, never a precondition for it.
 *
 * Previously the "hidden" variant included `opacity: 0`, which shipped
 * straight into the SSR HTML and only ever resolved once framer-motion's
 * `whileInView`/mount animation actually ran client-side. Google's Test
 * Live URL renderer doesn't scroll the page, so `whileInView` never fired,
 * and the "mount" trigger (used by most page heroes) had no fallback at
 * all if its own transition hadn't finished by the time the renderer's
 * screenshot was taken — the rendered result was a blank/black page with
 * real, indexable text sitting at opacity 0 the whole time.
 *
 * Fix: `hidden` no longer touches opacity — only `y`/`scale` differ from
 * `visible`. A "stuck hidden" element (JS never runs, transition never
 * completes, observer never fires) is now just slightly offset and
 * 2% smaller — fully painted, fully legible, fully indexable — never
 * invisible. That also means the earlier `navigator.webdriver`/user-agent
 * detection and its 2000ms timeout fallback are no longer needed: nothing
 * has to detect a crawler and rush it to a safe state, because every
 * state is already safe. Removed entirely, along with the bidirectional-
 * fade fallback hook — see about/LightBand.tsx and HomePage.tsx's
 * WhyChooseUs, both migrated to CSS `animation-timeline: view()` instead
 * (defaults to visible in browsers without support).
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
 * Reduced motion: hidden and visible are now the same state (opacity was
 * the only thing that used to differ once y/scale drop out per
 * docs/12-DESIGN-STANDARDS.md §9) — nothing to transition, so duration is
 * 0. Full motion keeps the rise + scale; opacity is never part of either.
 */
function useReveal(delay = 0) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = reduced
    ? { hidden: { opacity: 1, y: 0, scale: 1 }, visible: { opacity: 1, y: 0, scale: 1 } }
    : { hidden: { opacity: 1, y: REVEAL.y, scale: REVEAL.scale }, visible: { opacity: 1, y: 0, scale: 1 } };

  const transition = reduced ? { duration: 0 } : { duration: REVEAL.duration, ease: EASE.primary, delay };

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
  as?: "div" | "section" | "ul" | "tbody";
  stagger?: number;
  delay?: number;
  trigger?: RevealTrigger;
}) {
  const MotionTag = as === "section" ? motion.section : as === "ul" ? motion.ul : as === "tbody" ? motion.tbody : motion.div;
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
  as?: "div" | "li" | "tr";
}) {
  const { variants, transition } = useReveal();
  const MotionTag = as === "li" ? motion.li : as === "tr" ? motion.tr : motion.div;
  return (
    <MotionTag variants={variants} transition={transition} className={className}>
      {children}
    </MotionTag>
  );
}
