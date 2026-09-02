import Image from "next/image";

/**
 * PART 4 — appears near the end of the report page. The email's own
 * version is built separately in src/lib/checker/leads.ts (email HTML
 * can't use next/image or Tailwind), but carries the identical photo,
 * name, title, and note text — see that file's own comment for why it
 * isn't shared code.
 *
 * Photo, name and signed note only — appears for everyone, unchanged
 * (PART 4, "open to all" task). It used to also carry its own hardcoded
 * button pitching the healthcare GEO service to every visitor regardless
 * of industry, which is exactly the "pitch a healthcare service to a
 * restaurant" the brief forbids; that button is removed, not made
 * conditional, so there's a single closing CTA per report (the dedicated,
 * industry-conditional section right above this block in FullReport.tsx —
 * @/lib/checker/reportCopy's buildClosingCta) rather than two competing
 * ones stacked back to back.
 */
const NOTE =
  "I read every report that comes through here. If anything above doesn't make sense, or you want to know what it would take to fix it, reply to this email and you'll get me — not a form.";

export function FounderBlock() {
  return (
    <section aria-labelledby="checker-founder-heading" data-print-avoid-break className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8">
      <h3 id="checker-founder-heading" className="sr-only">
        A note from the founder
      </h3>
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Image
          src="/founder/ritik.jpg"
          alt="Ritik Malhotra"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="font-display text-lg font-bold text-white">Ritik Malhotra</p>
          <p className="text-sm text-white/50">Founder, Boost Web Digital</p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80">&ldquo;{NOTE}&rdquo;</p>
        </div>
      </div>
    </section>
  );
}
