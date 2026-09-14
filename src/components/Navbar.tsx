"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/tokens";
import { SERVICES, INDUSTRIES, RESOURCES, getLiveGroupItems, type NavGroup } from "@/lib/navigation";
import { MegaMenu } from "@/components/MegaMenu";

// ---------------------------------------------------------------------------
// Navbar — layoutId-shared active/hover highlight, per the locked spec in
// docs/12-DESIGN-STANDARDS.md §8 (Navigation).
//
// Desktop's Services/Industries/Resources disclosure is MegaMenu.tsx (Phase
// 4's full-width mega menu, itself sourced from src/lib/navigation.ts) — the
// old ServicesDropdown/OtherDropdown pair (two small panels holding a
// hand-mixed set of links) is gone. The mobile sheet below keeps its own
// pattern per that same task's explicit instruction ("NOT a mega menu"),
// now with three expandable groups instead of two, matching the real group
// boundaries in navigation.ts instead of the old ad hoc split.
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

const MotionLink = motion.create(Link);

// Real routes (no "#") are matched against the current pathname so the
// underline follows the page you're actually on. Services/Industries/
// Resources pages activate MegaMenu's own trigger highlight directly (see
// that component) rather than being tracked here.
function getActiveLabel(pathname: string) {
  if (pathname === "/") return "Home";
  for (const item of NAV_LINKS) {
    if (item.href === "/" || item.href.includes("#")) continue;
    const hrefPath = item.href.replace(/\/$/, "");
    if (pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)) {
      return item.label;
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

      <MegaMenu />

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
    </div>
  );
}

// Three real groups (Phase 4), matching src/lib/navigation.ts exactly —
// replaces the old Services (which used to also carry Industries) + Other
// split. Blurbs are dropped here (see MobileGroup below): at mobile's large
// font-display item size, a second line under all ~16 live items would
// roughly double the sheet's height. Said here once rather than at every
// call site.
const MOBILE_GROUPS: NavGroup[] = [SERVICES, INDUSTRIES, RESOURCES];

function MobileGroup({ group, open, onToggle, onNavigate }: { group: NavGroup; open: boolean; onToggle: () => void; onNavigate: () => void }) {
  const items = getLiveGroupItems(group);
  const panelId = `mobile-group-${group.id}`;

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="font-display flex items-center gap-2 py-3 text-3xl text-white/80 transition-colors hover:text-white sm:text-4xl"
      >
        {group.title}
        <svg
          width="18"
          height="18"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={cn("text-white/40 transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE.primary }}
            className="flex w-full flex-col items-center overflow-hidden"
          >
            {group.overviewHref && (
              <Link
                href={group.overviewHref}
                onClick={onNavigate}
                className="font-display py-2 text-xl text-white/60 transition-colors hover:text-white sm:text-2xl"
              >
                All {group.title}
              </Link>
            )}
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="font-display py-2 text-xl text-white/60 transition-colors hover:text-white sm:text-2xl"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  // A record, not one value — Services/Industries/Resources each expand
  // independently, same as the original two-boolean (Services, Other)
  // version. A single "which one is open" value would silently collapse
  // Services the moment Industries opened, which is not the existing
  // pattern this task's mobile section says to keep.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Collapse every group panel every time the menu itself closes, so none
  // reopen already-expanded next time.
  useEffect(() => {
    if (!open) setOpenGroups({});
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

              {MOBILE_GROUPS.map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.4, delay: 0.16 + 0.06 * (2 + i), ease: EASE.primary }}
                  className="flex w-full flex-col items-center"
                >
                  <MobileGroup
                    group={group}
                    open={Boolean(openGroups[group.id])}
                    onToggle={() => setOpenGroups((v) => ({ ...v, [group.id]: !v[group.id] }))}
                    onNavigate={() => setOpen(false)}
                  />
                </motion.div>
              ))}

              {NAV_LINKS.slice(2).map((item, i) => (
                <MotionLink
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.4, delay: 0.16 + 0.06 * (5 + i), ease: EASE.primary }}
                  className="font-display py-3 text-3xl text-white/80 transition-colors hover:text-white sm:text-4xl"
                >
                  {item.label}
                </MotionLink>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.4, delay: 0.16 + 0.06 * 6, ease: EASE.primary }}
                className="mx-auto mt-8 w-full max-w-xs px-2"
              >
                <Link href="/contact/" className="btn-primary flex w-full justify-center">
                  <span>Book a consultation</span>
                </Link>
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
              <Link href="/contact/" className="btn-primary hidden shrink-0 sm:inline-flex">
                <span>Book a consultation</span>
              </Link>
              <MobileNav />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </header>
  );
}
