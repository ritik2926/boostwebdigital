import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const TO_EMAIL = "hello@boostwebdigital.com";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
      { message: "Email sending isn't configured yet. Please email hello@boostwebdigital.com directly." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "Boost Web Digital <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Budget: ${budget}`,
        `Needs: ${needs.length ? needs.join(", ") : "Not specified"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
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

  return NextResponse.json({ ok: true });
}
