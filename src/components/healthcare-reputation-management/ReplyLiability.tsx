import Image from "next/image";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const NEVER_INCLUDE = [
  "The patient's name, or anything else that identifies them as a patient.",
  "The specific treatment, procedure, or visit details.",
  "A diagnosis, condition, or any health information.",
  "Billing, payment, or insurance details.",
];

const COMPARISON_ROWS: Array<[string, string]> = [
  ["Star average alone", "Velocity, response rate, consistency, and AI visibility together"],
  ["Reply written to defend the treatment", "Reply written to avoid confirming a patient relationship"],
  ["One profile kept current", "Every directory a patient might actually check, kept consistent"],
  ["Reviews solicited from happy patients only", "Every patient asked the same way, every time"],
];

export function HrmReplyLiability() {
  return (
    <section id="the-reply" className={cn("relative scroll-mt-28", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Angle</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Reply Is the Liability, Not the Review</h2>

        <div className={cn(STACK.headingToSub, "grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12")}>
          <div className="flex flex-col gap-5 text-white/70">
            <p className="font-semibold text-white">
              Star ratings recover. A public HIPAA disclosure does not un-happen.
            </p>
            <p>
              That is the actual asymmetry behind every angry reply, and it is the reason this page exists. A reply
              must never contain the four things below — saying &ldquo;we treated you for X&rdquo; confirms a patient
              relationship even if you never wrote a name. That confirmation is the disclosure.
            </p>

            <ul className="flex flex-col gap-3 border-y border-white/8 py-5">
              {NEVER_INCLUDE.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                  {item}
                </li>
              ))}
            </ul>

            <p>
              This already happened, in public, to a real practice. In 2023, the HHS Office for Civil Rights fined
              Manasa Health Center $30,000 — a psychiatric practice in Kendall Park, New Jersey. It had replied to
              four negative Google reviews and disclosed patients&rsquo; mental health diagnoses and treatment
              details. OCR found this violated the HIPAA Privacy Rule under 45 C.F.R. § 164.502(a) and § 164.530(i),
              and the practice took on a two-year corrective action plan.
            </p>
            <p className="rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
              [UNVERIFIED — RITIK TO CONFIRM] This case is confirmed against secondary legal-industry reporting
              (HIPAA Journal, JD Supra), not against the HHS resolution agreement directly — HHS.gov blocked
              automated verification. Confirm the figures above against the source before this page is treated as
              final.
            </p>
            <p>
              The safe version of a reply says almost nothing: thank the reviewer, say the practice takes the
              feedback seriously, and ask them to reach out directly by phone or email. No confirmation, no clinical
              detail, no defense of the treatment. The diagram below sets out exactly when even that much is right.
            </p>
            <p className="text-sm text-white/45">
              This is not legal advice. Confirm anything specific to your situation with your own counsel before you
              rely on it.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl">
              {/*
                Source: https://www.pexels.com/photo/warm-lit-modern-office-corridor-with-plants-31690584/
                Photographer: Hyeok Jang — Pexels License, free for commercial
                use, no attribution required. Downloaded and re-encoded to
                WebP locally; not hotlinked. Cropped to 900x1100, 51.3KB.
              */}
              <Image
                src="/images/healthcare-reputation-management/quiet-corridor.webp"
                alt="A quiet, empty office corridor with warm light and no visible signage"
                width={900}
                height={1100}
                sizes="(min-width: 1024px) 40vw, 90vw"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full min-w-90 border-collapse text-left text-sm">
                <caption className="sr-only">What most reputation work tracks compared with what we track</caption>
                <thead>
                  <tr className="border-b border-white/8">
                    <th scope="col" className="p-4 font-semibold text-white/50">
                      Most reputation work tracks
                    </th>
                    <th scope="col" className="p-4 font-semibold text-white">
                      What we track
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
