import Link from "next/link";
import { cn } from "@/lib/utils";
import { CARD_PADDING } from "@/lib/tokens";

/**
 * Solid accent fill is normally reserved for the one primary CTA per view
 * (docs/12-DESIGN-STANDARDS.md §2.1) — this card is the explicit, contained
 * exception requested for the archive grid specifically, mirroring the
 * reference's high-contrast yellow interrupt cards with our own accent hue
 * instead. Not a precedent for using solid accent fill elsewhere.
 */
export function InlineCtaCard() {
  return (
    <div className={cn("flex h-full min-h-90 flex-col justify-between rounded-2xl bg-accent", CARD_PADDING.standard)}>
      <div>
        <h3 className="font-display text-xl font-bold leading-snug text-white">See what AI says about your practice</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/85">Fifteen questions, four AI engines, one free report.</p>
      </div>
      <Link
        href="/contact/"
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-accent transition-transform duration-200 hover:scale-[1.03]"
      >
        Get my free report
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
