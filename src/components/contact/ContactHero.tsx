import { ContactContainer } from "@/components/contact/ContactContainer";
import { HeroBackground } from "@/components/contact/HeroBackground";
import { ContactForm } from "@/components/contact/ContactForm";
import { GhostButton } from "@/components/Buttons";

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
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40">
      <HeroBackground />
      <ContactContainer>
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.6)] md:p-12">
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
            <div className="flex flex-col">
              <h1 className="max-w-full font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[2.75rem]">
                Tell us about your practice
              </h1>

              <ul className="mt-8 flex flex-col gap-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckBadge />
                    <span className="text-[15px] text-white/60">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <a
                  href="mailto:hello@boostwebdigital.com"
                  className="text-base text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
                >
                  hello@boostwebdigital.com
                </a>
              </div>

              <p className="mt-6 max-w-65 text-sm text-white/50">Prefer to pick a time instead?</p>

              <GhostButton href="mailto:hello@boostwebdigital.com" className="mt-4 inline-flex h-10 w-fit">
                Book a free call
              </GhostButton>
            </div>

            {/* RIGHT COLUMN — form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </ContactContainer>
    </section>
  );
}
