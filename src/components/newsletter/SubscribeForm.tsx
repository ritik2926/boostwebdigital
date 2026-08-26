"use client";

import { useRef, useState } from "react";
import { MagneticButton } from "@/components/Buttons";
import { cn } from "@/lib/utils";

type State = "idle" | "submitting" | "success" | "error";

// Matches ContactForm.tsx's local UNDERLINE_INPUT (not exported from there,
// so duplicated rather than reached across files for one shared constant).
const UNDERLINE_INPUT =
  "w-full border-0 border-b border-white/15 bg-transparent pb-2.5 text-[15px] text-white outline-none transition-[border-color,border-width] duration-200 placeholder:text-white/40 focus:border-b-2 focus:border-accent";

/**
 * One reusable subscribe form — Footer.tsx and blog post pages, per PART 6.
 * Never the homepage, a popup, or a modal.
 */
export function SubscribeForm({ source, className }: { source: "footer" | "blog-post"; className?: string }) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const renderedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          "company-name": honeypot,
          "rendered-at": renderedAt.current,
          source,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (res.status === 429) {
        setState("error");
        setMessage(data?.message ?? "Too many attempts. Try again in an hour.");
        return;
      }
      if (!res.ok || !data?.ok) {
        setState("error");
        setMessage(data?.message ?? "Something went wrong. Try again.");
        return;
      }

      setState("success");
      setMessage(data.message ?? "Check your inbox — we've sent you a confirmation link.");
    } catch {
      setState("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  if (state === "success") {
    return (
      <div className={className}>
        <p className="text-sm text-white/70">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <p className="text-sm text-white/50">New posts on AI search visibility for healthcare practices. No pitches.</p>

      {/* Honeypot — hidden from sighted users and screen readers, never filled by a real person. Same technique as ContactForm.tsx. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="newsletter-company-name">Leave this field blank</label>
        <input
          id="newsletter-company-name"
          name="company-name"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={`newsletter-email-${source}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${source}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourpractice.com"
            className={UNDERLINE_INPUT}
          />
        </div>
        <MagneticButton type="submit" disabled={state === "submitting"} className="shrink-0 disabled:cursor-not-allowed disabled:opacity-60">
          {state === "submitting" ? "Sending…" : "Subscribe"}
        </MagneticButton>
      </div>

      {state === "error" && <p className="mt-3 text-sm text-white/50">{message}</p>}
    </form>
  );
}
