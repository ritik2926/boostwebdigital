"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { MagneticButton } from "@/components/Buttons";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// Navbar — layoutId-shared active/hover highlight, per the locked spec in
// docs/12-DESIGN-STANDARDS.md §8 (Navigation).
// ---------------------------------------------------------------------------

// Services/Pricing/FAQ are same-page anchors on the homepage, not routes —
// root-relative ("/#services") so they still resolve correctly when clicked
// from a real route like /about/ or /blogs/ instead of just appending an
// inert hash to the current URL.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Services", href: "/#services" },
  { label: "Blog", href: "/blogs/" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const MotionLink = motion.create(Link);

function DesktopNavLinks({ className }: { className?: string }) {
  const [active, setActive] = useState<string>(NAV_LINKS[0].label);

  return (
    <div
      className={cn("relative hidden items-center gap-1 lg:flex", className)}
      onMouseLeave={() => setActive(NAV_LINKS[0].label)}
    >
      {NAV_LINKS.map((item) => {
        const isActive = active === item.label;
        return (
          <Link
            key={item.label}
            href={item.href}
            onMouseEnter={() => setActive(item.label)}
            className="relative px-4 py-2 text-sm"
          >
            {isActive && (
              <motion.span
                layoutId="nav-highlight"
                className="absolute inset-x-3 bottom-1 h-px rounded-full bg-white/60"
                style={{ boxShadow: "0 0 6px rgba(255,255,255,0.55), 0 -8px 10px -4px rgba(255,255,255,0.35)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className={cn("relative transition-colors", isActive ? "text-white" : "text-white/60")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="relative lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/4"
      >
        <div className="relative h-4 w-5">
          <motion.span
            animate={{ rotate: open ? 45 : 0, top: open ? "50%" : "0%" }}
            transition={{ duration: 0.3, ease: EASE.primary }}
            className="absolute left-0 top-0 h-[1.5px] w-full -translate-y-1/2 bg-white"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.2, ease: EASE.primary }}
            className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-white"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, top: open ? "50%" : "100%" }}
            transition={{ duration: 0.3, ease: EASE.primary }}
            className="absolute left-0 h-[1.5px] w-full -translate-y-1/2 bg-white"
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(1% at 100% 0%)", opacity: 0.6 }}
            animate={{ clipPath: "circle(175% at 100% 0%)", opacity: 1 }}
            exit={{ clipPath: "circle(1% at 100% 0%)", opacity: 0.6 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 -z-10 flex flex-col overflow-hidden bg-[#08080a]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25"
              style={{ filter: "blur(70px)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/10"
              style={{ filter: "blur(80px)" }}
            />

            <nav className="relative flex flex-1 flex-col items-center justify-center gap-1 px-6">
              {NAV_LINKS.map((item, i) => (
                <MotionLink
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.4, delay: 0.16 + 0.06 * i, ease: EASE.primary }}
                  className="font-display py-3 text-3xl text-white/80 transition-colors hover:text-white sm:text-4xl"
                >
                  {item.label}
                </MotionLink>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.4, delay: 0.16 + 0.06 * NAV_LINKS.length, ease: EASE.primary }}
                className="mt-8 w-full max-w-xs px-2"
              >
                <MagneticButton className="w-full">Book a consultation</MagneticButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Scroll-driven "squeeze": at rest, no box/border at all — logo, links, and
 * CTA float directly on the page. Past ~100px of scroll, the bar narrows,
 * the glass box/border/blur fades in, and padding tightens — logo and CTA
 * visibly move closer to the nav links.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const barWidth = useTransform(scrollY, [0, 100], ["100%", "88%"]);
  const chromeOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const contentPaddingY = useTransform(scrollY, [0, 100], [16, 10]);
  const contentPaddingX = useTransform(scrollY, [0, 100], [8, 20]);

  return (
    <header className="sticky top-0 z-(--z-nav) pt-4">
      <Container>
        <motion.div style={{ width: barWidth }} className="relative mx-auto">
          {/* Chrome layer: glass bg + border + shadow + ambient sheen — fades
              in with scroll, absent (no box) at rest. */}
          <motion.div
            aria-hidden
            style={{ opacity: chromeOpacity }}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full border border-white/8 bg-white/4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div
              className="absolute -top-10 left-1/3 h-24 w-64 rounded-full bg-white/8"
              style={{ filter: "blur(24px)" }}
            />
          </motion.div>

          <motion.div
            style={{ paddingTop: contentPaddingY, paddingBottom: contentPaddingY, paddingLeft: contentPaddingX, paddingRight: contentPaddingX }}
            className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center"
          >
            <Link href="/" className="flex items-center justify-self-start">
              <Image
                src="/logo/logo-dark.svg"
                alt="Boost Web Digital"
                width={160}
                height={54}
                className="h-8 w-auto sm:h-9"
                priority
              />
            </Link>

            <DesktopNavLinks className="justify-self-center" />

            <div className="col-start-3 flex items-center justify-self-end gap-2 sm:gap-4">
              <MagneticButton className="hidden shrink-0 sm:inline-flex">Book a consultation</MagneticButton>
              <MobileNav />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </header>
  );
}
