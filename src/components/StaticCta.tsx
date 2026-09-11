import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Plain, framer-motion-free CTA components — no cursor-follow physics, no
 * "use client". PrimaryCta wears the sitewide `.btn-primary` skin (2026-09-11
 * button-system consolidation); SecondaryCta wears `.ghost-cta`, unchanged.
 */
export function PrimaryCta({ href, children, className, dataCta }: { href: string; children: React.ReactNode; className?: string; dataCta?: string }) {
  return (
    <Link href={href} className={cn("btn-primary inline-flex", className)} data-cta={dataCta}>
      <span>{children}</span>
    </Link>
  );
}

export function SecondaryCta({ href, children, className, dataCta }: { href: string; children: React.ReactNode; className?: string; dataCta?: string }) {
  return (
    <Link href={href} className={cn("ghost-cta", className)} data-cta={dataCta}>
      <span>{children}</span>
      <svg className="icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
