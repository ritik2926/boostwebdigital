"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { EASE, DURATION, SPRING, MAGNETIC, BLUR, OPACITY, Z_INDEX, blurPx } from "@/lib/tokens";

/**
 * DESIGN LAB — not production. Not the homepage. A throwaway sandbox to
 * validate the Signal & Noise visual language live before rebuilding
 * every Tier 1+ component against it. Reusability and polish are
 * deliberately not the goal here — visual/interaction fidelity to
 * docs/12-DESIGN-STANDARDS.md and 00-experience-blueprint.html is.
 */

// ---------------------------------------------------------------------------
// Shared lab chrome
// ---------------------------------------------------------------------------

function LabSection({
  id,
  title,
  note,
  dark = false,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 border-b border-white/[0.08] py-24",
        dark && "bg-black/20"
      )}
    >
      <Container className="relative">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{title}</p>
          {note && <p className="mt-2 max-w-2xl text-sm text-white/60">{note}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Ambient background system — grain, bokeh, particles (§5 Background System)
// ---------------------------------------------------------------------------

function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-[0.035]"
      style={{
        zIndex: Z_INDEX.ambient,
        animation: "grain-shift 8s steps(2) infinite",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function BokehLayer({ count = 2 }: { count?: number }) {
  const [bokehs] = useState(() =>
    Array.from({ length: count }, () => ({
      top: 10 + Math.random() * 60,
      left: 10 + Math.random() * 70,
      size: 180 + Math.random() * 120,
      duration: 50 + Math.random() * 30,
      delay: -Math.random() * 40,
    }))
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: Z_INDEX.ambient }}>
      {bokehs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            filter: blurPx(BLUR.ambient),
            background: "radial-gradient(circle, rgba(var(--accent-rgb),0.16), transparent 70%)",
            animation: `drift ${b.duration}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function ParticleField({ count = 12 }: { count?: number }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 30 + Math.random() * 30,
      delay: -Math.random() * 30,
      opacity: OPACITY.ghost + Math.random() * (OPACITY.faint - OPACITY.ghost),
    }))
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: Z_INDEX.ambient }}>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            filter: blurPx(BLUR.partial),
            animation: `drift ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function BreathingGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        filter: blurPx(BLUR.ambient),
        background: "radial-gradient(circle, rgba(var(--accent-rgb),0.3), transparent 70%)",
        animation: "breathe 5s ease-in-out infinite",
        zIndex: Z_INDEX.ambient,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Global cursor glow — lighting system, Focus Pull's companion (§4)
// ---------------------------------------------------------------------------

function CursorGlow() {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const springX = useSpring(x, SPRING.cursor);
  const springY = useSpring(y, SPRING.cursor);
  const size = 300;
  const left = useTransform(springX, (v) => v - size / 2);
  const top = useTransform(springY, (v) => v - size / 2);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed rounded-full"
      style={{
        left,
        top,
        width: size,
        height: size,
        background: "radial-gradient(circle, rgba(var(--accent-rgb),0.22), transparent 70%)",
        zIndex: Z_INDEX.cursorFx,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Focus Pull — cursor-proximity blur resolve (§ signature interaction 01)
// ---------------------------------------------------------------------------

function NoisePhrase({ text, style }: { text: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const blur = useMotionValue<number>(BLUR.noise);
  const opacity = useMotionValue<number>(OPACITY.ghost);
  const filter = useTransform(blur, (b) => blurPx(b));

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const proximity = Math.max(0, 1 - dist / 140);
      blur.set(BLUR.noise - proximity * BLUR.noise);
      opacity.set(OPACITY.ghost + proximity * (OPACITY.visible - OPACITY.ghost));
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [blur, opacity]);

  return (
    <motion.span
      ref={ref}
      style={{ filter, opacity, ...style }}
      className="absolute select-none whitespace-nowrap font-sans text-base text-white"
    >
      {text}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// Hero — noise dissolving into signal (Scene 01)
// ---------------------------------------------------------------------------

const HERO_PHRASES = [
  { text: "results-driven", top: "10%", left: "4%" },
  { text: "data-backed", top: "72%", left: "6%" },
  { text: "industry-leading", top: "14%", left: "66%" },
  { text: "full-service", top: "80%", left: "58%" },
  { text: "ROI-focused", top: "42%", left: "86%" },
];

function LabHero() {
  return (
    <div className="relative flex min-h-[85vh] items-center overflow-hidden border-b border-white/[0.08]">
      <BokehLayer count={2} />
      <ParticleField count={10} />
      <div className="absolute inset-0" style={{ zIndex: Z_INDEX.ambient }}>
        {HERO_PHRASES.map((p) => (
          <NoisePhrase key={p.text} text={p.text} style={{ top: p.top, left: p.left }} />
        ))}
      </div>
      <Container className="relative" style={{ zIndex: Z_INDEX.base }}>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Design Lab — Hero</p>
        <h1 className="mt-5 max-w-3xl font-display text-[2.5rem] font-medium leading-[1] tracking-[-0.02em] text-white sm:text-[4rem]">
          Healthcare-only marketing,
          <br />
          proven in the open.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/70">
          Move your cursor near the faded phrases scattered behind this
          headline — that&apos;s Focus Pull. The headline itself never blurs;
          it&apos;s signal.
        </p>
      </Container>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typography scale (§2.2)
// ---------------------------------------------------------------------------

function TypographyShowcase() {
  const rows: Array<{ label: string; className: string; sample: string }> = [
    { label: "H1 · Switzer 800", className: "font-display text-[2.5rem] sm:text-[4rem] font-extrabold leading-[1] tracking-[-0.02em]", sample: "Signal over noise" },
    { label: "H2 · Switzer 700", className: "font-display text-[1.875rem] sm:text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em]", sample: "Section heading" },
    { label: "H3 · Switzer 600", className: "font-sans text-[1.25rem] sm:text-[1.375rem] font-semibold leading-[1.25]", sample: "Card / subsection" },
    { label: "Body large · Switzer 400", className: "font-sans text-[1.125rem] leading-[1.6]", sample: "Hero subhead, intro paragraphs read at this size." },
    { label: "Body · Switzer 400", className: "font-sans text-base leading-[1.6]", sample: "Default paragraph copy across the site." },
    { label: "Eyebrow · Geist Mono 600, 0.14em", className: "font-mono text-xs uppercase tracking-[0.14em] text-accent", sample: "Eyebrow label" },
  ];
  return (
    <div className="space-y-8">
      {rows.map((r) => (
        <div key={r.label} className="border-b border-white/[0.06] pb-6">
          <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-white/40">{r.label}</p>
          <p className={cn(r.className, "text-white")}>{r.sample}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Buttons — Magnetic CTA (§7 Interaction System)
// ---------------------------------------------------------------------------

function MagneticButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.magnetic);
  const springY = useSpring(y, SPRING.magnetic);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
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

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white shadow-[var(--glow-whisper)] transition-shadow hover:shadow-[var(--glow-soft)]"
    >
      {children}
    </motion.button>
  );
}

function ButtonShowcase() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <MagneticButton>Book a consultation</MagneticButton>
      <button className="group flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white">
        Learn more
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cards — Depth-of-Field Hover (§ signature interaction 07)
// ---------------------------------------------------------------------------

function DofCardGroup() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cards = [
    { title: "Healthcare SEO", desc: "Technical + on-page, healthcare-specific." },
    { title: "AI Search / GEO", desc: "Answer-engine and generative-engine visibility." },
    { title: "Web Design", desc: "Editorial, premium, conversion-first." },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {cards.map((c, i) => {
        const isHovered = hoveredIndex === i;
        const siblingHovered = hoveredIndex !== null && !isHovered;
        return (
          <motion.div
            key={c.title}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
            animate={{
              filter: blurPx(isHovered ? BLUR.signal : siblingHovered ? BLUR.ambient : BLUR.partial),
              opacity: isHovered ? OPACITY.full : siblingHovered ? OPACITY.muted : OPACITY.visible,
              y: isHovered ? -4 : 0,
            }}
            transition={{ duration: DURATION.reveal, ease: EASE.primary }}
            className={cn(
              "rounded-2xl border p-6 backdrop-blur-xl transition-shadow duration-300",
              "border-white/[0.08] bg-white/[0.03] shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
              isHovered && "border-accent/20 shadow-[0_0_20px_rgba(var(--accent-rgb),0.25)]"
            )}
          >
            <h3 className="font-sans text-lg font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-sm text-white/65">{c.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Glass treatments (§2.4 glassmorphism recipe)
// ---------------------------------------------------------------------------

function GlassShowcase() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {(["resting", "hover", "elevated"] as const).map((state) => (
        <div
          key={state}
          className={cn(
            "rounded-2xl border p-6 backdrop-blur-xl",
            state === "resting" && "border-white/[0.08] bg-white/[0.03] shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
            state === "hover" && "border-white/[0.14] bg-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
            state === "elevated" && "border-white/[0.08] bg-[#0b0b0f]/80 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
          )}
        >
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/40">{state}</p>
          <p className="mt-3 text-sm text-white/70">Translucent surface + border + shadow, per elevation.</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section spacing (§3 Composition Rules)
// ---------------------------------------------------------------------------

function SpacingShowcase() {
  const blocks = [
    { label: "py-24 — mobile section padding", height: "h-24" },
    { label: "py-32 — desktop section padding", height: "h-32" },
    { label: "py-36 — desktop, generous", height: "h-36" },
  ];
  return (
    <div className="space-y-4">
      {blocks.map((b) => (
        <div key={b.label} className="flex items-center gap-4">
          <div className={cn(b.height, "w-2 rounded-full bg-accent/40")} />
          <p className="text-sm text-white/60">{b.label}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live Metric Draw + honest proof spotlight mini-demo (Scene 03)
// ---------------------------------------------------------------------------

function LiveMetricDraw() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 backdrop-blur-xl"
    >
      <BreathingGlow className="-right-10 -top-10 h-56 w-56" />
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Kaja Hair Studio — real result</p>
      <div className="mt-6 flex items-end gap-4">
        <svg width="220" height="70" viewBox="0 0 220 70" className="text-accent">
          <motion.path
            d="M0,55 L40,52 L70,54 L100,30 L140,20 L180,10 L220,6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? 1 : 0 }}
            transition={{ duration: 1.1, ease: EASE.primary }}
          />
        </svg>
        <span className="font-display text-3xl font-medium text-white">Real, cited result</span>
      </div>
      <p className="mt-4 max-w-md text-sm text-white/65">
        This is the only card on the whole site allowed to look this
        confident at rest — because it&apos;s the only one backed by a real
        client. Everything else earns its focus; this one already has it.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aperture transition (signature interaction 08)
// ---------------------------------------------------------------------------

function ApertureDemo() {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="flex h-40 w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]"
    >
      <motion.div
        animate={{ scale: open ? 7 : 1 }}
        transition={{ duration: 0.5, ease: EASE.primary }}
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent"
      >
        <motion.span
          animate={{ opacity: open ? 0 : 1 }}
          className="font-mono text-[0.6rem] text-accent"
        >
          CLICK
        </motion.span>
      </motion.div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  ["hero", "Hero"],
  ["typography", "Typography"],
  ["buttons", "Buttons"],
  ["cards", "Cards"],
  ["spacing", "Spacing"],
  ["background", "Background"],
  ["lighting", "Lighting"],
  ["motion", "Motion"],
  ["glass", "Glass"],
  ["proof", "Proof"],
] as const;

export function DesignLab() {
  return (
    <main className="relative">
      <GrainOverlay />
      <CursorGlow />

      <div className="sticky top-0 z-[var(--z-nav)] border-b border-white/[0.08] bg-black/70 backdrop-blur-xl">
        <Container className="flex items-center gap-6 overflow-x-auto py-3">
          <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.1em] text-white/40">
            Design Lab — not production
          </span>
          {NAV_LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap text-xs text-white/60 hover:text-accent">
              {label}
            </a>
          ))}
        </Container>
      </div>

      <div id="hero">
        <LabHero />
      </div>

      <LabSection id="typography" title="Typography" note="Switzer (sitewide typeface, weight-led hierarchy) + Geist Mono (eyebrows/labels) at the locked scale.">
        <TypographyShowcase />
      </LabSection>

      <LabSection id="buttons" title="Buttons — Magnetic CTA" note="Move your cursor near the button; it pulls within an 80px radius.">
        <ButtonShowcase />
      </LabSection>

      <LabSection id="cards" title="Cards — Depth-of-Field Hover" note="Hover one card: it resolves to full focus, the other two recede further.">
        <DofCardGroup />
      </LabSection>

      <LabSection id="spacing" title="Section spacing">
        <SpacingShowcase />
      </LabSection>

      <LabSection id="background" title="Background system" note="Grain (sitewide, fixed), bokeh + particles (this section only, contained).">
        <div className="relative h-64 overflow-hidden rounded-2xl border border-white/[0.08]">
          <BokehLayer count={3} />
          <ParticleField count={16} />
          <div className="relative flex h-full items-center justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/40">bokeh + particles, contained</p>
          </div>
        </div>
      </LabSection>

      <LabSection id="lighting" title="Lighting — ambient breathing glow">
        <div className="relative h-40 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <BreathingGlow className="left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </LabSection>

      <LabSection id="motion" title="Motion — Aperture Transition" note="Click the circle.">
        <ApertureDemo />
      </LabSection>

      <LabSection id="glass" title="Glass treatments">
        <GlassShowcase />
      </LabSection>

      <LabSection id="proof" title="Honest proof spotlight — Live Metric Draw" dark>
        <LiveMetricDraw />
      </LabSection>
    </main>
  );
}
