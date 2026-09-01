#!/usr/bin/env node
/**
 * Calls the checker engine functions DIRECTLY — no HTTP, no cookie, no rate
 * limit, no database write. This is how the scoring gets checked before any
 * UI exists.
 *
 * Usage:
 *   npm run checker:test -- "Bright Smile Dental" "best dentist" "Amritsar" "Punjab" "India"
 *
 * Requires EXA_API_KEY — loaded from .env.local if present, or from the
 * shell environment otherwise. Never prints the value of either.
 */
import { existsSync } from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, "..", ".env.local");
if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // .env.local exists but couldn't be parsed — fall through and rely on
    // whatever is already in the shell environment.
  }
}

// Lets this plain-Node script import the checker's .ts source files
// directly, without a build step or a tsconfig change — see the loader's
// own header comment for how.
register(pathToFileURL(path.join(__dirname, "checker-ts-loader.mjs")).href);

const [, , businessName, keyword, city, region, country] = process.argv;

if (!businessName || !keyword || !city || !country) {
  console.error('Usage: npm run checker:test -- "<business name>" "<keyword>" "<city>" "<region>" "<country>"');
  console.error('Example: npm run checker:test -- "Bright Smile Dental" "best dentist" "Amritsar" "Punjab" "India"');
  process.exit(1);
}

if (!process.env.EXA_API_KEY) {
  console.error("EXA_API_KEY is not set (checked .env.local and the shell environment).");
  process.exit(1);
}

const { buildQuery, getEngine, DEFAULT_ENGINE_ID } = await import("../src/lib/checker/engines/index");
const { findMentions, scoreVisibility } = await import("../src/lib/checker/parse");
const { analyse } = await import("../src/lib/checker/analyse");

function section(title) {
  console.log(`\n${"=".repeat(3)} ${title} ${"=".repeat(Math.max(3, 60 - title.length))}`);
}

async function main() {
  const query = buildQuery({ keyword, city, region: region || null, country });
  section("QUERY SENT (verbatim)");
  console.log(query);

  const engine = getEngine(DEFAULT_ENGINE_ID);
  if (!engine) {
    console.error(`No '${DEFAULT_ENGINE_ID}' engine registered.`);
    process.exit(1);
  }

  section(`CALL 1 — ${engine.id} (real web search + written answer)`);
  console.log("Calling... (costDollars.total for this request is logged by the engine below)");
  const { answer, sources, model } = await engine.run(query);

  section("FULL ANSWER TEXT (stored as-is, never edited)");
  console.log(answer.length > 0 ? answer : "(empty — no answer returned)");

  section("CITATION URLS (every one)");
  if (sources.length === 0) {
    console.log("(none returned)");
  } else {
    sources.forEach((source, i) => console.log(`${i + 1}. ${source}`));
  }

  section("MODEL");
  console.log(model);

  section("MENTION RESULT (parse.ts — no AI)");
  const mentions = findMentions(answer, businessName, keyword);
  console.log(`matched:        ${mentions.matched}`);
  console.log(`variantMatched: ${mentions.variantMatched ?? "(none)"}`);
  console.log(`firstIndex:     ${mentions.firstIndex ?? "(none)"}`);
  console.log(`count:          ${mentions.count}`);

  section("SCORE, FULL BREAKDOWN (parse.ts — no AI, this is the number the report shows)");
  const { score, breakdown } = scoreVisibility({ answer, mentions, sources, website: null });
  console.log(`Total: ${score}/100`);
  for (const row of breakdown) {
    console.log(`  +${String(row.points).padStart(3, " ")}  ${row.signal}`);
  }

  section("CALL 2 — generated prose (analyse.ts, never influences the score above)");
  console.log("Calling...");
  const generated = await analyse({ answer, businessName, matched: mentions.matched, score });
  if (generated) {
    console.log(JSON.stringify(generated, null, 2));
  } else {
    console.log("(call 2 failed after one retry — the measured score above is unaffected either way)");
  }

  section("DONE");
}

main().catch((err) => {
  console.error("\nFAILED:", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
