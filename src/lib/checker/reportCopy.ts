/**
 * Sections 2 and 3 of the shareable report — the verdict and "what this
 * means for you". Pure TypeScript templates, never AI-generated: the same
 * measured facts must always produce identical wording. See this task's
 * report for the governing rule ("interpret before you evidence") and the
 * exact text of every branch below.
 *
 * Never states more certainty than the data supports, never names an
 * engine that wasn't queried, never invents a number — every number
 * interpolated below (namedCount, totalQueries, a page count) is a
 * measured fact already computed elsewhere (parse.ts / report.ts), never
 * generated here.
 */

export interface VerdictInput {
  businessName: string;
  namedCount: number;
  totalQueries: number;
}

/** Section 2 — the biggest thing on the page, one plain sentence. */
export function buildVerdict(input: VerdictInput): string {
  return input.namedCount > 0
    ? `${input.businessName} was named in ${input.namedCount} of the three answers we checked.`
    : `${input.businessName} was not named in any of the three answers we checked.`;
}

export interface InterpretationInput {
  businessName: string;
  namedCount: number;
  ownDomainCited: boolean;
  totalSourcesCount: number;
}

/**
 * Section 3 — four branches, selected purely by (named vs not) × (own
 * domain cited vs not), plus one further special case for zero citations
 * at all. This is deliberately not a finer-grained matrix on namedCount
 * (1 vs 2 vs 3) — the practical takeaway for a practice owner is the same
 * whether they were named once or three times; the number itself already
 * appears in the sentence.
 */
export function buildInterpretation(input: InterpretationInput): string {
  const { businessName, namedCount, ownDomainCited, totalSourcesCount } = input;
  const otherPagesCount = totalSourcesCount - (ownDomainCited ? 1 : 0);

  if (namedCount === 0 && !ownDomainCited) {
    if (totalSourcesCount === 0) {
      return `Right now, this engine doesn't mention ${businessName}, and it isn't citing any real pages to answer this question at all — not yours, not a competitor's. That's a different problem than losing to someone else: there's nothing to compete against yet, which is still worth understanding before you invest in fixing it.`;
    }
    return `Right now, this engine doesn't mention ${businessName} — and it isn't reading anything from your site either. It's citing ${otherPagesCount} other ${otherPagesCount === 1 ? "page" : "pages"} to answer this question instead. For a patient asking this exact thing, ${businessName} doesn't currently exist as an answer.`;
  }

  if (namedCount === 0 && ownDomainCited) {
    return `This engine is reading your site — it's one of the ${totalSourcesCount} pages cited to answer this question — but your name never made it into what it actually told a patient, in any of the three answers we checked. Being a source isn't the same as being the recommendation.`;
  }

  if (namedCount > 0 && !ownDomainCited) {
    return `${businessName} was named in ${namedCount} of the three answers we checked, which is a real result — but your own site wasn't among the ${otherPagesCount} ${otherPagesCount === 1 ? "page" : "pages"} this engine actually cited to get there. Whatever is making you visible right now doesn't depend on your website, which is a fragile position to be in.`;
  }

  return `${businessName} was named in ${namedCount} of the three answers we checked, and your own site is one of the ${totalSourcesCount} pages this engine reads to answer this question. That's the strongest position to be in — you're not just mentioned, you're a source it actually reads.`;
}
