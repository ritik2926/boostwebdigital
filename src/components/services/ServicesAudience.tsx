import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { REVEAL, SECTION_PADDING, STACK, GRID_GAP } from "@/lib/tokens";
import { AUDIENCE_EXCLUSIONS } from "@/lib/services";
import { SpotlightField } from "@/components/services/SpotlightField";
import { SpotlightTitleCard } from "@/components/services/SpotlightTitleCard";
import { cn } from "@/lib/utils";

/**
 * "Who we work with" + "When we are not the right fit" —
 * docs/services-content.md, SECTION — WHO THIS IS FOR. New component — no
 * existing section on /services/ held this content before this pass.
 */
export function ServicesAudience() {
  return (
    <section className={SECTION_PADDING.compact}>
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>Fit check</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Who we work with
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "flex flex-col gap-4 text-white/70")}>
            <p>
              Medical, dental, aesthetic, dermatology, plastic surgery, orthodontic and hair restoration practices.
              Hair transplant and restoration is our deepest specialty.
            </p>
            <p>
              We work with a small number of practices at a time, one per specialty per metro. If we are already
              working with a competitor in your city, we will tell you on the first call.
            </p>
          </RevealItem>
        </RevealGroup>

        <div className={cn(STACK.subToContent, "mx-auto flex max-w-2xl flex-col items-center text-center")}>
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">When we are not the right fit</h3>
        </div>

        <SpotlightField className={STACK.headingToSub}>
          <RevealGroup
            as="ul"
            trigger="viewport"
            stagger={REVEAL.cardStagger}
            className={cn("grid grid-cols-1 sm:grid-cols-2", GRID_GAP.default)}
          >
            {AUDIENCE_EXCLUSIONS.map((item) => (
              <RevealItem as="li" key={item.name}>
                <SpotlightTitleCard title={item.name} body={item.body} />
              </RevealItem>
            ))}
          </RevealGroup>
        </SpotlightField>
      </Container>
    </section>
  );
}
