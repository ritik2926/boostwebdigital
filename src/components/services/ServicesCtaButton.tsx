import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Redesigned primary CTA for /services/ — gradient hairline border (reuses
 * `.card-hairline`'s exact mask technique) over a soft static glow, with a
 * one-shot shine sweep and arrow nudge on hover. Deliberately pure CSS —
 * no JS, no magnetic-pull tracking (explicitly optional in spec, and
 * outside the "use client" whitelist for this page) — hover/focus states
 * cover the same "feels alive" goal at zero JS cost. Shared between Hero
 * and the closing CTA per spec ("the same redesigned CTA").
 */
export function ServicesCtaButton({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "card-hairline group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#0c0c11] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(var(--accent-rgb),0.25)] transition-shadow duration-300 hover:shadow-[0_0_36px_rgba(var(--accent-rgb),0.4)]"
      )}
    >
      {/* One-shot diagonal shine, transform-only, triggered on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1] -translate-x-[150%] bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]"
      />
      <span className="relative">{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="relative shrink-0 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
