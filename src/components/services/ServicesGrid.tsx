import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { GhostButton, MagneticButton } from "@/components/Buttons";
import { REVEAL, SECTION_PADDING, STACK, GRID_GAP, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { SERVICE_CARDS } from "@/lib/services";
import { SpotlightField } from "@/components/services/SpotlightField";
import { cn } from "@/lib/utils";

function ServiceCard({ service }: { service: (typeof SERVICE_CARDS)[number] }) {
  return (
    <div
      data-spotlight
      className={cn(
        "spotlight-card card-hairline group relative flex h-full min-h-56 flex-col justify-between transition-transform duration-300 hover:-translate-y-1",
        CARD_RADIUS.feature,
        CARD_PADDING.feature,
        service.featured ? "bg-white/[0.05] shadow-[0_20px_50px_rgba(var(--accent-rgb),0.15)]" : "bg-white/[0.03]"
      )}
    >
      <div className="relative z-2">
        <h3 className="font-display text-xl font-semibold text-white">{service.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{service.description}</p>
      </div>
      <div className="relative z-2 mt-6">
        {service.featured ? (
          <MagneticButton href="/contact/" className="inline-flex w-fit items-center">
            Get Service
          </MagneticButton>
        ) : (
          <GhostButton href="/contact/" className="inline-flex w-fit items-center">
            Get Service
          </GhostButton>
        )}
      </div>
    </div>
  );
}

export function ServicesGrid() {
  return (
    <section className={SECTION_PADDING.compact}>
      <Container>
        <RevealGroup as="div" className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealItem>
            <Kicker>Our expertise</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] sm:text-[2.5rem]">
              <span className="text-white">Our expertise, your </span>
              <span className="text-shimmer">growth</span>
            </h2>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="text-white/70">
              From strategy to execution, we offer a full suite of digital services designed to elevate your brand
              and drive results. Discover how we can help your business thrive.
            </p>
          </RevealItem>
        </RevealGroup>

        <SpotlightField className={STACK.subToContent}>
          <RevealGroup
            as="ul"
            trigger="viewport"
            stagger={REVEAL.cardStagger}
            className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", GRID_GAP.default)}
          >
            {SERVICE_CARDS.map((service) => (
              <RevealItem as="li" key={service.id}>
                <ServiceCard service={service} />
              </RevealItem>
            ))}
          </RevealGroup>
        </SpotlightField>

        <Reveal className={cn(STACK.headingToSub, "flex justify-center")}>
          <GhostButton href="/contact/" className="inline-flex w-fit items-center">
            All Service
          </GhostButton>
        </Reveal>
      </Container>
    </section>
  );
}
