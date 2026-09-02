import { cn } from "@/lib/utils";

/**
 * PART 3's shared horizontal-bar chart, used for both "Which pages the AI
 * read" and "Who got named instead". No chart library — a bar is just a
 * div with a percentage width, direct-labelled, so it degrades perfectly
 * to print/greyscale (bar length + the printed number carry the meaning,
 * never hue alone). Server-renderable: no client JS, no interactivity.
 *
 * Fixed-width label column on the left (truncated, never the bar colour)
 * so every bar starts from the same baseline — PART 3's "anchored to a
 * common baseline" — with a 2px gap between adjacent bar rows and a
 * rounded end on the data (right) side only.
 */
export interface BarChartRow {
  key: string;
  label: string;
  count: number;
  /** "cited by N of 3" / "named in N of 3" — built by the caller so this
   * component stays agnostic to which chart it's rendering. */
  detail: string;
  href?: string;
  highlighted?: boolean;
  chip?: string;
}

export function BarChart({ rows, maxCount }: { rows: BarChartRow[]; maxCount: number }) {
  return (
    <div className="checker-report-chart flex flex-col gap-0.5">
      {rows.map((row) => {
        const widthPercent = Math.max((row.count / Math.max(maxCount, 1)) * 100, 8);
        return (
          <div key={row.key} data-print-avoid-break className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] items-center gap-3 py-1">
            <span className={cn("truncate text-sm", row.highlighted ? "font-semibold text-white" : "text-white/75")}>
              {row.href ? (
                <a href={row.href} rel="nofollow noopener" target="_blank" className="underline-offset-4 hover:underline">
                  {row.label}
                </a>
              ) : (
                row.label
              )}
              {row.chip && (
                <span
                  className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                  style={{ backgroundColor: "color-mix(in srgb, var(--chart-good) 20%, transparent)", color: "var(--chart-good)" }}
                >
                  {row.chip}
                </span>
              )}
            </span>
            <div className="h-2.5 w-full overflow-hidden rounded-sm bg-white/8">
              <div
                className="h-full rounded-r-sm"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: row.highlighted ? "var(--chart-good)" : "var(--chart-brand)",
                }}
              />
            </div>
            <span className="shrink-0 whitespace-nowrap font-mono text-xs text-white/50">{row.detail}</span>
          </div>
        );
      })}
    </div>
  );
}

export function BarChartEmptyState({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-white/60">{children}</p>;
}
