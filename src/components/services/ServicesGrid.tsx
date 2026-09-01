import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { REVEAL, SECTION_PADDING, STACK, GRID_GAP, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { SERVICES } from "@/lib/services";
import { SpotlightField } from "@/components/services/SpotlightField";
import { SpotlightTitleCard } from "@/components/services/SpotlightTitleCard";
import { cn } from "@/lib/utils";

function ServiceBlock({ service, isLast }: { service: (typeof SERVICES)[number]; isLast: boolean }) {
  return (
    <div className={cn(!isLast && "border-b border-white/8 pb-16 lg:pb-20", "pt-16 first:pt-0 lg:pt-20")}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-3">
          <span aria-hidden className="font-display text-6xl font-extrabold text-white/10 sm:text-8xl">
            {service.number}
          </span>
        </Reveal>
        <RevealGroup as="div" className="lg:col-span-9">
          <RevealItem>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              {service.name}
            </h2>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="max-w-2xl text-lg font-medium text-white/90">{service.lead}</p>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "flex max-w-2xl flex-col gap-4 text-white/70")}>
            {service.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </RevealItem>
          {service.id === "ai-visibility" && (
            <RevealItem className={STACK.headingToSub}>
              <Link
                href="/ai-visibility-geo/"
                className="group inline-flex items-center gap-2 font-medium text-white/70 underline-offset-4 hover:text-accent hover:underline"
              >
                See how we approach AI visibility
                <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </RevealItem>
          )}
        </RevealGroup>
      </div>

      <SpotlightField className={STACK.subToContent}>
        <RevealGroup
          as="ul"
          trigger="viewport"
          stagger={REVEAL.cardStagger}
          className={cn("grid grid-cols-1 sm:grid-cols-2", GRID_GAP.default)}
        >
          {service.whatWeDo.map((item) => (
            <RevealItem as="li" key={item.title}>
              <SpotlightTitleCard title={item.title} body={item.body} />
            </RevealItem>
          ))}
        </RevealGroup>
      </SpotlightField>

      {service.callout && (
        <Reveal className={STACK.headingToSub}>
          <p
            className={cn(
              "card-hairline max-w-2xl bg-white/[0.03] text-lg leading-relaxed text-white/80 italic",
              CARD_RADIUS.standard,
              CARD_PADDING.standard
            )}
          >
            {service.callout}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function ServicesGrid() {
  return (
    <section className={SECTION_PADDING.compact}>
      <Container>
        {SERVICES.map((service, i) => (
          <ServiceBlock key={service.id} service={service} isLast={i === SERVICES.length - 1} />
        ))}

        <div className={cn(STACK.subToContent, "grid grid-cols-1 gap-6 border-t border-white/8 pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-20")}>
          <Reveal className="lg:col-span-3">
            <span aria-hidden className="font-display text-6xl font-extrabold text-white/10 sm:text-8xl">
              +
            </span>
          </Reveal>
          <RevealGroup as="div" className="lg:col-span-9">
            <RevealItem>
              <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
                What else we do
              </h2>
            </RevealItem>
            <RevealItem className={cn(STACK.headingToSub, "flex max-w-2xl flex-col gap-4 text-white/70")}>
              <p>
                Websites, content production, campaigns, paid search and reporting automation. All real work, all
                delivered where it serves the three services above.
              </p>
              <p>
                We do not sell any of it as a standalone engagement. If a new site is what stands between you and
                being recommended, we build it. If it is not, we will tell you that instead of quoting for one.
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
