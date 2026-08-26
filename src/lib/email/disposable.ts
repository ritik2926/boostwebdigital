/**
 * Common disposable/temporary-inbox domains. There is no single canonical
 * list and this one isn't exhaustive — it's the set of domains actually
 * seen abusing signup forms in the wild, kept short and reviewable rather
 * than pulled in as a several-thousand-entry package. Add to it as new
 * ones show up in the subscribers table.
 *
 * The contact form (src/app/api/contact/route.ts) does NOT currently check
 * this list — despite the newsletter task's brief assuming it did and
 * asking to "extract" it from there, no such check exists in that route
 * today. This file is a new, standalone module the newsletter subscribe
 * route is the first consumer of.
 */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerrillamail.biz",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "10minutemail.com",
  "10minutemail.net",
  "temp-mail.org",
  "tempmail.com",
  "tempmail.net",
  "throwawaymail.com",
  "yopmail.com",
  "yopmail.net",
  "yopmail.fr",
  "trashmail.com",
  "trashmail.net",
  "getnada.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "mintemail.com",
  "tempinbox.com",
  "mailnesia.com",
  "mailcatch.com",
  "mailnull.com",
  "spamgourmet.com",
  "spam4.me",
  "moakt.com",
  "mohmal.com",
  "emailondeck.com",
  "discard.email",
  "discardmail.com",
  "tempmailo.com",
  "tempr.email",
  "temp-mail.io",
  "burnermail.io",
  "inboxkitten.com",
  "33mail.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}
