import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

interface UnsubscribeBody {
  token?: unknown;
}

export async function POST(request: Request) {
  let body: UnsubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : "";
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Unknown token still returns ok:true — never confirm whether a token is
  // real (PART 2's enumeration-protection rule applies here too).
  await sql`
    UPDATE subscribers
    SET status = 'unsubscribed', unsubscribed_at = now()
    WHERE token = ${token} AND status != 'unsubscribed'
  `;

  return NextResponse.json({ ok: true });
}
