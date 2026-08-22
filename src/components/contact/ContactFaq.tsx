"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { FAQ_CATEGORIES, FAQ_ITEMS, type FaqCategory } from "@/lib/contact-faq";

function AccordionRow({ item, open, onToggle }: { item: (typeof FAQ_ITEMS)[number]; open: boolean; onToggle: () => void }) {
  const panelId = `faq-panel-${item.question.slice(0, 12).replace(/\s+/g, "-")}`;
  const buttonId = `faq-button-${item.question.slice(0, 12).replace(/\s+/g, "-")}`;

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

export function ContactFaq() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("General");
  const [openQuestion, setOpenQuestion] = useState<string | null>(FAQ_ITEMS[0].question);

  const visibleItems = FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section className={SECTION_PADDING.compact}>
      <Container size="heading" className="mx-auto text-center">
        <RevealGroup as="div">
          <RevealItem>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-[2.25rem]">
              Got questions? We&apos;ve <span className="italic font-normal text-accent">got answers</span>
            </h2>
          </RevealItem>
          <RevealItem className={STACK.headingToSub}>
            <p className="text-[15px] text-white/50">If yours isn&apos;t here, just ask in the form above.</p>
          </RevealItem>
          <RevealItem className={cn(STACK.subToContent, "flex flex-wrap justify-center gap-2")}>
            {FAQ_CATEGORIES.map((category) => {
              const selected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setActiveCategory(category);
                    const firstInCategory = FAQ_ITEMS.find((item) => item.category === category);
                    setOpenQuestion(firstInCategory?.question ?? null);
                  }}
                  className={cn(
                    "chip border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    selected ? "border-accent bg-accent/12 text-accent" : "border-white/8 text-white/60 hover:border-white/20 hover:text-white"
                  )}
                >
                  {category}
                </button>
              );
            })}
          </RevealItem>
        </RevealGroup>
      </Container>

      <Container size="heading" className={cn(STACK.subToContent, "mx-auto text-left")}>
        {visibleItems.map((item) => (
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
