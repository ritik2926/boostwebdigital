/**
 * Sitewide social profile config (2026-09-11, conversion layer task).
 * Adding a platform once its profile is confirmed live is a one-line edit
 * here — set `url` — never a code change to Footer.tsx or the icon set.
 * `url: null` renders nothing; Footer.tsx filters this list before
 * mapping, so an unconfirmed platform never reaches the DOM at all and
 * never reaches Organization.sameAs in src/lib/schema.ts either.
 *
 * Every URL below is null until confirmed live and active — a dead
 * profile linked from the footer is a credibility leak, and the same URL
 * in sameAs actively hurts entity confidence rather than helping it. See
 * this task's own report for exactly which platforms are still pending.
 */
export interface SocialLink {
  id: string;
  /** Real platform name, used in the aria-label ("Boost Web Digital on
   * LinkedIn") — never a generic "social link". */
  platform: string;
  url: string | null;
}

export const SOCIAL_LINKS: SocialLink[] = [
  // Confirmed live 2026-09-11 (this task) — real URLs already carried over
  // from schema.ts's pre-existing sameAs list, re-confirmed rather than
  // assumed still accurate.
  { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/company/boostwebdigital" },
  { id: "facebook", platform: "Facebook", url: "https://www.facebook.com/boostwebdigitals" },
  { id: "instagram", platform: "Instagram", url: "https://www.instagram.com/boostwebdigital/" },
  // Confirmed live 2026-09-11 but the exact profile URL is still pending —
  // url stays null (renders nothing) until it's supplied. Do not guess one.
  { id: "twitter", platform: "X", url: null },
  { id: "google-business", platform: "Google Business Profile", url: null },
  // Not confirmed — left out of the footer and sameAs per this task's brief.
  { id: "youtube", platform: "YouTube", url: null },
];

/** Only the confirmed, live links — what Footer.tsx renders and what
 * Organization.sameAs (src/lib/schema.ts) should ever include. */
export function getConfirmedSocialLinks(): Array<SocialLink & { url: string }> {
  return SOCIAL_LINKS.filter((link): link is SocialLink & { url: string } => Boolean(link.url));
}
