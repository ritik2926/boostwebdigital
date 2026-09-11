import { HEALTHCARE_INDUSTRY } from "@/lib/checker/industries";

/**
 * Maps the floating CTA's condensed 3-field form (website, email,
 * specialty) onto the full field set /api/checker/run actually requires
 * (business_name, industry, keyword, city, region, country) — see that
 * route's `requiredField`/`optionalField` checks. This is the ONLY
 * submission path for that form; it reuses the existing route rather than
 * adding a second one, so every field it doesn't ask the visitor for still
 * needs a real, honest value, not an empty one that would 400.
 *
 * `industry` is fixed to the site's one real bucket for every submission —
 * this is a healthcare-only marketing site, and the checker's `industry`
 * list (src/lib/checker/industries.ts) has exactly one healthcare option
 * that already covers dental/dermatology/aesthetic. The 4-option
 * "Specialty" select the visitor actually sees only drives the keyword
 * below; it is never sent to the API as its own field, because the API has
 * no column for it.
 */
export const SPECIALTIES = ["Dental", "Dermatology", "Med spa", "Other"] as const;
export type Specialty = (typeof SPECIALTIES)[number];

const SPECIALTY_KEYWORDS: Record<Specialty, string> = {
  Dental: "best dentist near me",
  Dermatology: "best dermatologist near me",
  "Med spa": "best med spa near me",
  Other: "best healthcare provider near me",
};

export function keywordForSpecialty(specialty: Specialty): string {
  return SPECIALTY_KEYWORDS[specialty];
}

export const QUICK_ENTRY_INDUSTRY = HEALTHCARE_INDUSTRY;

// This site is US-market-only (see CLAUDE.md) — city/region stay blank
// (the run route already treats a blank city as "no single city to check
// visibility in," per its own PART 1 comment) rather than asking the
// visitor for a third and fourth field this form deliberately omits.
export const QUICK_ENTRY_COUNTRY = "US";

/**
 * Derives a placeholder business name from the one thing the visitor did
 * give us — their own website — rather than asking for a business name as
 * a fourth field. Not a fabricated name: it's literally their domain,
 * lowercased and stripped of "www.". Falls back to the raw input if the
 * URL doesn't parse (the field is still required and non-empty either
 * way, since the API 400s on an empty business_name).
 */
export function deriveBusinessNameFromWebsite(website: string): string {
  const trimmed = website.trim();
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol).hostname.replace(/^www\./i, "");
  } catch {
    return trimmed;
  }
}
