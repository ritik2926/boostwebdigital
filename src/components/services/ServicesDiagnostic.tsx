import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const ROWS: Array<{ symptom: string; href: string; anchor: string }> = [
  {
    symptom: "Patients find us but book somewhere else",
    href: "/healthcare-reputation-management/",
    anchor: "Start with reputation management",
  },
  {
    symptom: "We don't appear when patients ask an AI tool",
    href: "/ai-visibility-geo/",
    anchor: "Start with AI visibility",
  },
  {
    symptom: "Our site is five years old and slow",
    href: "/medical-website-design/",
    anchor: "Start with website design",
  },
  {
    symptom: "We rank fine but the phone doesn't ring",
    href: "/medical-website-design/",
    anchor: "Start with the booking path",
  },
  {
    symptom: "We have almost no reviews",
    href: "#who-this-isnt-for",
    anchor: "Fix that first, before hiring anyone",
  },
  {
    symptom: "We're invisible for the procedures we actually make money on",
    href: "/healthcare-seo/",
    anchor: "Start with healthcare SEO",
  },
];

export function ServicesDiagnostic() {
  return (
    <section id="diagnostic" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Start Here</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>What&rsquo;s Actually Wrong, and Where to Start</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          Find the row closest to your situation. The right-hand column is where that specific problem gets fixed —
          not a menu of everything we offer.
        </p>

        <div className={cn(STACK.subToContent, "overflow-x-auto rounded-2xl border border-white/8")}>
          <table className="w-full min-w-160 border-collapse text-left text-sm">
            <caption className="sr-only">Common symptoms and which service addresses each one</caption>
            <thead>
              <tr className="border-b border-white/8">
                <th scope="col" className="p-4 font-semibold text-white">
                  What you&rsquo;re seeing
                </th>
                <th scope="col" className="p-4 font-semibold text-white/50">
                  Where to start
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.symptom} className="border-b border-white/8 last:border-b-0">
                  <td className="p-4 align-top font-medium text-white">{row.symptom}</td>
                  <td className="p-4 align-top">
                    <Link
                      href={row.href}
                      className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
                    >
                      {row.anchor}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={cn(STACK.subToContent, "max-w-2xl font-semibold text-white")}>
          Under 20 reviews is already on our own qualification list, below. We would rather tell you to fix that
          first than take a retainer we know won&rsquo;t show results yet.
        </p>
      </Container>
    </section>
  );
}
