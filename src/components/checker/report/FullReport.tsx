import Image from "next/image";
import type { ReactNode } from "react";
import type { FullReportAnswer, FullReportData } from "@/lib/checker/report";
import { buildInterpretation, buildVerdict } from "@/lib/checker/reportCopy";
import { buildScoreRows } from "@/lib/checker/scoreRows";
import { BarChart, BarChartEmptyState, type BarChartRow } from "./BarChart";
import { ScoreArc } from "./ScoreArc";
import { PrintButton } from "./PrintButton";
import { FounderBlock } from "./FounderBlock";

const SITE_URL = "https://boostwebdigital.com";
const CONTACT_EMAIL = "contact@boostwebdigital.com";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function SectionHeading({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
      {n} · {children}
    </h2>
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Plain text nodes only — never dangerouslySetInnerHTML. Same convention
 * as the inline widget's own highlightAnswer (CheckerReport.tsx). */
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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function DashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StatusChip({ answer }: { answer: FullReportAnswer }) {
  if (!answer.ok) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/50">
        <DashIcon /> No result
      </span>
    );
  }
  if (answer.matched) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
        style={{ borderColor: "color-mix(in srgb, var(--chart-good) 45%, transparent)", color: "var(--chart-good)" }}
      >
        <CheckIcon /> Named
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{ borderColor: "color-mix(in srgb, var(--chart-gap) 45%, transparent)", color: "var(--chart-gap)" }}
    >
      <XIcon /> Not named
    </span>
  );
}

const EFFORT_LABEL: Record<string, string> = { low: "Low effort", medium: "Medium effort", high: "High effort" };

export function FullReport({ report }: { report: FullReportData }) {
  const ownDomainSource = report.sources.find((s) => s.isOwnDomain);
  const verdict = buildVerdict({ businessName: report.businessName, namedCount: report.namedCount, totalQueries: report.totalQueries });
  const interpretation = buildInterpretation({
    businessName: report.businessName,
    namedCount: report.namedCount,
    ownDomainCited: Boolean(ownDomainSource),
    totalSourcesCount: report.sources.length,
  });
  const scoreRows = buildScoreRows({
    answers: report.answers,
    namedCount: report.namedCount,
    totalQueries: report.totalQueries,
    ownDomainCited: Boolean(ownDomainSource),
    hasWebsite: Boolean(report.website),
  });

  // Chart A — own domain pinned to the top when present, rest kept in the
  // already-cited-count-sorted order aggregateSources produced.
  const sourceRows: BarChartRow[] = [...report.sources]
    .sort((a, b) => (a.isOwnDomain === b.isOwnDomain ? 0 : a.isOwnDomain ? -1 : 1))
    .map((s) => ({
      key: s.url,
      label: s.url,
      count: s.citedByCount,
      detail: `cited by ${s.citedByCount} of ${report.totalQueries}`,
      href: s.url,
      highlighted: s.isOwnDomain,
      chip: s.isOwnDomain ? "Your site" : undefined,
    }));
  const sourceMaxCount = Math.max(...report.sources.map((s) => s.citedByCount), 1);

  const competitorRows: BarChartRow[] = report.competitors.map((c) => ({
    key: c.name,
    label: c.name,
    count: c.appearedIn,
    detail: `named in ${c.appearedIn} of ${report.totalQueries}`,
  }));
  const competitorMaxCount = Math.max(...report.competitors.map((c) => c.appearedIn), 1);

  return (
    <div className="checker-report-print-doc flex flex-col gap-14">
      {/* 1 · MASTHEAD */}
      <header data-print-avoid-break className="flex flex-col gap-6 border-b border-white/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Image src="/logo/logo-dark.svg" alt="Boost Web Digital" width={180} height={40} className="hidden h-9 w-auto print:hidden sm:block" />
          <Image src="/logo/logo-light.svg" alt="Boost Web Digital" width={180} height={40} className="hidden h-9 w-auto print:block" />
          <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/45">AI Visibility Report</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{report.businessName}</h1>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="text-sm text-white/50">{formatDate(report.createdAt)}</p>
          <PrintButton />
        </div>
      </header>

      {/* 2 · VERDICT */}
      <section>
        <p className="font-display text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.01em] text-white sm:text-[2.25rem]">{verdict}</p>
      </section>

      {/* 3 · WHAT THIS MEANS FOR YOU */}
      <section>
        <SectionHeading n={3}>What this means for you</SectionHeading>
        <p className="mt-3 max-w-prose text-[17px] leading-relaxed text-white/85">{interpretation}</p>
      </section>

      {/* 4 · SCORE */}
      <section data-print-avoid-break>
        <SectionHeading n={4}>Visibility score</SectionHeading>
        <div className="mt-4 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ScoreArc score={report.score} />
          <p className="text-sm text-white/50">
            Every point on this page is measured, never AI-generated — the table below is the complete formula, with a reason next to every row
            that wasn&rsquo;t earned.
          </p>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full min-w-100 border-collapse text-left text-sm">
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
              {scoreRows.map((row) => (
                <tr key={row.signal} data-print-avoid-break className="border-b border-white/8 last:border-0">
                  <td className="px-4 py-2.5">
                    <span className={row.earned ? "text-white" : "text-white/40"}>
                      {row.earned ? "✓ " : ""}
                      {row.signal}
                    </span>
                    {!row.earned && row.reason && <span className="block text-xs text-white/30">{row.reason}</span>}
                  </td>
                  <td className={row.earned ? "px-4 py-2.5 text-right font-semibold text-white" : "px-4 py-2.5 text-right text-white/30"}>
                    {row.earned ? `+${row.points}` : "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!report.website && (
          <p className="mt-3 text-sm text-white/50">
            Scored on the {scoreRows.length - 1} measures we could check. No website was given, so whether this engine reads your site could not be
            tested.
          </p>
        )}
      </section>

      {/* 5 · THE THREE QUESTIONS */}
      <section>
        <SectionHeading n={5}>The three questions</SectionHeading>
        <ul className="mt-4 flex flex-col gap-2">
          {report.queries.map((q) => {
            const answer = report.answers.find((a) => a.label === q.label);
            return (
              <li key={q.label} data-print-avoid-break className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/8 px-4 py-3">
                <span className="text-sm text-white/80">
                  <span className="mr-2 font-mono text-white/40">{q.label}</span>
                  {q.query}
                </span>
                {answer && <StatusChip answer={answer} />}
              </li>
            );
          })}
        </ul>
      </section>

      {/* 6 · WHICH PAGES THE AI READ */}
      <section data-print-avoid-break>
        <SectionHeading n={6}>Which pages the AI read</SectionHeading>
        {report.sources.length === 0 ? (
          <div className="mt-4">
            <BarChartEmptyState>No web sources were cited across any of the three answers.</BarChartEmptyState>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <BarChart rows={sourceRows} maxCount={sourceMaxCount} />
            </div>
            {!ownDomainSource && (
              <p className="mt-4 text-sm text-white/60">
                {report.website ? "Your domain did not appear among these sources." : "No website was provided, so it couldn't appear among these sources."}
              </p>
            )}
          </>
        )}
      </section>

      {/* 7 · WHO GOT NAMED INSTEAD */}
      <section data-print-avoid-break>
        <SectionHeading n={7}>Who got named instead</SectionHeading>
        {report.competitors.length === 0 ? (
          <div className="mt-4">
            <BarChartEmptyState>No other businesses were named across the three answers.</BarChartEmptyState>
          </div>
        ) : (
          <div className="mt-4">
            <BarChart rows={competitorRows} maxCount={competitorMaxCount} />
          </div>
        )}
      </section>

      {/* 8 · THE THREE ANSWERS */}
      <section>
        <SectionHeading n={8}>The three answers</SectionHeading>
        <div className="mt-4 flex flex-col gap-3">
          {report.answers.map((answer) => (
            <details key={answer.label} data-print-avoid-break className="rounded-xl border border-white/10 bg-white/[0.03]" open>
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-white/85 marker:content-none">
                <span className="font-mono text-white/40">{answer.label}</span> — {answer.query}
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
                  <p className="text-sm text-white/40">This question didn&rsquo;t return a result.</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 9 · WHAT THIS CHECKS — AND WHAT IT DOESN'T */}
      <section data-print-avoid-break>
        <SectionHeading n={9}>What this checks — and what it doesn&rsquo;t</SectionHeading>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/70">
          <p className="font-semibold text-white">What this checks — and what it doesn&rsquo;t.</p>
          <p className="mt-2">
            We send three real questions to one AI answer engine and show you its exact answers and the sources it used. Different AI engines
            search different indexes, so a practice named by one may not be named by another. This is a sample, not a full audit. What it
            reliably shows is which pages AI systems are reading to answer questions like these — and whether yours is one of them.
          </p>
        </div>
      </section>

      {/* 10 · WHAT TO DO NEXT */}
      <section>
        <SectionHeading n={10}>What to do next</SectionHeading>
        {report.recommendations === null ? (
          <p className="mt-3 text-sm text-white/40">Not available for this report.</p>
        ) : (
          <ol className="mt-4 flex flex-col gap-4">
            {report.recommendations.map((rec, i) => (
              <li key={i} data-print-avoid-break className="rounded-xl border border-white/8 p-4">
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

      {/* 11 · FOUNDER BLOCK, 12 · FOOTER — grouped with a tighter gap than the
          rest of the document's rhythm (not individually forced to stay
          together, each keeps its own avoid-break) so the short footer has
          the best chance of actually fitting on the founder block's page
          in print, instead of spilling alone onto an otherwise-blank page. */}
      <div className="flex flex-col gap-6">
        <FounderBlock />

        <footer data-print-avoid-break className="border-t border-white/8 pt-6 text-sm text-white/45">
          <p>Boost Web Digital &middot; {SITE_URL.replace("https://", "")}</p>
          <p className="mt-1">
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline-offset-4 hover:text-white hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-1">Generated {formatDate(report.createdAt)}</p>
        </footer>
      </div>
    </div>
  );
}

