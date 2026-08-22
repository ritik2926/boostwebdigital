// Swapped from ./local to ./wordpress (headless WP) — 2026-08-22. Nothing
// else in the app needed to change; that was the point of this seam.
export { getAllPosts, getPostBySlug, getAllSlugs, getRelatedPosts } from "./wordpress";
