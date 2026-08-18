import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "./types";
import { extractToc, computeReadingTime } from "./toc";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

interface Frontmatter {
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  tags?: string[];
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageWidth?: number;
  featuredImageHeight?: number;
  author: string;
  authorRole: string;
  authorAvatar: string;
  authorUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  ctaHeading?: string;
  ctaBody?: string;
  ctaLabel?: string;
  ctaHref?: string;
  relatedSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
  noindex?: boolean;
}

function readSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readPost(slug: string): BlogPost | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  const post: BlogPost = {
    slug,
    title: fm.title,
    excerpt: fm.excerpt,
    category: { name: fm.category, slug: fm.categorySlug },
    tags: fm.tags,
    featuredImage: {
      src: fm.featuredImage,
      alt: fm.featuredImageAlt,
      width: fm.featuredImageWidth ?? 1600,
      height: fm.featuredImageHeight ?? 900,
    },
    author: {
      name: fm.author,
      role: fm.authorRole,
      avatar: fm.authorAvatar,
      url: fm.authorUrl,
    },
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
    readingTime: computeReadingTime(content),
    toc: extractToc(content),
    content,
    cta:
      fm.ctaHeading && fm.ctaBody && fm.ctaLabel && fm.ctaHref
        ? { heading: fm.ctaHeading, body: fm.ctaBody, label: fm.ctaLabel, href: fm.ctaHref }
        : undefined,
    relatedSlugs: fm.relatedSlugs,
    seo: fm.seoTitle || fm.seoDescription || fm.noindex ? { title: fm.seoTitle, description: fm.seoDescription, noindex: fm.noindex } : undefined,
  };

  return post;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = readSlugs()
    .map(readPost)
    .filter((post): post is BlogPost => post !== null);

  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return readPost(slug);
}

export async function getAllSlugs(): Promise<string[]> {
  return readSlugs();
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const current = readPost(slug);
  const all = (await getAllPosts()).filter((post) => post.slug !== slug);

  if (current?.relatedSlugs?.length) {
    const manual = current.relatedSlugs.map((s) => all.find((post) => post.slug === s)).filter((post): post is BlogPost => Boolean(post));
    if (manual.length) return manual.slice(0, limit);
  }

  if (current) {
    const sameCategory = all.filter((post) => post.category.slug === current.category.slug);
    if (sameCategory.length) return sameCategory.slice(0, limit);
  }

  return all.slice(0, limit);
}
