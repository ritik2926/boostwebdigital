"use client";

// PLACEHOLDER — no real testimonials exist yet. Every field below is a
// bracketed placeholder and MUST be replaced with a real, attributable
// testimonial, or this section removed, before the page ships.
// Do not fill these with invented names, quotes or ratings.

import { useRef, useState } from "react";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { SECTION_PADDING, STACK, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";

const TESTIMONIALS = [
  { id: "A", name: "[CLIENT NAME]", role: "[ROLE], [PRACTICE NAME]" },
  { id: "B", name: "[CLIENT NAME]", role: "[ROLE], [PRACTICE NAME]" },
  { id: "C", name: "[CLIENT NAME]", role: "[ROLE], [PRACTICE NAME]" },
];

const QUOTE = "[Testimonial quote goes here — replace with a real client testimonial before this page goes live.]";
const RATING = "[X.X]";

function StarRow() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 text-accent/30" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1l2.06 4.44L15 6.18l-3.5 3.42.83 4.9L8 12.14 3.67 14.5l.83-4.9L1 6.18l4.94-.74L8 1z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-white/50">{RATING}</span>
    </div>
  );
}

function MonogramAvatar({ letter }: { letter: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/5 font-display text-lg font-semibold text-white/70">
      {letter}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <div
      data-testimonial-card
      className={cn("w-full shrink-0 snap-start border border-white/8 bg-white/[0.03] sm:w-[calc(50%-12px)]", CARD_RADIUS.standard, CARD_PADDING.standard)}
    >
      <div className="flex items-center gap-4">
        <MonogramAvatar letter={testimonial.id} />
        <div>
          <p className="text-[15px] font-medium text-white">{testimonial.name}</p>
          <p className="text-[13px] text-white/50">{testimonial.role}</p>
        </div>
      </div>
      <p className="mt-6 text-[15px] leading-[1.6] text-white/70">{QUOTE}</p>
      <div className="mt-6">
        <StarRow />
      </div>
    </div>
  );
}

export function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const tickingRef = useRef(false);

  function updateProgress() {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 0 : el.scrollLeft / max);
  }

  // Native `scroll` events can fire far more often than the display can
  // paint; reading scrollWidth/clientWidth/scrollLeft on every single one
  // is the forced-reflow pattern PageSpeed flags. Coalescing to one read
  // per animation frame keeps the same progress-bar feel at a fraction of
  // the reads.
  function handleScroll() {
    if (tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      updateProgress();
      tickingRef.current = false;
    });
  }

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const step = (card?.offsetWidth ?? el.clientWidth) + 24;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className={SECTION_PADDING.spacious}>
      <Container>
        <RevealGroup as="div" className="flex flex-col items-center text-center">
          <RevealItem>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-[2.25rem]">
              Our partners find <span className="italic font-normal text-accent">numerous reasons</span> to love us
            </h2>
          </RevealItem>
        </RevealGroup>

        <Reveal className={STACK.subToContent}>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 text-white/60 transition-colors hover:border-white/25 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 text-white/60 transition-colors hover:border-white/25 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="h-px flex-1 max-w-60 bg-white/10">
              <div className={cn("h-px bg-white transition-[width] duration-200")} style={{ width: `${Math.max(8, progress * 100)}%` }} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
