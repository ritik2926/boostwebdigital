import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Page Not Found</h1>
          <p className="mt-4 max-w-md text-white/60">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <Link href="/" className="mt-8 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60">
            Return to the homepage
          </Link>
        </Container>
      </main>
      <Footer />
    </>
  );
}
