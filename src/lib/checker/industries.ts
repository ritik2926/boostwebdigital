/**
 * The checker's industry field (PART 1, 2026-09-02 — "open to all" task).
 * Zero imports, same convention as queryBuilder.ts and locations/index.ts —
 * safe for both the server (run/route.ts, leads.ts) and the "use client"
 * CheckerWidget.tsx to import directly.
 *
 * REWORK (2026-09-02, same day) — the FULL label (including the three
 * categories' descriptive examples) is now what's actually submitted,
 * stored in reports.industry, sent to the Sheet, and used for the report's
 * conditional CTA and the owner alert's WHO block — never abbreviated. The
 * short form below exists ONLY for the owner-alert subject line, via an
 * explicit map, not a truncation rule: "strip after the em dash" was tried
 * first and didn't produce sensible short forms for the options that have
 * no dash at all ("Retail or e-commerce" → "Retail", "Restaurant, cafe or
 * hospitality" → "Hospitality" aren't derivable by any single rule).
 */
export const INDUSTRIES: string[] = [
  "Healthcare — clinic, hospital, dental, aesthetic",
  "Professional services — legal, accounting, consulting",
  "Home services — trades, repair, cleaning",
  "Retail or e-commerce",
  "Restaurant, cafe or hospitality",
  "Education or training",
  "Real estate",
  "Fitness, wellness or salon",
  "Automotive",
  "Other",
];

const INDUSTRY_SET = new Set(INDUSTRIES);

/** Server-side allowlist check — a native <select> can't submit anything
 * outside its own options from a real browser, but a direct API call can,
 * and the subject line/CTA branch/Sheet column all trust this value. */
export function isValidIndustry(value: string): boolean {
  return INDUSTRY_SET.has(value);
}

export const HEALTHCARE_INDUSTRY = "Healthcare — clinic, hospital, dental, aesthetic";

/** Owner-alert subject ONLY — see this file's header comment for why this
 * is an explicit map rather than a computed abbreviation. */
const SHORT_LABELS: Record<string, string> = {
  "Healthcare — clinic, hospital, dental, aesthetic": "Healthcare",
  "Professional services — legal, accounting, consulting": "Professional",
  "Home services — trades, repair, cleaning": "Home services",
  "Retail or e-commerce": "Retail",
  "Restaurant, cafe or hospitality": "Hospitality",
  "Education or training": "Education",
  "Real estate": "Real estate",
  "Fitness, wellness or salon": "Wellness",
  Automotive: "Automotive",
  Other: "Other",
};

/** Falls back to the full label itself if somehow given a value outside
 * the map (e.g. a legacy row saved under the old short-value scheme) —
 * a slightly long subject beats a blank or "undefined" one. */
export function shortIndustryLabel(fullLabel: string): string {
  return SHORT_LABELS[fullLabel] ?? fullLabel;
}
