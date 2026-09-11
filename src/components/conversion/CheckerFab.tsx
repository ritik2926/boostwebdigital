"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TargetIcon, CloseIcon } from "@/components/conversion/icons";
import {
  SPECIALTIES,
  type Specialty,
  keywordForSpecialty,
  deriveBusinessNameFromWebsite,
  QUICK_ENTRY_INDUSTRY,
  QUICK_ENTRY_COUNTRY,
} from "@/lib/checker/quickEntry";

// Same endpoint, same constants CheckerWidget.tsx already uses — this form
// is a second ENTRY POINT into the one existing lead-capture path, never a
// second submission path. See src/app/api/checker/run/route.ts.
const RUN_URL = "/api/checker/run/";
const ABORT_MS = 75_000;
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const DISMISS_KEY = "checker-fab-dismissed";
const REPORT_URL_PREFIX = "/tools/ai-visibility-checker/report/";

type Status = "idle" | "submitting" | "success" | "error";

// Duplicated from CheckerWidget.tsx rather than imported — that file's
// copies are unexported locals, same "small enough to duplicate" call as
// SubscribeForm.tsx's UNDERLINE_INPUT elsewhere in this codebase.
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function looksLikeUrl(value: string): boolean {
  try {
    new URL(value.includes("://") ? value : `https://${value}`);
    return true;
  } catch {
    return false;
  }
}

interface FieldErrors {
  website?: string;
  email?: string;
  specialty?: string;
}

/**
 * The floating checker CTA (desktop pill, bottom-right / mobile sticky
 * bar, bottom-full-width) and the <dialog> form it opens. The ONLY two
 * client components this conversion layer needs — Footer and the footer
 * CTA band stay Server Components. Rendered once, sitewide, from
 * src/app/layout.tsx.
 */
export function CheckerFab() {
  const [pastHero, setPastHero] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [footerCtaInView, setFooterCtaInView] = useState(false);
  const [open, setOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const renderedAtRef = useRef<number | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState<Specialty | "">("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  // Session dismiss — try/catch per this task's brief: sessionStorage
  // throws in some privacy modes (Safari private browsing, some
  // extensions), and a thrown error here must never block the page.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      // Storage unavailable — the CTA just can't remember a dismissal for
      // this session. Not worth surfacing to the visitor.
    }
  }, []);

  // "Appears after the user scrolls past the hero" — a page-agnostic scroll
  // threshold rather than an IntersectionObserver on a `#hero` element,
  // since not every route on this site tags its hero with that id (the
  // brief offers either "IntersectionObserver on the hero, or a CSS
  // scroll-driven approach" — this is the latter, and it works identically
  // on every page without a per-page marker). rAF-throttled, matching the
  // same technique already used by StickyMobileBar.tsx.
  // A one-way latch, not a live "are we currently past the hero" flag —
  // once shown, the trigger stays mounted for the rest of the page view
  // rather than flickering in and out if the visitor scrolls back up near
  // the threshold. This also sidesteps a real bug found while testing:
  // toggling `document.documentElement.style.overflow` to lock scroll for
  // the open dialog measurably perturbs `window.scrollY` in some browsers
  // for one frame, which could otherwise flip this straight back to false
  // the instant the dialog closes — unmounting the exact button
  // handleDialogClose needs a live ref to, stranding focus on <body>.
  useEffect(() => {
    let ticking = false;
    function measure() {
      if (window.scrollY > window.innerHeight * 0.8) setPastHero(true);
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hides the mobile bar once the footer's own CTA band is in view — two
  // competing CTAs on one small screen convert worse than one. `#footer-cta`
  // is rendered by every page via the shared Footer component.
  useEffect(() => {
    const el = document.getElementById("footer-cta");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setFooterCtaInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      renderedAtRef.current = Date.now();
      document.documentElement.style.overflow = "hidden";
    }
  }, [open]);

  // The dialog's native `close` event is the single source of truth for
  // "did it close" — it fires for Escape, backdrop dismissal, and our own
  // imperative .close() calls alike, so every path (keyboard, mouse, the
  // X button) converges here instead of three separate handlers drifting
  // out of sync.
  function handleDialogClose() {
    setOpen(false);
    document.documentElement.style.overflow = "";
    // Deferred a frame: the browser's own native dialog-close focus fixup
    // (return focus to whatever had it before showModal()) runs AFTER this
    // handler, and clobbers a synchronous .focus() call here — confirmed by
    // testing, not assumed; a bare call left focus on <body> on Escape
    // every time. Running on the next frame guarantees this wins instead.
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
    // Reset for next open — a completed or abandoned attempt shouldn't
    // reappear stale the next time this is opened.
    setWebsite("");
    setEmail("");
    setSpecialty("");
    setErrors({});
    setStatus("idle");
    setServerMessage(null);
    setReportUrl(null);
  }

  function openModal(e: React.MouseEvent<HTMLButtonElement>) {
    lastTriggerRef.current = e.currentTarget;
    setOpen(true);
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) dialogRef.current?.close();
  }

  // Reinforces the native focus trap rather than replacing it — confirmed
  // by testing (not assumed) that this Chromium build's own showModal()
  // trap leaks one Tab stop out to <body> when tabbing forward past the
  // last focusable element, before wrapping back to the first. Only steps
  // in at the two boundary presses; every other Tab/Shift+Tab is left
  // entirely to the browser's native handling.
  function handleDialogKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }

  function handleDismiss(e: React.MouseEvent) {
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Same as above — a failed write just means this comes back next
      // page load, which is an acceptable degradation, not an error.
    }
  }

  function validateAll(): FieldErrors {
    const next: FieldErrors = {};
    if (!looksLikeUrl(website.trim())) next.website = "Enter a valid website address.";
    if (!isValidEmail(email.trim())) next.email = "Enter a valid email address.";
    if (!specialty) next.specialty = "Choose a specialty.";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const fieldErrors = validateAll();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");
    setServerMessage(null);

    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), ABORT_MS);

    try {
      const res = await fetch(RUN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          business_name: deriveBusinessNameFromWebsite(website),
          industry: QUICK_ENTRY_INDUSTRY,
          website: website.trim(),
          email: email.trim(),
          keyword: keywordForSpecialty(specialty as Specialty),
          city: "",
          region: "",
          country: QUICK_ENTRY_COUNTRY,
          "company-website": honeypotRef.current?.value ?? "",
          "rendered-at": renderedAtRef.current,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!data) {
        setStatus("error");
        setServerMessage("Something went wrong. Please try again.");
        return;
      }
      if (data.blocked) {
        setStatus("error");
        setServerMessage(data.message ?? "You've already used your free reports.");
        return;
      }
      if (!data.ok) {
        setStatus("error");
        setServerMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setReportUrl(data.report?.id ? `${REPORT_URL_PREFIX}${data.report.id}/` : null);
    } catch {
      setStatus("error");
      setServerMessage("That took longer than expected. Please try again.");
    } finally {
      clearTimeout(abortTimer);
    }
  }

  function handleBlurValidate(field: keyof FieldErrors) {
    const next = validateAll();
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  }

  // Whether each trigger's underlying condition is met, independent of
  // `open`. `open` is deliberately OR'd into the actual mount checks below
  // — unmounting the button that opened the dialog while it's still open
  // strands the ref handleDialogClose uses to return focus (confirmed by
  // testing: a real scroll-position or footer-visibility change during the
  // ~200ms close transition can flip these booleans before the
  // requestAnimationFrame focus-restore callback runs, leaving focus on
  // <body> instead of the button). The mobile bar still needs to visually
  // and interactively disappear while open per this task's brief — done
  // with `invisible` (removes it from tab order and the a11y tree) rather
  // than un-rendering it, so the node stays connected for the ref.
  const desktopTriggerActive = pastHero && !dismissed;
  const mobileBarActive = desktopTriggerActive && !footerCtaInView;
  const showDesktopTrigger = desktopTriggerActive || open;
  const showMobileBar = mobileBarActive || open;

  return (
    <>
      {/* Desktop floating pill — bottom-right, hidden on mobile (Step 5's
          sticky bar replaces it there). Visible-by-default once mounted;
          `pastHero` only gates it after the scroll threshold, never a
          `opacity:0` state waiting on JS to reveal it — before that point
          it simply isn't rendered at all. */}
      {showDesktopTrigger && (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block">
          <div className="relative">
            <button type="button" onClick={openModal} className="btn-primary inline-flex min-h-14 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              <TargetIcon />
              {/* Visible label at rest, not an icon-only pill that expands
                  on hover — an icon alone is ambiguous, and this task's
                  brief is explicit that the label must be present at rest.
                  The extra sr-only text extends the accessible name without
                  an aria-label override — an aria-label that didn't contain
                  this visible text verbatim would fail WCAG 2.5.3 Label in
                  Name for voice-control users. */}
              <span>
                Free AI check<span className="sr-only"> — opens the free AI visibility check form</span>
              </span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss this for now"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[#08080a] text-white/50 transition-colors duration-200 ease-(--ease-signature) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-outline)"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile sticky bar — full-width, bottom-centre, thumb reach.
          Invisible (not unmounted — see the comment above) while the modal
          is open or the footer's own CTA band is in view. */}
      {showMobileBar && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#08080a]/95 px-4 pt-1.5 backdrop-blur-sm md:hidden",
            open && "invisible"
          )}
          style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
        >
          {/* Total height (border + padding + button): ~61px, under this
              task's 64px ceiling — measured with Playwright, not assumed. */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={openModal} className="btn-primary flex min-h-11 flex-1 justify-center">
              <TargetIcon />
              <span>
                Free AI check<span className="sr-only"> — opens the free AI visibility check form</span>
              </span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss this for now"
              className="flex h-11.5 w-11.5 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors duration-200 ease-(--ease-signature) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-outline)"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
        onKeyDown={handleDialogKeyDown}
        aria-labelledby="checker-fab-heading"
        className="checker-fab-dialog"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors duration-200 ease-(--ease-signature) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-outline)"
          >
            <CloseIcon />
          </button>

          {status === "success" ? (
            <div className="flex flex-col gap-4 p-8 sm:p-10">
              <h2 id="checker-fab-heading" className="font-display text-2xl font-bold text-white">
                Check complete
              </h2>
              <p className="text-white/70">
                We ran your free AI visibility check. We&rsquo;ve also emailed the full report to the address you gave
                us, in case you want to close this and read it later.
              </p>
              {reportUrl && (
                <Link href={reportUrl} className="btn-primary inline-flex w-fit">
                  <span>View my full report</span>
                </Link>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-8 sm:p-10">
              <div>
                <h2 id="checker-fab-heading" className="font-display text-2xl font-bold text-white">
                  Free AI Visibility Check
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  We send real questions to a live AI answer engine and show you whether it names your practice. Free.
                  No card. About 40 seconds.
                </p>
              </div>

              {/* Honeypot — real visitors never see or fill this. Hidden from
                  screen readers (aria-hidden + tabindex="-1") as well as
                  sighted users (off-screen positioning), matching the exact
                  field name /api/checker/run already checks for. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="checker-fab-company-website">Leave this field blank</label>
                <input
                  ref={honeypotRef}
                  id="checker-fab-company-website"
                  name="company-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="checker-fab-website" className="mb-1.5 block text-sm font-medium text-white/85">
                  Practice website URL
                </label>
                <input
                  id="checker-fab-website"
                  type="text"
                  autoFocus
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  onBlur={() => handleBlurValidate("website")}
                  aria-invalid={Boolean(errors.website)}
                  aria-describedby={errors.website ? "checker-fab-website-error" : undefined}
                  className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-white outline-none transition-colors focus:border-accent"
                  placeholder="yourpractice.com"
                />
                {errors.website && (
                  <p id="checker-fab-website-error" className="mt-1.5 text-sm text-red-400">
                    {errors.website}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="checker-fab-email" className="mb-1.5 block text-sm font-medium text-white/85">
                  Email
                </label>
                <input
                  id="checker-fab-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlurValidate("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "checker-fab-email-error" : undefined}
                  className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-white outline-none transition-colors focus:border-accent"
                  placeholder="you@yourpractice.com"
                />
                {errors.email && (
                  <p id="checker-fab-email-error" className="mt-1.5 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="checker-fab-specialty" className="mb-1.5 block text-sm font-medium text-white/85">
                  Specialty
                </label>
                <select
                  id="checker-fab-specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value as Specialty)}
                  onBlur={() => handleBlurValidate("specialty")}
                  aria-invalid={Boolean(errors.specialty)}
                  aria-describedby={errors.specialty ? "checker-fab-specialty-error" : undefined}
                  className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-white outline-none transition-colors focus:border-accent"
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.specialty && (
                  <p id="checker-fab-specialty-error" className="mt-1.5 text-sm text-red-400">
                    {errors.specialty}
                  </p>
                )}
              </div>

              {status === "error" && serverMessage && (
                <p role="alert" className="text-sm text-red-400">
                  {serverMessage}
                </p>
              )}

              <button type="submit" disabled={status === "submitting"} className="btn-primary flex w-full justify-center disabled:opacity-70">
                <span>{status === "submitting" ? "Checking… about 40 seconds" : "Run my free check"}</span>
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
