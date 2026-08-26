"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/Buttons";

type State = "idle" | "submitting" | "success" | "error";

/**
 * Client-only — the page itself stays a server component so a prefetched
 * GET (Gmail/security-scanner link-prefetch) never touches this component
 * at all. Nothing here runs until a real click fires the POST.
 */
export function UnsubscribeButton({ token }: { token: string }) {
  const [state, setState] = useState<State>("idle");

  async function handleClick() {
    setState("submitting");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error("request failed");
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return <p className="text-white/70">You&apos;ve been removed. You won&apos;t hear from us again.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <MagneticButton
        onClick={handleClick}
        disabled={state === "submitting"}
        className="disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "submitting" ? "Unsubscribing…" : "Unsubscribe"}
      </MagneticButton>
      {state === "error" && <p className="text-sm text-white/50">Something went wrong. Try again.</p>}
    </div>
  );
}
