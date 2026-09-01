/**
 * Free tier: Google Search grounding is capped at 500 requests/day, shared
 * across the two models below — a 429 from either means that ceiling.
 * Grounding is not available on free tier for any Gemini 3.x model, so the
 * paid tier's single-call `combined` path (3.x grounding + structured
 * output in one request) can't be backfilled onto free — hence two
 * separate model configs, not one model with a flag. Anything other than
 * the literal "paid" is treated as free, so an unset or mistyped
 * GEMINI_TIER fails toward the safer (rate-limited, no-billing) tier rather
 * than silently trying to bill.
 *
 * Model names verified live against the Gemini API on 2026-08-27, NOT the
 * literal gemini-2.5-flash / gemini-2.5-flash-lite this file originally
 * specified — both now return 404 "no longer available to new users" for
 * this project's API key, with Google's own error response naming the
 * exact replacement for each:
 *   gemini-2.5-flash      -> gemini-3.6-flash       (error-message-specified)
 *   gemini-2.5-flash-lite -> gemini-3.5-flash-lite  (error-message-specified)
 * That second mapping means the "paid" tier below was already naming the
 * model that's now also the correct free-tier structured/lite model — a
 * coincidence of Google's naming migration, not a sign the two tiers have
 * converged. Confirm grounding still behaves as free-tier (not billed) on
 * gemini-3.6-flash before shipping; this could not be verified end-to-end
 * here because the API key had no request quota available at the time
 * (every model tried returned 429 "check your plan and billing details" —
 * see the task report's Questions section).
 */
type Tier = "free" | "paid";

export const TIER: Tier = process.env.GEMINI_TIER === "paid" ? "paid" : "free";

export const MODELS = {
  free: {
    grounded: "gemini-3.6-flash",
    structured: "gemini-3.5-flash-lite",
    combined: false,
  },
  paid: {
    grounded: "gemini-3.5-flash-lite",
    structured: "gemini-3.5-flash-lite",
    combined: true,
  },
}[TIER];
