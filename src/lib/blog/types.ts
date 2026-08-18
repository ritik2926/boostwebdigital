/**
 * Shaped to mirror what a future WordPress GraphQL adapter would return, so
 * swapping source.ts's import from ./local to ./wordpress is a field mapping,
 * not a rewrite. See source.ts for the swap point.
 */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: { name: string; slug: string };
  tags?: string[];
  featuredImage: { src: string; alt: string; width: number; height: number };
  author: { name: string; role: string; avatar: string; url?: string };
  publishedAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
  readingTime: number; // minutes — computed from word count, not hand-entered
  toc: TocItem[]; // auto-generated from h2/h3 headings
  content: string; // raw MDX body
  cta?: { heading: string; body: string; label: string; href: string };
  relatedSlugs?: string[]; // optional manual override
  seo?: { title?: string; description?: string; noindex?: boolean };
}
