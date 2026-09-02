/**
 * The checker's industry field (PART 1, 2026-09-02 — "open to all" task).
 * Zero imports, same convention as queryBuilder.ts and locations/index.ts —
 * safe for both the server (run/route.ts, leads.ts) and the "use client"
 * CheckerWidget.tsx to import directly.
 *
 * `value` is what's actually submitted, stored in reports.industry, sent
 * to the Sheet, and used for the owner-alert subject prefix and the
 * report's conditional CTA — short and clean on purpose (a Sheet column
 * full of "Healthcare — clinic, hospital, dental, aesthetic" repeated on
 * every row is useless to filter on). `label` is the full text the visitor
 * actually sees in the dropdown, including the brief's own descriptive
 * examples for the three categories broad enough to need one.
 */
export interface IndustryOption {
  value: string;
  label: string;
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { value: "Healthcare", label: "Healthcare — clinic, hospital, dental, aesthetic" },
  { value: "Professional services", label: "Professional services — legal, accounting, consulting" },
  { value: "Home services", label: "Home services — trades, repair, cleaning" },
  { value: "Retail or e-commerce", label: "Retail or e-commerce" },
  { value: "Restaurant, cafe or hospitality", label: "Restaurant, cafe or hospitality" },
  { value: "Education or training", label: "Education or training" },
  { value: "Real estate", label: "Real estate" },
  { value: "Fitness, wellness or salon", label: "Fitness, wellness or salon" },
  { value: "Automotive", label: "Automotive" },
  { value: "Other", label: "Other" },
];

const INDUSTRY_VALUES = new Set(INDUSTRY_OPTIONS.map((o) => o.value));

/** Server-side allowlist check — a native <select> can't submit anything
 * outside its own options from a real browser, but a direct API call can,
 * and the subject line/CTA branch/Sheet column all trust this value. */
export function isValidIndustry(value: string): boolean {
  return INDUSTRY_VALUES.has(value);
}

export const HEALTHCARE_INDUSTRY = "Healthcare";
