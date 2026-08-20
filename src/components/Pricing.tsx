"use client";

import { useRef, useState, type KeyboardEvent, type MutableRefObject, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RevealGroup, RevealItem, usePrefersReducedMotion } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { AmbientGlow } from "@/components/AmbientGlow";
import { MagneticButton } from "@/components/Buttons";
import { cn } from "@/lib/utils";
import { EASE, SECTION_PADDING, STACK } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// Pricing — one plan card, three tab-switched states, rather than three
// cards side by side: three cards invite feature-by-feature comparison,
// which is a comparison a small agency loses against a larger one. One
// card at a time keeps the visitor evaluating a single outcome, and the
// left-hand value-prop column holds the trust signals steady no matter
// which plan is selected — adapted from a reference layout, rebuilt
// against this site's own system rather than its glass/purple original:
// no backdrop-blur, no gradient-fill buttons, no checkmark-in-pill chips —
// flat borders, `MagneticButton`, accent-hue-only, the same restraint as
// every other section (`feedback_avoid_ai_generated_look`). Tabs and the
// currency toggle reuse the sitewide `layoutId`-shared-highlight technique
// (`Navbar`'s `DesktopNavLinks` sliding underline, generalized to a filled
// pill for a real segmented control) instead of inventing a new
// interaction language. The INR figures are a separate India-market
// price, not an FX conversion of the USD ones — see the disclosure line
// under the toggle; getting this wrong (straight-converting $1,500 to
// ~₹1,30,000) would make the INR tab actively harm conversion there.
// ---------------------------------------------------------------------------

type CurrencyKey = "USD" | "INR";

const CURRENCIES: Record<CurrencyKey, { code: string; symbol: string; locale: string; label: string }> = {
  USD: { code: "USD", symbol: "$", locale: "en-US", label: "USD" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN", label: "INR" },
};

type PlanId = "visibility" | "growth" | "market-leader";

const PLANS: Array<{
  id: PlanId;
  name: string;
  outcome: string;
  desc: string;
  price: Record<CurrencyKey, number>;
  breakEven: Record<CurrencyKey, string>;
  popular: boolean;
  features: string[];
}> = [
  {
    id: "visibility",
    name: "Visibility",
    outcome: "Stop being invisible",
    desc: "For single-location practices that never come up when patients ask AI for a recommendation.",
    price: { USD: 1500, INR: 35000 },
    breakEven: { USD: "2 procedures a year", INR: "4 procedures a year" },
    popular: false,
    features: [
      "Monthly AI scan — ChatGPT, Google AI Overviews, Perplexity, Gemini",
      "15 patient questions tracked every month",
      "Entity and structured data correction",
      "Google Business Profile optimisation",
      "100% of reviews answered",
      "Monthly citation report — the number, and what moved it",
      "Direct access to the founder, not an account manager",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    outcome: "Get chosen, not just found",
    desc: "For established practices that get found and still lose the booking to someone else.",
    price: { USD: 3500, INR: 75000 },
    breakEven: { USD: "5 procedures a year", INR: "8 procedures a year" },
    popular: true,
    features: [
      "Everything in Visibility",
      "40 patient questions tracked — including cost and comparison intent",
      "Content built for AI extraction, published monthly",
      "Active review generation, not just response",
      "Competitor citation tracking — see who wins instead of you",
      "Booking path conversion review",
      "Third-party mention building",
      "Fortnightly strategy call",
    ],
  },
  {
    id: "market-leader",
    name: "Market Leader",
    outcome: "Own the market",
    desc: "For multi-location groups that intend to be the default answer in their market.",
    price: { USD: 7500, INR: 150000 },
    breakEven: { USD: "9 procedures a year", INR: "15 procedures a year" },
    popular: false,
    features: [
      "Everything in Growth",
      "Up to 5 locations tracked and optimised independently",
      "Full treatment-line coverage",
      "Original research published under your practice's name",
      "Digital PR and industry placement",
      "Paid search management",
      "Weekly call plus quarterly strategy session",
      "Guaranteed market exclusivity in your specialty",
    ],
  },
];

type PricingValuePropId = "citations" | "guarantee" | "no-lockin" | "no-data";

const PRICING_VALUE_PROPS: Array<{ id: PricingValuePropId; name: string; desc: string }> = [
  {
    id: "citations",
    name: "Measured in citations, not rankings",
    desc: "Your current agency reports keyword positions. We report how many times AI named your practice this month versus last. Same questions, same engines, every month.",
  },
  {
    id: "guarantee",
    name: "90-day guarantee",
    desc: "If your AI citation count hasn't increased after 90 days, the fourth month is free. We don't guarantee revenue or rankings — nobody can control those honestly.",
  },
  {
    id: "no-lockin",
    name: "Month to month, no lock-in",
    desc: "No twelve-month contract, no setup fee, no cancellation penalty. We'd rather keep you because the numbers move than because the paperwork says you have to stay.",
  },
  {
    id: "no-data",
    name: "No patient data, ever",
    desc: "We work exclusively with public data — your site, listings, reviews and public AI output. No records, no intake forms, no CRM access, so no BAA is required.",
  },
];

/** Simple line-art, matching ProcessIcon/WhyChooseIcon's primitive-only
 * style — no circular badge wrapper. Draws in on scroll (same `pathLength`
 * "arrival" grammar used everywhere else), skipped under reduced motion. */
function PricingValuePropIcon({ id }: { id: PricingValuePropId }) {
  const reducedMotion = usePrefersReducedMotion();
  const draw = {
    initial: { pathLength: reducedMotion ? 1 : 0, opacity: reducedMotion ? 1 : 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: reducedMotion ? 0 : 0.6, ease: EASE.primary },
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      {id === "citations" && (
        <>
          <motion.path d="M6 20V12" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" strokeLinecap="round" {...draw} />
          <motion.path d="M14 20V6" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" strokeLinecap="round" {...draw} />
        </>
      )}
      {id === "guarantee" && (
        <>
          <motion.circle cx="12" cy="12" r="8.5" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" {...draw} />
          <motion.path d="M8.5 12.3l2.3 2.3 4.2-5" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...draw} />
        </>
      )}
      {id === "no-lockin" && (
        <>
          <motion.rect x="5" y="11" width="14" height="10" rx="2" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" {...draw} />
          <motion.path d="M8.5 11V7.5a3.5 3.5 0 016.5-1.8" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" strokeLinecap="round" {...draw} />
        </>
      )}
      {id === "no-data" && (
        <>
          <motion.rect x="5" y="11" width="14" height="10" rx="2" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" {...draw} />
          <motion.path d="M8.5 11V8a3.5 3.5 0 017 0v3" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" strokeLinecap="round" {...draw} />
          <motion.path d="M3.5 3.5l17 17" stroke="rgb(var(--accent-rgb))" strokeWidth="1.75" strokeLinecap="round" {...draw} />
        </>
      )}
    </svg>
  );
}

/** en-IN groups as 1,50,000 (lakh notation) rather than 150,000 — using the
 * wrong grouping on an INR price reads as foreign to an Indian buyer. */
function formatPrice(amount: number, currencyKey: CurrencyKey) {
  const { locale, code } = CURRENCIES[currencyKey];
  return new Intl.NumberFormat(locale, { style: "currency", currency: code, maximumFractionDigits: 0 }).format(amount);
}

/** Shared filled-pill segmented control — the same `layoutId` shared-
 * element slide `Navbar`'s `DesktopNavLinks` uses for its underline,
 * generalized to a solid background so it reads as a real toggle/tab
 * rather than a nav hover state. Flat `bg-white/10`, no gradient fill, no
 * glow. Only Pricing uses this today — kept colocated here rather than a
 * shared file until a second consumer actually needs it. */
function SegmentedControl<T extends string>({
  layoutGroupId,
  options,
  value,
  onChange,
  getLabel,
  role,
  ariaLabel,
  onKeyDown,
  itemRefs,
}: {
  layoutGroupId: string;
  options: T[];
  value: T;
  onChange: (next: T) => void;
  getLabel: (option: T) => ReactNode;
  role: "tablist" | "radiogroup";
  ariaLabel: string;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  itemRefs?: MutableRefObject<Array<HTMLButtonElement | null>>;
}) {
  const itemRole = role === "tablist" ? "tab" : "radio";
  return (
    <div role={role} aria-label={ariaLabel} onKeyDown={onKeyDown} className="inline-flex items-center gap-1 rounded-lg border border-white/8 bg-white/3 p-1">
      {options.map((option, i) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            ref={
              itemRefs
                ? (el) => {
                    itemRefs.current[i] = el;
                  }
                : undefined
            }
            role={itemRole}
            aria-selected={role === "tablist" ? isActive : undefined}
            aria-checked={role === "radiogroup" ? isActive : undefined}
            tabIndex={role === "tablist" ? (isActive ? 0 : -1) : undefined}
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

export function Pricing() {
  const [activePlan, setActivePlan] = useState(1);
  const [currency, setCurrency] = useState<CurrencyKey>("USD");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const plan = PLANS[activePlan];

  /** Arrow-key navigation between tabs — required for a WAI-ARIA compliant
   * tablist; without it the tabs are unusable by keyboard. */
  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (activePlan + direction + PLANS.length) % PLANS.length;
    setActivePlan(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="pricing" className={cn("relative overflow-hidden", SECTION_PADDING.compact)}>
      <AmbientGlow corner="top-right" duration={80} />
      <Container>
        <RevealGroup as="div">
          <RevealItem>
            <Kicker>Pricing</Kicker>
          </RevealItem>
          <RevealItem className={cn(STACK.kickerToHeading, "max-w-2xl")}>
            <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
              Priced Against What a Patient Is Worth, Not Against Other Agencies
            </h2>
          </RevealItem>
          <RevealItem className={cn(STACK.headingToSub, "max-w-2xl")}>
            <p className="text-white/70">
              A single hair restoration procedure is worth $6,000 to $15,000. A full-arch implant case is worth
              $20,000 to $40,000. The only question that matters is how many extra patients it takes to cover the
              fee — so that&apos;s the number we put next to every plan.
            </p>
          </RevealItem>
        </RevealGroup>

        <RevealItem className="mt-10">
          <SegmentedControl
            layoutGroupId="currency-toggle-highlight"
            role="radiogroup"
            ariaLabel="Select currency"
            options={Object.keys(CURRENCIES) as CurrencyKey[]}
            value={currency}
            onChange={setCurrency}
            getLabel={(key) => `${CURRENCIES[key].symbol} ${CURRENCIES[key].label}`}
          />
          {currency === "INR" && (
            <p className="mt-3 max-w-xl text-sm text-white/50">
              INR pricing applies to clinics marketing within India and reflects Indian market rates — it is not a
              currency conversion of the USD plans.
            </p>
          )}
        </RevealItem>

        <div className="mt-14 lg:flex lg:items-start lg:gap-16">
          <ul className="flex flex-col gap-10 lg:max-w-md">
            {PRICING_VALUE_PROPS.map((item) => (
              <RevealItem key={item.id} as="li">
                <div className="flex gap-4">
                  <div className="shrink-0 pt-0.5">
                    <PricingValuePropIcon id={item.id} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                    <p className="mt-2 text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </ul>

          <div className="mt-14 flex-1 lg:mt-0 lg:max-w-xl">
            <div className="rounded-2xl border border-white/8 bg-white/2">
              <SegmentedControl
                layoutGroupId="plan-tab-highlight"
                role="tablist"
                ariaLabel="Pricing plans"
                options={PLANS.map((p) => p.id)}
                value={plan.id}
                onChange={(id) => setActivePlan(PLANS.findIndex((p) => p.id === id))}
                getLabel={(id) => PLANS.find((p) => p.id === id)?.name}
                onKeyDown={handleTabKeyDown}
                itemRefs={tabRefs}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${plan.id}-${currency}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE.primary }}
                  role="tabpanel"
                >
                  <div className="border-t border-white/8 p-6 sm:p-8">
                    {plan.popular && (
                      <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent">
                        Most practices start here
                      </span>
                    )}

                    <div className="flex justify-between gap-4">
                      <div className="max-w-xs">
                        <span className="font-display text-2xl font-semibold tracking-[-0.01em] text-white sm:text-3xl">
                          {plan.name}
                        </span>
                        <p className="mt-1 text-sm font-medium text-accent">{plan.outcome}</p>
                        <p className="mt-3 text-sm text-white/60">{plan.desc}</p>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="whitespace-nowrap font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
                          {formatPrice(plan.price[currency], currency)}
                          <span className="font-display text-lg font-normal text-white/50">/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-l-2 border-accent pl-4">
                      <p className="text-sm text-white/70">
                        Pays for itself at <span className="font-semibold text-white">{plan.breakEven[currency]}</span>.
                      </p>
                    </div>

                    <MagneticButton className="mt-6 w-full">Get My Free AI Visibility Report</MagneticButton>

                    <p className="mt-3 text-center text-xs text-white/40">
                      No call required. You&apos;ll get three specific fixes even if you never hire us.
                    </p>
                  </div>

                  <ul className="border-t border-white/8 p-6 sm:p-8">
                    <li className="pb-4 font-medium text-white">What&apos;s included</li>
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 py-2 text-sm text-white/70">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
                          <path d="M3 8.5L6 11.5L13 4.5" stroke="rgb(var(--accent-rgb))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <RevealItem className="mt-16 max-w-2xl">
          <p className="text-sm text-white/40">
            Ad spend is paid directly to Google or Meta — we never mark up media. One practice per specialty per
            metro. See{" "}
            <Link
              href="/pricing/"
              className="text-white/70 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
            >
              full pricing details
            </Link>{" "}
            for what&apos;s not included.
          </p>
        </RevealItem>
      </Container>
    </section>
  );
}
