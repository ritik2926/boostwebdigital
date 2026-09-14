/**
 * The single source of truth for what exists on this site and where it
 * sits. Every nav consumer (Navbar desktop, the mobile sheet, Footer, the
 * /services/ page cards) reads from here — adding a page later is one
 * entry in this one file, not four separate edits that can drift apart.
 *
 * `live:false` items are FILTERED OUT of every consumer entirely, not
 * greyed out or labelled "coming soon" — an unclickable dropdown item is a
 * broken one. They stay declared here so shipping a page is a one-word
 * flip (`live: false` → `live: true`), not a new entry hunted down across
 * four files.
 *
 * next.config.ts imports NAV_GROUPS and asserts every `live: true` href has
 * a matching `src/app/**‍/page.tsx` at build time — see the comment there.
 * Breaking that mapping fails the build with the offending href named,
 * rather than shipping a live nav item that 404s.
 */

export type NavItem = {
  label: string;
  href: string;
  /** 6-10 words. What the thing IS, not marketing copy. */
  blurb: string;
  live: boolean;
};

export type NavGroup = {
  id: string;
  title: string;
  subtitle: string;
  items: NavItem[];
  /** Set only when a real hub page exists for "see everything in this
   * group." Industries has none — do not invent one. */
  overviewHref?: string;
};

export const SERVICES: NavGroup = {
  id: "services",
  title: "Services",
  subtitle: "The work, explained. Any practice type.",
  overviewHref: "/services/",
  items: [
    {
      label: "AI Visibility & GEO",
      href: "/ai-visibility-geo/",
      blurb: "Getting a practice named inside AI-generated answers, not just ranked.",
      live: true,
    },
    {
      label: "Healthcare SEO",
      href: "/healthcare-seo/",
      blurb: "Technical SEO and content built around medical search terms.",
      live: true,
    },
    {
      label: "Reputation Management",
      href: "/healthcare-reputation-management/",
      blurb: "Review replies and listing consistency, handled without HIPAA exposure.",
      live: true,
    },
    {
      label: "Social Media Management",
      href: "/healthcare-social-media-management/",
      blurb: "A managed, compliant presence on the platforms patients check.",
      live: true,
    },
    {
      label: "Website Design",
      href: "/medical-website-design/",
      blurb: "Site rebuilds focused on speed, booking path, and accessibility.",
      live: true,
    },
    {
      label: "Paid Search",
      href: "/healthcare-ppc/",
      blurb: "Google and Meta ad management run inside healthcare ad policy.",
      live: false,
    },
  ],
};

/**
 * `/hair-restoration-marketing/` is not in the task brief's literal list
 * but was already declared in src/lib/specialties.ts (the flagship
 * specialty, the one with a real client — see CLAUDE.md's honesty rule)
 * with `built` unset. Dropping it here would silently lose that fact
 * rather than reconcile it, so it's kept as a live:false entry — same
 * pattern as every other unbuilt industry below, invisible until flipped.
 */
export const INDUSTRIES: NavGroup = {
  id: "industries",
  title: "Industries",
  subtitle: "The same method, different buyer.",
  items: [
    {
      label: "Dental Marketing",
      href: "/dental-marketing/",
      blurb: "Split query strategy for emergency versus elective dental patients.",
      live: true,
    },
    {
      label: "Dermatology Marketing",
      href: "/dermatology-marketing/",
      blurb: "Separate strategies for medical patients and cosmetic dermatology patients.",
      live: true,
    },
    {
      label: "Med Spa Marketing",
      href: "/med-spa-marketing/",
      blurb: "Credibility-first marketing for a business that isn't a medical practice.",
      live: true,
    },
    {
      label: "Plastic Surgery",
      href: "/plastic-surgery-marketing/",
      blurb: "Long consideration cycles and heavy reputation sensitivity, addressed directly.",
      live: false,
    },
    {
      label: "Orthodontics",
      href: "/orthodontist-marketing/",
      blurb: "Parent-led and adult self-referred searches, handled as separate paths.",
      live: false,
    },
    {
      label: "Ophthalmology",
      href: "/ophthalmology-marketing/",
      blurb: "Vision-correction and medical eye care, marketed as two intents.",
      live: false,
    },
    {
      label: "Physical Therapy",
      href: "/physical-therapy-marketing/",
      blurb: "Referral-driven and self-referred patients need two different funnels.",
      live: false,
    },
    {
      label: "Veterinary",
      href: "/veterinary-marketing/",
      blurb: "Pet-owner search and local visibility for animal hospitals.",
      live: false,
    },
    {
      label: "Hair Restoration Marketing",
      href: "/hair-restoration-marketing/",
      blurb: "The flagship specialty — the only one with a real client.",
      live: false,
    },
  ],
};

export const RESOURCES: NavGroup = {
  id: "resources",
  title: "Resources",
  subtitle: "Tools, writing, and what things cost.",
  items: [
    {
      label: "Free Tools",
      href: "/tools/",
      blurb: "An index of every free tool this site offers.",
      live: true,
    },
    {
      label: "AI Visibility Checker",
      href: "/tools/ai-visibility-checker/",
      blurb: "Checks whether one live AI engine names your practice.",
      live: true,
    },
    {
      label: "Review Reply Checker",
      href: "/tools/review-reply-hipaa-checker/",
      blurb: "Flags possible HIPAA-risk phrases in a draft review reply.",
      live: true,
    },
    {
      label: "Blog",
      href: "/blogs/",
      blurb: "Articles on healthcare marketing, SEO, and AI search.",
      live: true,
    },
    /**
     * Not in the task brief's literal RESOURCES list, added anyway: /faq/
     * is a real, live, sitemapped page (docs/LINK-TARGETS.md Section A)
     * that the current Navbar/Footer already link to. Omitting it here
     * would silently orphan it the moment this file becomes the sole nav
     * source — the exact class of bug a prior session found and fixed for
     * /tools/. Flagged in the Phase 1 report rather than silently added.
     */
    {
      label: "FAQ",
      href: "/faq/",
      blurb: "Answers to the questions asked before every consultation call.",
      live: true,
    },
    {
      label: "Pricing",
      href: "/pricing/",
      blurb: "Published monthly tiers, no hidden custom-quote requirement.",
      live: true,
    },
    {
      label: "About",
      href: "/about/",
      blurb: "Who the company is, and what it won't do.",
      live: true,
    },
    {
      label: "Contact",
      href: "/contact/",
      blurb: "The form and email address behind every CTA here.",
      live: true,
    },
    {
      label: "Research",
      href: "/research/",
      blurb: "Original healthcare marketing data and statistics, not yet published.",
      live: false,
    },
  ],
};

export const NAV_GROUPS: NavGroup[] = [SERVICES, INDUSTRIES, RESOURCES];

/** Every item across every group, live or not — for build-time assertions
 * and any consumer that genuinely needs the full set. */
export function getAllNavItems(): NavItem[] {
  return NAV_GROUPS.flatMap((group) => group.items);
}

/** What a nav consumer actually renders — dead entries filtered out here,
 * once, instead of re-filtered at every call site. */
export function getLiveNavItems(): NavItem[] {
  return getAllNavItems().filter((item) => item.live);
}

export function getLiveGroupItems(group: NavGroup): NavItem[] {
  return group.items.filter((item) => item.live);
}
