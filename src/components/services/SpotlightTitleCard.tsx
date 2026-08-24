import { CARD_PADDING, CARD_RADIUS } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Shared small title+body card used across /services/'s three sub-item
 * grids ("what we do" lists, How It Works steps, Honest Exclusions) — one
 * definition instead of three near-identical copies. Must be a child of
 * `<SpotlightField>` (`data-spotlight` is what that component's mousemove
 * handler looks for).
 */
export function SpotlightTitleCard({ title, body, numeral }: { title: string; body: string; numeral?: string }) {
  return (
    <div
      data-spotlight
      className={cn("spotlight-card card-hairline relative flex h-full flex-col bg-white/[0.03]", CARD_RADIUS.standard, CARD_PADDING.standard)}
    >
      <div className="relative z-2">
        {numeral && (
          <span aria-hidden className="font-mono text-xs font-semibold tracking-[0.12em] text-accent">
            {numeral}
          </span>
        )}
        <h4 className={cn("font-display text-base font-semibold text-white", numeral && "mt-2")}>{title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
      </div>
    </div>
  );
}
