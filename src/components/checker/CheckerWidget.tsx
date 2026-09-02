"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/Reveal";
import { CheckerReport } from "./CheckerReport";
import { trackCheckerEvent } from "./analytics";
import type { BlockReason, CheckerReport as CheckerReportData, HistoryReport } from "./types";
import { buildQueries, type BuiltQuery } from "@/lib/checker/queryBuilder";
import { countriesForSelect, INDIA_CITIES, INDIA_STATES } from "@/lib/checker/locations";
import { INDUSTRY_OPTIONS } from "@/lib/checker/industries";

/**
 * Talks to the checker exclusively over fetch() to these three existing
 * routes — never imports src/lib/db.ts, src/lib/checker/engines/*, or
 * anything else that could carry EXA_API_KEY/DATABASE_URL/RESEND_API_KEY/
 * VISITOR_COOKIE_SECRET/IP_HASH_SALT into this "use client" module. See
 * this task's report for the grep that confirms none of the five reach the
 * built client bundle.
 *
 * The one exception is @/lib/checker/queryBuilder — a zero-import, secret-
 * free sibling of engines/index.ts (never engines/ itself) — imported so
 * the running-state display below can show the visitor the exact three
 * query strings the server is about to send, built from the same source
 * instead of a hand-duplicated copy that could drift from it.
 */
const RUN_URL = "/api/checker/run/";
const QUOTA_URL = "/api/checker/quota/";
const HISTORY_URL = "/api/checker/history/";

const MIN_SUBMIT_DELAY_MS = 3000; // matches run/route.ts's own MIN_SUBMIT_DELAY_MS
const ABORT_MS = 75_000;

/**
 * PART 2 (2026-09-02) — five stages, TIME-BASED, not driven by real backend
 * events. The route runs all three queries in parallel, then one analysis
 * call, then saves and responds — this timeline describes that real order
 * of work, but the MOMENT each stage below appears is an estimate, not a
 * server-reported checkpoint. Do not read `atMs` as telemetry.
 *
 * RECOMPRESSED (PART 5, 2026-09-02, "open to all" task) — measured 10 real,
 * direct-to-engine end-to-end runs (bypassing the HTTP route, so no daily-
 * cap slot or quota was spent measuring this): median 5.52s, range
 * 4.97s–6.24s (min/max), split roughly 2.1s for the 3 parallel answers +
 * 3.4s for the analysis call. The previous timings (0/7s/15s/23s/31s) were
 * ~3x too slow — real runs only ever reached stage 2 before the report
 * arrived. Recompressed so all five stages are actually seen inside a
 * real run: stage 5 lands at 4.4s, comfortably before the 4.97s fastest
 * observed completion.
 */
const STAGE_TIMINGS_MS = [0, 1_200, 2_200, 3_400, 4_400] as const;

function stageLabel(stage: number, businessName: string): string {
  switch (stage) {
    case 0:
      return "Asking three questions";
    case 1:
      return "Reading the answers";
    case 2:
      return `Looking for “${businessName}”`;
    case 3:
      return "Checking which pages were cited";
    default:
      return "Writing your report";
  }
}

const MAX_LENGTHS = {
  business_name: 120,
  keyword: 100,
  city: 80,
  region: 80,
  country: 80,
  website: 200,
  email: 200,
  industry: 60,
} as const;

interface FormValues {
  business_name: string;
  industry: string;
  website: string;
  email: string;
  keyword: string;
  city: string;
  region: string;
  country: string;
}

// PART 1B (2026-09-02): no field may have a pre-selected value — a default
// here would silently become most visitors' answer. Country starts blank;
// the visitor must actually choose it. Industry (PART 1, "open to all"
// task) follows the same rule — an unset default becomes the most common
// answer and the industry breakdown becomes useless.
const INITIAL_VALUES: FormValues = {
  business_name: "",
  industry: "",
  website: "",
  email: "",
  keyword: "",
  city: "",
  region: "",
  country: "",
};

const OTHER_CITY_VALUE = "__OTHER__";

type FormErrors = Partial<Record<keyof FormValues, string>>;

type ViewState =
  | { kind: "idle" }
  | { kind: "running"; queries: BuiltQuery[]; businessName: string }
  | { kind: "report"; report: CheckerReportData }
  | { kind: "no-answer"; queries: Array<{ label: string; query: string }>; message: string }
  | { kind: "blocked"; reason: BlockReason; message: string; history: HistoryReport[] | null }
  | { kind: "error"; message: string };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Loose on purpose — a URL field should catch "not a URL at all", not
 * reject every real-world edge case. The server doesn't validate format any
 * more strictly than "is a string within the length limit" either. */
function looksLikeUrl(value: string): boolean {
  try {
    new URL(value.includes("://") ? value : `https://${value}`);
    return true;
  } catch {
    return false;
  }
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.business_name.trim()) errors.business_name = "Enter your business name.";
  else if (values.business_name.length > MAX_LENGTHS.business_name) errors.business_name = "That name is too long.";

  if (!values.industry) errors.industry = "Select an industry.";

  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";

  if (!values.keyword.trim()) errors.keyword = 'Enter a keyword, e.g. "best dentist".';
  else if (values.keyword.length > MAX_LENGTHS.keyword) errors.keyword = "That keyword is too long.";

  // City is optional (PART 1, 2026-09-02) — a national or online-only
  // business has no single city to check visibility "in".
  if (values.city.length > MAX_LENGTHS.city) errors.city = "That city name is too long.";

  if (!values.country.trim()) errors.country = "Select a country.";
  else if (values.country.length > MAX_LENGTHS.country) errors.country = "That country name is too long.";

  if (values.website.trim() && !looksLikeUrl(values.website.trim())) errors.website = "Enter a valid website address, or leave this blank.";

  return errors;
}

const UNDERLINE_INPUT =
  "w-full border-0 border-b border-white/15 bg-transparent pb-2.5 text-[15px] text-white outline-none transition-[border-color,border-width] duration-200 placeholder:text-white/40 focus-visible:border-b-2 focus-visible:border-accent";

const UNDERLINE_SELECT = cn(UNDERLINE_INPUT, "cursor-pointer appearance-none pr-6 [&_option]:bg-[#0c0b0f] [&_option]:text-white");

/** Native selects get their own chevron since `appearance-none` removes the
 * OS-drawn one — kept purely decorative (aria-hidden) since the select
 * itself already communicates its own state to assistive tech. */
function SelectChevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 8" className="pointer-events-none absolute right-0 bottom-3 h-2 w-3 text-white/40">
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-medium text-white/70">
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] text-red-400">
      {message}
    </p>
  );
}

function QuotaLine({ quota }: { quota: { used: number; remaining: number } | null }) {
  if (quota === null) return null; // fetch failed — say nothing rather than risk a wrong number
  const text =
    quota.remaining <= 0
      ? "You've used both free reports."
      : `${quota.remaining} free report${quota.remaining === 1 ? "" : "s"} remaining`;
  return <p className="text-sm text-white/50">{text}</p>;
}

/**
 * PART 2 (2026-09-02) — shows the visitor their own real request in
 * progress instead of generic copy: the exact three query strings while
 * they're "in flight" (stage 0 — all three run in parallel, never one
 * after another, so they're shown together, not as a 1-2-3 sequence) and
 * their own business name once the tool is "looking" for it. No percentage,
 * no filling progress bar — the client has no real knowledge of server
 * progress to justify either. The elapsed-seconds counter below IS real
 * (Date.now() each tick); the stage advances on STAGE_TIMINGS_MS above,
 * which are NOT — see that constant's own comment.
 */
function RunningStages({ queries, businessName }: { queries: BuiltQuery[]; businessName: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      let next = 0;
      for (let i = 0; i < STAGE_TIMINGS_MS.length; i++) {
        if (elapsed >= STAGE_TIMINGS_MS[i]!) next = i;
      }
      setStage(next);
      setElapsedSeconds(Math.floor(elapsed / 1000));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <svg className={cn("h-6 w-6 text-white/50", !reducedMotion && "animate-spin")} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* No transition/animation on this container between stage changes —
          prefers-reduced-motion or not, the label just swaps; the only
          thing that ever animates here is the spinner above, and only
          without reduced motion. */}
      <div aria-live="polite" className="flex w-full max-w-md flex-col items-center gap-3 px-4">
        <p className="text-[15px] font-medium text-white">{stageLabel(stage, businessName)}</p>
        {stage === 0 && (
          <ul className="flex w-full flex-col gap-1.5 text-sm text-white/60">
            {queries.map((q) => (
              <li key={q.label} className="wrap-break-word">
                <span className="mr-1.5 font-mono text-xs text-white/35">{q.label}</span>“{q.query}”
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-sm text-white/40">This usually takes about 10 seconds. {elapsedSeconds}s elapsed.</p>
    </div>
  );
}

function HistoryList({ history }: { history: HistoryReport[] | null }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (history === null) {
    return <p className="mt-4 text-sm text-white/40">Loading your past reports…</p>;
  }
  if (history.length === 0) {
    return null;
  }

  return (
    <ul className="mt-6 flex flex-col gap-3 text-left">
      {history.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id} className="rounded-xl border border-white/8">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
            >
              <span className="text-sm text-white/85">
                {item.businessName} — <span className="text-white/50">{item.keyword}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-white/50">{item.score}/100</span>
            </button>
            {open && (
              <div className="border-t border-white/8 px-4 py-4">
                <CheckerReport
                  report={{
                    id: item.id,
                    status: item.status === "no-answer" ? "no-answer" : "ok",
                    model: item.model,
                    queries: item.queries,
                    answers: item.answers,
                    namedCount: item.namedCount,
                    totalQueries: item.totalQueries,
                    sources: item.sources,
                    score: item.score,
                    breakdown: [],
                    industry: item.industry,
                    competitors: item.competitors,
                    strengths: item.strengths,
                    weaknesses: item.weaknesses,
                    recommendations: item.recommendations,
                    partialFailure: false,
                    failedQueries: [],
                  }}
                  onReset={() => setOpenId(null)}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function CheckerWidget() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [renderedAt] = useState(() => Date.now());
  const [quota, setQuota] = useState<{ used: number; remaining: number } | null>(null);
  const [view, setView] = useState<ViewState>({ kind: "idle" });
  // PART 1B — true once the visitor picks "Other — type it" in the city
  // dropdown; swaps City to a text input for the rest of this render
  // session. Reset whenever Country or State changes, since the dropdown
  // it was standing in for may no longer even apply.
  const [cityOther, setCityOther] = useState(false);
  const submittingRef = useRef(false);
  const startedTrackedRef = useRef(false);

  function handleFirstFocus() {
    if (startedTrackedRef.current) return;
    startedTrackedRef.current = true;
    trackCheckerEvent("checker_started");
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(QUOTA_URL);
        if (!res.ok) return;
        const data = (await res.json()) as { used: number; remaining: number };
        if (cancelled) return;
        setQuota(data);
        if (data.remaining <= 0) {
          const history = await fetchHistory();
          if (!cancelled) {
            setView({
              kind: "blocked",
              reason: "visitor-limit",
              message: "You've used both free reports.",
              history,
            });
          }
        }
      } catch {
        // Say nothing rather than show a wrong number — this is a courtesy
        // display only, never the real enforcement.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchHistory(): Promise<HistoryReport[] | null> {
    try {
      const res = await fetch(HISTORY_URL);
      if (!res.ok) return null;
      const data = (await res.json()) as { reports: HistoryReport[] };
      return data.reports;
    } catch {
      return null;
    }
  }

  function updateField<K extends keyof FormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // PART 1B — Country determines whether State is a dropdown, and State
  // (when it's India) determines whether City is a dropdown. Changing
  // either one upstream invalidates whatever was chosen downstream, so both
  // reset State+City (on a Country change) or just City (on a State
  // change) rather than leaving a stale value from a list that no longer
  // applies.
  function handleCountryChange(nextCountry: string) {
    setValues((prev) => ({ ...prev, country: nextCountry, region: "", city: "" }));
    setErrors((prev) => ({ ...prev, country: undefined, region: undefined, city: undefined }));
    setCityOther(false);
  }

  function handleRegionSelectChange(nextRegion: string) {
    setValues((prev) => ({ ...prev, region: nextRegion, city: "" }));
    setErrors((prev) => ({ ...prev, region: undefined, city: undefined }));
    setCityOther(false);
  }

  function handleCitySelectChange(next: string) {
    if (next === OTHER_CITY_VALUE) {
      setCityOther(true);
      setValues((prev) => ({ ...prev, city: "" }));
      return;
    }
    updateField("city", next);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return; // double-click guard, checked synchronously

    if (honeypot) return; // matches ContactForm.tsx's own convention — silently drop

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (Date.now() - renderedAt < MIN_SUBMIT_DELAY_MS) {
      // A genuine visitor cannot possibly hit this — the form takes longer
      // than 3s to read and fill. Treat it the same as the server would.
      return;
    }

    submittingRef.current = true;
    trackCheckerEvent("checker_submitted");

    const businessName = values.business_name.trim();
    const city = values.city.trim();
    const region = values.region.trim();
    const country = values.country.trim();
    // Built from the same source run/route.ts uses server-side
    // (@/lib/checker/queryBuilder) — the running-state display below shows
    // these as "the exact three query strings", so they must actually be
    // exact, not a hand-copied approximation of the real template.
    const queries = buildQueries({ keyword: values.keyword.trim(), city, region: region || null, country });
    setView({ kind: "running", queries, businessName });

    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), ABORT_MS);

    try {
      const res = await fetch(RUN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          business_name: businessName,
          industry: values.industry,
          website: values.website.trim(),
          email: values.email.trim(),
          keyword: values.keyword.trim(),
          city,
          region,
          country,
          "company-website": honeypot,
          "rendered-at": renderedAt,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!data) {
        trackCheckerEvent("checker_error", { state: "error" });
        setView({ kind: "error", message: "Something went wrong. Please try again. This did not use one of your free reports." });
        return;
      }

      if (data.blocked) {
        const reason: BlockReason = data.reason === "daily-cap" ? "daily-cap" : "visitor-limit";
        trackCheckerEvent("checker_limit_hit", { reason });
        if (reason === "visitor-limit") {
          const history = await fetchHistory();
          setView({ kind: "blocked", reason, message: "You've used both free reports.", history });
        } else {
          setView({
            kind: "blocked",
            reason,
            message: data.message ?? "We've hit today's limit across the whole site. Try again tomorrow.",
            history: null,
          });
        }
        return;
      }

      if (data.ok && data.report) {
        const report = data.report as CheckerReportData;
        if (report.status === "no-answer") {
          trackCheckerEvent("checker_error", { state: "no-answer" });
          setView({
            kind: "no-answer",
            queries: report.queries,
            message: report.message ?? "No answer was returned for any of the three questions. This did not use one of your free reports.",
          });
          setQuota((prev) => prev); // unchanged — no-answer never consumes quota
        } else {
          trackCheckerEvent("checker_completed", { score: report.score, mentioned: report.namedCount > 0 });
          setView({ kind: "report", report });
          setQuota((prev) => (prev ? { used: prev.used + 1, remaining: Math.max(0, prev.remaining - 1) } : prev));
        }
        return;
      }

      trackCheckerEvent("checker_error", { state: "error" });
      setView({
        kind: "error",
        message: (data.message as string | undefined) ?? "Something went wrong. This did not use one of your free reports.",
      });
    } catch (err) {
      trackCheckerEvent("checker_error", { state: "error" });
      if (err instanceof Error && err.name === "AbortError") {
        setView({
          kind: "error",
          message: "This is taking longer than expected. Please try again — this did not use one of your free reports.",
        });
      } else {
        setView({ kind: "error", message: "Something went wrong. Please try again. This did not use one of your free reports." });
      }
    } finally {
      clearTimeout(abortTimer);
      submittingRef.current = false;
    }
  }

  function resetToForm() {
    setView({ kind: "idle" });
  }

  if (view.kind === "running") {
    return <RunningStages queries={view.queries} businessName={view.businessName} />;
  }

  if (view.kind === "report") {
    return (
      <div className="flex flex-col gap-6">
        {view.report.id && (
          <a
            href={`/tools/ai-visibility-checker/report/${view.report.id}/`}
            target="_blank"
            rel="noopener"
            className="shiny-cta w-fit print:hidden"
          >
            <span>Open your full report</span>
          </a>
        )}
        <CheckerReport report={view.report} onReset={resetToForm} />
      </div>
    );
  }

  if (view.kind === "no-answer") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-white/10 p-6">
        <h2 className="font-display text-xl font-semibold text-white">No AI answer came back</h2>
        <div className="text-sm text-white/45">
          <p>Questions sent:</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {view.queries.map((q) => (
              <li key={q.label} className="text-white/70">
                <span className="font-mono text-white/40">{q.label}</span> — {q.query}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-white/75">{view.message}</p>
        <button type="button" onClick={resetToForm} className="shiny-cta">
          <span>Try again</span>
        </button>
      </div>
    );
  }

  if (view.kind === "blocked") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-white/10 p-6">
        <h2 className="font-display text-xl font-semibold text-white">{view.message}</h2>
        {view.reason === "visitor-limit" ? (
          <>
            <p className="text-white/70">Here are your two reports so far.</p>
            <HistoryList history={view.history} />
            <a href="/contact/" className="shiny-cta">
              <span>Talk to us about ongoing monitoring</span>
            </a>
          </>
        ) : (
          <>
            <p className="text-white/70">This is our limit, not yours — nothing about your free reports has changed.</p>
            <a href="/contact/" className="text-sm text-white/70 underline-offset-4 hover:text-accent hover:underline">
              Contact us
            </a>
          </>
        )}
      </div>
    );
  }

  if (view.kind === "error") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-white/10 p-6">
        <h2 className="font-display text-xl font-semibold text-white">That didn&rsquo;t work</h2>
        <p className="text-white/75">{view.message}</p>
        <button type="button" onClick={resetToForm} className="shiny-cta">
          <span>Try again</span>
        </button>
      </div>
    );
  }

  // PART 1B — India is the only country with a bundled state list (see
  // src/lib/checker/locations/index.ts's own comment on why: no other
  // list was already available to bundle without a new dependency or an
  // external geocoding call). City only ever becomes a dropdown one level
  // further in, when a bundled India state has its own city list AND the
  // visitor hasn't already asked to type it themselves.
  const isIndiaSelected = values.country === "India";
  const citiesForState = isIndiaSelected ? INDIA_CITIES[values.region] : undefined;
  const showCityDropdown = Boolean(citiesForState) && !cityOther;

  return (
    <form onSubmit={handleSubmit} onFocus={handleFirstFocus} noValidate className="flex flex-col gap-6 print:hidden">
      {/* Honeypot — hidden from sighted users and screen readers, never disabled, no autocomplete */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="checker-company-website">Leave this field blank</label>
        <input
          id="checker-company-website"
          name="company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <FieldLabel htmlFor="checker-business-name">Business name *</FieldLabel>
        <input
          id="checker-business-name"
          type="text"
          value={values.business_name}
          onChange={(e) => updateField("business_name", e.target.value)}
          maxLength={MAX_LENGTHS.business_name}
          aria-invalid={Boolean(errors.business_name)}
          aria-describedby={errors.business_name ? "business-name-error" : undefined}
          placeholder="Riverside Studio"
          className={cn("mt-3", UNDERLINE_INPUT)}
        />
        <FieldError id="business-name-error" message={errors.business_name} />
      </div>

      {/* PART 1 (2026-09-02, "open to all") — its own row even on mobile,
          single-tap native select, no helper text beneath it per spec. */}
      <div>
        <FieldLabel htmlFor="checker-industry">Industry *</FieldLabel>
        <div className="relative mt-3">
          <select
            id="checker-industry"
            value={values.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            aria-invalid={Boolean(errors.industry)}
            aria-describedby={errors.industry ? "industry-error" : undefined}
            className={UNDERLINE_SELECT}
          >
            <option value="" disabled>
              Select industry
            </option>
            {INDUSTRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
        <FieldError id="industry-error" message={errors.industry} />
      </div>

      <div>
        <FieldLabel htmlFor="checker-website">Website (optional)</FieldLabel>
        <input
          id="checker-website"
          type="url"
          value={values.website}
          onChange={(e) => updateField("website", e.target.value)}
          maxLength={MAX_LENGTHS.website}
          aria-invalid={Boolean(errors.website)}
          aria-describedby={errors.website ? "website-error" : "website-help"}
          placeholder="yourbusiness.com"
          className={cn("mt-3", UNDERLINE_INPUT)}
        />
        <p id="website-help" className="mt-1.5 text-[13px] text-white/40">
          Leave blank only if you don&rsquo;t have one — without it we can&rsquo;t check whether the engine reads your site.
        </p>
        <FieldError id="website-error" message={errors.website} />
      </div>

      <div>
        <FieldLabel htmlFor="checker-email">Email *</FieldLabel>
        <input
          id="checker-email"
          type="email"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          maxLength={MAX_LENGTHS.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="jane@yourbusiness.com"
          className={cn("mt-3", UNDERLINE_INPUT)}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      <div>
        <FieldLabel htmlFor="checker-keyword">Keyword *</FieldLabel>
        <input
          id="checker-keyword"
          type="text"
          value={values.keyword}
          onChange={(e) => updateField("keyword", e.target.value)}
          maxLength={MAX_LENGTHS.keyword}
          aria-invalid={Boolean(errors.keyword)}
          aria-describedby={errors.keyword ? "keyword-error" : undefined}
          placeholder="best dentist"
          className={cn("mt-3", UNDERLINE_INPUT)}
        />
        <FieldError id="keyword-error" message={errors.keyword} />
      </div>

      {/* PART 1B — Country first: State's control type (dropdown vs text)
          and City's (dropdown vs text) both cascade from it, so a visitor
          who filled City or State before Country would just be redone by
          this order — Country goes first so the cascade is never wasted
          work. Every control starts on its own placeholder; nothing here
          is pre-selected. */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="checker-country">Country *</FieldLabel>
          <div className="relative mt-3">
            <select
              id="checker-country"
              value={values.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              aria-invalid={Boolean(errors.country)}
              aria-describedby={errors.country ? "country-error" : undefined}
              className={UNDERLINE_SELECT}
            >
              <option value="" disabled>
                Select country
              </option>
              {countriesForSelect().map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
          <FieldError id="country-error" message={errors.country} />
        </div>

        <div>
          <FieldLabel htmlFor="checker-region">State / region (optional)</FieldLabel>
          {isIndiaSelected ? (
            <div className="relative mt-3">
              <select
                id="checker-region"
                value={values.region}
                onChange={(e) => handleRegionSelectChange(e.target.value)}
                className={UNDERLINE_SELECT}
              >
                <option value="" disabled>
                  Select state or region
                </option>
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          ) : (
            <input
              id="checker-region"
              type="text"
              value={values.region}
              onChange={(e) => updateField("region", e.target.value)}
              maxLength={MAX_LENGTHS.region}
              placeholder="Punjab"
              className={cn("mt-3", UNDERLINE_INPUT)}
            />
          )}
        </div>

        <div>
          <FieldLabel htmlFor="checker-city">City (optional)</FieldLabel>
          {showCityDropdown ? (
            <div className="relative mt-3">
              <select
                id="checker-city"
                value={values.city}
                onChange={(e) => handleCitySelectChange(e.target.value)}
                aria-describedby="city-help"
                className={UNDERLINE_SELECT}
              >
                <option value="" disabled>
                  Select city
                </option>
                {citiesForState!.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={OTHER_CITY_VALUE}>Other — type it</option>
              </select>
              <SelectChevron />
            </div>
          ) : (
            <input
              id="checker-city"
              type="text"
              value={values.city}
              onChange={(e) => updateField("city", e.target.value)}
              maxLength={MAX_LENGTHS.city}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "city-error" : "city-help"}
              placeholder="Amritsar"
              className={cn("mt-3", UNDERLINE_INPUT)}
            />
          )}
          <p id="city-help" className="mt-1.5 text-[13px] text-white/40">
            Leave blank if you serve the whole country or sell online.
          </p>
          <FieldError id="city-error" message={errors.city} />
        </div>
      </div>

      <div className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="shiny-cta w-full sm:w-auto">
          <span>Check my AI visibility</span>
        </button>
        <QuotaLine quota={quota} />
      </div>

      <p className="text-xs text-white/40">
        We store your submission —{" "}
        <a href="/privacy/#ai-visibility-checker" className="underline decoration-white/30 underline-offset-2 hover:text-white/70">
          see our privacy policy
        </a>
        .
      </p>
    </form>
  );
}
