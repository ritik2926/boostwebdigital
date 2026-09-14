"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { SERVICES, INDUSTRIES, RESOURCES, getAllNavItems, getLiveGroupItems, type NavGroup } from "@/lib/navigation";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Full-width desktop mega menu (Phase 4) — one trigger, one panel, three
// columns, all rendered from src/lib/navigation.ts. Nothing here is
// hardcoded; add a page there and it appears here automatically.
//
// Replaces the old ServicesDropdown + OtherDropdown pair: those were two
// separate small panels holding a hand-mixed set of services, specialties,
// and resources. This is the single consolidated entry point for all three
// of navigation.ts's real groups.
//
// The old Services trigger was a genuine <Link href="/services/"> with a
// disclosure chevron bolted on. This task requires the trigger to be a real
// <button> with aria-expanded/aria-controls — a toggle, not a hybrid
// link-and-disclosure — so clicking the word "Services" no longer navigates
// directly; it opens the panel, whose Services column ends with its own
// "See all services" link to the same destination. A one-click shortcut
// traded for a real disclosure control, not an oversight.
// ---------------------------------------------------------------------------

const OPEN_DELAY_MS = 100;
const CLOSE_DELAY_MS = 300;

function isCurrentPage(pathname: string, href: string): boolean {
  const hrefPath = href.replace(/\/$/, "");
  return pathname === hrefPath || (hrefPath !== "" && pathname.startsWith(`${hrefPath}/`));
}

function MegaMenuColumn({ group, pathname }: { group: NavGroup; pathname: string }) {
  const items = getLiveGroupItems(group);
  const headingId = `mega-heading-${group.id}`;
  // GROWTH (Phase 4): Industries is designed to grow well past its current
  // 3 live entries toward the 8 declared in src/lib/navigation.ts. Past six
  // items, the list itself splits into two sub-columns instead of growing
  // one long column — verified by temporarily flipping every Industries
  // entry to live:true and confirming the panel still fit one viewport
  // height at 1440x900 and 1280x800, then reverting (see task report).
  const splitList = group.id === "industries" && items.length > 6;

  return (
    <div>
      <h3 id={headingId} className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
        {group.title}
      </h3>
      <p className="mt-1.5 text-sm text-white/50">{group.subtitle}</p>

      <ul aria-labelledby={headingId} className={cn("mt-5 flex flex-col gap-0.5", splitList && "grid grid-cols-2 gap-x-3 gap-y-0.5")}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isCurrentPage(pathname, item.href) ? "page" : undefined}
              className="block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="block text-sm font-medium text-white">{item.label}</span>
              <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-white/45">{item.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>

      {group.overviewHref && (
        <Link
          href={group.overviewHref}
          className="mt-4 inline-flex items-center gap-1.5 border-t border-white/8 pt-4 text-sm font-semibold text-white transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          See all services
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}

function NavHighlight() {
  return (
    <span
      className="pointer-events-none absolute inset-x-3 bottom-1 h-px rounded-full bg-white/60"
      style={{ boxShadow: "0 0 6px rgba(255,255,255,0.55), 0 -8px 10px -4px rgba(255,255,255,0.35)" }}
    />
  );
}

export function MegaMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = "mega-menu-panel";

  const isActive = getAllNavItems().some((item) => item.live && isCurrentPage(pathname, item.href));

  function clearTimers() {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleOpen() {
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  }

  function scheduleClose() {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  useEffect(() => clearTimers, []);

  // Route changes (a link inside the panel was followed) should never leave
  // a stale open panel behind.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-1 px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {isActive && <NavHighlight />}
        <span className={cn("relative transition-colors", isActive ? "text-white" : "text-white/60")}>Services</span>
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

      <div id={panelId} hidden={!open} className="mega-menu-panel absolute left-1/2 top-full w-screen pt-3">
        <div className="border-t border-white/8 bg-[#0b0b0f]/98 py-10 shadow-[0_30px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              <MegaMenuColumn group={SERVICES} pathname={pathname} />
              <MegaMenuColumn group={INDUSTRIES} pathname={pathname} />
              <MegaMenuColumn group={RESOURCES} pathname={pathname} />
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
