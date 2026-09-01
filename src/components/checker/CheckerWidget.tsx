"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { CheckerReport } from "./CheckerReport";
import type { BlockReason, CheckerReport as CheckerReportData, HistoryReport } from "./types";

/**
 * Talks to the checker exclusively over fetch() to these three existing
 * routes — never imports src/lib/db.ts, src/lib/checker/engines/*, or
 * anything else that could carry EXA_API_KEY/DATABASE_URL/RESEND_API_KEY/
 * VISITOR_COOKIE_SECRET/IP_HASH_SALT into this "use client" module. See
 * this task's report for the grep that confirms none of the five reach the
 * built client bundle.
 */
const RUN_URL = "/api/checker/run/";
const QUOTA_URL = "/api/checker/quota/";
const HISTORY_URL = "/api/checker/history/";

const MIN_SUBMIT_DELAY_MS = 3000; // matches run/route.ts's own MIN_SUBMIT_DELAY_MS
const ABORT_MS = 75_000;

const STAGES = [
  { atMs: 0, label: "Searching the live web…" },
  { atMs: 8_000, label: "Reading what the AI said…" },
  { atMs: 20_000, label: "Measuring your visibility…" },
  { atMs: 30_000, label: "Writing your report…" },
] as const;

const MAX_LENGTHS = {
  business_name: 120,
  keyword: 100,
  city: 80,
  region: 80,
  country: 80,
  website: 200,
  email: 200,
} as const;

interface FormValues {
  business_name: string;
  website: string;
  email: string;
  keyword: string;
  city: string;
  region: string;
  country: string;
}

const INITIAL_VALUES: FormValues = {
  business_name: "",
  website: "",
  email: "",
  keyword: "",
  city: "",
  region: "",
  country: "India",
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type ViewState =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "report"; report: CheckerReportData }
  | { kind: "no-answer"; query: string; message: string }
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
  if (!values.business_name.trim()) errors.business_name = "Enter your practice or business name.";
  else if (values.business_name.length > MAX_LENGTHS.business_name) errors.business_name = "That name is too long.";

  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";

  if (!values.keyword.trim()) errors.keyword = 'Enter a keyword, e.g. "best dentist".';
  else if (values.keyword.length > MAX_LENGTHS.keyword) errors.keyword = "That keyword is too long.";

  if (!values.city.trim()) errors.city = "Enter a city.";
  else if (values.city.length > MAX_LENGTHS.city) errors.city = "That city name is too long.";

  if (!values.country.trim()) errors.country = "Enter a country.";
  else if (values.country.length > MAX_LENGTHS.country) errors.country = "That country name is too long.";

  if (values.website.trim() && !looksLikeUrl(values.website.trim())) errors.website = "Enter a valid website address, or leave this blank.";

  return errors;
}

const UNDERLINE_INPUT =
  "w-full border-0 border-b border-white/15 bg-transparent pb-2.5 text-[15px] text-white outline-none transition-[border-color,border-width] duration-200 placeholder:text-white/40 focus-visible:border-b-2 focus-visible:border-accent";

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

function RunningStages() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      let next = 0;
      for (let i = 0; i < STAGES.length; i++) {
        if (elapsed >= STAGES[i]!.atMs) next = i;
      }
      setStageIndex(next);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <svg className="h-6 w-6 animate-spin text-white/50" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p aria-live="polite" className="text-[15px] font-medium text-white">
        {STAGES[stageIndex]!.label}
      </p>
      <p className="text-sm text-white/40">This takes about 30 seconds.</p>
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
                    query: item.query,
                    model: item.model,
                    answer: item.answer,
                    sources: item.sources,
                    matched: item.matched,
                    variantMatched: item.variantMatched,
                    firstIndex: item.firstIndex,
                    mentionCount: item.mentionCount,
                    score: item.score,
                    breakdown: [],
                    competitors: item.competitors,
                    strengths: item.strengths,
                    weaknesses: item.weaknesses,
                    recommendations: item.recommendations,
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
  const submittingRef = useRef(false);

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
    setView({ kind: "running" });

    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), ABORT_MS);

    try {
      const res = await fetch(RUN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          business_name: values.business_name.trim(),
          website: values.website.trim(),
          email: values.email.trim(),
          keyword: values.keyword.trim(),
          city: values.city.trim(),
          region: values.region.trim(),
          country: values.country.trim(),
          "company-website": honeypot,
          "rendered-at": renderedAt,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!data) {
        setView({ kind: "error", message: "Something went wrong. Please try again. This did not use one of your free reports." });
        return;
      }

      if (data.blocked) {
        const reason: BlockReason = data.reason === "daily-cap" ? "daily-cap" : "visitor-limit";
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
          setView({
            kind: "no-answer",
            query: report.query,
            message: report.message ?? "No answer was returned for this query. This did not use one of your free reports.",
          });
          setQuota((prev) => prev); // unchanged — no-answer never consumes quota
        } else {
          setView({ kind: "report", report });
          setQuota((prev) => (prev ? { used: prev.used + 1, remaining: Math.max(0, prev.remaining - 1) } : prev));
        }
        return;
      }

      setView({
        kind: "error",
        message: (data.message as string | undefined) ?? "Something went wrong. This did not use one of your free reports.",
      });
    } catch (err) {
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
    return <RunningStages />;
  }

  if (view.kind === "report") {
    return <CheckerReport report={view.report} onReset={resetToForm} />;
  }

  if (view.kind === "no-answer") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-white/10 p-6">
        <h2 className="font-display text-xl font-semibold text-white">No AI answer came back</h2>
        <p className="text-sm text-white/45">
          Query sent: <span className="text-white/70">{view.query}</span>
        </p>
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

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 print:hidden">
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
          placeholder="Bright Smile Dental"
          className={cn("mt-3", UNDERLINE_INPUT)}
        />
        <FieldError id="business-name-error" message={errors.business_name} />
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
          aria-describedby={errors.website ? "website-error" : undefined}
          placeholder="yourpractice.com"
          className={cn("mt-3", UNDERLINE_INPUT)}
        />
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
          placeholder="jane@yourpractice.com"
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

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="checker-city">City *</FieldLabel>
          <input
            id="checker-city"
            type="text"
            value={values.city}
            onChange={(e) => updateField("city", e.target.value)}
            maxLength={MAX_LENGTHS.city}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? "city-error" : undefined}
            placeholder="Amritsar"
            className={cn("mt-3", UNDERLINE_INPUT)}
          />
          <FieldError id="city-error" message={errors.city} />
        </div>
        <div>
          <FieldLabel htmlFor="checker-region">State / region (optional)</FieldLabel>
          <input
            id="checker-region"
            type="text"
            value={values.region}
            onChange={(e) => updateField("region", e.target.value)}
            maxLength={MAX_LENGTHS.region}
            placeholder="Punjab"
            className={cn("mt-3", UNDERLINE_INPUT)}
          />
        </div>
        <div>
          <FieldLabel htmlFor="checker-country">Country *</FieldLabel>
          <input
            id="checker-country"
            type="text"
            value={values.country}
            onChange={(e) => updateField("country", e.target.value)}
            maxLength={MAX_LENGTHS.country}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? "country-error" : undefined}
            className={cn("mt-3", UNDERLINE_INPUT)}
          />
          <FieldError id="country-error" message={errors.country} />
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
