import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  VISITOR_COOKIE_MAX_AGE_SECONDS,
  VISITOR_COOKIE_NAME,
  buildVisitorCookieValue,
  newVisitorId,
  verifyVisitorCookie,
} from "@/lib/checker/visitor";

export const runtime = "nodejs";

// See src/app/api/checker/run/route.ts for the assumed usage_counters
// schema this reads (visitor_id primary key, count, last_seen) — never
// altered here, read-only.
const FREE_REPORTS_LIMIT = 2;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const existingVisitorId = verifyVisitorCookie(request.cookies.get(VISITOR_COOKIE_NAME)?.value);
  const visitorId = existingVisitorId ?? newVisitorId();

  let used = 0;
  try {
    const rows = (await sql`SELECT count FROM usage_counters WHERE visitor_id = ${visitorId}`) as Array<{
      count: number;
    }>;
    used = rows[0]?.count ?? 0;
  } catch (err) {
    // Fail open (report 0 used) — this endpoint only affects what the form
    // displays before submission, never a security boundary on its own;
    // the real enforcement is the free-report check in run/route.ts.
    console.warn("[checker/quota] usage_counters lookup failed:", err instanceof Error ? err.message : err);
  }

  const response = NextResponse.json({
    used,
    remaining: Math.max(0, FREE_REPORTS_LIMIT - used),
  });

  if (!existingVisitorId) {
    response.cookies.set(VISITOR_COOKIE_NAME, buildVisitorCookieValue(visitorId), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
  }

  return response;
}
