import { PrimaryCta } from "@/components/StaticCta";

/**
 * Contextual, not floating — sits inline in the article body, after the
 * third H2 (src/lib/blog/splitAfterHeading.ts), per this task's brief.
 * Distinct from blog/InlineCtaCard.tsx, which is a grid tile for the
 * /blogs/ archive; this is a full-width prose-column banner instead.
 */
export function InlineCheckerCta() {
  return (
    <div className="my-10 flex flex-col items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <p className="font-display text-lg font-semibold text-white">See what AI says about your practice</p>
        <p className="mt-1.5 text-sm text-white/60">Free. No card. About 40 seconds.</p>
      </div>
      <PrimaryCta href="/tools/ai-visibility-checker/" dataCta="blog-inline-cta" className="inline-flex shrink-0">
        Check My Practice&rsquo;s AI Visibility
      </PrimaryCta>
    </div>
  );
}
