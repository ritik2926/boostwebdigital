import Link from "next/link";

/**
 * Primary CTA for /services/ — the sitewide .btn-primary skin (2026-09-11
 * button-system consolidation). Shared between Hero and the closing CTA.
 */
export function ServicesCtaButton({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="btn-primary inline-flex">
      <span>{children}</span>
    </Link>
  );
}
