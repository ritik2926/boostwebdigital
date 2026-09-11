import { PrimaryCta } from "@/components/StaticCta";
import { cn } from "@/lib/utils";
import { CARD_PADDING } from "@/lib/tokens";

/**
 * Neutral card (2026-09-11 button-system consolidation) — the previous
 * solid accent-fill card paired a white pill with accent text, which has no
 * remaining contrast pairing against the new .btn-primary (accent-outlined
 * at rest, accent-filled with foreground text on hover). Matches BlogCard's
 * neutral surface (border-white/8, bg-white/[0.02]) so this interrupt card
 * reads as part of the same grid instead of a one-off exception.
 */
export function InlineCtaCard() {
  return (
    <div
      className={cn(
        "flex h-full min-h-90 flex-col justify-between rounded-2xl border border-white/8 bg-white/[0.02]",
        CARD_PADDING.standard
      )}
    >
      <div>
        <h3 className="font-display text-xl font-bold leading-snug text-white">See what AI says about your practice</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">Fifteen questions, four AI engines, one free report.</p>
      </div>
      <PrimaryCta href="/contact/" className="mt-6 inline-flex w-fit">
        Get my free report
      </PrimaryCta>
    </div>
  );
}
