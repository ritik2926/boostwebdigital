import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

const SITE_URL = "https://boostwebdigital.com";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed/?status=invalid`);
  }

  const rows = (await sql`SELECT id, status FROM subscribers WHERE token = ${token}`) as Array<{ id: string; status: string }>;
  const row = rows[0];

  if (!row || row.status === "unsubscribed") {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed/?status=invalid`);
  }

  if (row.status === "pending") {
    await sql`UPDATE subscribers SET status = 'confirmed', confirmed_at = now() WHERE id = ${row.id}`;
  }
  // Already 'confirmed' — treat as success, no error, no second write.

  // Token is deliberately NOT cleared — it's reused as the unsubscribe
  // link's identifier (PART 2).
  return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed/`);
}
