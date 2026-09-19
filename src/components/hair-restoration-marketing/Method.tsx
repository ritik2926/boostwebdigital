import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const STEPS = [
  {
    number: "01",
    name: "Map the private research window",
    body: "A hair transplant decision usually runs six to twelve months, almost entirely in private — comparing FUE against FUT, checking before-and-after results, reading clinic reviews, and increasingly asking an AI tool directly instead of a search engine. We scan for the exact questions patients ask at each stage, not one generic keyword list.",
  },
  {
    number: "02",
    name: "Diagnose against the clinics actually being named",
    body: "We check which competing clinics an AI answer engine names for those questions today, and why — a stronger review profile, clearer before-and-after documentation, or simply a page that answers the question your page doesn't.",
  },
  {
    number: "03",
    name: "Fix the entity signals, not just the page copy",
    body: "Surgeon credentials, technique-specific content (FUE, FUT, DHI), consistent business information across every listing, and structured data an AI system can actually read — this is the same entity-consistency work described in our approach to AI search visibility, applied to a category where trust and technique detail decide the booking.",
  },
  {
    number: "04",
    name: "Rescan monthly, report what actually moved",
    body: "You see whether your clinic gets named more often, for which questions, and against which competitors — the same measured, engine-independent scoring behind our free visibility check, run on your real query set every month.",
  },
] as const;

export function HairRestorationMethod() {
  return (
    <section id="method" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Method</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What We Actually Do</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Read the full technical breakdown of the search and content side on our{" "}
          <Link href="/hair-restoration-seo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            hair restoration SEO
          </Link>{" "}
          page. This is the same{" "}
          <Link href="/ai-visibility-geo/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            AI search visibility
          </Link>{" "}
          approach we run for every specialty, applied to a category where the research window is longer and more
          private than almost any other.
        </p>

        <ul className={cn(STACK.subToContent, "flex flex-col divide-y divide-white/8 border-t border-white/8")}>
          {STEPS.map((step) => (
            <li key={step.number} className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-6">
              <span aria-hidden className="font-display text-4xl font-extrabold text-white/15 sm:col-span-2 sm:text-5xl">
                {step.number}
              </span>
              <div className="sm:col-span-10">
                <p className="text-lg font-semibold text-white">{step.name}</p>
                <p className="mt-2 max-w-2xl text-white/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
