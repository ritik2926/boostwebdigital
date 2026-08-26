import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { GhostButton } from "@/components/Buttons";
import { SECTION_PADDING, STACK } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const invalid = status === "invalid";

  return (
    <>
      <Navbar />
      <main>
        <section className={SECTION_PADDING.spacious}>
          <Container size="prose-narrow" className="mx-auto text-center">
            <RevealGroup as="div" className="flex flex-col items-center">
              <RevealItem>
                <h1 className="font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[2.75rem]">
                  {invalid ? "That link has expired or was already used." : "You're on the list."}
                </h1>
              </RevealItem>
              <RevealItem className={STACK.headingToSub}>
                <p className="text-white/70">
                  {invalid
                    ? "Enter your email again on the blog to get a fresh confirmation link."
                    : "We'll email you when something new goes up."}
                </p>
              </RevealItem>
              <RevealItem className={STACK.contentToCta}>
                <GhostButton href="/blogs/" className="inline-flex">
                  {invalid ? "Back to the blog" : "Read the blog"}
                </GhostButton>
              </RevealItem>
            </RevealGroup>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
