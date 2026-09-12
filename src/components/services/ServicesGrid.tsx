import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const CARDS: Array<{ name: string; what: string; who: string; href: string; anchor: string }> = [
  {
    name: "AI Search Visibility (GEO)",
    what: "Entity consistency, structured data, and the third-party mentions that get a practice named inside an AI-generated answer.",
    who: "For practices with something worth citing whose own site doesn't say so consistently.",
    href: "/ai-visibility-geo/",
    anchor: "See how AI visibility works",
  },
  {
    name: "Healthcare SEO",
    what: "Technical foundations, specialty-specific content, and local visibility — the base layer AI systems read before recommending anyone.",
    who: "For practices invisible for the specific procedures that pay the bills.",
    href: "/healthcare-seo/",
    anchor: "See our healthcare SEO approach",
  },
  {
    name: "Reputation Management",
    what: "A safe reply process and consistent listings across every platform patients actually check before booking.",
    who: "For practices with real review volume and no process for replying to any of it.",
    href: "/healthcare-reputation-management/",
    anchor: "See our reputation management approach",
  },
  {
    name: "Social Media Management",
    what: "A verification presence, not an acquisition channel — kept current, HIPAA-aware, and nothing more.",
    who: "For cosmetic and elective practices whose patients check social media before booking.",
    href: "/healthcare-social-media-management/",
    anchor: "See our social media approach",
  },
  {
    name: "Medical Website Design",
    what: "A rebuilt technical foundation: page speed, a short booking path, and real accessibility.",
    who: "For practices whose site measurably fails on speed, booking, or accessibility, not just looks dated.",
    href: "/medical-website-design/",
    anchor: "See our website design approach",
  },
];

export function ServicesGrid() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>The Five Services</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>Once You Know What&rsquo;s Wrong, Here&rsquo;s the Page for It</h2>

        <ul className={cn(STACK.subToContent, "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3")}>
          {CARDS.map((card) => (
            <li key={card.name}>
              <Link
                href={card.href}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] transition-colors duration-200 hover:border-white/25",
                  CARD_PADDING.standard
                )}
              >
                <h3 className="font-display text-lg font-semibold text-white">{card.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{card.what}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{card.who}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  {card.anchor}
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
