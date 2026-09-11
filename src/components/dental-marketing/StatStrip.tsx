import { Container } from "@/components/Container";
import { SECTION_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * SECTION 2 — the three sitewide-permitted statistics, and no others. No
 * fourth number anywhere in this file. Matches src/lib/faqs.ts /
 * src/app/about/page.tsx's own three: 88% AI Overviews, 36% patients use
 * AI, 75% won't book below 4.0 stars.
 */
const STATS = [
  { value: "88%", label: "of health searches now trigger an AI-generated answer before a single blue link." },
  { value: "36%", label: "of patients already use an AI tool to find a provider." },
  { value: "75%", label: "won't book a provider rated below 4.0 stars." },
] as const;

export function DentalStatStrip() {
  return (
    <section className={cn("relative border-y border-white/8", SECTION_PADDING.default)}>
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {STATS.map((stat) => (
            <div key={stat.value} className="flex flex-col gap-2">
              <span className="font-display text-4xl font-extrabold text-white sm:text-5xl">{stat.value}</span>
              <p className="max-w-[26ch] text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
