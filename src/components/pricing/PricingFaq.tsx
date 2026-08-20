"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { STACK, SECTION_PADDING } from "@/lib/tokens";
import { PRICING_FAQ_ITEMS } from "@/lib/pricing-faq";
import { cn } from "@/lib/utils";

/** Same plain accordion pattern as ContactFaq.tsx's AccordionRow — zero
 * blur/focus effects, per DESIGN-STANDARDS §8's "FAQ: plain-spoken." */
function AccordionRow({ item, open, onToggle }: { item: (typeof PRICING_FAQ_ITEMS)[number]; open: boolean; onToggle: () => void }) {
  const panelId = `pricing-faq-panel-${item.question.slice(0, 12).replace(/\s+/g, "-")}`;
  const buttonId = `pricing-faq-button-${item.question.slice(0, 12).replace(/\s+/g, "-")}`;

  return (
    <div className="border-b border-white/8">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-6 text-left"
        >
          <span className={cn("text-base font-medium transition-colors", open ? "text-accent" : "text-white")}>{item.question}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn("shrink-0 text-white/50 transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows,opacity] duration-[250ms] ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-white/60">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function PricingFaq() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(PRICING_FAQ_ITEMS[0].question);

  return (
    <section className={cn("relative", SECTION_PADDING.spacious)}>
      <Container size="heading" className="mx-auto text-center">
        <RevealGroup as="div">
          <RevealItem>
            <Kicker>Questions</Kicker>
          </RevealItem>
          <RevealItem className={STACK.kickerToHeading}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Pricing Questions
            </h2>
          </RevealItem>
        </RevealGroup>
      </Container>

      <Container size="heading" className={cn(STACK.subToContent, "mx-auto text-left")}>
        {PRICING_FAQ_ITEMS.map((item) => (
          <AccordionRow
            key={item.question}
            item={item}
            open={openQuestion === item.question}
            onToggle={() => setOpenQuestion((current) => (current === item.question ? null : item.question))}
          />
        ))}
      </Container>
    </section>
  );
}
