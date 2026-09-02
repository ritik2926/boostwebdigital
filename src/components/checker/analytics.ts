/**
 * Fires a checker analytics event through whichever tag system is actually
 * installed. This site currently runs plain gtag.js (see Analytics.tsx) —
 * no Google Tag Manager container — but `window.dataLayer` exists either
 * way (gtag.js seeds it itself), so detection can't just check for
 * `dataLayer`. `window.google_tag_manager` is only ever set by GTM's own
 * gtm.js, so it's the real signal. Never throws, never logs — a missing
 * analytics setup on localhost/preview must stay silent.
 */
export function trackCheckerEvent(name: string, params?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    google_tag_manager?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  try {
    if (w.google_tag_manager && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: name, ...params });
    } else if (typeof w.gtag === "function") {
      w.gtag("event", name, params ?? {});
    }
  } catch {
    // analytics must never break the checker itself
  }
}
