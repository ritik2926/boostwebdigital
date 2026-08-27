"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
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

// Found via Google Search Console's Test Live URL: the rendered screenshot
// came back solid black/blank sitewide, not just below the fold. Cause:
// `whileInView` has no fallback if its IntersectionObserver never fires —
// and it never does for a renderer that doesn't scroll the page. The dark
// theme's background (#08080a) painted fine; every viewport-triggered
// section was sitting at its hidden opacity (confirmed directly: the raw
// SSR HTML already ships `style="opacity:0;transform:translateY(26px)
// scale(0.98)"` on these wrappers, and effective opacity stayed 0 even
// after a full scripted scroll-to-bottom pass in a real headless browser).
// `onViewportEnter` uses the exact same observer as `whileInView` and
// fires the identical instant a real user scrolls a section into view, so
// nothing changes for a normal visit — this timeout only ever matters as a
// backstop for whatever never scrolls there at all.
const VIEWPORT_FALLBACK_MS = 2000;

/**
 * Confirmed live (2026-08-27): even after the timeout fallback above shipped
 * and was verified serving correctly, Search Console's Test Live URL kept
 * showing the same blank render on a fresh re-test. Root cause: this used to
 * gate the fallback on `navigator.webdriver` alone, and that flag is NOT
 * reliably set by Google's renderer — so Googlebot's WRS was silently
 * falling through to the full VIEWPORT_FALLBACK_MS timer, which is longer
 * than its screenshot budget. Matching known crawler/renderer/synthetic-
 * monitoring user-agent strings is the more reliable signal; webdriver is
 * kept as a second, broader net for whatever else DOES set it honestly.
 * Content and links are identical either way — this only ever skips the
 * entrance ANIMATION, never anything a bot vs. a human would each see.
 */
const BOT_USER_AGENT_PATTERN =
  /googlebot|google-inspectiontool|google page rendering|bingbot|duckduckbot|headlesschrome|lighthouse|chrome-lighthouse|pingdom|gtmetrix|prerender|bot|crawler|spider/i;

export function shouldRevealInstantly() {
  if (typeof navigator === "undefined") return false;
  if (navigator.webdriver === true) return true;
  return BOT_USER_AGENT_PATTERN.test(navigator.userAgent);
}

/**
 * The lazy `useState` initializer runs once per environment (server render
 * and the client's hydration render each call it fresh, independently — no
 * shared state crosses that boundary) — on the server `navigator` doesn't
 * exist, so `shouldRevealInstantly()` returns false there regardless, same
 * as always. On the client it CAN see `navigator`, so a detected bot starts
 * this hook already `entered`, before its own first paint, with no timer
 * involved at all — not "fires the 0ms fallback a tick sooner," genuinely
 * pre-entered from the first client render. Framer Motion applies the
 * resolved style in a layout effect (synchronous, pre-paint), so this
 * resolves before the browser — real or a renderer's — ever paints a frame.
 */
export function useViewportEntered() {
  const [entered, setEntered] = useState(() => shouldRevealInstantly());
  const enter = useCallback(() => setEntered(true), []);

  useEffect(() => {
    if (entered) return;
    const timer = setTimeout(enter, VIEWPORT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [entered, enter]);

  const state = entered ? "visible" : "hidden";
  return { initial: state, animate: state, onViewportEnter: enter, viewport: VIEWPORT } as const;
}

/**
 * Same fallback problem as `useViewportEntered` above, but for the rarer
 * bidirectional (`once: false`) `whileInView` sections — HomePage's
 * WhyChooseUs light flip and About's LightBand, both of which fade back out
 * on scroll-away, so a permanent "lock visible" fallback would break that.
 * This only forces `animate` while the real IntersectionObserver has never
 * once reported in *or* out; the instant it does (`onViewportEnter`/
 * `onViewportLeave`, the same observer whileInView itself uses), the
 * override drops out on that same render and whileInView runs unmodified.
 */
export function useBidirectionalViewportFallback() {
  const [hasRealEvent, setHasRealEvent] = useState(false);
  const [fallbackForced, setFallbackForced] = useState(() => shouldRevealInstantly());
  const markRealEvent = useCallback(() => setHasRealEvent(true), []);

  useEffect(() => {
    if (hasRealEvent || fallbackForced) return;
    const timer = setTimeout(() => setFallbackForced(true), VIEWPORT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [hasRealEvent, fallbackForced]);

  return {
    onViewportEnter: markRealEvent,
    onViewportLeave: markRealEvent,
    ...(fallbackForced && !hasRealEvent ? { animate: { opacity: 1 } } : {}),
  };
}

export type RevealTrigger = "viewport" | "mount" | "inherit";

function triggerProps(trigger: Exclude<RevealTrigger, "viewport">) {
  if (trigger === "inherit") return {};
  return { initial: "hidden", animate: "visible" };
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
  // Called unconditionally regardless of `trigger` — Rules of Hooks; unused
  // (and inert, since its own useEffect no-ops after first mount either
  // way) when trigger isn't "viewport".
  const viewportEntered = useViewportEntered();
  const props = trigger === "viewport" ? viewportEntered : triggerProps(trigger);
  return (
    <motion.div {...props} variants={variants} transition={transition} className={className}>
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

  // Called unconditionally regardless of `trigger` — Rules of Hooks; unused
  // when trigger isn't "viewport".
  const viewportEntered = useViewportEntered();
  const props = trigger === "viewport" ? viewportEntered : triggerProps(trigger);

  return (
    <MotionTag {...props} variants={groupVariants} className={className}>
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
