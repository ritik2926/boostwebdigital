import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { REVEAL, SECTION_PADDING, STACK, GRID_GAP } from "@/lib/tokens";
import { PROCESS_STEPS } from "@/lib/services";
import { SpotlightField } from "@/components/services/SpotlightField";
import { SpotlightTitleCard } from "@/components/services/SpotlightTitleCard";
import { cn } from "@/lib/utils";

/**
 * "How we work" — docs/services-content.md, SECTION — HOW IT WORKS. A
 * plain 4-card grid, not the Home page's scroll-jacked Process pin —
 * 12-DESIGN-STANDARDS.md §7 reserves that one GSAP scroll-jack slot for
 * Home's Process section sitewide, so this section stays passive-scroll.
 * New component — the doc's content doc has no existing section to hold
 * this on /services/ before this pass.
 */
export function ServicesProcess() {
  return (
    <section className={SECTION_PADDING.compact}>
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>Process</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              How we work
            </h2>
          </RevealItem>
        </RevealGroup>

        <SpotlightField className={STACK.subToContent}>
          <RevealGroup
            as="ul"
            trigger="viewport"
            stagger={REVEAL.cardStagger}
            className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", GRID_GAP.default)}
          >
            {PROCESS_STEPS.map((step) => (
              <RevealItem as="li" key={step.number}>
                <SpotlightTitleCard numeral={step.number} title={step.name} body={step.body} />
              </RevealItem>
            ))}
          </RevealGroup>
        </SpotlightField>
      </Container>
    </section>
  );
}
