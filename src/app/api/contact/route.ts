import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { renderEmail, escapeHtml } from "@/lib/email/template";

export const runtime = "nodejs";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "contact@boostwebdigital.com";
const FROM_EMAIL = "Boost Web Digital <hello@boostwebdigital.com>";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
const MIN_SUBMIT_DELAY_MS = 3000;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** "Jane Rivera" -> "Jane". Falls back to "there" if the name can't be
 * split cleanly (empty after trimming). */
function getFirstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first && first.length > 0 ? first : "there";
}

// Never trust the client — every rule the form checks client-side is
// re-checked here, since the client-side pass can always be bypassed with a
// direct request to this endpoint.
function validate(fields: { name: string; email: string; message: string; budget: string }) {
  const errors: string[] = [];
  if (fields.name.trim().length < 2) errors.push("name");
  if (!isValidEmail(fields.email)) errors.push("email");
  if (fields.message.trim().length < 20) errors.push("message");
  if (!fields.budget) errors.push("budget");
  return errors;
}

export async function POST(request: Request) {
  const formData = await request.formData();

  // Honeypot — a real visitor never sees or fills this field. A bot that
  // fills every field on the page will. Return a plain 200 so the bot's
  // script doesn't learn anything from the response, but never send mail.
  const honeypot = formData.get("company-website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const message = String(formData.get("message") ?? "");
  const budget = String(formData.get("budget") ?? "");
  const needsRaw = String(formData.get("needs") ?? "[]");
  const file = formData.get("file");

  // Timing check — a real visitor can't fill out and submit this form in
  // under 3 seconds. Same decoy response as the honeypot, and for the same
  // reason: tell a bot's script nothing, but never send mail.
  const renderedAt = Number(formData.get("rendered-at"));
  if (!Number.isNaN(renderedAt) && Date.now() - renderedAt < MIN_SUBMIT_DELAY_MS) {
    return NextResponse.json({ ok: true });
  }

  // Rate limit before validation and before any Resend call, so a flood of
  // requests never burns real email quota — even ones that would fail
  // validation still cost an Upstash round trip if checked after it.
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_SECONDS);
  if (!rateLimit.ok) {
    const rateLimitMessage = "Too many messages. Please try again in an hour.";
    return NextResponse.json({ error: rateLimitMessage, message: rateLimitMessage }, { status: 429 });
  }

  const errors = validate({ name, email, message, budget });
  if (errors.length > 0) {
    return NextResponse.json({ message: "Please check the highlighted fields and try again.", fields: errors }, { status: 400 });
  }

  let needs: string[] = [];
  try {
    const parsed = JSON.parse(needsRaw);
    if (Array.isArray(parsed)) needs = parsed.filter((n) => typeof n === "string");
  } catch {
    // malformed needs payload — not fatal, just omit it from the email
  }

  let attachment: { filename: string; content: Buffer } | null = null;
  if (file instanceof File) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ message: "That file is larger than 10MB." }, { status: 400 });
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ message: "Use a PDF, DOC, PNG or JPG file." }, { status: 400 });
    }
    attachment = { filename: file.name, content: Buffer.from(await file.arrayBuffer()) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fail loudly, not silently — log the submission so it isn't lost, but
    // tell the visitor the truth instead of a fake "message sent."
    console.error("[contact] RESEND_API_KEY is not set — submission logged, not emailed:", {
      name,
      email,
      budget,
      needs,
      message,
      hasAttachment: Boolean(attachment),
    });
    return NextResponse.json(
      { message: "Email sending isn't configured yet. Please email contact@boostwebdigital.com directly." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const needsText = needs.length ? needs.join(", ") : "Not specified";
  const notificationEmail = renderEmail({
    preheader: `New inquiry from ${name}`,
    heading: `New inquiry from ${escapeHtml(name)}`,
    bodyHtml:
      `<p style="margin: 0 0 12px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>` +
      `<p style="margin: 0 0 12px 0;"><strong>Budget:</strong> ${escapeHtml(budget)}</p>` +
      `<p style="margin: 0 0 12px 0;"><strong>Needs:</strong> ${escapeHtml(needsText)}</p>` +
      `<p style="margin: 0 0 4px 0;"><strong>Message:</strong></p>` +
      `<p style="margin: 0;">${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
    bodyText: [`Email: ${email}`, `Budget: ${budget}`, `Needs: ${needsText}`, "", "Message:", message].join("\n"),
    showSignature: false,
  });

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html: notificationEmail.html,
      text: notificationEmail.text,
      attachments: attachment ? [attachment] : undefined,
    });

    if (error) {
      console.error("[contact] Resend returned an error:", error);
      return NextResponse.json({ message: "The email service is unavailable right now. Please email us directly." }, { status: 503 });
    }
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json({ message: "The email service is unavailable right now. Please email us directly." }, { status: 503 });
  }

  // Auto-reply to the submitter — best-effort. The important email (to
  // Ritik) already sent, so a failure here is logged and swallowed rather
  // than reported back to the visitor as an error.
  try {
    const firstName = getFirstName(name);
    const { html, text } = renderEmail({
      preheader: "Thanks for getting in touch — here's what happens next.",
      heading: `Thanks, ${firstName}`,
      bodyHtml:
        "<p style=\"margin: 0 0 16px 0;\">Your message reached us and we&#39;ll reply within one business day.</p>" +
        "<p style=\"margin: 0;\">If it&#39;s urgent, reply directly to this email — it comes straight to us.</p>",
      bodyText:
        "Your message reached us and we'll reply within one business day.\n\n" +
        "If it's urgent, reply directly to this email — it comes straight to us.",
      cta: { label: "Read the blog", url: "https://boostwebdigital.com/blogs/" },
      footerNote: "You received this because you submitted the contact form at boostwebdigital.com.",
      showSignature: true,
    });

    const { error: autoReplyError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: "contact@boostwebdigital.com",
      subject: "We got your message",
      html,
      text,
    });

    if (autoReplyError) {
      console.error("[contact] Auto-reply returned an error:", autoReplyError);
    }
  } catch (err) {
    console.error("[contact] Auto-reply failed to send:", err);
  }

  return NextResponse.json({ ok: true });
}
