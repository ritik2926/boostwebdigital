import { SITE_URL, getStaticPageEntries, getPostSitemapEntries, getNewestLastMod, renderSitemapIndex } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const pageEntries = getStaticPageEntries();
  const postEntries = await getPostSitemapEntries();

  const xml = renderSitemapIndex([
    { url: `${SITE_URL}/page-sitemap.xml`, lastModified: getNewestLastMod(pageEntries) },
    { url: `${SITE_URL}/post-sitemap.xml`, lastModified: getNewestLastMod(postEntries) },
  ]);

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
