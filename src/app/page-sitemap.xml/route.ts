import { getStaticPageEntries, renderUrlset } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const xml = renderUrlset(getStaticPageEntries());
  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
