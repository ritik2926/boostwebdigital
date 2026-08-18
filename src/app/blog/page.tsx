import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/schema";
import { getAllPosts } from "@/lib/blog/source";
import { BlogIndexGrid } from "@/components/blog/BlogIndexGrid";

const SITE_URL = "https://boostwebdigital.com";
const TITLE = "Blog | Healthcare Marketing Insights";
const DESCRIPTION =
  "Healthcare marketing strategy, AI search visibility, and SEO insights for medical practices — from Boost Web Digital.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/blog/", type: "website" },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog/#webpage`,
        url: `${SITE_URL}/blog/`,
        name: TITLE,
        description: DESCRIPTION,
      },
      breadcrumb([
        { name: "Home", url: SITE_URL },
        { name: "Blog", url: `${SITE_URL}/blog/` },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar />
      <main>
        <section className="pb-16 pt-14 sm:pt-20 lg:pt-24">
          <Container>
            <RevealGroup as="div" trigger="mount" stagger={0.08}>
              <RevealItem>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
                  <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85">Blog</span>
                </span>
              </RevealItem>
              <RevealItem className="mt-6 max-w-(--container-heading)">
                <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl">
                  Healthcare marketing insights
                </h1>
              </RevealItem>
              <RevealItem className="mt-6 max-w-2xl">
                <p className="text-lg leading-relaxed text-white/65">
                  Strategy, SEO, and AI search visibility for medical practices — written for owners, not marketers.
                </p>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>

        <section className="pb-24">
          <Container>
            <Reveal>
              <BlogIndexGrid posts={posts} />
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
