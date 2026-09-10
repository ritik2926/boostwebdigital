import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Plain, framer-motion-free stand-ins for MagneticButton/GhostButton
 * (src/components/Buttons.tsx), for the same reason as StaticGlow.tsx:
 * MagneticButton is a "use client" component built on framer-motion's
 * useMotionValue/useSpring for its cursor-follow physics, which is exactly
 * the dependency /dermatology-marketing/ and /dental-marketing/ must not
 * pull in. Both `.shiny-cta`/`.ghost-cta` CSS classes in globals.css already
 * carry the full visual treatment (gradient border, dot texture, shimmer
 * sweep, icon reveal) as plain CSS — the magnetic mouse-follow offset and
 * whileTap scale are the only things this drops, and `.shiny-cta` already
 * disables its own continuous animation on coarse pointers regardless.
 */
export function PrimaryCta({ href, children, className, dataCta }: { href: string; children: React.ReactNode; className?: string; dataCta?: string }) {
  return (
    <Link href={href} className={cn("shiny-cta", className)} data-cta={dataCta}>
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
