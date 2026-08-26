/**
 * Distributed rate limiting via Upstash Redis's plain REST API — no SDK
 * (`@upstash/redis`/`@upstash/ratelimit`), since the newsletter task's only
 * approved new dependency is `@neondatabase/serverless`. UPSTASH_REDIS_REST_URL
 * / UPSTASH_REDIS_REST_TOKEN were already present in this project's env
 * (unused until now) — a plain in-memory counter would reset on every cold
 * start and diverge across concurrent serverless instances, so it can't
 * actually enforce "N per hour" the way an in-memory Map would silently
 * pretend to.
 *
 * One pipelined round trip: INCR always increments, `EXPIRE ... NX` sets
 * the window's TTL only the first time the key is created (Redis 7+) so a
 * burst of requests inside the window doesn't keep pushing the expiry back.
 */
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export async function checkRateLimit(
  key: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number }
): Promise<{ allowed: boolean }> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    // Fail OPEN, not closed — a misconfigured limiter should never be the
    // reason a real signup silently disappears. The honeypot, timing check
    // and disposable-domain filter upstream of this call still apply.
    console.warn("[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set — allowing request without limiting.");
    return { allowed: true };
  }

  let res: Response;
  try {
    res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
      ]),
    });
  } catch (err) {
    console.error("[rate-limit] Upstash request threw:", err);
    return { allowed: true };
  }

  if (!res.ok) {
    console.error("[rate-limit] Upstash returned", res.status);
    return { allowed: true };
  }

  const results = (await res.json()) as Array<{ result?: number; error?: string }>;
  const count = results[0]?.result ?? 0;
  return { allowed: count <= limit };
}
