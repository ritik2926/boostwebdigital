import { neon } from "@neondatabase/serverless";

/**
 * HTTP driver, not `pg` — Neon's serverless functions start and die per
 * request, so a pooled TCP connection is the wrong shape here; each query
 * is its own stateless HTTPS call.
 *
 * Import boundary: this file may ONLY be imported from files under
 * src/app/api/, or from src/lib/newsletter/notify.ts — which is itself
 * only ever imported from src/app/api/revalidate/route.ts and
 * src/app/api/newsletter/test-send/route.ts (notify.ts's own queries are
 * specified directly by the blog-publish-notification task, not layered
 * behind the API routes). A page/layout/client component importing this
 * file would bundle (or attempt to run) a database client outside a
 * request handler, and a client component importing it would try to ship
 * DATABASE_URL to the browser. Verified via
 * `grep -rL "app/api\|lib/newsletter/notify" $(grep -rl "lib/db" src)` —
 * see the newsletter task reports.
 *
 * Lazily constructed — `neon()` throws immediately if DATABASE_URL is
 * unset, and Next collects page data for every route module at build time
 * (imports it, doesn't call it), so an eager `neon(process.env.DATABASE_URL!)`
 * at module scope crashed `next build` outright whenever DATABASE_URL
 * wasn't present in the build environment. Same lazy-check shape the
 * contact route already uses for RESEND_API_KEY, just wrapped in a
 * pass-through tagged-template function instead of an `if` inside a
 * handler, since `sql` itself needs to keep being callable as
 * `` sql`SELECT ...` ``.
 */
let client: ReturnType<typeof neon> | undefined;

function getClient() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}

export const sql: ReturnType<typeof neon> = ((...args: Parameters<ReturnType<typeof neon>>) =>
  getClient()(...args)) as ReturnType<typeof neon>;
