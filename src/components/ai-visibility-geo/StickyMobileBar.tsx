"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const SCROLL_DEPTH_THRESHOLD = 0.4;

/**
 * Mobile/small-tablet-only sticky CTA bar (CTA 6). Appears past 40% scroll
 * depth, hides once the closing section (`closingSectionId`) enters view so
 * it never competes with or overlaps the page's own final CTA/footer.
 * Deliberately opaque — solid background + hairline top border, no
 * blur/translucency/shadow per the brief.
 */
export function StickyMobileBar({
  href,
  label,
  closingSectionId,
}: {
  href: string;
  label: string;
  closingSectionId: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [pastThreshold, setPastThreshold] = useState(false);
  const [closingInView, setClosingInView] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    function measure() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      setPastThreshold(ratio >= SCROLL_DEPTH_THRESHOLD);
      tickingRef.current = false;
    }
    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById(closingSectionId);
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setClosingInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [closingSectionId]);

  const visible = pastThreshold && !closingInView;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 max-h-16 border-t border-white/12 bg-[#08080a] px-4 py-3 lg:hidden",
        !visible && "pointer-events-none",
        reducedMotion
          ? visible
            ? "opacity-100"
            : "opacity-0"
          : cn("transition-transform duration-300 ease-out", visible ? "translate-y-0" : "translate-y-full")
      )}
    >
      <Link
        href={href}
        data-cta="sticky-mobile"
        tabIndex={visible ? 0 : -1}
        className="shiny-cta flex w-full items-center justify-center"
      >
        <span>{label}</span>
      </Link>
    </div>
  );
}
