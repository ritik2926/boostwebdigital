import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic [0,1) pseudo-random value from a seed — server and client
 * compute the identical scatter with no useEffect/setState needed, unlike
 * Math.random() which differs per environment and breaks hydration.
 */
export function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  // Rounded to 4dp — long float strings in inline styles (esp. shorthand
  // properties like `animation`) serialize differently between SSR's HTML
  // string and the client's re-applied style, causing a hydration mismatch.
  return Math.round((x - Math.floor(x)) * 10000) / 10000;
}

/** Shared date formatting for blog meta rows (post hero, cards, archive). */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
