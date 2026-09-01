"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/Reveal";
import { EASE } from "@/lib/tokens";

/**
 * The page's one signature moment — see docs/DESIGN-CRAFT.md's "one bold
 * move" rule and the brief's own "spend the entire visual budget on Section
 * 3" instruction. Everything else on this page is deliberately quiet so
 * this is the loudest thing on it.
 *
 * The full answer text is a real, static text node in the server-rendered
 * HTML at all times — the character spans start at opacity:0 (an SSR'd
 * Framer Motion-style initial state, the same "hidden but DOM-present"
 * pattern Reveal.tsx already uses sitewide) and are revealed to opacity:1
 * in sequence. A non-JS crawler reads the finished sentence immediately;
 * opacity never removes text from the accessibility tree the way
 * `display:none` would. Runs once (IntersectionObserver + a started-ref
 * guard, same convention as StatCounter.tsx) and never replays.
 */

const ANSWER_TEXT =
  "Based on their reviews, published specialty pages and how consistently they're described across the web, I'd recommend [Another Practice] for a full-arch consultation in your area.";
const ACCENT_PHRASE = "[Another Practice]";

const MS_PER_CHAR = 28;
const CAPTION_DELAY_MS = 500; // "a beat" after typing completes
const LINE_DELAY_MS = 500; // after the caption
const CTA_DELAY_MS = 600; // after the line, per the brief

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
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const [blockVisible, setBlockVisible] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    // usePrefersReducedMotion() reports `false` on the server/first paint
    // and only settles to the real client value after hydration — reading
    // it into a useState initializer would freeze these at whatever was
    // true during that first render. Reacting to it here instead means a
    // later correction to `true` still reveals everything immediately.
    if (!reducedMotion) return;
    setBlockVisible(true);
    setVisibleChars(CHARACTERS.length);
    setShowCaption(true);
    setShowLine(true);
    setShowCta(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return; // handled above — no typing sequence to run
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        setBlockVisible(true);
        const timers: ReturnType<typeof setTimeout>[] = [];

        // Typing starts once the block's own fade-up (400ms) has settled.
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
          }, 400)
        );

        return () => {
          timers.forEach(clearTimeout);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={containerRef}>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={blockVisible ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4, ease: EASE.primary }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12"
      >
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
      </motion.div>
    </div>
  );
}
