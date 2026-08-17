# SEO Build Rules — Boost Web Digital

**Read this file completely before touching any code.**

You are working on a Next.js (App Router) marketing site for **Boost Web Digital**, a healthcare marketing agency at `https://boostwebdigital.com`.

**The site owner is not a developer.** He cannot read a diff, debug a build error, or tell whether a change was safe. Everything you do must be explained in plain language and must be verifiable by looking at the site in a browser.

---

## 0. THE PRIME DIRECTIVE

> **The homepage currently works and looks correct. Your job is to add SEO without changing how a single pixel looks.**

If you are ever choosing between "better SEO" and "guaranteed not to break the design", **choose not breaking it every time.** Flag the SEO improvement, explain it, and wait to be asked.

A broken homepage costs the business money today. Slightly worse schema costs nothing today.

---

## 1. What you MAY change

These are additive. They add files or add exports. They do not alter what renders.

✅ **Create new files:**
- `app/sitemap.ts`
- `app/robots.ts`
- `app/opengraph-image.tsx`
- `app/icon.png`, `app/apple-icon.png`
- `components/JsonLd.tsx`
- `lib/schema.ts`

✅ **Add to existing files:**
- `export const metadata` / `export const viewport` in `app/layout.tsx` and `app/page.tsx`
- `<html lang="en">` if missing
- A `<JsonLd />` component call — it renders a `<script>` tag, which is invisible
- `alt` attributes on images that lack them
- `priority`, `width`, `height`, `sizes` on images

✅ **Swap with care (see §3):**
- `<img>` → `next/image`
- `<a href="/internal">` → `next/link`
- Heading tag levels

---

## 2. What you MUST NOT change

❌ **Never touch, without explicit permission asked and granted:**

| Never | Why |
|---|---|
| Any `className` or Tailwind class | This is the design. Changing one class can break the layout invisibly on mobile. |
| Any visible copy, heading text, or button label | The wording is deliberate and was written by a copywriter. |
| Component structure — adding, removing, or reordering JSX elements | Changes layout. |
| Component logic — `useState`, handlers, props, conditionals | Breaks functionality. |
| File or folder names, or file locations | Breaks imports. |
| `package.json`, `next.config.js`, `tailwind.config.js` | Breaks the build. |
| Installing any npm package | Ask first. Everything needed is built into Next.js. |
| `.env` or any environment variable | Security. |
| Colours, spacing, fonts, sizes, animations | This is the design. |
| Deleting anything | If something looks unused, say so. Don't remove it. |

**If a task seems to require one of these, stop and ask.** Explain what you need to change, why, and what the risk is.

---

## 3. The heading exception — the one genuinely risky change

SEO requires exactly one `<h1>` and no skipped heading levels. Fixing that means changing tags, e.g. `<h3>` → `<h2>`.

**In Tailwind, visual size comes from the `className`, not the tag** — so this is usually safe. But `@tailwindcss/typography` (`prose` classes) and any global CSS targeting `h2 {}` will restyle it.

**Procedure — follow exactly:**

1. Check whether the project uses `@tailwindcss/typography` or has global heading styles in `globals.css`. **Report what you find before changing anything.**
2. **Carry over the className exactly, character for character.**
   ```jsx
   // BEFORE
   <h3 className="text-lg font-normal tracking-tight">AI Visibility</h3>
   // AFTER — tag changed, className identical
   <h2 className="text-lg font-normal tracking-tight">AI Visibility</h2>
   ```
3. **List every heading change in your report** as a before/after table, so the owner can eyeball the page for those specific spots.
4. **Never change the heading text.** Only the tag.

If global heading styles exist, do **not** change tags. Report it and propose adding explicit Tailwind classes first, as a separate approved step.

---

## 4. How you must work

### 4.1 One step at a time

Never batch. Complete one numbered step, verify, report, **stop and wait**. The owner needs to check the site between steps so that if something breaks, we know exactly which change did it.

### 4.2 Always on a branch

Before your first change:

```bash
git checkout -b seo-optimization
```

Never commit to `main` directly. Commit after each verified step with a clear message.

### 4.3 Audit before editing

For any task, first **read and report**. Change nothing until the owner says go.

### 4.4 Always build before reporting

```bash
npm run build
```

If the build fails, **fix it or revert it before reporting.** Never hand back a broken build.

### 4.5 Report in plain language

The owner is not a developer. Every report uses this format:

```
## What I did
[Plain English. No jargon. "I added a description that Google shows
under your link in search results."]

## Files changed
- app/layout.tsx — added page title and description settings
- app/sitemap.ts — NEW FILE, tells Google which pages exist

## What you should see
Nothing. The site looks exactly the same. These changes are invisible
to visitors and only readable by search engines.

## Please check this yourself
1. Run: npm run dev
2. Open http://localhost:3000
3. Confirm the homepage looks exactly as it did before
4. [Specific check, e.g. "Right-click → View Page Source, press
   Ctrl+F, search for 'application/ld+json' — you should find it"]

## Build status
✅ npm run build completed with no errors

## What I did NOT do, and why
[Anything skipped, with the reason]

## Next step
[What comes next, and confirmation you're waiting for approval]
```

### 4.6 If you break something

Say so immediately, in the first line. Then:

```bash
git diff                    # show what changed
git checkout -- <file>      # revert one file
git reset --hard HEAD       # revert everything since last commit
```

Never try to quietly patch over a mistake. An honest revert is always cheaper.

---

## 5. Project facts — use these exactly

| Field | Value |
|---|---|
| Business name | `Boost Web Digital` |
| Descriptor | `Boost Web Digital — Healthcare Marketing & AI Visibility` |
| Domain | `https://boostwebdigital.com` |
| Founder | `Ritik Malhotra` |
| Locale | `en-US` |
| Market | United States |

**Spell these identically everywhere** — site copy, schema, meta tags. The brand name doesn't signal healthcare on its own, so consistency is doing that work. Any variation costs more than usual.

---

## 6. The SEO specification

### 6.1 Root layout — `app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://boostwebdigital.com"),
  title: {
    default: "Healthcare Marketing Agency | AI Search & SEO — Boost Web Digital",
    template: "%s | Boost Web Digital",
  },
  description: "...",
  applicationName: "Boost Web Digital",
  authors: [{ name: "Ritik Malhotra", url: "https://boostwebdigital.com/about/" }],
  creator: "Ritik Malhotra",
  publisher: "Boost Web Digital",
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Boost Web Digital",
    url: "https://boostwebdigital.com",
  },
  twitter: { card: "summary_large_image" },
};

// SEPARATE export — never inside metadata
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

`<html lang="en">` must be set.

### 6.2 Page metadata

Every page exports its own:

```tsx
export const metadata: Metadata = {
  title: "...",                                 // ≤60 chars, keyword first
  description: "...",                           // ≤155 chars, complete sentence
  alternates: { canonical: "/route-path/" },    // RELATIVE, not absolute
};
```

Do not repeat `metadataBase`, `siteName`, `locale`, or `twitter.card` — they inherit.

### 6.3 JSON-LD

`components/JsonLd.tsx` — Server Component, no `"use client"`:

```tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

`lib/schema.ts` exports shared nodes referenced by `@id`:
`ORGANIZATION` (`#organization`), `PERSON` (`#ritik`), `WEBSITE` (`#website`), plus `breadcrumb()` and `faqPage()` helpers.

Rules:
- One `@graph` per page
- Server Components only
- `FAQPage` text must match the visible page **word for word**
- **Never `AggregateRating` or `Review`** — no verifiable reviews exist; this is a manual-action risk
- `BreadcrumbList` on every page except the homepage

### 6.4 Homepage `@graph` nodes

`Organization` · `Person` · `WebSite` · `WebPage` · `Service` with `OfferCatalog` · `FAQPage` (only if a visible FAQ exists)

### 6.5 sitemap.ts and robots.ts

`app/sitemap.ts` — every indexable route. Homepage `priority: 1.0`. Exclude `/book/`, `/thank-you/`.
`app/robots.ts` — allow all, disallow `/api/` and `/_next/`, point `sitemap` at `https://boostwebdigital.com/sitemap.xml`.

### 6.6 Next.js 16 gotchas

- **`params` is a Promise.** `const { slug } = await params;` in `generateMetadata` and page components.
- `viewport` and `themeColor` are a separate export, never inside `metadata`.
- JSON-LD from Server Components only.
- `"use client"` belongs on the smallest interactive component — never on a page or layout.

---

## 7. Verify after every step

| Check | How | Expected |
|---|---|---|
| Build passes | `npm run build` | No red errors |
| Site unchanged | `npm run dev` → localhost:3000 | Looks identical |
| Mobile unchanged | Browser DevTools → phone view | Looks identical |
| Metadata present | View Page Source → search `<title>` | Correct title |
| Schema present | View Page Source → search `application/ld+json` | Found |
| Schema valid | Paste URL into Rich Results Test | Zero errors |
| One H1 | View Page Source → count `<h1` | Exactly 1 |
| Sitemap works | Visit `/sitemap.xml` | XML lists pages |
| Robots works | Visit `/robots.txt` | Text with sitemap line |

---

## 8. Plain-language glossary

The owner should understand what's being added.

| File / term | What it actually does |
|---|---|
| **Metadata** | The title and description Google shows in search results. Also what appears when a link is shared on WhatsApp or LinkedIn. |
| **`metadataBase`** | Tells Next.js the site's real address so it can build full URLs automatically. Set once. |
| **Canonical** | Tells Google "this is the official address of this page" — prevents duplicate-content confusion. |
| **JSON-LD / schema** | An invisible block of structured facts about the business. Google and AI systems read it to understand who you are. This is the single most important thing for AI citation. |
| **`sitemap.xml`** | A list of every page, so Google doesn't have to guess. |
| **`robots.txt`** | Instructions for crawlers about what to read and where the sitemap is. |
| **Open Graph image** | The preview picture when someone shares your link. |
| **H1** | The main headline. Exactly one per page — more than one confuses search engines. |
| **`next/image`** | Next.js's image component. Auto-compresses and resizes, which makes the site faster — and speed correlates strongly with AI citations. |
| **Server Component** | Code rendered on the server so search engines see the finished HTML. Schema must live here. |

---

## 9. Definition of done

- [ ] `npm run build` clean
- [ ] Homepage visually identical, desktop and mobile
- [ ] `metadata` and `viewport` in root layout
- [ ] Homepage has unique title, description, canonical
- [ ] JSON-LD present and valid in Rich Results Test
- [ ] Exactly one `<h1>` in rendered source
- [ ] No skipped heading levels
- [ ] All images use `next/image` with real `alt`
- [ ] `/sitemap.xml` and `/robots.txt` resolve
- [ ] OG image and favicon present
- [ ] No `AggregateRating` schema anywhere
- [ ] Every change committed to the `seo-optimization` branch with a clear message

---

## 10. Final rule

**When in doubt, ask. Do not guess.**

A question costs thirty seconds. A broken production homepage costs a day and possibly a client. There is no change on this site urgent enough to justify guessing.
