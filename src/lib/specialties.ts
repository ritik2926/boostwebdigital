/**
 * Shared by Who We Serve (homepage) and the Footer's specialty links — one
 * source of truth for the six specialties this site serves and their
 * locked URL-architecture slugs (docs/13-URL-ARCHITECTURE.md).
 */

export type SpecialtyId = "hair-restoration" | "dental" | "med-spa" | "dermatology" | "plastic-surgery" | "orthodontist";

export const SPECIALTIES: Array<{ id: SpecialtyId; name: string; desc: string; href: string }> = [
  {
    id: "hair-restoration",
    name: "Hair Transplant & Restoration Clinics",
    desc: "Our flagship specialty. Patients research hair restoration privately for six to twelve months before booking, and increasingly do that research through AI rather than by asking anyone they know.",
    href: "/hair-restoration-marketing/",
  },
  {
    id: "dental",
    name: "Dental Practices",
    desc: "High-value implant and cosmetic cases are won long before the first call, in comparison searches most practices never see.",
    href: "/dental-marketing/",
  },
  {
    id: "med-spa",
    name: "Med Spas",
    desc: "A crowded local market where reviews and AI recommendations decide the booking more often than rankings do.",
    href: "/med-spa-marketing/",
  },
  {
    id: "dermatology",
    name: "Dermatology Clinics",
    desc: "A mix of insurance-based and cash-pay demand that needs two different search strategies running at once.",
    href: "/dermatology-marketing/",
  },
  {
    id: "plastic-surgery",
    name: "Plastic Surgery Practices",
    desc: "Long consideration cycles, heavy reputation sensitivity, and patients who compare surgeons across multiple cities.",
    href: "/plastic-surgery-marketing/",
  },
  {
    id: "orthodontist",
    name: "Orthodontists",
    desc: "Parent-led and adult self-referred searches behave completely differently and need separate content paths.",
    href: "/orthodontist-marketing/",
  },
];
