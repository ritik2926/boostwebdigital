import Image from "next/image";
import Link from "next/link";

/**
 * PART 4 — appears near the end of the report page. The email's own
 * version is built separately in src/lib/checker/leads.ts (email HTML
 * can't use next/image or Tailwind), but carries the identical photo,
 * name, title, and note text — see that file's own comment for why it
 * isn't shared code.
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
      <div className="mt-6">
        <Link href="/ai-visibility-geo/" className="shiny-cta">
          <span>See the full AI Search Visibility service</span>
        </Link>
      </div>
    </section>
  );
}
