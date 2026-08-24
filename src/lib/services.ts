/**
 * Real /services/ content, sourced verbatim from docs/services-content.md
 * (the content doc pasted directly into the session — replaces the earlier
 * agency-template placeholder data this file used to hold). Do not add a
 * fourth service or extra copy beyond what that doc specifies.
 */
export const SERVICES = [
  {
    id: "ai-visibility",
    number: "01",
    name: "AI Search Visibility (GEO)",
    lead: "We get your practice named by ChatGPT, Google AI Overviews, Perplexity and Gemini.",
    body: [
      "88% of health-related searches now return an AI-generated answer before a single blue link. The patient reads that answer and chooses from the two or three practices named inside it. Your ranking is irrelevant if you are not in the answer.",
      "Generative engine optimisation is not SEO with a new name. AI systems weight three things far more heavily than traditional rankings do, and we work on all three.",
    ],
    whatWeDo: [
      {
        title: "Entity consistency",
        body: "Your practice described identically across your site, your listings, your profiles and every third-party mention. Inconsistent entity data is the most common reason an AI system cannot confidently name a practice.",
      },
      {
        title: "Structured data",
        body: "Schema markup that lets a machine parse who you are, what you treat, where you operate and who runs the practice — without guessing.",
      },
      {
        title: "Extractable content",
        body: "Answers written so an AI can lift them cleanly. Question-shaped headings, direct answers, no burying the point in paragraph four.",
      },
      {
        title: "Third-party mentions",
        body: "The independent sources AI models actually pull from. Not link building — citation building.",
      },
      {
        title: "Monthly measurement",
        body: "Fifteen patient-intent questions, four engines, the same questions every month. You get a citation count that is comparable over time, not a screenshot of one good result.",
      },
    ],
    callout:
      "A practice can rank in position three and be cited zero times. That combination is now common, and no rank tracker will ever show it to you.",
  },
  {
    id: "healthcare-seo",
    number: "02",
    name: "Healthcare SEO",
    lead: "Technical foundations, specialty content and local visibility — the base layer AI systems read before deciding who to recommend.",
    body: [
      "Traditional SEO has not stopped mattering. It has stopped being sufficient.",
      "AI systems do not invent recommendations. They read the web, and the web they read is the one SEO builds. A practice with broken technical foundations, thin specialty pages and no local presence gives those systems nothing to work with — so they name someone else.",
    ],
    whatWeDo: [
      {
        title: "Technical foundations",
        body: "Crawlability, site speed, mobile experience, indexation. The unglamorous work that everything else depends on.",
      },
      {
        title: "Specialty-specific content",
        body: "A hair restoration patient and an orthodontic patient do not search, compare or decide anything alike. Pages built per specialty, not per keyword.",
      },
      {
        title: "Local visibility",
        body: "Google Business Profile optimisation, local landing pages, and the citation consistency that local ranking depends on.",
      },
      {
        title: "Internal architecture",
        body: "A structure that makes it obvious to both a reader and a crawler what your practice is expert in.",
      },
    ],
    callout: null,
  },
  {
    id: "reputation-management",
    number: "03",
    name: "Reputation Management",
    lead: "The last gate before a booking, and the one most practices leave to chance.",
    body: [
      "75% of patients will not book a provider rated below 4.0 stars. Getting named by an AI and ranking on Google both fail at that gate.",
      "Reviews are also one of the strongest signals AI systems use when judging a provider — so this work compounds directly back into visibility. It is the one service here that improves the other two.",
    ],
    whatWeDo: [
      {
        title: "Review velocity",
        body: "A repeatable process for asking, at the moment a patient is most likely to say yes.",
      },
      {
        title: "Response rate and quality",
        body: "How you reply is read by patients and parsed by machines. Both matter.",
      },
      {
        title: "Rating trajectory",
        body: "The direction of travel over months, tracked and reported — not just the current number.",
      },
      {
        title: "Platform coverage",
        body: "Consistent presence and consistent detail across the platforms your patients actually check.",
      },
    ],
    callout: null,
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    name: "Scan",
    body: "Fifteen patient-intent questions across four AI engines. We score where you currently stand. Free, and it needs nothing from you but your practice name.",
  },
  {
    number: "02",
    name: "Diagnose",
    body: "Which competitors are being recommended instead of you, and the specific reasons why — entity gaps, missing structured data, review deficits, absent third-party mentions.",
  },
  {
    number: "03",
    name: "Fix",
    body: "Sixty to ninety days of focused work. You see exactly what changed and when.",
  },
  {
    number: "04",
    name: "Rescan",
    body: "Same fifteen questions, same four engines, every month. The citation count moves or it does not, and you see which.",
  },
] as const;

export const AUDIENCE_EXCLUSIONS = [
  {
    name: "You need results this month",
    body: "AI citations typically move in 30 to 60 days and SEO takes longer. Neither is a next-week channel.",
  },
  {
    name: "You want a rankings report",
    body: "We report citations. If keyword positions are what your board wants to see, another agency will serve you better.",
  },
  {
    name: "You need patient data handled",
    body: "We work exclusively with public data — your site, listings, reviews and public AI output. No records, no intake forms, no CRM access, so no business associate agreement is required.",
  },
  {
    name: "You want everything done",
    body: "We do three things well. A full-service agency does more things, less deeply. Both are valid; only one is us.",
  },
] as const;

/**
 * The three permitted figures, already established site-wide in
 * HomePage.tsx's Market Shift accordion — reused here verbatim (value +
 * caption) rather than invented for this page. No other statistic is
 * permitted on /services/.
 */
export const SERVICE_STATS = [
  { value: 88, suffix: "%", label: "AI Overview Prevalence" },
  { value: 36, suffix: "%", label: "Provider Discovery Channel" },
  { value: 75, suffix: "%", label: "Review Trust Threshold" },
] as const;
