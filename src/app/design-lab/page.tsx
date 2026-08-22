import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabLoader } from "./LabLoader";

export const metadata: Metadata = {
  title: "Design Lab",
  robots: { index: false, follow: false },
};

/**
 * A dev-only playground — doesn't belong on the public site at all. `next
 * build` still generates this as a real static route regardless of
 * robots.txt's Disallow line (which blocks crawling but not indexing:
 * Google can still index the bare URL if it ever finds a link to it, and
 * can't see the noindex above on a page it's forbidden from crawling —
 * the two directives cancel out). Excluding it from production behavior
 * entirely, rather than relying on either directive alone, is the fix:
 * `next build`/Vercel always run with NODE_ENV=production, `npm run dev`
 * doesn't, so this stays fully usable locally and 404s for real everywhere
 * else — no new dependency, no separate build config, no deleted file.
 */
export default function DesignLabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <LabLoader />;
}
