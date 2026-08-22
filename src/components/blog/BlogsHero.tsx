import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Purple → blue → transparent radial wash, unique to this hero — recreates
 * the reference's top-band light wash in our own two hues (Testimonials.tsx's
 * validated purple `#a855f7` and our locked accent), not a new brand color.
 * Built inline (bespoke per-page glow) rather than via the shared
 * `AmbientGlow`, which is single-hue and corner-anchored only — precedent
 * for a one-off hero treatment already exists on /about/'s hero.
 *
 * Compact + left-aligned (2026-08-23, featured-split redesign): this is now
 * an introduction to the page rather than the main event — the featured
 * post below carries that job — so padding is cut roughly in half to keep
 * that post visible near the first viewport. Left-aligned rather than
 * centered because the split below it is asymmetric/left-heavy; centering
 * the intro then jumping to a left-heavy layout read as two disconnected
 * compositions, and 12-DESIGN-STANDARDS.md §3 already defaults to
 * left-aligned text for everything after a page's opening hero moment.
 * Copy is unchanged, only padding/alignment.
 */
export function BlogsHero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 lg:pt-28 lg:pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-140 w-280 -translate-x-1/2 -translate-y-1/3"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,85,247,0.22), rgba(59,79,219,0.16) 45%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />

      <Container className="relative flex flex-col items-start text-left">
        <RevealGroup as="div" trigger="mount" stagger={0.1} className="flex flex-col items-start">
          <RevealItem>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #a855f7, rgb(var(--accent-rgb)))" }}>
                Blog
              </span>
            </span>
          </RevealItem>

          <RevealItem className={cn(STACK.kickerToHeading, "max-w-225")}>
            <h1 className="font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.25rem]">
              Notes on AI search, healthcare SEO,
              <br />
              and getting recommended
            </h1>
          </RevealItem>

          <RevealItem className={cn(STACK.headingToSub, "max-w-155")}>
            <p className="text-lg leading-relaxed text-white/65">
              What we&apos;re learning about how patients actually find providers now — and what practices can do
              about it.
            </p>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
