"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { MagneticButton, GhostButton } from "@/components/Buttons";
import { REVEAL, GRID_GAP, CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

// Matches the `lg:` breakpoint the mobile tab-select already switches on.
// getServerSnapshot defaults to "desktop" so SSR/hydration keeps emitting all
// three full cards (unchanged, crawlable, no mismatch); a real client-side
// nav (no prior SSR to reconcile against) reads the true viewport on its very
// first render — which is exactly the case that was mounting three ~40-node
// cards (with a MagneticButton's springs on the featured one) to show one.
const DESKTOP_QUERY = "(min-width: 1024px)";
function subscribeDesktop(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}
function getDesktopServerSnapshot() {
  return true;
}
function useIsDesktopViewport() {
  return useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getDesktopServerSnapshot);
}

type PlanId = "visibility" | "growth" | "market-leader";
type BillingCycle = "monthly" | "annual";

const PLANS: Array<{
  id: PlanId;
  name: string;
  monthly: string;
  annual: string;
  badge?: string;
  featured?: boolean;
  forWho: string;
  problem: string;
  outcome: string;
  features: string[];
  bestFor: string;
  mobileOrder: string;
}> = [
  {
    id: "visibility",
    name: "Visibility",
    monthly: "$1,500/month",
    annual: "$18,000/year",
    forWho: "Single-location practices that are invisible in AI search and want to find out what it takes to change that.",
    problem:
      "Patients in your area are asking ChatGPT and Google AI for a recommendation every day, and your name never comes up. You may rank well and still be entirely absent from the answer patients actually read.",
    outcome:
      "Your practice appears in AI answers for your core treatments in your city. You'll know your exact citation count, you'll see it monthly, and you'll know which competitors you're gaining on.",
    features: [
      "Monthly AI visibility scan across ChatGPT, Google AI Overviews, Perplexity and Gemini",
      "Entity and structured data correction",
      "Google Business Profile optimisation",
      "Review response system — 100% of reviews answered",
      "Monthly citation report",
      "Direct access to me",
    ],
    bestFor: "Solo practitioners and single-location clinics doing under $1M a year, or anyone who wants to test us before committing more.",
    mobileOrder: "order-2 lg:order-1",
  },
  {
    id: "growth",
    name: "Growth",
    monthly: "$3,500/month",
    annual: "$42,000/year",
    badge: "Most practices start here",
    featured: true,
    forWho: "Established practices that are visible but not chosen — you get found, and the patient books elsewhere.",
    problem:
      "Visibility alone doesn't fill a calendar. When AI names three clinics and a patient picks one, the decision comes down to reviews, how your practice is described, and whether your website answers the question they're actually asking.",
    outcome:
      "You're named in AI answers for your core treatments and for the comparison and cost questions patients ask right before they book. Your rating is climbing, every review is answered, and your site answers the top twenty questions in your specialty better than any competitor in your market.",
    features: [
      "Expanded scan — 40 patient questions",
      "Content built for AI extraction",
      "Review generation system",
      "Competitor citation tracking",
      "Booking-path conversion review",
      "Third-party mention building",
      "Fortnightly call",
    ],
    bestFor: "Practices doing $1M–$5M a year with real competition in their market.",
    mobileOrder: "order-1 lg:order-2",
  },
  {
    id: "market-leader",
    name: "Market Leader",
    monthly: "$7,500/month",
    annual: "$90,000/year",
    forWho: "Multi-location groups and practices that intend to be the default answer in their market.",
    problem: "In most metros, three or four clinics capture nearly every AI recommendation and everyone else splits what's left.",
    outcome:
      "You are one of the practices AI names first, across multiple treatments and multiple locations. You have data on your market that your competitors don't, and a published presence in your specialty that compounds every month.",
    features: [
      "Up to 5 locations tracked and optimised independently",
      "Full treatment-line coverage",
      "Original research",
      "Digital PR and industry placement",
      "Paid search management where unit economics justify it",
      "Quarterly strategy session",
      "Weekly call",
    ],
    bestFor: "Multi-location groups, DSO-affiliated practices, and practices doing $5M+ a year.",
    mobileOrder: "order-3 lg:order-3",
  },
];

/** Shared filled-pill segmented control, same pattern as the homepage
 * Pricing.tsx tabs / Navbar's underline — rebuilt locally per
 * PricingHeroToggle's own precedent rather than exporting a shared one. */
function SegmentedControl({
  layoutGroupId,
  options,
  value,
  onChange,
  getLabel,
}: {
  layoutGroupId: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
  getLabel: (option: string) => string;
}) {
  return (
    <div role="tablist" className="inline-flex items-center gap-1 rounded-lg border border-white/8 bg-white/3 p-1">
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            className="relative rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId={layoutGroupId}
                className="absolute inset-0 rounded-md bg-white/10"
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
              />
            )}
            <span className={cn("relative", isActive ? "text-white" : "text-white/50 hover:text-white/75")}>{getLabel(option)}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Billing toggle (Monthly/Annual — reacts on every card's price) plus, on
 * mobile only, a plan tab-select so a visitor sees ONE full card instead of
 * scrolling past all three stacked — the desktop 3-column grid is
 * unaffected, all three always render there. Mirrors the mobile scroll-
 * length fix the homepage's Pricing.tsx already solved with one-card-at-a-
 * time, applied here to the full-detail cards instead of a single
 * perpetually-tabbed card.
 */
export function PricingPlansCards() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [mobilePlan, setMobilePlan] = useState<PlanId>("growth");
  const isDesktop = useIsDesktopViewport();

  return (
    <>
      <RevealItem className="flex flex-col items-center gap-4">
        <SegmentedControl
          layoutGroupId="pricing-plans-cycle-highlight"
          options={["monthly", "annual"]}
          value={cycle}
          onChange={(v) => setCycle(v as BillingCycle)}
          getLabel={(v) => (v === "monthly" ? "Monthly" : "Annually")}
        />

        {!isDesktop && (
          <div className="lg:hidden">
            <SegmentedControl
              layoutGroupId="pricing-plans-mobile-tab-highlight"
              options={PLANS.map((p) => p.id)}
              value={mobilePlan}
              onChange={(v) => setMobilePlan(v as PlanId)}
              getLabel={(v) => PLANS.find((p) => p.id === v)?.name ?? v}
            />
          </div>
        )}
      </RevealItem>

      <RevealGroup
        as="ul"
        trigger="viewport"
        stagger={REVEAL.cardStagger}
        className={cn("mt-10 grid w-full grid-cols-1 items-start lg:mt-14 lg:grid-cols-3", GRID_GAP.default)}
      >
        {PLANS.map((plan) => {
          return (
          <RevealItem
            as="li"
            key={plan.id}
            className={cn(plan.mobileOrder, mobilePlan === plan.id ? "block" : "hidden", "lg:block")}
          >
            {/* Content always mounted — CSS (the className above) is what
                hides the non-selected mobile plans, the same as any
                tab/accordion pattern. Previously this was ALSO gated by a
                JS conditional mount (`showContent`), which on a mobile
                viewport post-hydration actually removed two of three
                plans' name/price/features from the DOM entirely — worse
                than an invisible-but-present element, since there was
                nothing left to read at all. SSR always showed all three
                (isDesktop defaults true server-side, see
                useIsDesktopViewport's comment above), so this only ever
                bit a renderer that executes JS at a mobile viewport width
                — which is Google's default (mobile-first indexing). */}
            <div className="relative h-full">
              {plan.featured && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 rounded-full"
                  style={{
                    background: "radial-gradient(ellipse, rgba(var(--accent-rgb),0.28), transparent 70%)",
                    filter: "blur(50px)",
                  }}
                />
              )}
              <div
                className={cn(
                  "flex h-full min-h-220 flex-col border bg-white/[0.03] lg:min-h-240",
                  CARD_RADIUS.feature,
                  CARD_PADDING.feature,
                  plan.featured ? "border-accent/40 bg-white/[0.05] shadow-[0_24px_70px_rgba(var(--accent-rgb),0.18)] lg:-mt-6" : "border-white/8"
                )}
              >
                {plan.badge && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-accent">
                    {plan.badge}
                  </span>
                )}

                <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-white">{plan.name}</h3>
                <div className="mt-2 font-display text-2xl font-bold tabular-nums text-white">
                  {cycle === "monthly" ? plan.monthly : plan.annual}
                </div>

                <p className="mt-4 text-sm text-white/60">{plan.forWho}</p>

                <div className="mt-6 space-y-4 border-t border-white/8 pt-6">
                  <div>
                    <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/40">The problem</span>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{plan.problem}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/40">The outcome</span>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{plan.outcome}</p>
                  </div>
                </div>

                <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/8 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
                        <path d="M3 8.5L6 11.5L13 4.5" stroke="rgb(var(--accent-rgb))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  {plan.featured ? (
                    <MagneticButton className="flex w-full items-center justify-center">Get My Free AI Visibility Report</MagneticButton>
                  ) : (
                    <GhostButton className="inline-flex w-full items-center justify-center">Get My Free AI Visibility Report</GhostButton>
                  )}
                  <p className="mt-4 text-xs text-white/45">
                    <span className="font-medium text-white/60">Best for:</span> {plan.bestFor}
                  </p>
                </div>
              </div>
            </div>
          </RevealItem>
          );
        })}
      </RevealGroup>
    </>
  );
}
