/**
 * Inline SVG only — no icon font, no npm icon package, no emoji (per this
 * task's brief). Every icon here is `aria-hidden`; the accessible name
 * lives on the link/button that wraps it.
 */

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.5h3.3l-7.2 8.23 8.47 11.27h-6.63l-5.2-6.8-5.94 6.8H1.74l7.7-8.8L1.32 2.5h6.79l4.7 6.22zm-1.16 17.6h1.83L7.02 4.3H5.06z" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.5H16l.4-3.2h-2.9V7.3c0-.93.26-1.56 1.6-1.56h1.7V2.9C16.5 2.86 15.6 2.8 14.5 2.8c-2.4 0-4 1.46-4 4.15v2.35H7.9v3.2h2.6V21z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.3a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.4a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .4 4.7 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.4a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.7zM10 15.2V8.8l5.5 3.2z" />
    </svg>
  );
}

export function GoogleBusinessIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M21.6 12.23c0-.68-.06-1.36-.18-2H12v3.79h5.4a4.63 4.63 0 0 1-2 3.04v2.5h3.2c1.9-1.75 2.98-4.3 2.98-7.33z" />
      <path d="M12 22c2.7 0 4.97-.9 6.6-2.44l-3.2-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.8-1.76-5.6-4.13H3.1v2.6A10 10 0 0 0 12 22z" />
      <path d="M6.4 13.88a6 6 0 0 1 0-3.76v-2.6H3.1a10 10 0 0 0 0 9l3.3-2.64z" />
      <path d="M12 5.98c1.47 0 2.8.5 3.83 1.5l2.87-2.86A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.9 5.52l3.3 2.6C7.2 7.75 9.4 5.98 12 5.98z" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  linkedin: LinkedInIcon,
  twitter: XIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  "google-business": GoogleBusinessIcon,
};

/** Bullseye/target glyph — reads as "measure/check," never as an envelope
 * or speech bubble (which would set the wrong expectation: "contact
 * form"). Used on the floating CTA only. */
export function TargetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.25" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
