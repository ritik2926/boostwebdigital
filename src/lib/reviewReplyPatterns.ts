/**
 * Plain pattern matching, no AI, no API, no network call — this file is
 * imported by src/components/tools/ReviewReplyChecker.tsx ("use client")
 * and must stay that way: nothing here may import fetch, an env var, or
 * anything server-only. The whole point of this tool is that a pasted
 * draft reply never leaves the browser.
 *
 * Four categories run on the draft reply alone. Two ("repeats a clinical
 * detail the reviewer disclosed" and "names the reviewer beyond what they
 * posted") are meaningfully different from the general clinical-detail and
 * name checks only when the reviewer's original review text is also
 * pasted (optional) — without it, they fall back to a broader, still-
 * honest version of the same check rather than being silently skipped.
 */

export type FlagCategory =
  | "confirms-patient"
  | "clinical-detail"
  | "repeats-disclosed-detail"
  | "date-time"
  | "billing"
  | "names-beyond-disclosure";

export interface Flag {
  start: number;
  end: number;
  text: string;
  category: FlagCategory;
  reason: string;
}

export const CATEGORY_LABEL: Record<FlagCategory, string> = {
  "confirms-patient": "Confirms this person is a patient",
  "clinical-detail": "Names a condition, treatment, or medication",
  "repeats-disclosed-detail": "Repeats a clinical detail the reviewer disclosed",
  "date-time": "Names a date, time, or visit detail",
  billing: "Mentions payment, billing, insurance, or a balance",
  "names-beyond-disclosure": "Names the reviewer beyond what they posted",
};

const PATIENT_CONFIRMATION_PATTERNS = [
  /\bour patient\b/gi,
  /\bwhen you came in\b/gi,
  /\byour appointment\b/gi,
  /\byou were seen\b/gi,
  /\byour visit\b/gi,
  /\bas a patient\b/gi,
  /\byour treatment\b/gi,
  /\byour procedure\b/gi,
];

// Not exhaustive — a moderate, cross-specialty list (dental, dermatology,
// med spa, general practice). Flags a real phrase; doesn't claim to catch
// every possible clinical term.
const CLINICAL_KEYWORDS = [
  "diagnosis",
  "diagnosed",
  "prescribed",
  "prescription",
  "medication",
  "treatment for",
  "procedure",
  "surgery",
  "surgical",
  "biopsy",
  "infection",
  "condition",
  "therapy",
  "dosage",
  "botox",
  "filler",
  "fillers",
  "invisalign",
  "root canal",
  "extraction",
  "chemical peel",
  "microneedling",
  "coolsculpting",
  "laser hair removal",
  "mole",
  "rash",
  "anxiety",
  "depression",
  "cancer",
  "diabetes",
  "blood pressure",
  "allergic reaction",
  "side effect",
  "x-ray",
  "mri",
  "referral",
];

const DATE_TIME_PATTERNS = [
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?\b/gi,
  /\b(yesterday|last week|last month|this morning|last night|tonight|earlier today|this week)\b/gi,
  /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/gi,
];

const BILLING_KEYWORDS = [
  "bill",
  "billing",
  "invoice",
  "insurance",
  "copay",
  "co-pay",
  "balance",
  "charge",
  "payment",
  "refund",
  "deductible",
  "claim",
];

// A common way a reply names the reviewer beyond what they posted: greeting
// them by name, or thanking them by name. Deliberately narrow (not "any
// capitalized word") to avoid flagging product names, days, or sentence-
// initial capitals as false positives.
const NAME_GREETING_PATTERNS = [/^(hi|hello|dear|hey)\s+([A-Z][a-z]+)\b/i, /\b(thanks?,|thank you,)\s+([A-Z][a-z]+)\b/gi];

function keywordRegex(words: string[]): RegExp {
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
}

function collectMatches(text: string, patterns: RegExp[]): Array<{ start: number; end: number; text: string }> {
  const matches: Array<{ start: number; end: number; text: string }> = [];
  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
      if (m[0].length === 0) re.lastIndex++; // never loop forever on a zero-width match
    }
  }
  return matches;
}

/** Drops any match fully contained inside an earlier, already-kept match —
 * two categories catching the exact same span would otherwise double-count
 * it in the flagged list. */
function dedupeOverlaps<T extends { start: number; end: number }>(matches: T[]): T[] {
  const sorted = [...matches].sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: T[] = [];
  for (const m of sorted) {
    const overlapsKept = kept.some((k) => m.start < k.end && m.end > k.start);
    if (!overlapsKept) kept.push(m);
  }
  return kept.sort((a, b) => a.start - b.start);
}

export function scanReviewReply(reply: string, originalReview: string): Flag[] {
  const flags: Flag[] = [];
  const reviewLower = originalReview.trim().toLowerCase();
  const hasReview = reviewLower.length > 0;

  for (const m of collectMatches(reply, PATIENT_CONFIRMATION_PATTERNS)) {
    flags.push({
      ...m,
      category: "confirms-patient",
      reason: "This phrase confirms a relationship with this specific person, which HIPAA treats as protected information on its own.",
    });
  }

  for (const m of collectMatches(reply, [keywordRegex(CLINICAL_KEYWORDS)])) {
    const phraseInReview = hasReview && reviewLower.includes(m.text.toLowerCase());
    flags.push(
      phraseInReview
        ? {
            ...m,
            category: "repeats-disclosed-detail",
            reason: "The review already mentions this — repeating it back is still your practice confirming clinical information publicly.",
          }
        : {
            ...m,
            category: "clinical-detail",
            reason: "This names a specific condition, treatment, or medication in a public reply.",
          }
    );
  }

  for (const m of collectMatches(reply, DATE_TIME_PATTERNS)) {
    flags.push({
      ...m,
      category: "date-time",
      reason: "A specific date, time, or visit detail can help identify this person even without naming them.",
    });
  }

  for (const m of collectMatches(reply, [keywordRegex(BILLING_KEYWORDS)])) {
    flags.push({
      ...m,
      category: "billing",
      reason: "Payment and billing details are protected the same way clinical details are.",
    });
  }

  for (const pattern of NAME_GREETING_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    let m: RegExpExecArray | null;
    while ((m = re.exec(reply)) !== null) {
      const name = m[2] ?? m[1];
      if (!name) continue;
      const nameInReview = hasReview && reviewLower.includes(name.toLowerCase());
      flags.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0],
        category: "names-beyond-disclosure",
        reason:
          hasReview && !nameInReview
            ? "This name doesn't appear anywhere in the review as posted — confirm the reviewer disclosed it publicly before using it."
            : "Addressing a reviewer by name in a public reply can itself confirm they're a patient — confirm this name was already public before publishing.",
      });
    }
  }

  return dedupeOverlaps(flags);
}

/** Rendered both statically in page.tsx (so a no-JS visitor still sees a
 * real safe-reply template, per this tool's own "works without JS"
 * requirement) and again inside the interactive results, right under the
 * draft it was checked against. */
export const SAFE_REPLY_TEMPLATE =
  "Thank you for taking the time to share your feedback. We take every patient experience seriously, and we'd like to understand more. Please reach out to our office directly so we can look into this properly — we're not able to discuss any specific patient details in a public reply.";

export interface TextSegment {
  text: string;
  flag: Flag | null;
}

/** Splits the draft into an ordered list of plain and flagged segments, so
 * the component can render each flagged span inside a <mark> without doing
 * any of this index math itself. */
export function segmentText(text: string, flags: Flag[]): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const flag of flags) {
    if (flag.start > cursor) segments.push({ text: text.slice(cursor, flag.start), flag: null });
    segments.push({ text: text.slice(flag.start, flag.end), flag });
    cursor = flag.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), flag: null });
  return segments;
}
