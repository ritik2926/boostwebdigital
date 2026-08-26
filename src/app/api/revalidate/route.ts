import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { notifySubscribers } from "@/lib/newsletter/notify";

export const runtime = "nodejs";
export const maxDuration = 60;

// Called by a WordPress webhook (or Ritik, manually) after publishing or
// editing a post, so the site doesn't wait for the next full redeploy to
// pick it up. Never logs or echoes the secret — a 401 on mismatch is all
// the caller needs to know.
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = typeof body?.slug === "string" ? body.slug : undefined;

  // Next 16 added a required second "profile" argument to revalidateTag,
  // part of its newer cache-components model — "max" is one of Next's own
  // built-in profile names (cache as long as possible), passed here since
  // this route only ever wants a full, immediate invalidation regardless
  // of whatever cache-life a fetch call ends up tagged with.
  revalidateTag("posts", "max");
  revalidatePath("/blogs");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  }

  // Runs after revalidation, only when a slug is present, and can never
  // change this route's response — cache invalidation is the more
  // important job, and a newsletter failure must never look like a
  // revalidate failure to the caller (the WordPress mu-plugin).
  if (slug) {
    try {
      const result = await notifySubscribers(slug);
      console.log("[newsletter]", slug, result);
    } catch (err) {
      console.error("[newsletter] failed for", slug, err);
    }
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
