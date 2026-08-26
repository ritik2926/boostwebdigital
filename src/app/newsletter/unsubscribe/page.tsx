import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { UnsubscribeButton } from "@/components/newsletter/UnsubscribeButton";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

/**
 * PART 3 — this page exists specifically so unsubscribe is a POST behind a
 * click, not a bare GET link. Email clients and security scanners prefetch
 * GET links in messages; a GET-only unsubscribe silently removes the
 * subscriber before they ever see this page. Loading this page (including
 * a prefetch) changes nothing — only clicking the button inside
 * UnsubscribeButton (a client component) fires the actual POST.
 */
export default async function NewsletterUnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <>
      <Navbar />
      <main>
        <section className={SECTION_PADDING.spacious}>
          <Container size="prose-narrow" className="mx-auto text-center">
            <RevealGroup as="div" className="flex flex-col items-center">
              <RevealItem>
                <h1 className="font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[2.75rem]">
                  {token ? "Unsubscribe from Boost Web Digital updates?" : "This link is incomplete."}
                </h1>
              </RevealItem>
              {token && (
                <RevealItem className={STACK.contentToCta}>
                  <UnsubscribeButton token={token} />
                </RevealItem>
              )}
            </RevealGroup>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
