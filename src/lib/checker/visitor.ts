import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";

/**
 * Shared by both checker API routes (run + quota) so the signing scheme
 * only lives in one place. HMAC, not a JWT/session library — a single
 * opaque id with a signature is all a free-report counter needs.
 */
export const VISITOR_COOKIE_NAME = "visitor_id";
export const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

function sign(visitorId: string): string | null {
  const secret = process.env.VISITOR_COOKIE_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(visitorId).digest("hex");
}

export function newVisitorId(): string {
  return randomUUID();
}

export function buildVisitorCookieValue(visitorId: string): string {
  const signature = sign(visitorId);
  // No VISITOR_COOKIE_SECRET set → ship the id unsigned rather than throw;
  // verifyVisitorCookie below also can't verify without a secret, so this
  // degrades to "trust the cookie as-is" (same as a first visit each time
  // if the secret is genuinely unset) instead of hard-failing every request.
  return signature ? `${visitorId}.${signature}` : visitorId;
}

/** Missing, tampered, or unverifiable (secret unset, bad format, signature
 * mismatch) all resolve to null — callers treat that as "no visitor yet". */
export function verifyVisitorCookie(cookieValue: string | undefined | null): string | null {
  if (!cookieValue) return null;
  const separatorIndex = cookieValue.lastIndexOf(".");
  if (separatorIndex === -1) return null;
  const visitorId = cookieValue.slice(0, separatorIndex);
  const signature = cookieValue.slice(separatorIndex + 1);
  if (!visitorId || !signature) return null;

  const expected = sign(visitorId);
  if (!expected) return null;

  const provided = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (provided.length !== wanted.length) return null;
  return timingSafeEqual(provided, wanted) ? visitorId : null;
}

/** Never store a raw IP — this is the only form that reaches the database. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(ip + salt).digest("hex");
}
