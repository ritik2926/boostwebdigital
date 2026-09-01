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

/**
 * Every row here is a measured fact, published on the report page as the
 * formula — it has to be auditable. "Which third" is firstIndex /
 * answer.length: deterministic, and it measures how early the AI brings the
 * business up, without ranking it against competitors (competitor names
 * are a call-2/generated value — see analyse.ts — and a measured score must
 * never depend on one).
 */
export function scoreVisibility(input: {
  answer: string;
  mentions: MentionResult;
  sources: string[];
  website: string | null;
}): ScoreResult {
  const { answer, mentions, sources, website } = input;
  const breakdown: ScoreBreakdownRow[] = [];

  if (!mentions.matched || mentions.firstIndex === null) {
    breakdown.push({ signal: "Not named in the answer", points: 0 });
    return { score: 0, breakdown };
  }

  let score = 0;

  breakdown.push({ signal: "Named in the answer", points: 50 });
  score += 50;

  const position = mentions.firstIndex / Math.max(answer.length, 1);
  if (position < 1 / 3) {
    breakdown.push({ signal: "First mention in the first third of the answer", points: 25 });
    score += 25;
  } else if (position < 2 / 3) {
    breakdown.push({ signal: "First mention in the middle third of the answer", points: 15 });
    score += 15;
  } else {
    breakdown.push({ signal: "First mention in the last third of the answer", points: 10 });
    score += 10;
  }

  if (website && sources.some((source) => sameDomain(source, website))) {
    breakdown.push({ signal: "Own domain appears in the citation sources", points: 15 });
    score += 15;
  }

  if (mentions.count > 1) {
    breakdown.push({ signal: "Named more than once", points: 10 });
    score += 10;
  }

  return { score: Math.min(score, 100), breakdown };
}
