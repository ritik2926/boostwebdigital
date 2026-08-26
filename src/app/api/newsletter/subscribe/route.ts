import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { isDisposableEmail } from "@/lib/email/disposable";
import { renderEmail } from "@/lib/email/template";

export const runtime = "nodejs";

const SITE_URL = "https://boostwebdigital.com";

// Identical wording in every outcome (new / already-pending / already-
// confirmed / re-opting-in) — never reveal whether a given address is
// already on the list. See the enumeration-protection note in PART 2.
const SUCCESS_MESSAGE = "Check your inbox — we've sent you a confirmation link.";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

interface SubscribeBody {
  email?: unknown;
  "company-name"?: unknown;
  "rendered-at"?: unknown;
  source?: unknown;
}

export async function POST(request: Request) {
  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const decoySuccess = () => NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });

  // 1. Honeypot — a real visitor never sees "company-name". A bot filling
  // every field will. Same response, nothing written, nothing sent.
  const honeypot = body["company-name"];
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return decoySuccess();
  }

  // 2. Timing — a human takes more than 3s to notice the form and submit
  // it; a bot that fetches the page and posts immediately doesn't.
  const renderedAt = typeof body["rendered-at"] === "number" ? body["rendered-at"] : null;
  if (renderedAt === null || Date.now() - renderedAt < 3000) {
    return decoySuccess();
  }

  // 3. Rate limit — 3 signups per IP per hour, shared Upstash-backed helper.
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const { allowed } = await checkRateLimit(`newsletter-subscribe:${ipHash}`, { limit: 3, windowSeconds: 3600 });
  if (!allowed) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again in an hour." }, { status: 429 });
  }

  // 4. Validate
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });
  }
  if (isDisposableEmail(email)) {
    return NextResponse.json({ ok: false, message: "Please use a permanent email address." }, { status: 400 });
  }

  const source = typeof body.source === "string" && body.source ? body.source : "website";

  // 5. Token
  const token = crypto.randomBytes(32).toString("hex");

  // 6. Upsert — see PART 2 for the four-way branch this implements.
  const existing = (await sql`SELECT id, status FROM subscribers WHERE email = ${email}`) as Array<{
    id: string;
    status: string;
  }>;
  let shouldSend = true;

  if (existing.length === 0) {
    await sql`
      INSERT INTO subscribers (email, status, token, source, ip_hash)
      VALUES (${email}, 'pending', ${token}, ${source}, ${ipHash})
    `;
  } else {
    const row = existing[0]!;
    if (row.status === "pending") {
      await sql`UPDATE subscribers SET token = ${token} WHERE id = ${row.id}`;
    } else if (row.status === "confirmed") {
      shouldSend = false;
    } else {
      // 'unsubscribed' — they're opting back in.
      await sql`
        UPDATE subscribers
        SET status = 'pending', token = ${token}, unsubscribed_at = NULL
        WHERE id = ${row.id}
      `;
    }
  }

  // 7. Send confirmation (skipped only for the already-'confirmed' branch).
  if (shouldSend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[newsletter/subscribe] RESEND_API_KEY is not set — row saved, no email sent.");
    } else {
      const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
      const { html, text } = renderEmail({
        subject: "Confirm your subscription",
        preheader: "One click and you're on the list.",
        heading: "Confirm your subscription",
        body: [
          "You asked for new posts from Boost Web Digital. Click below to confirm and we'll email you when something new goes up.",
          "If you didn't sign up, ignore this — you won't hear from us again.",
        ],
        cta: { label: "Confirm subscription", url: confirmUrl },
        showSignature: true,
        footerNote:
          "You received this because someone entered this address at boostwebdigital.com. No further email will be sent unless you confirm.",
      });

      try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: "Boost Web Digital <hello@boostwebdigital.com>",
          replyTo: "ritik@boostwebdigital.com",
          to: email,
          subject: "Confirm your subscription",
          html,
          text,
        });
        if (error) console.error("[newsletter/subscribe] Resend returned an error:", error);
      } catch (err) {
        console.error("[newsletter/subscribe] Failed to send confirmation email:", err);
      }
    }
  }

  // Identical response regardless of branch — see SUCCESS_MESSAGE above.
  return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
}
