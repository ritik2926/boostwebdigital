/**
 * Section 4's "large number, thin progress arc" — a plain SVG circle pair
 * (track + progress), no chart library. Colour stays the neutral brand hue
 * regardless of the score value — this page never editorializes on
 * whether a score is "good" or "bad" beyond the plain number and the
 * templated interpretation in section 3; that framing is reserved for the
 * owner alert, which the practice owner never sees.
 */
export function ScoreArc({ score }: { score: number }) {
  const size = 128;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const dashoffset = circumference * (1 - clamped / 100);

  return (
    <div className="checker-report-chart relative inline-flex h-32 w-32 shrink-0 items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--chart-brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-extrabold text-white">{score}</span>
        <span className="text-[11px] text-white/40">/100</span>
      </div>
    </div>
  );
}
