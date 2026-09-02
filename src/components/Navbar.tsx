"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { MagneticButton } from "@/components/Buttons";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// Navbar — layoutId-shared active/hover highlight, per the locked spec in
// docs/12-DESIGN-STANDARDS.md §8 (Navigation).
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

// Services renders as its own dropdown (see ServicesDropdown) rather than a
// plain NAV_LINKS entry, so /ai-visibility-geo/ can live as a real sub-page
// under it without a second top-level nav item.
const SERVICES_SUBLINKS: Array<{ label: string; href: string }> = [
  { label: "All Services", href: "/services/" },
  { label: "AI Search Visibility", href: "/ai-visibility-geo/" },
];

// Grouped under the "Other" dropdown. `href: null` means the page doesn't
// exist yet — rendered disabled with a "Soon" tag rather than a dead link
// (no fake functional UI, per CLAUDE.md's honesty rule).
const OTHER_LINKS: Array<{ label: string; href: string | null }> = [
  // AI Visibility Checker link deliberately removed while the three-query
  // rework ships — see this task's report. Restored in the final commit.
  { label: "Blogs", href: "/blogs/" },
  { label: "AI News", href: null },
  { label: "FAQs", href: "/faq/" },
  { label: "Pricing", href: "/pricing/" },
];

const MotionLink = motion.create(Link);

// Real routes (no "#") are matched against the current pathname so the
// underline follows the page you're actually on; anchor links only ever
// activate on hover since there's no scroll-spy tracking which section is
// in view. A real route living inside the "Other" dropdown (e.g. Blogs)
// activates the "Other" trigger itself rather than nothing at all.
function getActiveLabel(pathname: string) {
  if (pathname === "/") return "Home";
  for (const item of NAV_LINKS) {
    if (item.href === "/" || item.href.includes("#")) continue;
    const hrefPath = item.href.replace(/\/$/, "");
    if (pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)) {
      return item.label;
    }
  }
  for (const item of SERVICES_SUBLINKS) {
    const hrefPath = item.href.replace(/\/$/, "");
    if (pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)) {
      return "Services";
    }
  }
  for (const item of OTHER_LINKS) {
    if (!item.href || item.href.includes("#")) continue;
    const hrefPath = item.href.replace(/\/$/, "");
    if (pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)) {
      return "Other";
    }
  }
  return "";
}

function NavHighlight() {
  return (
    <motion.span
      layoutId="nav-highlight"
      className="absolute inset-x-3 bottom-1 h-px rounded-full bg-white/60"
      style={{ boxShadow: "0 0 6px rgba(255,255,255,0.55), 0 -8px 10px -4px rgba(255,255,255,0.35)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}

/**
 * Unlike OtherDropdown, "Services" has a real destination of its own, so
 * the trigger is a genuine <Link> to /services/ (not just a toggle button)
 * — the chevron is decorative only. Hovering/focusing still reveals the
 * sub-page list underneath, same panel mechanics as OtherDropdown.
 */
function ServicesDropdown({ active, onHover }: { active: boolean; onHover: (label: string | null) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        onHover("Services");
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        onHover("Services");
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link href="/services/" className="relative flex items-center gap-1 px-4 py-2 text-sm">
        {active && <NavHighlight />}
        <span className={cn("relative transition-colors", active ? "text-white" : "text-white/60")}>Services</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={cn("relative mt-px text-white/50 transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Always rendered — see OtherDropdown's identical note on crawlers
          that never fire hover/focus. */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 6 }}
        transition={{ duration: 0.2, ease: EASE.primary }}
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
        className="absolute left-1/2 top-full z-(--z-raised) w-52 -translate-x-1/2 pt-3"
      >
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b0b0f]/95 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {SERVICES_SUBLINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function OtherDropdown({ active, onHover }: { active: boolean; onHover: (label: string | null) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        onHover("Other");
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        onHover("Other");
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex items-center gap-1 px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {active && <NavHighlight />}
        <span className={cn("relative transition-colors", active ? "text-white" : "text-white/60")}>Other</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={cn("relative mt-px text-white/50 transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Always rendered (not `{open && ...}`) — a non-JS crawler (GPTBot,
          ClaudeBot, etc.) never fires the hover/focus handlers above, so
          conditionally mounting this menu left Blogs/FAQs/Pricing entirely
          out of the server HTML. Hidden via opacity/pointer-events/
          aria-hidden instead, which is invisible to sighted mouse users but
          not to a crawler reading the raw HTML. */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 6 }}
        transition={{ duration: 0.2, ease: EASE.primary }}
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
        // pt-3 (padding, not margin) keeps the gap to the trigger inside
        // this element's own hoverable box — a margin-based gap here is
        // a dead zone the mouse falls out of before reaching the panel.
        className="absolute left-1/2 top-full z-(--z-raised) w-48 -translate-x-1/2 pt-3"
      >
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b0b0f]/95 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {OTHER_LINKS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className="flex items-center justify-between px-4 py-2.5 text-sm text-white/30">
                {item.label}
                <span className="rounded-full border border-white/10 px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-wide text-white/30">
                  Soon
                </span>
              </span>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DesktopNavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  const currentLabel = getActiveLabel(pathname);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? currentLabel;

  return (
    <div
      className={cn("relative hidden items-center gap-1 lg:flex", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {NAV_LINKS.slice(0, 2).map((item) => {
        const isActive = active === item.label;
        return (
          <Link
            key={item.label}
            href={item.href}
            onMouseEnter={() => setHovered(item.label)}
            className="relative px-4 py-2 text-sm"
          >
            {isActive && <NavHighlight />}
            <span className={cn("relative transition-colors", isActive ? "text-white" : "text-white/60")}>
              {item.label}
            </span>
          </Link>
        );
      })}

      <ServicesDropdown active={active === "Services"} onHover={setHovered} />

      {NAV_LINKS.slice(2).map((item) => {
        const isActive = active === item.label;
        return (
          <Link
            key={item.label}
            href={item.href}
            onMouseEnter={() => setHovered(item.label)}
            className="relative px-4 py-2 text-sm"
          >
            {isActive && <NavHighlight />}
            <span className={cn("relative transition-colors", isActive ? "text-white" : "text-white/60")}>
              {item.label}
            </span>
          </Link>
        );
      })}

      <OtherDropdown active={active === "Other"} onHover={setHovered} />
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Collapse the "Other"/"Services" panels every time the menu itself
  // closes, so they don't reopen already-expanded next time.
  useEffect(() => {
    if (!open) {
      setOtherOpen(false);
      setServicesOpen(false);
    }
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

            <nav className="relative flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto px-6 py-8">
              {NAV_LINKS.slice(0, 2).map((item, i) => (
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
                transition={{ duration: 0.4, delay: 0.16 + 0.06 * 2, ease: EASE.primary }}
                className="flex items-center gap-2"
              >
                <MotionLink
                  href="/services/"
                  onClick={() => setOpen(false)}
                  className="font-display py-3 text-3xl text-white/80 transition-colors hover:text-white sm:text-4xl"
                >
                  Services
                </MotionLink>
                <button
                  type="button"
                  onClick={() => setServicesOpen((v) => !v)}
                  aria-expanded={servicesOpen}
                  aria-label="Toggle services sub-menu"
                  className="flex h-8 w-8 items-center justify-center"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden
                    className={cn("text-white/40 transition-transform duration-200", servicesOpen && "rotate-180")}
                  >
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </motion.div>

              <AnimatePresence initial={false}>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EASE.primary }}
                    className="flex w-full flex-col items-center overflow-hidden"
                  >
                    {SERVICES_SUBLINKS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="font-display py-2 text-xl text-white/60 transition-colors hover:text-white sm:text-2xl"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {NAV_LINKS.slice(2).map((item, i) => (
                <MotionLink
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.4, delay: 0.16 + 0.06 * (3 + i), ease: EASE.primary }}
                  className="font-display py-3 text-3xl text-white/80 transition-colors hover:text-white sm:text-4xl"
                >
                  {item.label}
                </MotionLink>
              ))}

              <motion.button
                type="button"
                onClick={() => setOtherOpen((v) => !v)}
                aria-expanded={otherOpen}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.4, delay: 0.16 + 0.06 * 4, ease: EASE.primary }}
                className="font-display flex items-center gap-2 py-3 text-3xl text-white/80 transition-colors hover:text-white sm:text-4xl"
              >
                Other
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden
                  className={cn("text-white/40 transition-transform duration-200", otherOpen && "rotate-180")}
                >
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>

              <AnimatePresence initial={false}>
                {otherOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EASE.primary }}
                    className="flex w-full flex-col items-center overflow-hidden"
                  >
                    {OTHER_LINKS.map((item) =>
                      item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="font-display py-2 text-xl text-white/60 transition-colors hover:text-white sm:text-2xl"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span
                          key={item.label}
                          className="font-display flex items-center gap-2.5 py-2 text-xl text-white/25 sm:text-2xl"
                        >
                          {item.label}
                          <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-wide text-white/30">
                            Soon
                          </span>
                        </span>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.4, delay: 0.16 + 0.06 * 5, ease: EASE.primary }}
                className="mx-auto mt-8 w-full max-w-xs px-2"
              >
                <MagneticButton href="/contact/" className="flex w-full items-center justify-center">Book a consultation</MagneticButton>
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
              <MagneticButton href="/contact/" className="hidden shrink-0 sm:inline-flex">Book a consultation</MagneticButton>
              <MobileNav />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </header>
  );
}
