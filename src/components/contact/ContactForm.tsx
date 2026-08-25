"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const NEED_OPTIONS = ["AI Visibility", "Healthcare SEO", "Reputation", "Paid Search", "Not sure yet"];
const BUDGET_OPTIONS = ["Under $1,500", "$1,500-$3,500", "$3,500+"];
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  budget?: string;
  file?: string;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const CHIP_BASE =
  "chip border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const CHIP_SELECTED = "border-accent bg-accent/12 text-accent";
const CHIP_UNSELECTED = "border-white/8 text-white/60 hover:border-white/20 hover:text-white";

const UNDERLINE_INPUT =
  "w-full border-0 border-b border-white/15 bg-transparent pb-2.5 text-[15px] text-white outline-none transition-[border-color,border-width] duration-200 placeholder:text-white/40 focus:border-b-2 focus:border-accent";

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

export function ContactForm() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  // Bot-timing check — a real visitor can't fill out and submit this form
  // in under 3 seconds. Captured once, at mount, so it reflects when the
  // form actually rendered rather than when the field happens to be read.
  const [renderedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function toggleNeed(option: string) {
    setNeeds((current) => (current.includes(option) ? current.filter((n) => n !== option) : [...current, option]));
  }

  function autoGrow() {
    const el = textareaRef.current;
    if (!el) return;
    // Batched via rAF rather than reading `scrollHeight` synchronously right
    // after the `height:auto` write on every keystroke (a forced-reflow
    // pattern PageSpeed flags) — this runs right before the next paint
    // instead of blocking the input handler.
    requestAnimationFrame(() => {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    });
  }

  function validateFile(candidate: File): string | null {
    if (candidate.size > MAX_FILE_BYTES) return "File is larger than 10MB.";
    if (!ALLOWED_FILE_TYPES.includes(candidate.type)) return "Use a PDF, DOC, PNG or JPG file.";
    return null;
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const candidate = e.target.files?.[0];
    if (!candidate) return;
    const fileError = validateFile(candidate);
    if (fileError) {
      setErrors((prev) => ({ ...prev, file: fileError }));
      return;
    }
    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(candidate);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const candidate = e.dataTransfer.files?.[0];
    if (!candidate) return;
    const fileError = validateFile(candidate);
    if (fileError) {
      setErrors((prev) => ({ ...prev, file: fileError }));
      return;
    }
    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(candidate);
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (message.trim().length < 20) next.message = "Tell us a little more — at least 20 characters.";
    if (!budget) next.budget = "Select a monthly budget.";
    setErrors((prev) => ({ ...prev, ...next, name: next.name, email: next.email, message: next.message, budget: next.budget }));
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return; // silently drop bot submissions

    const validation = validate();
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    setServerError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    formData.append("budget", budget ?? "");
    formData.append("needs", JSON.stringify(needs));
    formData.append("rendered-at", String(renderedAt));
    if (file) formData.append("file", file);

    try {
      // Trailing slash matches the sitewide trailingSlash:true config directly
      // — hitting the bare path would 308-redirect first (extra round trip).
      const res = await fetch("/api/contact/", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.message ?? "Something went wrong. Please email us directly instead.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Something went wrong. Please email us directly instead.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/12">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4.5 4.5L19 8" stroke="rgb(var(--accent-rgb))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">Thanks — we&apos;ll reply within 12 hours</h3>
        <p className="mt-2 max-w-xs text-sm text-white/60">
          Want to skip the wait? We also run a free AI visibility report while you wait to hear back.
        </p>
        <a
          href="mailto:contact@boostwebdigital.com"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          contact@boostwebdigital.com
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      {/* Honeypot — hidden from sighted users and screen readers, never filled by a real person */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-website">Leave this field blank</label>
        <input
          id="company-website"
          name="company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <input type="hidden" name="rendered-at" value={renderedAt} readOnly />

      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/40">What do you need?</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {NEED_OPTIONS.map((option) => {
            const selected = needs.includes(option);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleNeed(option)}
                className={cn(CHIP_BASE, selected ? CHIP_SELECTED : CHIP_UNSELECTED)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Monthly budget</span>
        <div role="radiogroup" aria-label="Monthly budget" className="mt-3 flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((option) => {
            const selected = budget === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setBudget(option);
                  setErrors((prev) => ({ ...prev, budget: undefined }));
                }}
                className={cn(CHIP_BASE, selected ? CHIP_SELECTED : CHIP_UNSELECTED)}
              >
                {option}
              </button>
            );
          })}
        </div>
        <FieldError id="budget-error" message={errors.budget} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="contact-name">Full name *</FieldLabel>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Jane Rivera"
            className={cn("mt-3", UNDERLINE_INPUT)}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <FieldLabel htmlFor="contact-email">Email *</FieldLabel>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="jane@yourpractice.com"
            className={cn("mt-3", UNDERLINE_INPUT)}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="contact-message">Tell us about your practice *</FieldLabel>
        <textarea
          id="contact-message"
          ref={textareaRef}
          rows={3}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            autoGrow();
          }}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="What's the practice, and what made you look for help now?"
          className={cn("mt-3 resize-none", UNDERLINE_INPUT)}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div>
        <FieldLabel htmlFor="file-upload">Attach a file (optional)</FieldLabel>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "mt-3 flex h-22 items-center justify-center rounded-xl border border-dashed transition-colors duration-150",
            dragActive ? "border-accent bg-accent/5" : "border-white/15 hover:border-white/25"
          )}
        >
          {file ? (
            <div className="flex items-center gap-3 px-4 text-sm text-white/75">
              <span className="max-w-60 truncate">{file.name}</span>
              <button
                type="button"
                onClick={removeFile}
                aria-label="Remove attached file"
                className="flex h-6 w-6 items-center justify-center rounded-full text-white/50 hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer text-center text-sm text-white/40">
              Choose a file or drag and drop here
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept={ALLOWED_FILE_TYPES.join(",")}
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}
        </div>
        <FieldError id="file-error" message={errors.file} />
      </div>

      {status === "error" && (
        <p role="alert" className="text-[13px] text-red-400">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group flex h-13 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-[#08080a] transition-transform duration-200 hover:scale-[1.01] hover:shadow-[0_0_32px_rgba(var(--accent-rgb),0.35)] disabled:opacity-70 disabled:hover:scale-100"
      >
        {status === "submitting" ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
              <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Sending...
          </>
        ) : (
          "Submit inquiry"
        )}
      </button>
    </form>
  );
}
