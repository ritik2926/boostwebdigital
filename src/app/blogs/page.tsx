import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/FinalCTA";
import JsonLd from "@/components/JsonLd";
import { ORGANIZATION, breadcrumb } from "@/lib/schema";
import { getAllPosts } from "@/lib/blog/source";
import { BlogsHero } from "@/components/blog/BlogsHero";
import { FeaturedSplit } from "@/components/blog/FeaturedSplit";
import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
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

  // Gradient-per-category order, derived from post data only — never
  // hardcoded — so PostThumbnail's fallback-SVG color stays consistent for
  // a given category everywhere it appears on this page. Category *names*
  // and *counts* for the filter bar are computed separately, inside
  // BlogFilterBar, from just the posts it actually filters (see that file).
  const categoryOrder = Array.from(new Set(posts.map((post) => post.category.slug)));

  // Section 2 (FeaturedSplit) shows post 1 large plus up to 3 more in the
  // "Latest" panel — the grid below must never repeat those same posts, so
  // it only ever sees whatever's left over.
  const featuredSplitCount = Math.min(4, posts.length);
  const gridPosts = posts.slice(featuredSplitCount);

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
        <FeaturedSplit posts={posts} categoryOrder={categoryOrder} />
        <BlogFilterBar posts={gridPosts} categoryOrder={categoryOrder} />

        <BlogMarquee />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
