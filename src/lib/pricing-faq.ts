/**
 * Plain data module (not a "use client" file) — RSC treats every export of a
 * client-boundary file as a client reference, so this needs to live
 * separately to be importable from both the client accordion component and
 * the server-rendered JSON-LD FAQPage schema. Same fix already established
 * by src/lib/contact-faq.ts.
 *
 * Every answer is built only from facts already stated elsewhere on this
 * page (hero, plans, guarantee) or already-live sitewide copy (the "one
 * practice per specialty per metro" line from the homepage Pricing
 * section) — no new claims.
 */
export const PRICING_FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: "Why do you publish your pricing when most agencies don't?",
    answer:
      "Most agencies make you sit through a discovery call before they'll tell you a number. We publish ours because the only thing that matters is whether the math works for your practice — and you can check that yourself before ever talking to us.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No. Every plan is month to month — no twelve-month contract, no setup fee, no cancellation penalty. If the numbers don't move, you leave.",
  },
  {
    question: "Can I move between plans?",
    answer:
      "Yes. Everything here is month to month, so you can move up or down between plans whenever your situation changes — there's no contract locking you into the plan you started on.",
  },
  {
    question: "What if I only want the AI visibility work?",
    answer:
      "That's exactly what the Visibility plan is for — single-location practices that want the AI visibility work specifically, without the reputation and content work bundled into Growth or Market Leader.",
  },
  {
    question: "Do you work with more than one practice in the same market?",
    answer:
      "No. We take one practice per specialty per metro, so the visibility work we do for you is never being undone by also doing it for a competitor down the street.",
  },
  {
    question: "How is this different from what my current agency does?",
    answer:
      "Most agencies report rankings and traffic. We report your actual AI citation count — how many times ChatGPT, Google AI Overviews, Perplexity and Gemini name your practice by name — measured with the same questions every month, so you can see the number move.",
  },
];
