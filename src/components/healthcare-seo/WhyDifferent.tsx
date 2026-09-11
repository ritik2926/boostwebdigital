import Image from "next/image";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const COMPARISON_ROWS: Array<[string, string]> = [
  ["Normal content review", "YMYL: the highest scrutiny tier"],
  ["Anyone can publish under any name", "A named reviewer with checkable credentials"],
  ["Retargeting is a routine tactic", "Retargeting a patient can be a HIPAA risk"],
  ["Reply to reviews however you want", "Naming a condition in a reply can trigger a complaint"],
  ["Rankings and links decide visibility", "A directory listing often decides first"],
];

export function HealthcareSeoWhyDifferent() {
  return (
    <section id="why-different" className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Angle</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Google Holds Medical Content to a Higher Standard</h2>

        <div className={cn(STACK.headingToSub, "grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12")}>
          <div className="flex flex-col gap-5 text-white/70">
            <p>
              Healthcare SEO answers a harder question than regular SEO does. Google does not just ask &ldquo;is this
              page relevant.&rdquo; For medical topics, it asks &ldquo;can this practice be trusted with someone&rsquo;s
              health decision.&rdquo; That second question changes almost everything below it.
            </p>
            <p>
              Google calls medical content YMYL: Your Money or Your Life. It sits in the highest-scrutiny tier its
              quality raters use, next to finance and safety topics. A trick that works fine on an online store —
              thin pages, unproven claims, no named author — can get a medical page pushed down, or flagged as
              unreliable, instead of just ignored.
            </p>
            <p>
              That extra scrutiny shows up as E-E-A-T: experience, expertise, authority, and trust. In plain terms,
              it means a byline. Who wrote the page, who checked it for accuracy, and whether that reviewer&rsquo;s
              credentials show up on the page itself, not just claimed in a footer. A page with no named author and
              no reviewer reads as unverified, and Google&rsquo;s own guidance treats it that way.
            </p>
            <p>
              HIPAA sits on top of all of this, and it covers choices most industries never think twice about. A
              retargeting pixel on a patient-facing page can reveal that one visitor searched for one condition. A
              cheerful reply to a review that confirms someone was a patient, or names their treatment, can trigger a
              real complaint.
            </p>
            <p>
              This already happened. In March 2022, the Department of Health and Human Services fined a dental
              practice $50,000. The dentist had replied to a bad Yelp review with the patient&rsquo;s name, their main
              complaint, and the treatment they were sent for. The reply was public. So was the fine.{" "}
              <a
                href="https://www.workplaceprivacyreport.com/2022/03/articles/hipaa/get-a-life-another-dentist-responds-to-patients-online-review-this-time-faces-a-50000-ocr-penalty/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
              >
                Source
              </a>
              .
            </p>
            <p>
              Local visibility carries its own weight, separate from any of this. The map pack and insurance-network
              directories often decide who gets the call before a single word of content does. A patient filtering by
              &ldquo;in-network&rdquo; never even reaches the page a content fix improved.
            </p>
            <p className="font-semibold text-white">
              And more and more, ranking and being named are two different outcomes. AI-written answers now sit above
              the normal results for many health questions.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl">
              {/*
                Source: https://www.pexels.com/photo/waiting-room-in-a-hospital-8459996/
                Photographer: Cristian Rojas (Los Muertos Crew) — Pexels License,
                free for commercial use, no attribution required. Downloaded and
                re-encoded to WebP locally; not hotlinked. 1200x800, 28.1KB.
              */}
              <Image
                src="/images/healthcare-seo/clinic-waiting-area.webp"
                alt="An empty, well-lit clinic waiting area with modern seating and a reception counter"
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 45vw, 90vw"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full min-w-90 border-collapse text-left text-sm">
                <caption className="sr-only">Regular SEO compared with healthcare SEO</caption>
                <thead>
                  <tr className="border-b border-white/8">
                    <th scope="col" className="p-4 font-semibold text-white/50">
                      Regular SEO
                    </th>
                    <th scope="col" className="p-4 font-semibold text-white">
                      Healthcare SEO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-white/8 last:border-b-0">
                      <td className="p-4 text-white/60">{row[0]}</td>
                      <td className="p-4 text-white/85">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
