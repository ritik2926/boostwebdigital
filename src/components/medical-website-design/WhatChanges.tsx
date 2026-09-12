import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const COMPARISON_ROWS: Array<[string, string, string]> = [
  [
    "A visual refresh",
    "New colors, new photography, a template swap",
    "No. Looks different, measures the same.",
  ],
  [
    "Page speed",
    "How long a patient waits before the page is usable, measured by Google's Core Web Vitals",
    "Yes, if the underlying code changes, not just the theme on top of it.",
  ],
  [
    "The booking path",
    "How many taps it takes to request an appointment on a phone",
    "Yes, and it is usually the single most valuable fix on the whole site.",
  ],
  [
    "Accessibility",
    "Whether a patient using a screen reader or keyboard-only navigation can actually use the site",
    "Only if it is built in, not layered on after launch.",
  ],
  [
    "AI and search readability",
    "Whether the code structure lets a crawler or an AI system parse who you are and what you treat",
    "Only if the technical foundation is rebuilt, not just the layout.",
  ],
] as const;

export function MwdWhatChanges() {
  return (
    <section id="what-changes" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Angle</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>A Redesign and a Rebuild Are Not the Same Project</h2>

        <div className={cn(STACK.headingToSub, "flex max-w-2xl flex-col gap-4 text-white/70")}>
          <p>
            Most agencies sell a website project as a look. New colors, a new template, updated photography. That
            work is real, but it does not change how fast the page loads, how many taps a patient needs to book, or
            whether the site can be read by someone using a screen reader.
          </p>
          <p className="font-semibold text-white">
            Those three things are what a redesign is usually blamed for not fixing, because they were never part of
            the brief.
          </p>
        </div>

        <div className={cn(STACK.subToContent, "overflow-x-auto rounded-2xl border border-white/8")}>
          <table className="w-full min-w-180 border-collapse text-left text-sm">
            <caption className="sr-only">What a typical redesign changes, and what it does not</caption>
            <thead>
              <tr className="border-b border-white/8">
                <th scope="col" className="p-4 font-semibold text-white">
                  What it is
                </th>
                <th scope="col" className="p-4 font-semibold text-white/50">
                  What that means
                </th>
                <th scope="col" className="p-4 font-semibold text-white/50">
                  Does a visual redesign fix it?
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row[0]} className="border-b border-white/8 last:border-b-0">
                  <td className="p-4 font-semibold text-white">{row[0]}</td>
                  <td className="p-4 text-white/60">{row[1]}</td>
                  <td className="p-4 text-white/85">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
