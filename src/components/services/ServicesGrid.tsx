import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import { SERVICES, getLiveGroupItems } from "@/lib/navigation";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

/**
 * Persuasive per-card copy, keyed by href — this is real page content (a
 * "what"/"who"/anchor sentence, not a 6-10 word nav blurb), so it stays
 * hand-authored here rather than trying to squeeze it into
 * src/lib/navigation.ts's plain NavItem shape. What IS sourced from that
 * file is the set and order of which services get a card at all: the map
 * below over `getLiveGroupItems(SERVICES)` (Phase 1, single nav source of
 * truth) means a newly-live service (Paid Search, once built) renders here
 * automatically in the correct order, and throws immediately in dev if
 * someone flips it live without adding its copy — a silent stale card list
 * is worse than a loud error naming the missing href.
 */
const CARD_COPY: Record<string, { what: string; who: string; anchor: string }> = {
  "/ai-visibility-geo/": {
    what: "Entity consistency, structured data, and the third-party mentions that get a practice named inside an AI-generated answer.",
    who: "For practices with something worth citing whose own site doesn't say so consistently.",
    anchor: "See how AI visibility works",
  },
  "/healthcare-seo/": {
    what: "Technical foundations, specialty-specific content, and local visibility — the base layer AI systems read before recommending anyone.",
    who: "For practices invisible for the specific procedures that pay the bills.",
    anchor: "See our healthcare SEO approach",
  },
  "/healthcare-reputation-management/": {
    what: "A safe reply process and consistent listings across every platform patients actually check before booking.",
    who: "For practices with real review volume and no process for replying to any of it.",
    anchor: "See our reputation management approach",
  },
  "/healthcare-social-media-management/": {
    what: "A verification presence, not an acquisition channel — kept current, HIPAA-aware, and nothing more.",
    who: "For cosmetic and elective practices whose patients check social media before booking.",
    anchor: "See our social media approach",
  },
  "/medical-website-design/": {
    what: "A rebuilt technical foundation: page speed, a short booking path, and real accessibility.",
    who: "For practices whose site measurably fails on speed, booking, or accessibility, not just looks dated.",
    anchor: "See our website design approach",
  },
};

const CARDS = getLiveGroupItems(SERVICES).map((service) => {
  const copy = CARD_COPY[service.href];
  if (!copy) {
    throw new Error(
      `[ServicesGrid] "${service.href}" is live in src/lib/navigation.ts but has no CARD_COPY entry here yet.`
    );
  }
  return { name: service.label, href: service.href, ...copy };
});

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
