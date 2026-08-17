/**
 * Screenshot a route at desktop and mobile, full page, and report console errors.
 *
 * Usage:  npm run shot http://localhost:3000/about/ about
 * Output: docs/refs/shots/about-desktop.png
 *         docs/refs/shots/about-mobile.png
 *
 * The dev server must already be running in another terminal (npm run dev).
 */
const { chromium } = require("playwright");
const fs = require("fs");

const url = process.argv[2];
const name = process.argv[3] || "page";
const dir = "docs/refs/shots";

if (!url) {
  console.error("Usage: npm run shot <url> <name>");
  console.error("Example: npm run shot http://localhost:3000/about/ about");
  process.exit(1);
}

const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];

(async () => {
  fs.mkdirSync(dir, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    console.error("Could not launch Chromium. Run: npx playwright install chromium");
    process.exit(1);
  }

  let totalErrors = 0;

  for (const [label, width, height] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height } });

    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(String(err)));

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    } catch (err) {
      console.error(`Could not load ${url} — is the dev server running? (npm run dev)`);
      await browser.close();
      process.exit(1);
    }

    // Let above-the-fold reveals settle first.
    await page.waitForTimeout(1000);

    // Scroll the full page in steps so every scroll-triggered (whileInView)
    // reveal actually fires before capture — fullPage screenshots resize to
    // the document's full height in one shot, which is too late for any
    // IntersectionObserver below the original viewport to have already
    // resolved and finished animating. Without this, everything past the
    // first viewport comes back blank (stuck at its hidden/opacity:0 state).
    const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = Math.max(6, Math.ceil(fullHeight / height));
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (fullHeight / steps) * i);
      await page.waitForTimeout(300);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const out = `${dir}/${name}-${label}.png`;
    await page.screenshot({ path: out, fullPage: true });

    console.log(`\n✓ ${out}  (${width}x${fullHeight})`);

    if (consoleErrors.length) {
      totalErrors += consoleErrors.length;
      console.log(`  ⚠  ${consoleErrors.length} console error(s):`);
      consoleErrors.slice(0, 5).forEach((e) => console.log(`     - ${e.slice(0, 160)}`));
    } else {
      console.log("  ✓ no console errors");
    }

    await page.close();
  }

  await browser.close();

  console.log(`\nScreenshots saved to ${dir}/`);
  if (totalErrors) {
    console.log(`\n⚠  ${totalErrors} console error(s) found — fix these before design work.`);
  }
})();
