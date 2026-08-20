/**
 * Layered dark atmosphere for /pricing/ — three large, soft, off-center
 * light washes plus a hairline grid texture, all pure CSS (no image/canvas/
 * video, no client JS), anchored to the top of the page behind the Hero and
 * Plans (where the design calls for the strongest glow) and scrolling away
 * normally after that — same `absolute`, section-scoped approach every
 * other background on the site uses (AmbientGlow, HeroBackground). This was
 * originally `fixed`, which combined with three `filter: blur()` layers is
 * a well-known mobile scroll/repaint cost; `absolute` composites once and
 * scrolls with the page like everything else.
 *
 * Uses the site's one locked accent hue (`--accent-rgb`) throughout, not a
 * separate cyan/teal — see CLAUDE.md/12-DESIGN-STANDARDS.md §2.1, "never a
 * second accent." The cool, restrained-glow feeling the brief asks for
 * comes from this hue's own blue-toned register against near-black, not a
 * new color.
 */
export function PricingBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1600px] overflow-hidden bg-[#08080a]">
      {/* Centre/top — strongest wash, sits behind the Hero and bleeds down
          toward the pricing cards below it. */}
      <div
        className="absolute left-1/2 top-[-12%] h-[70vh] w-[130vw] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.22), transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      {/* Broad wash, upper-left. */}
      <div
        className="absolute -left-[20%] top-[8%] h-[55vh] w-[60vw] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.14), transparent 72%)",
          filter: "blur(100px)",
        }}
      />
      {/* Broad wash, upper-right. */}
      <div
        className="absolute -right-[18%] top-[2%] h-[50vh] w-[55vw] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.13), transparent 72%)",
          filter: "blur(95px)",
        }}
      />
      {/* Subtle tech-grid texture — hairline lines only, fades out toward
          the bottom so it never competes with content further down. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(var(--accent-rgb),0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--accent-rgb),0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 60%)",
        }}
      />
      {/* Fade everything to black toward the bottom of the viewport so the
          wash never reads as a flat tint sitting under distant sections. */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, transparent 0%, transparent 40%, #08080a 85%)" }}
      />
    </div>
  );
}
