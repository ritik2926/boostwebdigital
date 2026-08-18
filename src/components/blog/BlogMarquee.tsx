"use client";

import { Container } from "@/components/Container";

const MARQUEE_ITEMS = ["AI Search", "Healthcare SEO", "Get Recommended", "Reputation"];

function MarqueeRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="blog-marquee-track flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14" aria-hidden={ariaHidden}>
      {MARQUEE_ITEMS.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center gap-10 font-display text-4xl font-bold text-white/15 sm:gap-14 sm:text-6xl">
          {item}
          <span aria-hidden className="text-accent/35">
            ·
          </span>
        </span>
      ))}
    </div>
  );
}

/** Full-bleed marquee above the final CTA — reuses the zero-seam double-row
 * technique already established by LogoMarquee (HomePage.tsx), via the
 * shared `marquee` keyframe wrapped in `.blog-marquee-track` (globals.css)
 * for pause-on-hover + reduced-motion, which that component doesn't need.
 * Padding is top-only — FinalCTA already carries its own generous top
 * padding, and stacking both would blow past DESIGN-CRAFT.md's section-gap
 * cap (≤200px desktop / ≤120px mobile). */
export function BlogMarquee() {
  return (
    <section className="overflow-hidden pt-10 sm:pt-12 lg:pt-16">
      <Container>
        <div
          className="flex w-full overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <MarqueeRow />
          <MarqueeRow ariaHidden />
        </div>
      </Container>
    </section>
  );
}
