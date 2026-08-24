"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/tokens";
import { motion } from "framer-motion";

/**
 * Page-scoped replica of HomePage.tsx's private Faq accordion pattern
 * (numbered, single-select, rotating plus/× icon). That implementation is
 * unexported, so it's rebuilt locally rather than imported — same
 * precedent already set by the standalone /faq/ page. Answers stay in the
 * DOM at all times (height-animated, not unmounted) so FAQPage JSON-LD and
 * crawlable text always match what's rendered.
 */

export type GeoFaqItem = {
  question: string;
  answer: React.ReactNode;
};

function FaqToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
      <motion.span
        aria-hidden
        className="absolute h-[1.5px] w-3 bg-white/60"
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.25, ease: EASE.primary }}
      />
      <motion.span
        aria-hidden
        className="absolute h-[1.5px] w-3 bg-white/60"
        animate={{ rotate: open ? -45 : 90 }}
        transition={{ duration: 0.25, ease: EASE.primary }}
      />
    </span>
  );
}

function FaqAccordionItem({
  item,
  index,
  open,
  onToggle,
}: {
  item: GeoFaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  return (
    <div className="border-b border-white/10 py-6">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-6 text-left"
      >
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-white/35">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="text-lg font-medium text-white">{item.question}</h3>
        </span>
        <FaqToggleIcon open={open} />
      </button>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE.primary }}
        className="overflow-hidden"
      >
        <p className="max-w-[65ch] pl-[calc(0.65rem+1rem)] pt-4 text-white/70">{item.answer}</p>
      </motion.div>
    </div>
  );
}

export function GeoFaqAccordion({ items }: { items: GeoFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div>
      {items.map((item, i) => (
        <FaqAccordionItem
          key={item.question}
          item={item}
          index={i}
          open={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
        />
      ))}
    </div>
  );
}
