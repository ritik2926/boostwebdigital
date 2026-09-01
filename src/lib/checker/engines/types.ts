/**
 * One engine per AI surface (Gemini today; Perplexity/OpenAI can register
 * their own implementation of this same shape later without anything
 * downstream — parse.ts, analyse.ts, the API routes — needing to change).
 * Same seam as src/lib/blog/source.ts's swap from local to WordPress.
 */
export interface VisibilityEngine {
  id: string;
  run(query: string): Promise<{
    answer: string;
    sources: string[];
    model: string;
  }>;
}
