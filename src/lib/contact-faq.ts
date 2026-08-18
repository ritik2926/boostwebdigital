/**
 * Shared FAQ data for /contact/ — kept in its own plain (non-"use client")
 * module so the Server Component page.tsx can import it for JSON-LD without
 * pulling in ContactFaq.tsx's client boundary. Importing a data export from
 * a "use client" file from a Server Component resolves to a client
 * reference at build time, not the real array — this file exists to avoid
 * exactly that.
 */

export type FaqCategory = "General" | "Services" | "Working together";

export const FAQ_CATEGORIES: FaqCategory[] = ["General", "Services", "Working together"];

export const FAQ_ITEMS: Array<{ category: FaqCategory; question: string; answer: string }> = [
  {
    category: "General",
    question: "What is AI visibility, and how is it different from SEO?",
    answer:
      "SEO gets you ranked in a list of links. AI visibility gets you named inside the AI-generated answer that now appears above those links on 88% of health searches. They overlap, but they're optimised differently.",
  },
  {
    category: "General",
    question: "How long does it take to see results?",
    answer:
      "AI citations typically move within 30 to 60 days because the underlying signals can be corrected quickly. Traditional SEO gains take longer. We rescan monthly so you see movement, or its absence, immediately.",
  },
  {
    category: "Services",
    question: "How do you measure AI visibility?",
    answer:
      "We ask fifteen patient-intent questions across ChatGPT, Perplexity, Google AI Overviews and Gemini, and count how many times your practice is named. Same questions, same engines, every month.",
  },
  {
    category: "Services",
    question: "Which healthcare specialties do you work with?",
    answer:
      "Hair transplant and restoration is our deepest specialty. We also work with dental practices, med spas, dermatology clinics, plastic surgery practices and orthodontists.",
  },
  {
    category: "Working together",
    question: "Do you handle patient data? Is this HIPAA-relevant?",
    answer:
      "No. We work with publicly available data only — your website, listings, reviews and public AI outputs. No patient records, no intake forms, no CRM access, so no business associate agreement is required.",
  },
  {
    category: "Working together",
    question: "Is there a contract?",
    answer: "No. Month to month with 30 days' notice. If the citation count doesn't move, you leave.",
  },
];
