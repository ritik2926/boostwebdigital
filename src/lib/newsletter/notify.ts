import { Resend } from "resend";
import { sql } from "@/lib/db";
import { getPostBySlug } from "@/lib/blog/source";
import { renderEmail, escapeHtml } from "@/lib/email/template";
import type { BlogPost } from "@/lib/blog/types";

/**
 * db.ts's own import boundary (only files under src/app/api/) does not
 * cover this file — src/lib/newsletter/notify.ts is itself only ever
 * imported from src/app/api/revalidate/route.ts and
 * src/app/api/newsletter/test-send/route.ts, both under that boundary.
 */

const SITE_URL = "https://boostwebdigital.com";
const BATCH_SIZE = 100;
const DAILY_SEND_CAP = 100; // Resend free tier

interface Recipient {
  email: string;
  token: string;
}

/**
 * Shared by the real send (notifySubscribers) and /api/newsletter/test-send
 * so a preview is provably identical to what a real subscriber receives —
 * same subject, same body, same headers, only the recipient differs.
 */
export function buildEmailPayload(post: BlogPost, recipient: Recipient) {
  const postUrl = `${SITE_URL}/blog/${post.slug}/`;
  const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe/?token=${recipient.token}`;
  const preheader = post.excerpt.slice(0, 100);

  // post.excerpt (src/lib/blog/wordpress.ts's deriveExcerpt) is already
  // plain text — HTML-stripped and entity-decoded — never raw WordPress
  // HTML. escapeHtml() re-escapes it for safe interpolation into bodyHtml;
  // bodyText uses the same plain string unescaped, per PART 2.
  const { html, text } = renderEmail({
    preheader,
    heading: post.title,
    bodyHtml: `<p style="margin: 0;">${escapeHtml(post.excerpt)}</p>`,
    bodyText: post.excerpt,
    cta: { label: "Read the post", url: postUrl },
    showSignature: true,
    footerNote: `You're receiving this because you confirmed your subscription at boostwebdigital.com. Unsubscribe: ${unsubscribeUrl}`,
  });

  return {
    from: "Boost Web Digital <hello@boostwebdigital.com>",
    to: recipient.email,
    replyTo: "ritik@boostwebdigital.com",
    subject: post.title,
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${SITE_URL}/api/newsletter/unsubscribe?token=${recipient.token}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

async function sendBatches(post: BlogPost, recipients: Recipient[]): Promise<number> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[newsletter] RESEND_API_KEY is not set — no emails sent for", post.slug);
    return 0;
  }
  const resend = new Resend(apiKey);

  let sent = 0;
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    try {
      const { data, error } = await resend.batch.send(chunk.map((r) => buildEmailPayload(post, r)));
      if (error) {
        console.error(`[newsletter] batch ${i / BATCH_SIZE + 1} failed for ${post.slug}:`, error);
        continue; // a failed batch must not abort the remaining batches
      }
      sent += data?.length ?? 0;
    } catch (err) {
      console.error(`[newsletter] batch ${i / BATCH_SIZE + 1} threw for ${post.slug}:`, err);
    }
  }
  return sent;
}

export async function notifySubscribers(slug: string): Promise<{ sent: number; skipped: string | null }> {
  try {
    // 1. Claim the slug first — the whole duplicate guard. See PART 1.
    const claimed = (await sql`
      INSERT INTO sent_posts (post_slug) VALUES (${slug})
      ON CONFLICT (post_slug) DO NOTHING
      RETURNING post_slug
    `) as Array<{ post_slug: string }>;
    if (claimed.length === 0) {
      return { sent: 0, skipped: "already-sent" };
    }

    // 2 & 3. Fetch and verify published. getPostBySlug's own WordPress
    // query already filters status=publish, so a missing post and an
    // unpublished/trashed one are indistinguishable here — both return
    // null, and both mean "don't email this."
    const post = await getPostBySlug(slug);
    if (!post) {
      await sql`DELETE FROM sent_posts WHERE post_slug = ${slug}`;
      return { sent: 0, skipped: "not-published" };
    }

    // 4. Load recipients
    const recipients = (await sql`SELECT email, token FROM subscribers WHERE status = 'confirmed'`) as Recipient[];
    if (recipients.length === 0) {
      await sql`UPDATE sent_posts SET recipient_count = 0 WHERE post_slug = ${slug}`;
      return { sent: 0, skipped: "no-subscribers" };
    }

    // 5. Send — capped at the Resend free-tier daily quota. Never silently
    // truncate: a capped run is logged loudly, not just quietly short.
    const capped = recipients.slice(0, DAILY_SEND_CAP);
    if (recipients.length > DAILY_SEND_CAP) {
      console.warn(
        `[newsletter] daily send cap reached for ${slug} — sending to ${DAILY_SEND_CAP} of ${recipients.length} confirmed subscribers, ${recipients.length - DAILY_SEND_CAP} skipped this run`
      );
    }
    const sentCount = await sendBatches(post, capped);

    // 6. Record the real count
    await sql`UPDATE sent_posts SET recipient_count = ${sentCount} WHERE post_slug = ${slug}`;

    return { sent: sentCount, skipped: null };
  } catch (err) {
    // A total send failure must not throw out of notifySubscribers — the
    // caller (revalidate) must never fail because of this.
    console.error("[newsletter] notifySubscribers failed for", slug, err);
    return { sent: 0, skipped: "error" };
  }
}
