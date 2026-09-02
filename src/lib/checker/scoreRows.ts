import type { FullReportAnswer } from "./report";

/**
 * Presentation-only reconstruction of the full 8-row score formula table
 * for the shareable report — NOT a scoring change (parse.ts's
 * scoreVisibility is untouched and remains the only place points are
 * decided). This just adds a "why not" reason to every row that wasn't
 * earned, which the original breakdown never needed to carry since the
 * inline widget only ever showed earned rows against a static full-formula
 * list with no reasons attached.
 */
export interface ScoreRow {
  signal: string;
  points: number;
  earned: boolean;
  reason?: string;
}

/**
 * "Own domain cited in the sources" is worth 40 of the 100-point formula,
 * and is structurally unwinnable without a website — sameDomain() in
 * parse.ts has nothing to compare against. Scoring a business against a
 * maximum it was never able to reach reads as a failure for a signal it
 * was never possible to earn (a business named in all three answers with
 * no website submitted scored 42/100 before this fix — the exact false-
 * low-score problem the three-query rework existed to remove, in a
 * different shape). This rescales parse.ts's raw, measured score onto only
 * the points that were actually possible to earn given what the visitor
 * submitted — the formula and its weights in parse.ts are completely
 * untouched; this is a presentation-layer normalisation of its output, not
 * a new way of earning points, and it's a no-op (rawScore unchanged) once
 * a website IS given, since maxPossible is then the full 100.
 */
const OWN_DOMAIN_POINTS = 40;
const MAX_SCORE = 100;

export function computeMaxPossibleScore(hasWebsite: boolean): number {
  return hasWebsite ? MAX_SCORE : MAX_SCORE - OWN_DOMAIN_POINTS;
}

export function rescaleScore(rawScore: number, hasWebsite: boolean): number {
  const maxPossible = computeMaxPossibleScore(hasWebsite);
  return Math.min(MAX_SCORE, Math.round((rawScore / maxPossible) * MAX_SCORE));
}

export function buildScoreRows(input: {
  answers: FullReportAnswer[];
  namedCount: number;
  totalQueries: number;
  ownDomainCited: boolean;
  hasWebsite: boolean;
}): ScoreRow[] {
  const { answers, namedCount, totalQueries, ownDomainCited, hasWebsite } = input;
  const matched = answers.filter((a) => a.ok && a.matched && a.firstIndex !== null);

  let bestTier: 0 | 1 | 2 | null = null;
  for (const a of matched) {
    const position = a.firstIndex! / Math.max(a.answer.length, 1);
    const tier = position < 1 / 3 ? 0 : position < 2 / 3 ? 1 : 2;
    if (bestTier === null || tier < bestTier) bestTier = tier;
  }
  const hasRepeat = matched.some((a) => a.mentionCount > 1);

  const rows: ScoreRow[] = [];

  rows.push({
    signal: "Own domain cited in the sources",
    points: 40,
    earned: ownDomainCited,
    reason: ownDomainCited
      ? undefined
      : hasWebsite
        ? "not scored — your site wasn't among the cited pages"
        : "not scored — no website provided (excluded, not counted against you)",
  });

  const namedTier = namedCount >= 3 ? "all" : namedCount === 2 ? "two" : namedCount === 1 ? "one" : null;
  for (const t of [
    { key: "all", signal: "Named in all three answers", points: 30 },
    { key: "two", signal: "Named in two of three answers", points: 20 },
    { key: "one", signal: "Named in one of three answers", points: 10 },
  ]) {
    const earned = namedTier === t.key;
    rows.push({
      signal: t.signal,
      points: t.points,
      earned,
      reason: earned ? undefined : `not scored — named in ${namedCount} of ${totalQueries}`,
    });
  }

  for (const t of [
    { key: 0, signal: "Best position in the first third of an answer", points: 20 },
    { key: 1, signal: "Best position in the middle third of an answer", points: 12 },
    { key: 2, signal: "Best position in the last third of an answer", points: 6 },
  ]) {
    const earned = bestTier === t.key;
    rows.push({
      signal: t.signal,
      points: t.points,
      earned,
      reason: earned ? undefined : bestTier === null ? "not scored — not named in any answer" : "not scored — best position was in a different third",
    });
  }

  rows.push({
    signal: "Named more than once in a single answer",
    points: 10,
    earned: hasRepeat,
    reason: hasRepeat ? undefined : namedCount === 0 ? "not scored — not named in any answer" : "not scored — never repeated within one answer",
  });

  return rows;
}
