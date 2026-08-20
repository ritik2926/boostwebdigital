"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GRID_GAP } from "@/lib/tokens";

type BillingCycle = "monthly" | "annual";

const PLAN_PRICES: Array<{ name: string; monthly: string; annual: string }> = [
  { name: "Visibility", monthly: "$1,500/mo", annual: "$18,000/yr" },
  { name: "Growth", monthly: "$3,500/mo", annual: "$42,000/yr" },
  { name: "Market Leader", monthly: "$7,500/mo", annual: "$90,000/yr" },
];

/**
 * The one functional, client-isolated piece of the Hero — a Monthly/Annual
 * toggle plus the compact 3-plan price row it controls. Same filled-pill
 * `layoutId`-shared-highlight segmented control already established by
 * `Pricing.tsx`'s currency/plan tabs and `Navbar`'s nav underline, rebuilt
 * locally here rather than exported from `Pricing.tsx` — that component's
 * internal `SegmentedControl` isn't exported, and duplicating this one small
 * pattern is lower-risk than refactoring a homepage section to share it.
 * The full detailed plan cards further down the page show both prices at
 * once as static text (see PricingPlans.tsx), so this toggle's only job is
 * this compact preview row.
 */
export function PricingHeroToggle() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="flex flex-col items-center">
      <div role="radiogroup" aria-label="Billing cycle" className="inline-flex items-center gap-1 rounded-lg border border-white/8 bg-white/3 p-1">
        {(["monthly", "annual"] as const).map((option) => {
          const isActive = cycle === option;
          return (
            <button
              key={option}
              role="radio"
              aria-checked={isActive}
              onClick={() => setCycle(option)}
              className="relative rounded-md px-5 py-2 text-sm font-medium transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="pricing-hero-toggle-highlight"
                  className="absolute inset-0 rounded-md bg-white/10"
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                />
              )}
              <span className={cn("relative", isActive ? "text-white" : "text-white/50 hover:text-white/75")}>
                {option === "monthly" ? "Monthly" : "Annually"}
              </span>
            </button>
          );
        })}
      </div>

      <div className={cn("mt-8 grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3", GRID_GAP.default)}>
        {PLAN_PRICES.map((plan) => (
          <div
            key={plan.name}
            className="rounded-3xl border border-white/8 bg-white/[0.03] px-6 py-5 text-center"
          >
            <div className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">{plan.name}</div>
            <div className="mt-2 font-display text-2xl font-bold tabular-nums text-white sm:text-[1.75rem]">
              {cycle === "monthly" ? plan.monthly : plan.annual}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
