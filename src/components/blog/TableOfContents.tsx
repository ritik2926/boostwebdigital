"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/blog/types";

function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  useEffect(() => {
    const headings = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size > 0) {
          const topMost = headings.find((h) => visible.has(h.id));
          if (topMost && topMost.id !== activeIdRef.current) setActiveId(topMost.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function TocLink({ item, active }: { item: TocItem; active: boolean }) {
  return (
    <a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${item.id}`);
      }}
      className={cn(
        "block border-l-2 py-1.5 pl-4 text-[0.8125rem] leading-[1.4] transition-colors duration-200",
        item.level === 3 && "pl-7",
        active ? "border-accent text-white" : "border-white/8 text-white/50 hover:border-white/25 hover:text-white/75"
      )}
    >
      {item.text}
    </a>
  );
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeading(items.map((i) => i.id));

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-32">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/40">On this page</span>
      <div className="mt-4 flex flex-col">
        {items.map((item) => (
          <TocLink key={item.id} item={item} active={item.id === activeId} />
        ))}
      </div>
    </nav>
  );
}

/** Below xl: TOC collapses into a sticky expandable bar under the hero. */
export function TableOfContentsMobile({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const activeId = useActiveHeading(items.map((i) => i.id));
  const activeItem = items.find((i) => i.id === activeId);

  if (!items.length) return null;

  return (
    <div className="sticky top-24 z-(--z-raised) border-y border-white/8 bg-[#08080a]/90 backdrop-blur-md xl:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-6 py-3.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 text-sm">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white/40">On this page</span>
          <span className="truncate text-white/75">{activeItem?.text}</span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={cn("shrink-0 text-white/50 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        >
          <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 px-6 pb-4">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                setOpen(false);
              }}
              className={cn(
                "py-1.5 text-sm transition-colors",
                item.level === 3 && "pl-4",
                item.id === activeId ? "text-white" : "text-white/55"
              )}
            >
              {item.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
