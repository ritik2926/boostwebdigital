import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Project-priced, not the sitewide Visibility/Growth/Market Leader monthly
 * tiers — same reasoning as /hair-restoration-google-ads/'s Included.tsx
 * and /medical-website-design/'s Engagement.tsx: a website rebuild is a
 * fixed scope with a defined end, not an ongoing monthly service, so
 * bundling it into a flat monthly rate would misstate what's actually being
 * sold. No number is invented here; this routes to a real conversation
 * instead.
 */
export function HairRestorationWebsiteDesignIncluded() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>How This Is Priced</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Project Work, Not a Monthly Retainer</h2>
        <p className={cn(STACK.headingToSub, "max-w-2xl text-white/70")}>
          The monthly tiers on this site cover ongoing work: AI visibility, SEO, reputation, and social. A website
          rebuild is a fixed scope with a defined end, so it&rsquo;s quoted separately — alongside an existing tier
          if you&rsquo;re already on one, never folded into it.
        </p>
        <p className={cn(STACK.subToContent, "max-w-2xl text-white/70")}>
          Exact price depends on how much of your current site can be kept, how many technique pages you need, and
          how much of the gallery and booking-path work above your current site already passes.{" "}
          <Link href="/pricing/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            Full tier pricing for the ongoing services is on our pricing page
          </Link>
          .
        </p>
        <p className={cn(STACK.subToContent, "text-white/70")}>
          <Link href="/contact/" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70">
            Talk to us about your site
          </Link>{" "}
          and we&rsquo;ll scope it directly.
        </p>
      </Container>
    </section>
  );
}
