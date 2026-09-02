import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { trackCheckerEvent } from "./analytics";
import type { CheckerReport as CheckerReportData, QueryAnswer, RankedSource } from "./types";
// Zero-secret, string-only template (same as @/lib/checker/queryBuilder and
// @/lib/checker/locations already imported by CheckerWidget.tsx) — safe in
// this client-rendered tree.
import { buildClosingCta } from "@/lib/checker/reportCopy";

/**
 * Mirrors src/lib/checker/parse.ts's scoreVisibility() signal wording
 * exactly — the backend only returns the rows that were actually earned,
 * so the full eight-row formula table (earned AND not-earned) has to be
 * reconstructed here for display. If parse.ts's wording ever changes, this
 * must change with it or the "not earned" rows stop matching correctly.
 */
const FULL_FORMULA: Array<{ signal: string; points: number }> = [
  { signal: "Own domain cited in the sources", points: 40 },
  { signal: "Named in all three answers", points: 30 },
  { signal: "Named in two of three answers", points: 20 },
  { signal: "Named in one of three answers", points: 10 },
  { signal: "Best position in the first third of an answer", points: 20 },
  { signal: "Best position in the middle third of an answer", points: 12 },
  { signal: "Best position in the last third of an answer", points: 6 },
  { signal: "Named more than once in a single answer", points: 10 },
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

function positionLabel(firstIndex: number, answerLength: number): string {
  const position = firstIndex / Math.max(answerLength, 1);
  if (position < 1 / 3) return "in the first third of the answer";
  if (position < 2 / 3) return "in the middle third of the answer";
  return "in the last third of the answer";
}

function Verdict({ report }: { report: CheckerReportData }) {
  return (
    <p className="font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]">
      {report.namedCount > 0
        ? `Named in ${report.namedCount} of ${report.totalQueries} answers.`
        : `Not named in any of the ${report.totalQueries} answers.`}
    </p>
  );
}

/**
 * Required directly beneath the verdict, not buried in a footer — see this
 * task's report, Part 4. States plainly what a three-query, one-engine
 * sample can and can't tell a visitor, so nothing here implies certainty
 * the data doesn't support.
 */
function WhatThisChecksBox({ partialFailure, failedCount }: { partialFailure: boolean; failedCount: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/70">
      <p className="font-semibold text-white">What this checks — and what it doesn&rsquo;t.</p>
      <p className="mt-2">
        We send three real questions to one AI answer engine and show you its exact answers and the sources it used.
        Different AI engines search different indexes, so a business named by one may not be named by another. This
        is a sample, not a full audit. What it reliably shows is which pages AI systems are reading to answer
        questions like these — and whether yours is one of them.
      </p>
      {partialFailure && (
        <p className="mt-2 text-white/60">
          {failedCount === 1 ? "One of the three questions" : `${failedCount} of the three questions`} didn&rsquo;t
          return a result this time — this report reflects the answers that did come back.
        </p>
      )}
    </div>
  );
}

function SourcesSection({ sources }: { sources: RankedSource[] }) {
  const ownDomainSource = sources.find((s) => s.isOwnDomain);
  return (
    <section aria-labelledby="checker-sources-heading">
      <h3 id="checker-sources-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        1 · The sources AI read
      </h3>
      <p className={ownDomainSource ? "mt-2 text-sm text-white" : "mt-2 text-sm text-white/60"}>
        {ownDomainSource
          ? "Your own domain is among the pages this engine cited."
          : "Your own domain does not appear among the pages this engine cited."}
      </p>
      {sources.length === 0 ? (
        <p className="mt-3 text-sm text-white/60">No web sources were cited across any of the three answers.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {sources.map((source) => (
            <li
              key={source.url}
              className={source.isOwnDomain ? "rounded-lg border border-accent/40 bg-accent/10 p-3" : "rounded-lg border border-white/8 p-3"}
            >
              <a
                href={source.url}
                rel="nofollow noopener"
                target="_blank"
                className="block truncate text-sm text-white/80 underline-offset-4 hover:text-accent hover:underline"
              >
                {source.url}
              </a>
              <p className="mt-1 text-xs text-white/40">
                Cited by {source.citedByCount} of 3 answers ({source.citedIn.join(", ")})
                {source.isOwnDomain ? " — this is your domain" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function NamedSection({ report }: { report: CheckerReportData }) {
  const matchedAnswers = report.answers.filter((a) => a.ok && a.matched);
  return (
    <section aria-labelledby="checker-named-heading">
      <h3 id="checker-named-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        2 · Were you named
      </h3>
      <p className="mt-2 text-sm text-white/70">
        {report.namedCount > 0
          ? `Named in ${report.namedCount} of ${report.totalQueries} answers.`
          : `Not named in any of the ${report.totalQueries} answers.`}
      </p>
      {matchedAnswers.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-white/70">
          {matchedAnswers.map((a) => (
            <li key={a.label}>
              <span className="font-mono text-white/40">{a.label}</span> — named {positionLabel(a.firstIndex!, a.answer.length)}
              {a.mentionCount > 1 ? `, mentioned ${a.mentionCount} times` : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function AnswerCard({ answer }: { answer: QueryAnswer }) {
  return (
    <details className="rounded-xl border border-white/10 bg-white/[0.03] open:pb-1" open>
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-white/85 marker:content-none">
        <span className="font-mono text-white/40">{answer.label}</span> — {answer.query}
        {answer.ok && (
          <span className={answer.matched ? "ml-2 text-accent" : "ml-2 text-white/40"}>{answer.matched ? "· named" : "· not named"}</span>
        )}
      </summary>
      <div className="px-5 pb-5">
        {answer.ok ? (
          answer.answer.trim().length === 0 ? (
            <p className="text-sm text-white/40">No answer was returned for this question.</p>
          ) : (
            <>
              <blockquote className="rounded-lg border border-white/10 bg-black/20 p-4 text-[15px] leading-relaxed text-white/85">
                {highlightAnswer(answer.answer, answer.variantMatched)}
              </blockquote>
              {answer.variantMatched && <p className="mt-2 text-xs text-white/40">matched on: {answer.variantMatched}</p>}
            </>
          )
        ) : (
          <p className="text-sm text-white/40">This question didn&rsquo;t return a result. {answer.error ?? ""}</p>
        )}
      </div>
    </details>
  );
}

function AnswersSection({ answers }: { answers: QueryAnswer[] }) {
  return (
    <section aria-labelledby="checker-answers-heading">
      <h3 id="checker-answers-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        3 · The answers themselves
      </h3>
      <div className="mt-3 flex flex-col gap-3">
        {answers.map((answer) => (
          <AnswerCard key={answer.label} answer={answer} />
        ))}
      </div>
    </section>
  );
}

function ScoreSection({ report }: { report: CheckerReportData }) {
  const earnedSignals = new Set(report.breakdown.map((row) => row.signal));
  return (
    <section aria-labelledby="checker-score-heading">
      <h3 id="checker-score-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        4 · Visibility score
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
        Maximum 100. This is the full formula — every point on this page can be checked against the answers above.
      </p>
    </section>
  );
}

function CompetitorsSection({ competitors }: { competitors: CheckerReportData["competitors"] }) {
  return (
    <section aria-labelledby="checker-competitors-heading">
      <h3 id="checker-competitors-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
        5 · Named instead
      </h3>
      {competitors === null ? (
        <p className="mt-3 text-sm text-white/40">Not available for this report.</p>
      ) : competitors.length === 0 ? (
        <p className="mt-3 text-sm text-white/60">No other businesses were named across the three answers.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2">
          {competitors.map((c, i) => (
            <li key={`${c.name}-${i}`} className="flex items-baseline justify-between gap-3 text-sm text-white/75">
              <span>
                <span aria-hidden className="mr-2 font-mono text-white/30">
                  {i + 1}.
                </span>
                {c.name}
              </span>
              <span className="shrink-0 text-xs text-white/40">named in {c.appearedIn} of 3</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function StrengthsWeaknesses({ strengths, weaknesses }: { strengths: string[] | null; weaknesses: string[] | null }) {
  if (strengths === null && weaknesses === null) {
    return (
      <section aria-labelledby="checker-sw-heading">
        <h3 id="checker-sw-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          6 · Strengths &amp; weaknesses
        </h3>
        <p className="mt-3 text-sm text-white/40">Not available for this report.</p>
      </section>
    );
  }
  return (
    <section aria-labelledby="checker-sw-heading">
      <div className="flex items-baseline gap-2">
        <h3 id="checker-sw-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          6 · Strengths &amp; weaknesses
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
  const cta = buildClosingCta(report.industry);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="checker-print-doc flex flex-col gap-10 print:gap-6" data-checker-report>
      <div className="flex flex-col gap-5">
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Your AI visibility report
        </h2>
        <Verdict report={report} />
        <WhatThisChecksBox partialFailure={report.partialFailure} failedCount={report.failedQueries.length} />
      </div>
      <SourcesSection sources={report.sources} />
      <NamedSection report={report} />
      <AnswersSection answers={report.answers} />
      <ScoreSection report={report} />
      <CompetitorsSection competitors={report.competitors} />
      <StrengthsWeaknesses strengths={report.strengths} weaknesses={report.weaknesses} />
      <RecommendationsSection recommendations={report.recommendations} />

      <div className="flex flex-col items-start gap-4 border-t border-white/8 pt-8 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-white">{cta.paragraph}</p>
          <Link
            href={cta.linkHref}
            onClick={() => trackCheckerEvent("checker_cta_clicked")}
            className="mt-1 inline-block text-sm text-white/70 underline-offset-4 hover:text-accent hover:underline"
          >
            {cta.linkLabel}
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
