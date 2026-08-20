"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE, REVEAL } from "@/lib/tokens";

/**
 * The one entrance motion every section on the site uses (§6 Motion System —
 * "no repeated fade-up as the sole language" holds because this itself
 * combines blur→sharp resolve with a soft rise + scale, not a generic
 * translate-only fade). Three pieces, composed:
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

function subscribeToCoarsePointer(callback: () => void) {
  const query = window.matchMedia("(pointer: coarse)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getCoarsePointerSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function getCoarsePointerServerSnapshot() {
  return false;
}

/**
 * Animating `filter: blur()` is the one part of the reveal that forces a
 * repaint every frame instead of a cheap compositor-only update — fine on
 * desktop GPUs, but on mid/low-end phones it drops enough frames that the
 * whole reveal reads as "blank, then instantly popped in" rather than a
 * smooth fade. Touch devices get the same y/scale/opacity motion, just
 * without the blur term, which is the one actually causing the jank.
 */
function usePrefersCoarsePointer() {
  return useSyncExternalStore(subscribeToCoarsePointer, getCoarsePointerSnapshot, getCoarsePointerServerSnapshot);
}

const VIEWPORT = { once: true, margin: "-10% 0px" } as const;

export type RevealTrigger = "viewport" | "mount" | "inherit";

/**
 * Broadcasts the enclosing group's trigger down to RevealItem/useReveal so
 * blur can be skipped for mount-triggered content structurally (see
 * useReveal below) — this has to be known before any client-only pointer/
 * motion-preference detection runs, since it's about what the *server*
 * renders, not a runtime capability.
 */
const RevealTriggerContext = createContext<RevealTrigger>("viewport");

function triggerProps(trigger: RevealTrigger) {
  if (trigger === "inherit") return {};
  if (trigger === "mount") return { initial: "hidden", animate: "visible" };
  return { initial: "hidden", whileInView: "visible", viewport: VIEWPORT };
}

/**
 * docs/12-DESIGN-STANDARDS.md §9: reduced-motion resolves to opacity-only —
 * no y-translate, no blur transition, not a full disable. Framer's own
 * `reducedMotion="user"` config only guarantees stripping transform, not
 * `filter`, so this is handled explicitly rather than left to that default.
 */
function useReveal(delay = 0, triggerOverride?: RevealTrigger) {
  const reduced = usePrefersReducedMotion();
  const coarsePointer = usePrefersCoarsePointer();
  const contextTrigger = useContext(RevealTriggerContext);
  const groupTrigger = triggerOverride ?? contextTrigger;

  // Mount-triggered content (a page's Hero, the very first thing rendered)
  // is a special case: the coarse-pointer/reduced-motion checks below only
  // take effect *after* hydration runs, because `useSyncExternalStore`'s
  // server snapshot always assumes "not coarse" (there's no way to know a
  // real device's pointer type during SSR). On a slow connection or a slow
  // phone, that gap between "server sends blurred HTML" and "client JS
  // corrects it" is exactly the multi-second visible stuck-blur bug this
  // fixes — a runtime capability check can't solve a problem that happens
  // before runtime capability checks are even possible. Mount content skips
  // blur unconditionally instead, decided at render time from a plain prop,
  // so the server-rendered HTML is never blurred in the first place.
  const skipBlurStructurally = groupTrigger === "mount";

  // Reduced variants explicitly zero y/scale/filter rather than omitting
  // them — `getServerSnapshot` assumes not-reduced, so the very first
  // client render can briefly use the full variants before this hook
  // corrects itself; omitting a property leaves it "uncontrolled" at
  // whatever value that first render left it at instead of resetting it.
  // The coarse-pointer variant omits `filter` entirely rather than pinning
  // it to "blur(0px)" at both ends: Framer still lists a property in the
  // animated CSS properties even when its value never changes, which is
  // enough for Chrome to mark the whole transition non-composited (flagged
  // directly by Lighthouse) — dropping the key keeps this animation to
  // transform + opacity only, both compositor-eligible.
  const variants: Variants = reduced
    ? { hidden: { opacity: 0, y: 0, scale: 1, filter: "blur(0px)" }, visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } }
    : coarsePointer || skipBlurStructurally
      ? { hidden: { opacity: 0, y: REVEAL.y, scale: REVEAL.scale }, visible: { opacity: 1, y: 0, scale: 1 } }
      : {
          hidden: { opacity: 0, y: REVEAL.y, scale: REVEAL.scale, filter: `blur(${REVEAL.blur}px)` },
          visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        };

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
  const { variants, transition } = useReveal(delay, trigger);
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
  // "inherit" means this group takes its animation state from its own
  // parent — it shouldn't also overwrite what trigger-type descendants see,
  // so it re-provides whatever the ambient context already was.
  const ambientTrigger = useContext(RevealTriggerContext);
  const providedTrigger = trigger === "inherit" ? ambientTrigger : trigger;

  return (
    <MotionTag {...triggerProps(trigger)} variants={groupVariants} className={className}>
      <RevealTriggerContext.Provider value={providedTrigger}>{children}</RevealTriggerContext.Provider>
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
