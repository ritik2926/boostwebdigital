import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPostBySlug } from "@/lib/blog/source";
import { buildEmailPayload } from "@/lib/newsletter/notify";

export const runtime = "nodejs";

interface TestSendBody {
  slug?: unknown;
  email?: unknown;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Lets Ritik preview a newsletter before it goes out, without publishing a
 * real post to a real list. Same secret as /api/revalidate — no separate
 * credential to manage. Never touches sent_posts or the subscribers table:
 * this is a one-off render+send, not a real campaign.
 */
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let body: TestSendBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!slug || !isValidEmail(email)) {
    return NextResponse.json({ message: "A valid slug and email are required." }, { status: 400 });
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ message: "Post not found or not published." }, { status: 404 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Email sending isn't configured yet." }, { status: 503 });
  }

  // No real subscriber is involved, so there's no real unsubscribe token to
  // use — a throwaway one exercises the identical URL-building/rendering
  // path (PART 4's requirement) without reading the subscribers table.
  // Clicking unsubscribe on a preview matches no row and no-ops, same as
  // any other unrecognized token.
  const previewToken = crypto.randomBytes(32).toString("hex");
  const payload = buildEmailPayload(post, { email, token: previewToken });

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send(payload);
    if (error) {
      console.error("[newsletter/test-send] Resend returned an error:", error);
      return NextResponse.json({ message: "The email service is unavailable right now." }, { status: 503 });
    }
  } catch (err) {
    console.error("[newsletter/test-send] Failed to send:", err);
    return NextResponse.json({ message: "The email service is unavailable right now." }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
