# Adding a blog post

Create a new `.mdx` file in this folder — the filename (minus `.mdx`) becomes the URL slug at `/blog/{slug}/`. Fill in the frontmatter fields below, then write the article body in Markdown/MDX underneath the closing `---`. Reading time, the table of contents, and heading anchors are all generated automatically from the body — never hand-write them.

```mdx
---
title: "Your Post Title"
excerpt: "One-sentence summary shown in the hero and on cards."
category: "Category Name"
categorySlug: "category-slug"
tags: ["Tag One", "Tag Two"]
featuredImage: "/images/blog/your-image.svg"
featuredImageAlt: "Descriptive alt text"
author: "Ritik Malhotra"
authorRole: "Founder"
authorAvatar: "/images/ritik-malhotra.webp"
authorUrl: "/about/"
publishedAt: "2026-08-18"
updatedAt: ""
ctaHeading: "Optional mid/end CTA heading"
ctaBody: "Optional CTA body copy."
ctaLabel: "Optional CTA button label"
ctaHref: "/contact/"
relatedSlugs: []
seoTitle: ""
seoDescription: ""
---

Opening paragraph. Article headings start at H2 — one H1 is rendered
automatically from `title` above.

## First section

Body copy, and any of the custom components: `<Callout type="info|warning|key">`,
`<PullQuote>`, `<ImageWithCaption src alt caption>`, `<Stat value label>`,
`<InlineCTA heading body label href>`.
```
