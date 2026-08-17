# Boost Web Digital — Launch Tracker

**How to use:** work top to bottom. Tick each box only after you've checked it yourself. Never skip ahead.

Keep this file in your project folder. Update it as you go — it becomes your record of what was done and when.

---

## Which files matter, and when

You have several documents. Most are for later. **Right now you need three.**

| File | Use it | When |
|---|---|---|
| **PROGRESS.md** (this file) | Your tracker. Where you are, what's next. | **Now, every day** |
| **PROMPTS.md** | Copy-paste prompts for Claude Code. | **Now, one at a time** |
| **SEO-BUILD-RULES.md** | Claude Code reads this. You don't need to. | **Now — just put it in the folder** |
| SEO-RULES.md | Full SEO reference for future pages. | Month 2+ |
| BoostWebDigital-Homepage-Content.md | The homepage copy. | Already used |
| boostwebdigital-pricing-page.md | Pricing page copy. | When you build /pricing/ |
| PricingSection.jsx | The pricing component. | When you add it |

**Ignore everything in the bottom four rows until the homepage is live.**

---

# PHASE 1 — Preparation

**Goal:** get set up so nothing can break. About 20 minutes.

### ☐ 1.1 Put the three files in your project

Drop `PROGRESS.md`, `PROMPTS.md` and `SEO-BUILD-RULES.md` into your project folder — the same folder that contains `package.json`.

*What's happening:* Claude Code can only read files that are in your project. This makes the rules available to it.

**Check:** you can see all three files next to `package.json`.

---

### ☐ 1.2 Make sure the site currently works

Open a terminal in your project folder and run:

```bash
npm run build
```

*What's happening:* this compiles your site the same way the real server will. If it fails now, it will fail after our changes too — and you won't know which caused it.

**Check:** it finishes with no red errors.

**If it fails:** stop. Paste the error into Claude Code and ask it to fix that first. Don't start SEO work on a broken build.

---

### ☐ 1.3 Run Prompt 0

Open Claude Code in your project folder. Paste **Prompt 0** from `PROMPTS.md`.

*What's happening:* this creates a **branch** — a safe parallel copy of your code. Every change happens there. Your working site stays untouched until you decide to merge.

**Check:** Claude Code lists three things it's not allowed to change, tells you your Next.js version, and confirms it created the `seo-optimization` branch.

---

# PHASE 2 — Understand before changing

**Goal:** know what's missing before anything is touched. About 15 minutes.

### ☐ 2.1 Run Prompt 1 (the audit)

Paste **Prompt 1**. This changes nothing at all.

*What's happening:* Claude Code reads your entire site and reports what SEO pieces are missing — no title tags, no schema, three H1s, whatever it finds.

**Check:** you get a report. Zero files changed.

**Read the report.** You don't need to understand every line. Look for the risk ratings: *safe*, *needs care*, *risky*. That tells you which steps to pay closest attention to.

**Write below what it found:**

```
Notes from audit:



```

---

# PHASE 3 — Build the SEO

**Goal:** add everything without changing how the site looks. About 2 hours, spread over as many sessions as you like.

**The rhythm, every single time:**
1. Paste one prompt
2. Wait for Claude Code to finish
3. Run `npm run dev`, open `localhost:3000`
4. Does it look exactly the same? Check mobile too (F12 → phone icon)
5. Yes → tick the box, next prompt. No → use the emergency prompt.

---

### ☐ 3.1 Prompt 2 — Root layout

*What's happening:* adds your site's title and description — the text Google shows in search results, and what appears when someone shares your link on WhatsApp or LinkedIn. Right now you probably have something like "Create Next App".

**Check:** site looks identical. Right-click → View Page Source → find `<title>` → it says your real title.

---

### ☐ 3.2 Prompt 3 — Schema foundation

*What's happening:* creates two new files that hold your business's structured facts — name, founder, services, URL. This is the block that AI systems read to understand who you are. **This is the most important thing on the whole list** for getting cited by ChatGPT and Google AI.

**Check:** site looks identical. Two new files exist. Build passes.

---

### ☐ 3.3 Prompt 4 — Homepage metadata + schema

*What's happening:* the homepage gets its own title, description, and its structured-data block.

**Check:**
- Site looks identical
- View Page Source → Ctrl+F → search `application/ld+json` → you find a block of JSON
- Copy that JSON, paste it into **[Rich Results Test](https://search.google.com/test/rich-results)** → zero errors

**This is your first real proof it worked.** Screenshot it.

---

### ☐ 3.4 Prompt 5 — Headings ⚠️ *the careful one*

*What's happening:* search engines need exactly one main heading (H1) per page, in a logical order. This is the **only step that touches something visible.**

Claude Code will report first and wait for your approval. It will give you a before/after table.

**Check:** look at each spot in that table specifically. Same size, same weight, same position. Check mobile.

**If anything looks different:** emergency prompt, immediately.

---

### ☐ 3.5 Prompt 6 — Images and links

*What's happening:* converts images to Next.js's image component (makes them load faster — and speed strongly affects whether AI cites you), adds descriptions for accessibility and search, and fixes vague link text.

**Check:** all images still appear, same size, same place. Nothing jumps around while the page loads.

---

### ☐ 3.6 Prompt 7 — Sitemap, robots, social image

*What's happening:* creates the list of pages for Google (`sitemap.xml`), the crawler instructions (`robots.txt`), and the preview image shown when your link is shared.

**Check:** visit `localhost:3000/sitemap.xml` and `localhost:3000/robots.txt` — both show content.

---

### ☐ 3.7 Prompt 8 — Speed

*What's happening:* finds what's slowing the page down. Claude Code reports first — you choose which fixes to take.

**Take the safe ones. Skip anything marked risky.** You can revisit later.

**Check:** site looks identical and feels at least as fast.

---

# PHASE 4 — Go live

**Goal:** homepage live on your real domain. About 45 minutes.

### ☐ 4.1 Prompt 9 — Final check

*What's happening:* Claude Code runs through the full checklist and gives you a pass/fail table.

**Check:** every row passes. If any fail, fix before continuing.

---

### ☐ 4.2 Prompt 10 — Push to GitHub

*What's happening:* your branch goes up to GitHub. Vercel notices and automatically builds a **preview** — the real site on real servers, at a temporary URL.

**Your live domain is still untouched at this point.**

**Check:** you have a preview URL like `boostwebdigital-git-seo-optimization.vercel.app`.

---

### ☐ 4.3 Test the preview properly

Open the preview URL and check:

- ☐ Homepage looks right on desktop
- ☐ Homepage looks right on your phone (open the URL on your actual phone)
- ☐ Every link works
- ☐ `/sitemap.xml` loads
- ☐ `/robots.txt` loads
- ☐ Paste the preview URL into [Rich Results Test](https://search.google.com/test/rich-results) → zero errors
- ☐ Paste it into [PageSpeed Insights](https://pagespeed.web.dev/) → note the mobile score

**Write your PageSpeed mobile score here — it's your baseline:**

```
Mobile score:        /100
LCP:              seconds
CLS:
Date checked:
```

---

### ☐ 4.4 Merge to live

Only after 4.3 is fully ticked. On GitHub: open the pull request → **Merge**.

Vercel deploys to your real domain automatically, usually within two minutes.

**Check:** `https://boostwebdigital.com` loads and looks right.

🎉 **You're live.**

---

### ☐ 4.5 Tell Google you exist

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property → `boostwebdigital.com`
3. Verify (Vercel makes this easy — DNS record or HTML file)
4. Sitemaps → submit `https://boostwebdigital.com/sitemap.xml`
5. URL Inspection → paste your homepage → **Request Indexing**

*What's happening:* Google doesn't know your site exists yet. This is you raising your hand. Indexing usually takes a few days.

---

### ☐ 4.6 Also do these — free, 15 minutes

- ☐ [Bing Webmaster Tools](https://www.bing.com/webmasters) — add and submit the sitemap. Bing feeds ChatGPT's search, so this matters more than it used to.
- ☐ Run your own 15-question AI scan on your site and record the baseline. Day-one citations are almost certainly zero. **That zero is your first data point** — and eventually your own case study.

---

# HOW YOU KNOW IT'S WORKING

Realistic timeline. Do not panic in week two.

| When | What should happen | Where to look |
|---|---|---|
| **Day 1–3** | Google indexes the homepage | Search Console → Pages |
| **Day 3–7** | Searching `site:boostwebdigital.com` in Google returns your page | Google |
| **Week 2–4** | A trickle of impressions for brand and long-tail terms | Search Console → Performance |
| **Month 2–3** | First AI citations, *if* you've published the Index and built third-party mentions | Your monthly scan |
| **Month 4–6** | Rankings for lower-competition long-tail terms | Search Console |
| **Month 6–12** | Movement on competitive terms | Search Console |

**Honest expectation: your homepage will not rank for "healthcare marketing agency" this year.** Twenty-year-old domains hold that. That's fine — this year's clients come from outreach and the Index, not from ranking. The SEO work is you planting a tree, not buying fruit.

## Track these monthly — five minutes, same day each month

```
Month:  ___________

Search Console
  Impressions:
  Clicks:
  Indexed pages:
  Avg position:

AI Visibility (your 15-question scan)
  ChatGPT mentions:
  Perplexity mentions:
  Google AI Overview mentions:
  Gemini mentions:

Authority
  Referring domains (Ahrefs free / Search Console → Links):

Speed
  PageSpeed mobile score:
```

Same numbers, same method, same day every month. **A metric that keeps changing definition is not a metric** — and this is literally the discipline you're going to charge clients for, so practise it on yourself first.

---

# IF SOMETHING GOES WRONG

| Problem | Do this |
|---|---|
| Site looks broken after a change | "Something looks broken" prompt in `PROMPTS.md` |
| `npm run build` fails | "Build is failing" prompt |
| Want to undo everything | "Revert everything" prompt |
| Live site is broken | Vercel dashboard → Deployments → previous one → **Instant Rollback**. Takes 10 seconds. |

**You can always get back.** That's what the branch and Vercel's rollback are for. Nothing here is permanent.

---

# AFTER LAUNCH — what's next

Don't start these until the homepage is live and ticked off.

1. ☐ Run the AI visibility scan on your hair transplant client + 50 competitors
2. ☐ Build `/hair-transplant-ai-visibility-index/` with that data
3. ☐ Build `/about/` with your photo
4. ☐ Build `/pricing/` using the copy and component already written
5. ☐ Start the weekly `/ai-search-news/` post
6. ☐ Claim Clutch, UpCity, LinkedIn, Semrush directory listings — all free
7. ☐ Begin outreach

**Step 1 is the highest-value thing you will do all quarter.** It unlocks the Index, the case study, the free-report offer and your outreach — all four from one afternoon's work.

---

*Update this file as you go. Tick boxes. Write dates. In three months you'll want the record.*
