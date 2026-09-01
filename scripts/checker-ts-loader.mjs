/**
 * A tiny custom ESM resolve hook, registered by checker-test.mjs, so plain
 * Node can import the checker's .ts source files directly — no build step,
 * no tsconfig change. The .ts files themselves use ordinary extensionless
 * relative imports (the same style Next.js's bundler already resolves), so
 * this hook's only job is: if a relative specifier fails to resolve as-is,
 * retry it with a ".ts" suffix before giving up. Anything not a relative
 * specifier, or one that already resolves, passes straight through.
 */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.startsWith(".") && !specifier.endsWith(".ts")) {
      try {
        return await nextResolve(`${specifier}.ts`, context);
      } catch {
        // fall through to the original error — clearer than the retry's
      }
    }
    throw err;
  }
}
