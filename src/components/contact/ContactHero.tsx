import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { HeroBackground } from "@/components/contact/HeroBackground";
import { ContactForm } from "@/components/contact/ContactForm";
import { GhostButton } from "@/components/Buttons";
import { cn } from "@/lib/utils";
import { CARD_PADDING, CARD_RADIUS, STACK } from "@/lib/tokens";

const BENEFITS = [
  "We'll respond within 12 hours",
  "We'll sign an NDA if you need one",
  "You talk to the founder, not an account manager",
];

function CheckBadge() {
  return (
    <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-accent/15">
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 7.3L5.8 10L11 4" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-40 lg:pb-24">
      <HeroBackground />
      <Container>
        <Reveal trigger="mount">
          <div
            className={cn(
              "relative overflow-hidden border border-white/8 bg-white/[0.03] shadow-[0_24px_70px_rgba(0,0,0,0.6)]",
              CARD_RADIUS.feature,
              CARD_PADDING.feature
            )}
          >
            {/* 1.4 — inner glow bleeding from the card's bottom-left corner, contained by overflow-hidden above */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-1/4 -left-1/5 h-[75%] w-[62%] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(var(--accent-rgb),0.4), transparent 72%)",
                filter: "blur(50px)",
              }}
            />

            <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[42fr_58fr]">
              {/* LEFT COLUMN */}
              <RevealGroup as="div" trigger="mount" className="flex flex-col" stagger={0.08}>
                <RevealItem>
                  <h1 className="max-w-full font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[2.75rem]">
                    Tell us about your practice
                  </h1>
                </RevealItem>

                <RevealItem className={STACK.subToContent}>
                  <ul className="flex flex-col gap-4">
                    {BENEFITS.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckBadge />
                        <span className="text-[15px] text-white/60">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </RevealItem>

                <RevealItem className="mt-10 flex flex-col gap-2">
                  <a
                    href="mailto:contact@boostwebdigital.com"
                    className="text-base text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
                  >
                    contact@boostwebdigital.com
                  </a>
                  <a
                    href="mailto:ritik@boostwebdigital.com"
                    className="text-sm text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
                  >
                    ritik@boostwebdigital.com <span className="text-white/40">— Founder</span>
                  </a>
                </RevealItem>

                <RevealItem>
                  <p className="mt-6 max-w-65 text-sm text-white/50">Prefer to pick a time instead?</p>

                  <GhostButton href="mailto:contact@boostwebdigital.com" className="mt-4 inline-flex h-10 w-fit">
                    Book a free call
                  </GhostButton>
                </RevealItem>
              </RevealGroup>

              {/* RIGHT COLUMN — form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
