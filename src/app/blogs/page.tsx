import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { FinalCTA } from "@/components/FinalCTA";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb } from "@/lib/schema";
import { getAllPosts } from "@/lib/blog/source";
import { BlogsHero } from "@/components/blog/BlogsHero";
import { CategoryStrip } from "@/components/blog/CategoryStrip";
import { PostGrid } from "@/components/blog/PostGrid";
import { BlogMarquee } from "@/components/blog/BlogMarquee";

const SITE_URL = "https://boostwebdigital.com";
const ARCHIVE_URL = `${SITE_URL}/blogs/`;
const TITLE = "Blog | Healthcare Marketing Insights";
const DESCRIPTION =
  "Healthcare marketing strategy, AI search visibility, and SEO insights for medical practices — from Boost Web Digital.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blogs/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/blogs/", type: "website" },
};

export default async function BlogsArchivePage() {
  const posts = await getAllPosts();

  // Category list derived from post data only — never hardcoded, and a
  // category never appears unless it actually has a post behind it.
  const categoryMap = new Map<string, { name: string; count: number }>();
  for (const post of posts) {
    const existing = categoryMap.get(post.category.slug);
    categoryMap.set(post.category.slug, { name: post.category.name, count: (existing?.count ?? 0) + 1 });
  }
  const categories = Array.from(categoryMap, ([slug, value]) => ({ slug, ...value }));
  const categoryOrder = categories.map((c) => c.slug);

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${ARCHIVE_URL}#webpage`,
    url: ARCHIVE_URL,
    name: TITLE,
    description: DESCRIPTION,
    about: { "@id": ORGANIZATION["@id"] },
  };

  const itemList = {
    "@type": "ItemList",
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}/`,
      name: post.title,
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      collectionPage,
      itemList,
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Blog", url: ARCHIVE_URL },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <BlogsHero />

        <section className="pb-16 lg:pb-24">
          <Container>
            {posts.length >= 3 ? (
              <CategoryStrip categories={categories}>
                <PostGrid posts={posts} categoryOrder={categoryOrder} />
              </CategoryStrip>
            ) : (
              <PostGrid posts={posts} categoryOrder={categoryOrder} />
            )}
          </Container>
        </section>

        <BlogMarquee />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
