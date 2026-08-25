import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

/**
 * Generic sliding-window rate limiter on top of Upstash Redis. No
 * contact-form-specific logic here — the contact route (and, later, the AI
 * checker) supply their own identifier/limit/window and interpret the
 * result themselves.
 *
 * Fails OPEN: a missing Upstash config or an unreachable Redis must never
 * block a genuine visitor. Only a confirmed "over limit" response blocks.
 */

let redisClient: Redis | null = null;
const limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redisClient) redisClient = new Redis({ url, token });
  return redisClient;
}

function getLimiter(redis: Redis, limit: number, windowSeconds: number): Ratelimit {
  const key = `${limit}:${windowSeconds}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      prefix: "ratelimit",
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  const redis = getRedis();
  if (!redis) {
    console.warn("[rate-limit] UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not set — failing open");
    return { ok: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }

  // Never store or send the raw identifier (e.g. an IP address) to Redis.
  const hashed = createHash("sha256").update(identifier).digest("hex");

  try {
    const limiter = getLimiter(redis, limit, windowSeconds);
    const result = await limiter.limit(hashed);
    return { ok: result.success, remaining: result.remaining, resetAt: result.reset };
  } catch (err) {
    console.warn("[rate-limit] Upstash request failed — failing open:", err);
    return { ok: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }
}

/** Best-effort caller IP for rate-limiting — first x-forwarded-for entry,
 * then x-real-ip, then "unknown" (which still rate-limits, just as one
 * shared bucket for every caller neither header identifies). */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
