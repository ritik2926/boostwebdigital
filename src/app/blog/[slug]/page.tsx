import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { MagneticButton } from "@/components/Buttons";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, PERSON, breadcrumb } from "@/lib/schema";
import { getAllSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog/source";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { PostHero } from "@/components/blog/PostHero";
import { TableOfContents, TableOfContentsMobile } from "@/components/blog/TableOfContents";
import { ShareRail } from "@/components/blog/ShareRail";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { mdxComponents } from "@/components/blog/MdxComponents";

const SITE_URL = "https://boostwebdigital.com";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt;
  const url = `/blog/${post.slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: post.seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.featuredImage.src, width: post.featuredImage.width, height: post.featuredImage.height, alt: post.featuredImage.alt }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, 3);
  const postUrl = `${SITE_URL}/blog/${post.slug}/`;

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.featuredImage.src}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@id": PERSON["@id"] },
    publisher: { "@id": ORGANIZATION["@id"] },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      blogPosting,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Blog", url: `${SITE_URL}/blogs/` },
        { name: post.title, url: postUrl },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <ReadingProgress />
      <Navbar />
      <main>
        <PostHero post={post} />

        <TableOfContentsMobile items={post.toc} />

        <section className="pb-8 pt-4 sm:pt-8">
          <Container>
            <Reveal>
              <div className="mx-auto grid max-w-(--container-page) grid-cols-1 gap-10 xl:grid-cols-[160px_minmax(0,720px)_240px] xl:justify-center xl:gap-14">
                <div className="hidden xl:block">
                  <div className="sticky top-32">
                    <ShareRail url={postUrl} title={post.title} />
                  </div>
                </div>

                <article className="min-w-0">
                  <div className="mb-8 flex items-center gap-3 xl:hidden">
                    <ShareRail url={postUrl} title={post.title} />
                  </div>

                  <MDXRemote
                    source={post.content}
                    components={mdxComponents}
                    options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
                  />

                  <Reveal className="mt-16">
                    <AuthorCard author={post.author} />
                  </Reveal>
                </article>

                <div className="hidden xl:block">
                  <TableOfContents items={post.toc} />
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className={cn("relative overflow-hidden", SECTION_PADDING.default)}>
          <Container size="heading" className="mx-auto text-center">
            <RevealGroup as="div" className="flex flex-col items-center">
              <RevealItem>
                <h2 className="font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.25rem]">
                  {post.cta?.heading ?? "Find out what AI says about your practice"}
                </h2>
              </RevealItem>
              <RevealItem className={cn(STACK.headingToSub, "max-w-xl")}>
                <p className="text-white/65">
                  {post.cta?.body ??
                    "We run fifteen patient questions across four AI engines, count how many times your practice gets named, and send you the report."}
                </p>
              </RevealItem>
              <RevealItem className={STACK.contentToCta}>
                <MagneticButton>{post.cta?.label ?? "Get My Free AI Visibility Report"}</MagneticButton>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>

        <RelatedPosts posts={relatedPosts} />
      </main>
      <Footer />
    </>
  );
}
