import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import type { CheckerReport as CheckerReportData } from "./types";

/**
 * Mirrors src/lib/checker/parse.ts's scoreVisibility() signal wording
 * exactly — the backend only returns the rows that were actually earned,
 * so the full six-row formula table (earned AND not-earned) has to be
 * reconstructed here for display. If parse.ts's wording ever changes, this
 * must change with it or the "not earned" rows stop matching correctly.
 */
const FULL_FORMULA: Array<{ signal: string; points: number }> = [
  { signal: "Named in the answer", points: 50 },
  { signal: "First mention in the first third of the answer", points: 25 },
  { signal: "First mention in the middle third of the answer", points: 15 },
  { signal: "First mention in the last third of the answer", points: 10 },
  { signal: "Own domain appears in the citation sources", points: 15 },
  { signal: "Named more than once", points: 10 },
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Best-effort VISUAL highlight only, built entirely from plain text nodes —
 * never dangerouslySetInnerHTML, never a markdown renderer. `variant` came
 * back from parse.ts's own matching, so this is highlighting the same
 * phrase that was actually matched, just with a simpler (non-accent-aware)
 * search than parse.ts uses internally; the score itself is the
 * authoritative match, this is only what the eye sees.
 */
function highlightAnswer(answer: string, variant: string | null): ReactNode {
  if (!variant) return answer;
  const pattern = new RegExp(`(${escapeRegExp(variant)})`, "gi");
  const parts = answer.split(pattern);
  if (parts.length === 1) return answer;
  return parts.map((part, i) =>
    part.toLowerCase() === variant.toLowerCase() ? (
      <mark key={i} className="rounded-sm bg-accent/25 px-0.5 text-white">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** Display-only ordinal ("named 2nd of 5") — never fed back into the score.
 * Approximates each competitor's position with a simple case-insensitive
 * search of the answer text; a competitor whose name isn't found this way
 * is treated as unranked rather than guessed at. */
function computeVerdictRank(report: CheckerReportData): { rank: number; total: number } | null {
  if (!report.matched || report.firstIndex === null) return null;
  const competitors = report.competitors ?? [];
  const positions = competitors
    .map((name) => report.answer.toLowerCase().indexOf(name.toLowerCase()))
    .filter((index) => index !== -1);
  const rank = 1 + positions.filter((index) => index < report.firstIndex!).length;
  return { rank, total: 1 + competitors.length };
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

function Verdict({ report }: { report: CheckerReportData }) {
  const rankInfo = computeVerdictRank(report);
  return (
    <p className="font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
      {report.matched
        ? rankInfo
          ? `Your practice was named ${ordinal(rankInfo.rank)} of ${rankInfo.total}.`
          : "Your practice was named in the answer."
        : "Your practice was not named."}
    </p>
  );
}

function ScoreSection({ report }: { report: CheckerReportData }) {
  const earnedSignals = new Set(report.breakdown.map((row) => row.signal));
  return (
    <section aria-labelledby="checker-score-heading">
      <h3 id="checker-score-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        Visibility score
      </h3>
      <p className="mt-2 font-display text-4xl font-extrabold text-white">
        {report.score}
        <span className="text-xl font-semibold text-white/40">/100</span>
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full min-w-90 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.03]">
              <th scope="col" className="px-4 py-2.5 font-semibold text-white/60">
                Signal
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold text-white/60">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {FULL_FORMULA.map((row) => {
              const earned = earnedSignals.has(row.signal);
              return (
                <tr key={row.signal} className="border-b border-white/8 last:border-0">
                  <td className={earned ? "px-4 py-2.5 text-white" : "px-4 py-2.5 text-white/40"}>
                    {earned ? "✓ " : ""}
                    {row.signal}
                  </td>
                  <td className={earned ? "px-4 py-2.5 text-right font-semibold text-white" : "px-4 py-2.5 text-right text-white/30"}>
                    {earned ? `+${row.points}` : "0"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-white/40">
        Maximum 100. This is the full formula — every point on this page can be checked against the answer below.
      </p>
    </section>
  );
}

function AnswerSection({ report }: { report: CheckerReportData }) {
  return (
    <section aria-labelledby="checker-answer-heading">
      <h3 id="checker-answer-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        The actual answer
      </h3>
      <blockquote className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-[15px] leading-relaxed text-white/85">
        {highlightAnswer(report.answer, report.variantMatched)}
      </blockquote>
      {report.variantMatched && <p className="mt-2 text-xs text-white/40">matched on: {report.variantMatched}</p>}
    </section>
  );
}

function CompetitorsSection({ competitors }: { competitors: string[] | null }) {
  return (
    <section aria-labelledby="checker-competitors-heading">
      <h3 id="checker-competitors-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        Named instead
      </h3>
      {competitors === null ? (
        <p className="mt-3 text-sm text-white/40">Not available for this report.</p>
      ) : competitors.length === 0 ? (
        <p className="mt-3 text-sm text-white/60">No other businesses were named in the answer.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2">
          {competitors.map((name, i) => (
            <li key={`${name}-${i}`} className="flex items-baseline gap-3 text-sm text-white/75">
              <span aria-hidden className="font-mono text-white/30">
                {i + 1}.
              </span>
              {name}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function SourcesSection({ sources }: { sources: string[] }) {
  return (
    <section aria-labelledby="checker-sources-heading">
      <h3 id="checker-sources-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        Sources cited
      </h3>
      {sources.length === 0 ? (
        <p className="mt-3 text-sm text-white/60">No web sources were cited.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {sources.map((url) => (
            <li key={url} className="truncate text-sm">
              <a
                href={url}
                rel="nofollow noopener"
                target="_blank"
                className="text-accent underline-offset-4 hover:underline"
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StrengthsWeaknesses({ strengths, weaknesses }: { strengths: string[] | null; weaknesses: string[] | null }) {
  if (strengths === null && weaknesses === null) {
    return (
      <section aria-labelledby="checker-sw-heading">
        <h3 id="checker-sw-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          Strengths &amp; weaknesses
        </h3>
        <p className="mt-3 text-sm text-white/40">Not available for this report.</p>
      </section>
    );
  }
  return (
    <section aria-labelledby="checker-sw-heading">
      <div className="flex items-baseline gap-2">
        <h3 id="checker-sw-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          Strengths &amp; weaknesses
        </h3>
        <span className="text-[11px] text-white/35">— AI-generated interpretation, not a measured score</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/50">Strengths</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-white/75">
            {(strengths ?? []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/50">Weaknesses</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-white/75">
            {(weaknesses ?? []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const EFFORT_LABEL: Record<string, string> = { low: "Low effort", medium: "Medium effort", high: "High effort" };

function RecommendationsSection({ recommendations }: { recommendations: CheckerReportData["recommendations"] }) {
  return (
    <section aria-labelledby="checker-recs-heading">
      <h3 id="checker-recs-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        Recommendations
      </h3>
      {recommendations === null ? (
        <p className="mt-3 text-sm text-white/40">Not available for this report.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-4">
          {recommendations.map((rec, i) => (
            <li key={i} className="rounded-xl border border-white/8 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-white">{rec.title}</p>
                <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-white/55">
                  {EFFORT_LABEL[rec.effort] ?? rec.effort}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-white/70">{rec.why}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function CheckerReport({ report, onReset }: { report: CheckerReportData; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="checker-print-doc flex flex-col gap-10 print:gap-6" data-checker-report>
      <div>
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Your AI visibility report
        </h2>
        <Verdict report={report} />
      </div>
      <ScoreSection report={report} />
      <AnswerSection report={report} />
      <CompetitorsSection competitors={report.competitors} />
      <SourcesSection sources={report.sources} />
      <StrengthsWeaknesses strengths={report.strengths} weaknesses={report.weaknesses} />
      <RecommendationsSection recommendations={report.recommendations} />

      <div className="flex flex-col items-start gap-4 border-t border-white/8 pt-8 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-white">This was one question, on one engine. We run fifteen, on four.</p>
          <Link href="/ai-visibility-geo/" className="mt-1 inline-block text-sm text-accent underline-offset-4 hover:underline">
            See the full AI Search Visibility service
          </Link>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 text-sm font-medium text-white/60 underline-offset-4 hover:text-white hover:underline"
        >
          Run another check
        </button>
      </div>
    </div>
  );
}
