import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

interface UnsubscribeBody {
  token?: unknown;
}

/**
 * Token can arrive three ways:
 *  - the query string (?token=...) — how the List-Unsubscribe header points
 *    mail clients at this route for RFC 8058 one-click unsubscribe; the
 *    POST body they send is just the fixed "List-Unsubscribe=One-Click"
 *    marker, form-encoded, never JSON
 *  - a JSON body { token } — the site's own unsubscribe-page button
 *  - a form body — belt and suspenders for any other form-posting caller
 * Checked in that order since the query string is what a one-click POST
 * always carries, whether or not it also sends a body.
 */
async function readToken(request: Request): Promise<string> {
  const fromQuery = new URL(request.url).searchParams.get("token");
  if (fromQuery) return fromQuery;

  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body: UnsubscribeBody = await request.json();
      return typeof body.token === "string" ? body.token : "";
    }
    const formData = await request.formData();
    const fromForm = formData.get("token");
    return typeof fromForm === "string" ? fromForm : "";
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const token = await readToken(request);

  // No token at all, or an unrecognized one — same response either way,
  // never confirm whether a token is real (PART 2's enumeration-protection
  // rule applies here too). Mail providers expect a clean 200 for any
  // well-formed one-click POST, not a 400.
  if (token) {
    await sql`
      UPDATE subscribers
      SET status = 'unsubscribed', unsubscribed_at = now()
      WHERE token = ${token} AND status != 'unsubscribed'
    `;
  }

  return NextResponse.json({ ok: true });
}
