import Image from "next/image";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const COMPARISON_ROWS: Array<[string, string, string]> = [
  [
    "Acquisition",
    "A new patient finds you here for the first time",
    "Rarely. Almost no one searches social media the way they search Google or ask a friend for a name.",
  ],
  [
    "Verification",
    "A patient who already has your name checks if you are real and current",
    "Yes. This is the job social media actually does for a practice.",
  ],
  [
    "Retention",
    "Existing patients stay a little more engaged between visits",
    "Sometimes. Depends entirely on whether there is anything worth seeing.",
  ],
];

export function HsmmWhatItActuallyDoes() {
  return (
    <section id="what-it-does" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Angle</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Social Media Does One Job Well, Not Three</h2>

        <div className={cn(STACK.headingToSub, "grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12")}>
          <div className="flex flex-col gap-5 text-white/70">
            <p>
              Most social media advice for practices assumes it is an acquisition channel. Post more, get found by
              more people, get more patients. For most healthcare practices, that assumption does not hold.
            </p>
            <p>
              Almost no patient searches Instagram to find a new provider the way they search Google or ask a
              friend. What they do instead is check an existing account. They want to decide whether you look real,
              current, and worth trusting with something clinical.
            </p>
            <p className="font-semibold text-white">
              That is a verification job, not an acquisition job — and it disqualifies the wrong buyers, which is the
              point.
            </p>
            <p>
              An account posted to twice last year fails that check even if the practice itself is excellent. A
              current, unremarkable account passes it. Retention sits between the two: patients who already see you
              sometimes stay a little more engaged if there is something worth seeing between visits.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl">
              {/*
                Source: https://www.pexels.com/photo/modern-office-space-with-indoor-plants-28461045/
                Photographer: Alpha En — Pexels License, free for commercial
                use, no attribution required. Downloaded and re-encoded to
                WebP locally; not hotlinked. Cropped to 900x1100, 74.9KB.
              */}
              <Image
                src="/images/healthcare-social-media-management/quiet-workspace.webp"
                alt="A quiet, empty seating area with a plant and natural light, no signage visible"
                width={900}
                height={1100}
                sizes="(min-width: 1024px) 40vw, 90vw"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className={cn(STACK.subToContent, "overflow-x-auto rounded-2xl border border-white/8")}>
          <table className="w-full min-w-160 border-collapse text-left text-sm">
            <caption className="sr-only">What social media moves for a practice, and what it does not</caption>
            <thead>
              <tr className="border-b border-white/8">
                <th scope="col" className="p-4 font-semibold text-white">
                  What it could do
                </th>
                <th scope="col" className="p-4 font-semibold text-white/50">
                  What that means
                </th>
                <th scope="col" className="p-4 font-semibold text-white/50">
                  Does it actually happen?
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
