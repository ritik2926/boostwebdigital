"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/Reveal";

/**
 * The page's one signature moment — see docs/DESIGN-CRAFT.md's "one bold
 * move" rule and the brief's own "spend the entire visual budget on Section
 * 3" instruction. Everything else on this page is deliberately quiet so
 * this is the loudest thing on it.
 *
 * Every piece of this block — the answer text, the caption, the line
 * below, the CTA — defaults to fully visible/typed. That default is what
 * a non-JS crawler sees, what SSR ships, and what a renderer that never
 * lets effects run is stuck with; it must never be an invisible or
 * mid-sequence state. For a real, JS-executing browser, `useLayoutEffect`
 * (not `useEffect`) resets everything to "about to type" and starts the
 * sequence — a layout effect runs synchronously before the browser's
 * first paint, so nothing is ever actually painted in the fully-visible
 * state first; visually this is identical to the block always having
 * started hidden.
 *
 * Previously this was gated by an IntersectionObserver (typing only began
 * once scrolled into view) — but Google's renderer never scrolls, so the
 * sequence never started at all and the text sat at opacity:0 forever.
 * It now starts shortly after mount instead, regardless of scroll
 * position. For a real visitor this mostly reads the same: the ~2-second
 * sequence typically finishes before someone scrolls down two sections to
 * reach this one. The one real difference is a visitor who scrolls here
 * unusually fast may catch the answer already fully typed rather than
 * watching it type — the tradeoff for it being guaranteed to run at all.
 *
 * Timing was shortened from ~28ms/char (~7s total) to ~7ms/char (~2s
 * total, quote itself complete by ~1.4s) — a renderer's JS-execution
 * budget is commonly cited around 5s and isn't guaranteed, and the
 * original pacing risked a screenshot landing mid-typing. Faster reads
 * as a quick reveal rather than a deliberate "natural" type — a real,
 * disclosed visual difference, traded for the sequence reliably finishing
 * well inside any reasonable render budget.
 */

const ANSWER_TEXT =
  "Based on their reviews, published specialty pages and how consistently they're described across the web, I'd recommend [Another Practice] for a full-arch consultation in your area.";
const ACCENT_PHRASE = "[Another Practice]";

const MS_PER_CHAR = 7;
const TYPING_START_DELAY_MS = 150;
const CAPTION_DELAY_MS = 150; // "a beat" after typing completes
const LINE_DELAY_MS = 150; // after the caption
const CTA_DELAY_MS = 250; // after the line

function buildCharacters(text: string, accentPhrase: string) {
  const start = text.indexOf(accentPhrase);
  const end = start + accentPhrase.length;
  return text.split("").map((char, i) => ({
    char,
    accent: start >= 0 && i >= start && i < end,
  }));
}

const CHARACTERS = buildCharacters(ANSWER_TEXT, ACCENT_PHRASE);

export function AnswerBlock({ ctaHref }: { ctaHref: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const [visibleChars, setVisibleChars] = useState(CHARACTERS.length);
  const [showCursor, setShowCursor] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const [showLine, setShowLine] = useState(true);
  const [showCta, setShowCta] = useState(true);

  useLayoutEffect(() => {
    if (reducedMotion) {
      // usePrefersReducedMotion() reports `false` on the server/first
      // render and only settles to the real client value on a later
      // render — if that first (stale) render already fired the branch
      // below and reset everything to "about to type," this is the only
      // thing that ever puts it back. Runs on every render where
      // reducedMotion is confirmedly true, not just once, so it also
      // recovers correctly if the user's OS-level preference changes
      // while the page is open.
      setVisibleChars(CHARACTERS.length);
      setShowCursor(false);
      setShowCaption(true);
      setShowLine(true);
      setShowCta(true);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    // Reset to "about to type" — runs before the browser's first paint, so
    // a real browser never shows the fully-typed state first.
    setVisibleChars(0);
    setShowCaption(false);
    setShowLine(false);
    setShowCta(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setShowCursor(true);
        const startTime = performance.now();

        function tick(now: number) {
          const elapsed = now - startTime;
          const count = Math.min(CHARACTERS.length, Math.floor(elapsed / MS_PER_CHAR));
          setVisibleChars((prev) => (prev === count ? prev : count));
          if (count < CHARACTERS.length) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            setShowCursor(false);
            timers.push(setTimeout(() => setShowCaption(true), CAPTION_DELAY_MS));
            timers.push(setTimeout(() => setShowLine(true), CAPTION_DELAY_MS + LINE_DELAY_MS));
            timers.push(setTimeout(() => setShowCta(true), CAPTION_DELAY_MS + LINE_DELAY_MS + CTA_DELAY_MS));
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      }, TYPING_START_DELAY_MS)
    );

    return () => {
      timers.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
      <p className="font-display text-[1.625rem] font-medium leading-[1.45] text-white sm:text-[2rem] lg:text-[2.15rem]">
        &ldquo;
        {CHARACTERS.map((c, i) => (
          // The cursor is inserted INTO the sequence, immediately before
          // the first not-yet-revealed character, rather than appended
          // after the whole map — invisible (opacity:0) characters still
          // reserve their normal inline layout space, so appending it
          // after all 187 spans would place it (and the closing quote)
          // at the sentence's true end position, wrapped onto whatever
          // line the still-invisible tail flows to. This keeps it
          // visually glued to the last revealed character instead.
          <span key={i} style={{ display: "contents" }}>
            {showCursor && i === visibleChars && (
              <span aria-hidden className="mr-px inline-block h-[1em] w-0.5 translate-y-1 animate-pulse bg-accent" />
            )}
            <span className={c.accent ? "text-accent" : undefined} style={{ opacity: i < visibleChars ? 1 : 0 }}>
              {c.char}
            </span>
          </span>
        ))}
        {showCursor && visibleChars === CHARACTERS.length && (
          <span aria-hidden className="mr-px inline-block h-[1em] w-0.5 translate-y-1 animate-pulse bg-accent" />
        )}
        <span style={{ opacity: visibleChars >= CHARACTERS.length ? 1 : 0 }}>&rdquo;</span>
      </p>

      <p
        className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-white/45 transition-opacity duration-500"
        style={{ opacity: showCaption ? 1 : 0 }}
      >
        Four engines. One answer. Two or three names in it.
      </p>

      <p
        className="mt-8 text-lg font-medium text-white transition-opacity duration-500 sm:text-xl"
        style={{ opacity: showLine ? 1 : 0 }}
      >
        You are either in that sentence or you are not. There is no position four.
      </p>

      <div className="mt-8 transition-opacity duration-500" style={{ opacity: showCta ? 1 : 0 }}>
        <Link
          href={ctaHref}
          data-cta="answer-inline"
          className="group inline-flex items-center gap-2 text-base font-medium text-white/70 underline-offset-4 hover:text-accent hover:underline"
        >
          Find out whose name is in it instead of yours
          <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
