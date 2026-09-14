/**
 * Shared by Who We Serve (homepage) and the Footer's specialty links — the
 * homepage's own card copy (a long marketing `desc`, plus `id` keying each
 * card's `/videos/{id}.mp4`) for the six specialties it renders. Genuinely
 * different content from src/lib/navigation.ts's plain, short NavItem
 * blurbs, so this file stays separate rather than folding into that one.
 *
 * What does NOT stay separate: whether a specialty is built and what its
 * URL is. Those two facts are now looked up from navigation.ts's INDUSTRIES
 * group (Phase 1, single nav source of truth) instead of being a second,
 * hand-maintained `built`/`href` pair here — the two lists could disagree
 * before; now there is exactly one declaration of "is this page live,"
 * and this file just reads it.
 */
import { INDUSTRIES } from "./navigation";

export type SpecialtyId = "hair-restoration" | "dental" | "med-spa" | "dermatology" | "plastic-surgery" | "orthodontist";

const SPECIALTY_HREF: Record<SpecialtyId, string> = {
  "hair-restoration": "/hair-restoration-marketing/",
  dental: "/dental-marketing/",
  "med-spa": "/med-spa-marketing/",
  dermatology: "/dermatology-marketing/",
  "plastic-surgery": "/plastic-surgery-marketing/",
  orthodontist: "/orthodontist-marketing/",
};

function isLiveIndustry(href: string): boolean {
  return INDUSTRIES.items.some((item) => item.href === href && item.live);
}

function specialty<Id extends SpecialtyId>(id: Id, name: string, desc: string) {
  const href = SPECIALTY_HREF[id];
  return { id, name, desc, href, built: isLiveIndustry(href) };
}

export const SPECIALTIES: Array<{ id: SpecialtyId; name: string; desc: string; href: string; built?: boolean }> = [
  specialty(
    "hair-restoration",
    "Hair Transplant & Restoration Clinics",
    "Our flagship specialty. Patients research hair restoration privately for six to twelve months before booking, and increasingly do that research through AI rather than by asking anyone they know."
  ),
  specialty(
    "dental",
    "Dental Practices",
    "High-value implant and cosmetic cases are won long before the first call, in comparison searches most practices never see."
  ),
  specialty(
    "med-spa",
    "Med Spas",
    "A crowded local market where reviews and AI recommendations decide the booking more often than rankings do."
  ),
  specialty(
    "dermatology",
    "Dermatology Clinics",
    "A mix of insurance-based and cash-pay demand that needs two different search strategies running at once."
  ),
  specialty(
    "plastic-surgery",
    "Plastic Surgery Practices",
    "Long consideration cycles, heavy reputation sensitivity, and patients who compare surgeons across multiple cities."
  ),
  specialty(
    "orthodontist",
    "Orthodontists",
    "Parent-led and adult self-referred searches behave completely differently and need separate content paths."
  ),
];
