/**
 * Pure functions only — no AI, no network, no database. This is the file
 * that produces the SCORE. Nothing here may ever be influenced by a
 * generated (AI) value; see analyse.ts for where competitors/strengths/
 * weaknesses/recommendations come from instead.
 */

const COMBINING_MARKS = /[\u0300-\u036f]/g;

export function normalise(s: string): string {
  return s
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(s: string): number {
  return s.split(" ").filter(Boolean).length;
}

/**
 * Trailing generic-suffix strip, checked in this exact order so a
 * multi-word suffix ("pvt ltd") is tried before the single word inside it
 * ("ltd") gets a chance to match on its own and leave a dangling "pvt".
 * Stops at the first suffix that matches — a name only ever has one.
 */
const GENERIC_SUFFIXES = [
  "clinic",
  "dental",
  "dentistry",
  "hospital",
  "centre",
  "center",
  "care",
  "medical",
  "pvt ltd",
  "ltd",
  "llc",
  "inc",
];

function stripGenericSuffix(normalisedName: string): string | null {
  for (const suffix of GENERIC_SUFFIXES) {
    const pattern = new RegExp(`\\s+${suffix.replace(/ /g, "\\s+")}$`);
    if (pattern.test(normalisedName)) {
      return normalisedName.replace(pattern, "").trim();
    }
  }
  return null;
}

/**
 * Length-preserving, character-for-character normalisation of the ORIGINAL
 * answer text (accent-stripped, lowercased, punctuation blanked to a single
 * space) — unlike the public `normalise()` above, this never collapses
 * whitespace, so `out.length === s.length` always and a regex match's
 * `.index` against this string is exactly the matching index in the
 * original, unmodified answer. That's what lets findMentions report a real
 * character offset into the text the user will actually read.
 */
function charNormaliseForSearch(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    const stripped = ch.normalize("NFD").replace(COMBINING_MARKS, "");
    const base = stripped.length > 0 ? stripped[0]! : ch;
    out += /[\p{L}\p{N}]/u.test(base) ? base.toLowerCase() : " ";
  }
  return out;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Word-boundary match on a (possibly multi-word) normalised phrase, tolerant
 * of any run of whitespace between its words in the source text. */
function buildVariantRegex(normalisedVariant: string, flags: string): RegExp {
  const words = normalisedVariant.split(" ").filter(Boolean).map(escapeRegex);
  return new RegExp(`(?<![\\p{L}\\p{N}])${words.join("\\s+")}(?![\\p{L}\\p{N}])`, flags);
}

export interface MentionResult {
  matched: boolean;
  variantMatched: string | null;
  firstIndex: number | null;
  count: number;
}

/**
 * Tries three name variants, in order, and stops at the first one that
 * appears in the answer. False positives are worse than false negatives
 * here — a wrong "you were mentioned" destroys trust in the whole tool —
 * so every variant is rejected outright if:
 *   - it's down to a single word (never fuzzy-matched, never partial-word:
 *     "Smile Dental" stripped of its "Dental" suffix leaves the single word
 *     "Smile", which this refuses to use as a match candidate at all — the
 *     same guard that keeps a generic industry word like "dental" from
 *     ever being matched on its own);
 *   - every one of its words is also present in the keyword the visitor
 *     typed. "Dental Clinic Amritsar" checked against keyword "best dental
 *     clinic" would otherwise match on the stripped/two-word variant
 *     "dental clinic" — a phrase that's entirely just the keyword's own
 *     generic terms, near-guaranteed to appear in any answer about the
 *     same search, and not real evidence the business itself was named.
 *     The full name ("dental clinic amritsar") is unaffected by this rule
 *     and can still match — "amritsar" isn't in the keyword, so that
 *     variant is more specific than the keyword itself.
 */
export function findMentions(answer: string, businessName: string, keyword: string): MentionResult {
  const searchable = charNormaliseForSearch(answer);
  const fullNormalised = normalise(businessName);
  const keywordWords = new Set(normalise(keyword).split(" ").filter(Boolean));

  function isEntirelyInKeyword(candidate: string): boolean {
    const candidateWords = candidate.split(" ").filter(Boolean);
    return candidateWords.length > 0 && candidateWords.every((word) => keywordWords.has(word));
  }

  const candidates: string[] = [];

  // 1. the full normalised name
  candidates.push(fullNormalised);

  // 2. the name with a trailing generic suffix removed
  const stripped = stripGenericSuffix(fullNormalised);
  if (stripped) candidates.push(stripped);

  // 3. the first two words, only if the full name is 3+ words AND those
  // two words are 8+ characters combined
  const words = fullNormalised.split(" ").filter(Boolean);
  if (words.length >= 3) {
    const twoWords = words.slice(0, 2);
    const combinedLength = twoWords.join("").length;
    if (combinedLength >= 8) candidates.push(twoWords.join(" "));
  }

  for (const candidate of candidates) {
    if (wordCount(candidate) < 2) continue; // never match on a single word
    if (isEntirelyInKeyword(candidate)) continue; // never match on the keyword's own words alone
    const firstMatch = searchable.match(buildVariantRegex(candidate, "u"));
    if (firstMatch && typeof firstMatch.index === "number") {
      const allMatches = searchable.match(buildVariantRegex(candidate, "gu")) ?? [];
      return {
        matched: true,
        variantMatched: candidate,
        firstIndex: firstMatch.index,
        count: allMatches.length,
      };
    }
  }

  return { matched: false, variantMatched: null, firstIndex: null, count: 0 };
}

function extractHostname(url: string): string | null {
  try {
    const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;
    const host = new URL(withProtocol).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return null;
  }
}

function sameDomain(sourceUrl: string, website: string): boolean {
  const sourceHost = extractHostname(sourceUrl);
  const websiteHost = extractHostname(website);
  return sourceHost !== null && websiteHost !== null && sourceHost === websiteHost;
}

export interface ScoreBreakdownRow {
  signal: string;
  points: number;
}

export interface ScoreResult {
  score: number;
  breakdown: ScoreBreakdownRow[];
}

export interface QueryMentionResult {
  label: string;
  answer: string;
  mentions: MentionResult;
}

/**
 * Every row here is a measured fact, published on the report page as the
 * formula — it has to be auditable. Weighted toward what's engine-independent
 * (which pages get cited) over what's Exa-specific (whether Exa's own prose
 * happens to say the business's name), since the citation sources are the
 * one signal that would look the same if a different engine had answered
 * these same three questions. `results` holds ONLY the queries that actually
 * got a real answer back — a failed Exa call contributes nothing here, it's
 * simply absent, which is why "named in all three" can only ever be earned
 * when all three actually ran and all three matched.
 */
export function scoreVisibility(input: {
  results: QueryMentionResult[];
  sources: string[];
  website: string | null;
}): ScoreResult {
  const { results, sources, website } = input;
  const breakdown: ScoreBreakdownRow[] = [];
  let score = 0;

  if (website && sources.some((source) => sameDomain(source, website))) {
    breakdown.push({ signal: "Own domain cited in the sources", points: 40 });
    score += 40;
  }

  const matched = results.filter((r) => r.mentions.matched && r.mentions.firstIndex !== null);

  if (matched.length >= 3) {
    breakdown.push({ signal: "Named in all three answers", points: 30 });
    score += 30;
  } else if (matched.length === 2) {
    breakdown.push({ signal: "Named in two of three answers", points: 20 });
    score += 20;
  } else if (matched.length === 1) {
    breakdown.push({ signal: "Named in one of three answers", points: 10 });
    score += 10;
  }

  if (matched.length > 0) {
    let bestTier = 2; // 0 = first third, 1 = middle third, 2 = last third
    for (const r of matched) {
      const position = r.mentions.firstIndex! / Math.max(r.answer.length, 1);
      const tier = position < 1 / 3 ? 0 : position < 2 / 3 ? 1 : 2;
      if (tier < bestTier) bestTier = tier;
    }
    if (bestTier === 0) {
      breakdown.push({ signal: "Best position in the first third of an answer", points: 20 });
      score += 20;
    } else if (bestTier === 1) {
      breakdown.push({ signal: "Best position in the middle third of an answer", points: 12 });
      score += 12;
    } else {
      breakdown.push({ signal: "Best position in the last third of an answer", points: 6 });
      score += 6;
    }
  }

  if (matched.some((r) => r.mentions.count > 1)) {
    breakdown.push({ signal: "Named more than once in a single answer", points: 10 });
    score += 10;
  }

  return { score: Math.min(score, 100), breakdown };
}

export interface RankedSource {
  url: string;
  citedByCount: number;
  citedIn: string[];
  isOwnDomain: boolean;
}

/**
 * The new headline of the report (see this task's report, Part 2): the
 * pages an AI answer engine actually read, deduplicated across the three
 * answers and ranked by how many of them cited each one. This is the
 * engine-independent claim — a different engine asked the same three
 * questions would very likely read from a similar set of directories,
 * listicles and review sites, even though its own written answer would
 * differ.
 */
export function aggregateSources(results: Array<{ label: string; sources: string[] }>, website: string | null): RankedSource[] {
  const byUrl = new Map<string, RankedSource>();
  for (const r of results) {
    for (const url of r.sources) {
      const existing = byUrl.get(url);
      if (existing) {
        existing.citedByCount += 1;
        existing.citedIn.push(r.label);
      } else {
        byUrl.set(url, {
          url,
          citedByCount: 1,
          citedIn: [r.label],
          isOwnDomain: website !== null && sameDomain(url, website),
        });
      }
    }
  }
  return Array.from(byUrl.values()).sort((a, b) => b.citedByCount - a.citedByCount);
}

export interface CompetitorAppearance {
  name: string;
  appearedIn: number;
}

/**
 * Call 2 (analyse.ts) returns competitor names as a flat, deduplicated
 * list — extracting and deduplicating names across free text is exactly
 * the kind of fuzzy work an AI is suited for. But "how many of the three
 * answers actually named this competitor" is countable, so it's counted
 * here in plain TypeScript rather than trusted from the model, matching
 * this file's own rule that nothing measured may come from a generated
 * value.
 *
 * Names with a verified count of zero are DROPPED, not kept with a
 * fabricated "1" — confirmed live in testing that Exa's analysis call, its
 * own instructions notwithstanding (see analyse.ts's SYSTEM_PROMPT and its
 * header comment), can still return a business name that isn't literally
 * present in any of the supplied answer texts, apparently surfaced from its
 * own live search rather than the provided text. Showing "named in 1 of 3"
 * for a name that appears in zero of them would itself be exactly the kind
 * of overstated claim this whole rework exists to remove.
 */
export function countCompetitorAppearances(names: string[], answers: string[]): CompetitorAppearance[] {
  const normalisedAnswers = answers.map((a) => normalise(a));
  return names
    .map((name) => {
      const needle = normalise(name);
      const count = needle ? normalisedAnswers.filter((a) => a.includes(needle)).length : 0;
      return { name, appearedIn: count };
    })
    .filter((c) => c.appearedIn > 0)
    .sort((a, b) => b.appearedIn - a.appearedIn);
}
