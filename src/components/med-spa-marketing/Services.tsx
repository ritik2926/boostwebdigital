import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { SECTION_PADDING, STACK, CARD_PADDING } from "@/lib/tokens";
import { cn } from "@/lib/utils";

const H2 = "font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.5rem]";

const SERVICES = [
  {
    name: "Healthcare SEO",
    body: "Procedure pages built around named treatment, price, and credential are the base layer the credibility case above needs to live on.",
    href: "/healthcare-seo/",
    anchor: "See our healthcare SEO approach",
  },
  {
    name: "Reputation Management",
    body: "Reviews are exactly where the FTC's rules bite hardest. We build a safe, real reply process instead of chasing volume through shortcuts.",
    href: "/healthcare-reputation-management/",
    anchor: "See our reputation management approach",
  },
  {
    name: "Social Media Management",
    body: "Cosmetic patients check social media before booking more than almost any other specialty. A managed, compliant presence, not an acquisition channel.",
    href: "/healthcare-social-media-management/",
    anchor: "See our social media approach",
  },
  {
    name: "Website Design",
    body: "Does your site name your medical director, injectors, and prices clearly, in under a minute, on a phone? We rebuild for exactly that.",
    href: "/medical-website-design/",
    anchor: "See our website design approach",
  },
];

export function MedSpaServices() {
  return (
    <section className={cn("relative", SECTION_PADDING.default)}>
      <Container>
        <Kicker>Supporting Services</Kicker>
        <h2 className={cn(H2, STACK.kickerToHeading, "max-w-2xl")}>The Work Underneath the Credibility Case</h2>

        <ul className={cn(STACK.subToContent, "grid grid-cols-1 gap-5 sm:grid-cols-2")}>
          {SERVICES.map((service) => (
            <li key={service.name}>
              <Link
                href={service.href}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] transition-colors duration-200 hover:border-white/25",
                  CARD_PADDING.standard
                )}
              >
                <h3 className="font-display text-lg font-semibold text-white">{service.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{service.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  {service.anchor}
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
