"use client";

import { useRef, type CSSProperties, type RefObject } from "react";
import { motion, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { useSpotlight } from "@/lib/useSpotlight";
import { cn } from "@/lib/utils";
import { EASE, SPRING, REVEAL, SECTION_PADDING, blurPx } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// Testimonials — PLACEHOLDER CONTENT, explicitly authorized by Ritik for
// design purposes only ("use fake placeholder testimonials for now, will
// change after design completion" — 2026-08-09; extended to include a name,
// practice/brand name, and avatar — 2026-08-09). Per the honesty gate
// (CLAUDE.md / docs/11-HOMEPAGE.md), Kaja Hair Studio is the only real,
// nameable client — every name/practice below is an invented, generic-
// sounding placeholder (not a real identifiable person or business) and
// MUST be swapped for real testimonials, or removed, before this ships.
// Avatars are gradient-monogram circles (reusing the exact per-specialty
// gradient pairs + .tile-gradient animation originally built for Who We
// Serve), not photographs — fabricating a face photo for a placeholder
// person is a materially worse honesty problem than a fabricated name, so
// this stops short of that.
//
// Three glass-card columns, each an infinite zero-seam vertical marquee
// (same doubled-content technique as the horizontal Client Logos marquee,
// rotated 90°) — no 3D tilt. Left/right scroll down, center scrolls up, each
// phase-offset so columns never look synchronized. Edges dissolve via
// gradient mask instead of a hard cut. Hovering a column pauses it (pure CSS
// animation-play-state, see globals.css) so a visitor can actually read a
// card. A cursor-follow accent glow sits behind the grid (lower z-index),
// showing through the cards' own glass translucency rather than sitting on
// top of them.
// ---------------------------------------------------------------------------

const TESTIMONIALS: Array<{
  quote: string;
  name: string;
  brand: string;
  from: string;
  to: string;
}> = [
  {
    quote:
      "Before this, almost every new patient came from a referral. Now people find us searching for a dentist nearby, read through our site, and book directly. Our schedule feels steady in a way it never did before.",
    name: "Sarah Bennett",
    brand: "Maple Street Dental",
    from: "#2563eb",
    to: "#38bdf8",
  },
  {
    quote:
      "What surprised me most is how many patients mention finding us through AI search results now, not just Google. We stopped guessing what people were actually searching for and started ranking for the specific questions they ask.",
    name: "Sarah Bennett",
    brand: "Maple Street Dental",
    from: "#2563eb",
    to: "#38bdf8",
  },
  {
    quote:
      "Our online reviews finally reflect the practice we actually run day to day. Response times changed, review volume grew, and patients tell us they chose us because of what they read before ever stepping through the door.",
    name: "Sarah Bennett",
    brand: "Maple Street Dental",
    from: "#2563eb",
    to: "#38bdf8",
  },
  {
    quote:
      "Our specialty pages actually rank for the specific procedures we want to be known for, not just generic dermatology terms. Patients arrive already understanding what we offer, which makes the first consultation feel like a formality.",
    name: "James Okafor",
    brand: "Clearview Dermatology",
    from: "#f43f5e",
    to: "#e879f9",
  },
  {
    quote:
      "We finally show up when people search for the conditions we actually treat, instead of losing them to bigger clinics with more marketing budget. It changed who calls us and how much they already know before they do.",
    name: "James Okafor",
    brand: "Clearview Dermatology",
    from: "#f43f5e",
    to: "#e879f9",
  },
  {
    quote:
      "Patients arrive already trusting us before the first consultation, because they've already read real explanations of what we do instead of a generic services list. That trust changes how the first appointment actually goes.",
    name: "James Okafor",
    brand: "Clearview Dermatology",
    from: "#f43f5e",
    to: "#e879f9",
  },
  {
    quote:
      "Bookings feel steady now instead of relying on referrals and word of mouth alone. People find the specific treatment they're searching for, read about it in detail, and arrive already decided instead of still comparing options.",
    name: "Priya Nair",
    brand: "Lumière Med Spa",
    from: "#10b981",
    to: "#2dd4bf",
  },
  {
    quote:
      "Search traffic actually converts into consultations now instead of people visiting once and never coming back. We used to get traffic with nothing to show for it — that gap closed once the site matched what we do.",
    name: "Priya Nair",
    brand: "Lumière Med Spa",
    from: "#10b981",
    to: "#2dd4bf",
  },
  {
    quote:
      "Response times on reviews changed how patients see us before they even call to ask a question. People mention in consultations that they read how we handled a concern, and that alone moved them toward booking with us.",
    name: "Priya Nair",
    brand: "Lumière Med Spa",
    from: "#10b981",
    to: "#2dd4bf",
  },
  {
    quote:
      "Our online reputation finally reflects the standard of care we actually provide, instead of a handful of old reviews doing all the talking. Patients research heavily before a consultation, and now what they find matches what they get.",
    name: "Michael Grant",
    brand: "Grant Plastic Surgery Associates",
    from: "#a855f7",
    to: "#6366f1",
  },
  {
    quote:
      "We show up in AI search answers now when people ask about specific procedures nearby, not just in traditional search results. That visibility brought in a kind of patient who had already done real research before contacting us.",
    name: "Michael Grant",
    brand: "Grant Plastic Surgery Associates",
    from: "#a855f7",
    to: "#6366f1",
  },
  {
    quote:
      "We rank for the actual procedures patients search for instead of only broad, generic terms that bring in the wrong kind of inquiry. The consultations we get now are far more aligned with what we specialize in.",
    name: "Michael Grant",
    brand: "Grant Plastic Surgery Associates",
    from: "#a855f7",
    to: "#6366f1",
  },
  {
    quote:
      "Patients mention finding us through AI search now, not just a traditional Google search, which wasn't happening even a year ago. That shift alone has changed how early in their research people are already deciding to call us.",
    name: "David Kim",
    brand: "Kim Hair Restoration Clinic",
    from: "#f59e0b",
    to: "#fb923c",
  },
  {
    quote:
      "The booking flow stopped losing people halfway through the process, which used to happen more often than we liked to admit. Small changes to how the site explained next steps made a real, measurable difference in follow-through.",
    name: "David Kim",
    brand: "Kim Hair Restoration Clinic",
    from: "#f59e0b",
    to: "#fb923c",
  },
  {
    quote:
      "Our online presence finally feels as intentional and considered as the care we actually provide in the clinic. Before, the website felt like an afterthought. Now it's genuinely part of how patients decide to trust us first.",
    name: "David Kim",
    brand: "Kim Hair Restoration Clinic",
    from: "#f59e0b",
    to: "#fb923c",
  },
  {
    quote:
      "New patient forms fill out faster now since the site actually explains what to expect before someone ever calls our office. Fewer people abandon partway through, and the ones who do call already know what we offer.",
    name: "Rachel Torres",
    brand: "Bright Smile Orthodontics",
    from: "#22d3ee",
    to: "#3b82f6",
  },
  {
    quote:
      "The site loads fast enough now that patients actually stay on it long enough to read through our process, instead of bouncing off within a few seconds like they used to on the old version of our website.",
    name: "Rachel Torres",
    brand: "Bright Smile Orthodontics",
    from: "#22d3ee",
    to: "#3b82f6",
  },
  {
    quote:
      "We stopped guessing what patients were actually searching for and started building pages around the real questions people ask before choosing an orthodontist. That shift alone changed which pages bring in the most consultations each month.",
    name: "Rachel Torres",
    brand: "Bright Smile Orthodontics",
    from: "#22d3ee",
    to: "#3b82f6",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Monogram/initials label over the animated two-tone `.tile-gradient` (see
 * globals.css) — used only by TestimonialCard's avatar. */
function GradientTile({
  from,
  to,
  label,
  shapeClassName,
  labelClassName,
}: {
  from: string;
  to: string;
  label: string;
  shapeClassName: string;
  labelClassName: string;
}) {
  return (
    <div className={cn("tile-gradient flex items-center justify-center", shapeClassName)} style={{ "--tile-from": from, "--tile-to": to } as CSSProperties}>
      <span className={cn("font-display", labelClassName)}>{label}</span>
    </div>
  );
}

function TestimonialCard({ quote, name, brand, from, to }: { quote: string; name: string; brand: string; from: string; to: string }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE.primary }}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
    >
      <span aria-hidden className="pointer-events-none absolute -right-1 -top-4 font-display text-6xl text-white/10">
        &rdquo;
      </span>
      <p className="relative text-[0.95rem] leading-relaxed text-white/80">{quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <GradientTile from={from} to={to} label={initials(name)} shapeClassName="h-10 w-10 shrink-0 rounded-full" labelClassName="text-xs text-white/90" />
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="font-mono text-[0.7rem] uppercase tracking-widest text-white/45">{brand}</p>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialColumn({
  items,
  duration,
  reverse,
  phaseOffset,
}: {
  items: typeof TESTIMONIALS;
  duration: number;
  reverse: boolean;
  phaseOffset: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className="h-180 overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
        maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
      }}
    >
      <div
        className="testimonial-track flex flex-col gap-6"
        style={
          {
            "--marquee-name": reverse ? "testimonial-scroll-up" : "testimonial-scroll-down",
            "--marquee-duration": `${duration}s`,
            "--marquee-delay": `-${phaseOffset}s`,
          } as CSSProperties
        }
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} quote={t.quote} name={t.name} brand={t.brand} from={t.from} to={t.to} />
        ))}
      </div>
    </div>
  );
}

const TESTIMONIAL_COLUMN_CONFIG = [
  { duration: 100, reverse: false, phaseOffset: 0 },
  { duration: 130, reverse: true, phaseOffset: 40 },
  { duration: 115, reverse: false, phaseOffset: 20 },
];

/** Cursor-follow accent glow, scoped to the card grid and z-indexed behind
 * it — visible through the cards' own translucent glass rather than sitting
 * in front of them. Reuses useSpotlight exactly as HeroMist/CursorGlow do. */
function TestimonialCursorGlow({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const { smx, smy, sPresence } = useSpotlight(containerRef, SPRING.presenceFade);
  const glowOpacity = useTransform(sPresence, [0, 1], [0, 0.4]);
  const size = 520;
  const left = useTransform(smx, (v) => v - size / 2);
  const top = useTransform(smy, (v) => v - size / 2);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute rounded-full"
      style={{
        left,
        top,
        width: size,
        height: size,
        opacity: glowOpacity,
        background: "radial-gradient(circle, rgba(var(--accent-rgb),0.65), transparent 70%)",
        filter: blurPx(70),
        zIndex: 0,
      }}
    />
  );
}

const TESTIMONIAL_COLUMNS = [TESTIMONIALS.slice(0, 6), TESTIMONIALS.slice(6, 12), TESTIMONIALS.slice(12, 18)];

export function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <section className={cn("overflow-hidden", SECTION_PADDING.compact)}>
      <Container>
        <RevealGroup as="div">
          <RevealItem>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              What Practices Say
            </p>
          </RevealItem>
          <RevealItem className="mt-5">
            <h2 className="max-w-3xl font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Results, in Their Words.
            </h2>
          </RevealItem>
          <RevealItem className="mt-6 max-w-2xl">
            <p className="text-white/70">
              What it sounds like once search, reputation, and the website all start pulling in the same direction.
            </p>
          </RevealItem>
        </RevealGroup>

        {/* Desktop / tablet — three counter-scrolling glass-card columns */}
        <Reveal className="mt-16 hidden md:block">
          <div ref={gridRef} className="relative grid grid-cols-3 gap-6">
            <TestimonialCursorGlow containerRef={gridRef} />
            {TESTIMONIAL_COLUMNS.map((col, i) => (
              <div key={i} className="relative z-10">
                <TestimonialColumn
                  items={col}
                  duration={TESTIMONIAL_COLUMN_CONFIG[i].duration}
                  reverse={TESTIMONIAL_COLUMN_CONFIG[i].reverse}
                  phaseOffset={TESTIMONIAL_COLUMN_CONFIG[i].phaseOffset}
                />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile — flat, static stack (no cursor for hover-pause, and a
            tall single-column loop would just be a slow read on a small
            screen — simplify per §11 Mobile Experience) */}
        <RevealGroup as="ul" trigger="viewport" stagger={REVEAL.cardStagger} className="mt-16 flex flex-col gap-4 md:hidden">
          {TESTIMONIALS.slice(0, 6).map((t, i) => (
            <RevealItem as="li" key={i}>
              <TestimonialCard quote={t.quote} name={t.name} brand={t.brand} from={t.from} to={t.to} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
