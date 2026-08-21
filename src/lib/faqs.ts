/**
 * Single source of truth for /faq/ — both the visible accordion and the
 * FAQPage JSON-LD read from this array, so the two can never drift (Google
 * requires the schema's answer text to match the visible text exactly).
 */
export type Faq = { q: string; a: string };
export type FaqCluster = { category: string; items: Faq[] };

export const FAQ_CLUSTERS: FaqCluster[] = [
  {
    category: "AI Search & Visibility",
    items: [
      {
        q: "Why doesn't my practice show up when patients ask ChatGPT for a recommendation?",
        a: "AI tools don't rank pages the way Google does — they build an answer from sources they trust and name only a few providers. If your practice isn't described, reviewed and referenced consistently across the web in the way these models read, you won't be one of the names they surface, even if you rank well on Google.",
      },
      {
        q: "What is AI search visibility for a medical practice?",
        a: "It's how often AI tools like ChatGPT, Gemini, Perplexity and Google's AI Overviews actually name your practice when a patient asks for a recommendation. Unlike a search ranking, it isn't a position on a page — it's whether the model mentions you at all, and whether it describes you accurately.",
      },
      {
        q: "Can my clinic appear in ChatGPT, Gemini and Perplexity answers?",
        a: "Yes. These tools pull from public information about your practice — your site, reviews, directories and third-party mentions. When that information is clear, consistent and trusted, the models are far more likely to cite you. That's what optimizing for AI visibility does.",
      },
      {
        q: "What is Generative Engine Optimization (GEO)?",
        a: "GEO is the practice of making your business easy for AI answer engines to understand, trust and recommend. It's the AI-era companion to SEO: instead of only chasing a ranking, it works on being the provider an AI actually names when someone asks a health question.",
      },
      {
        q: "How is ranking on Google different from being recommended by AI?",
        a: "A Google ranking puts a link in a list the patient still has to click and compare. An AI recommendation skips that — the tool names a provider directly. You can hold position one on Google and never be mentioned when a patient asks an AI who to see. Closing that gap is the whole job.",
      },
      {
        q: "Why does my practice rank #1 on Google but never get mentioned by AI?",
        a: "Ranking signals and AI-trust signals overlap but aren't identical. AI engines weigh how clearly and consistently you're described across many sources, your reputation, and third-party validation. A page can win the ranking while still lacking the wider footprint an AI needs to feel confident naming you.",
      },
      {
        q: "What is a Google AI Overview and how does it affect my bookings?",
        a: "An AI Overview is the AI-generated answer Google now shows above the classic blue links for many health queries. When it appears, the links sit lower and are seen less. If your practice isn't part of what the Overview references, you can lose visibility even while technically still ranking.",
      },
      {
        q: "How do AI engines decide which clinics to recommend?",
        a: "They favour providers that are described consistently everywhere, well-reviewed, clearly specialised, and referenced by sources they already trust. Contradictory or thin information makes a model hesitate to name you. The work is making your practice the clear, safe answer to name.",
      },
      {
        q: "Can I pay to appear in AI search results?",
        a: "Not directly — there's no ad slot inside an organic AI recommendation. You earn the mention by being the clearest, best-supported answer to the question. That's earned visibility, which is more durable than paid placement but takes deliberate work.",
      },
      {
        q: "How do I know if AI is recommending my competitors instead of me?",
        a: "You measure it. We run a fixed set of patient questions across the major AI engines and count how often each practice — yours and your competitors' — gets named. That turns a vague worry into a number you can watch move month to month.",
      },
      {
        q: "What is an AI Visibility Report and what does it show?",
        a: "It shows how often the major AI engines name your practice for the questions patients actually ask, which competitors get recommended instead, and the specific reasons why. You keep the report whether or not you ever work with us.",
      },
      {
        q: "Do AI answers pull from my website or from somewhere else?",
        a: "Both. Models draw on your own site plus the wider web — reviews, directories, articles and mentions elsewhere. That's why fixing only your website often isn't enough; the off-site picture of your practice matters just as much.",
      },
      {
        q: "How often does what AI says about my practice change?",
        a: "It shifts as the underlying sources change and as the models update. Improvements you make aren't reflected instantly, which is exactly why we measure the same questions on a regular cadence — so this month is directly comparable to last.",
      },
      {
        q: "Is optimizing for AI search worth it for a small clinic?",
        a: "Often more so. Smaller practices can't outspend large groups on ads, but they can become the clearest, best-reviewed, most specific answer to a narrow question — and that's precisely what AI engines like to name. Focus beats budget here.",
      },
    ],
  },
  {
    category: "Getting Found & Local SEO",
    items: [
      {
        q: "What is local SEO for a medical or dental practice?",
        a: "Local SEO is the work of getting your practice found by nearby patients searching for care — in the map pack, in \"near me\" results, and on your service pages. It combines your Google Business Profile, your website, your reviews and your local reputation.",
      },
      {
        q: "How long does SEO take to work for a clinic?",
        a: "Meaningful movement usually takes a few months, not days. Local and reputation signals build gradually. Any agency promising instant top rankings is overselling; honest progress shows as a steady trend you can see month to month.",
      },
      {
        q: "Why isn't my practice showing up in the local map pack?",
        a: "Common causes are an unverified or incomplete Google Business Profile, inconsistent name/address/phone details across the web, too few or weak reviews, or a website that doesn't clearly signal your location and services. Usually it's several of these at once.",
      },
      {
        q: "What's the difference between SEO and Google Ads for a clinic?",
        a: "Ads buy visibility instantly and stop the moment you stop paying. SEO earns visibility slowly and keeps working after the work is done. Most practices use ads for quick wins while SEO builds the durable foundation underneath.",
      },
      {
        q: 'How do I rank for "[treatment] near me" searches?',
        a: 'You need a clear service page for that treatment, a complete and active Google Business Profile, consistent local details, and genuine reviews mentioning that service. "Near me" results reward practices that are obviously relevant, nearby and trusted.',
      },
      {
        q: "Do multiple locations help or hurt my SEO?",
        a: "Handled well, each location can rank in its own area — with its own page and its own Business Profile. Handled poorly, duplicate or thin location pages compete with each other and confuse both Google and patients. Structure is everything.",
      },
      {
        q: "Why did my clinic's Google traffic suddenly drop?",
        a: "It could be a Google algorithm update, a new AI Overview taking clicks, a technical issue on your site, a Business Profile problem, or a fresh competitor. The fix starts with diagnosing which — guessing and changing things blindly usually makes it worse.",
      },
    ],
  },
  {
    category: "Google Business Profile",
    items: [
      {
        q: "How important is my Google Business Profile for getting patients?",
        a: "For a local practice it's often the single most important asset — it's what shows in the map pack and frequently what patients act on first. An incomplete or neglected profile quietly costs you bookings every week.",
      },
      {
        q: "What should I post on my Google Business Profile?",
        a: "Keep the basics accurate — hours, services, photos — and post regularly: new services, updates, patient-relevant tips. An active profile signals to Google that the practice is live and engaged, which supports your local visibility.",
      },
      {
        q: "How do I fix wrong information about my practice on Google?",
        a: "Claim and verify your Business Profile, correct the details there, and make sure your name, address and phone match everywhere else online. Conflicting information across the web is what lets wrong data resurface, so consistency is the real fix.",
      },
      {
        q: "Do directory listings and citations still matter for clinics?",
        a: "Yes, though not as raw ranking boosts anymore. Their value now is consistency — matching details across trusted directories reinforce that your practice is real and reliable, which supports both local search and how confidently an AI will describe you.",
      },
    ],
  },
  {
    category: "Reviews & Reputation",
    items: [
      {
        q: "How many Google reviews does my clinic need to compete?",
        a: "There's no magic number — it depends on what competitors nearby have. The practical goal is to be clearly in the conversation locally, with a steady flow of recent, genuine reviews rather than a stale burst from years ago.",
      },
      {
        q: "Why do patients choose a competitor with fewer reviews than me?",
        a: "Rating, recency and what the reviews actually say often matter more than count. A practice with fewer but recent, specific, high-rated reviews can beat one with more old or generic ones. Patients read the story, not just the total.",
      },
      {
        q: "Can I remove a fake or unfair negative review?",
        a: "You can't simply delete it, but you can report reviews that violate the platform's policies for removal, and you should respond professionally to the rest. A calm, helpful public response often does more for prospective patients than the review itself does damage.",
      },
      {
        q: "Is it allowed to ask patients for reviews?",
        a: "Asking satisfied patients to share honest feedback is generally fine and encouraged; what's not allowed is incentivising reviews, gating out negative ones, or writing them yourself. Keep it honest and unfiltered and you stay on the right side of the rules.",
      },
      {
        q: "How do reviews affect whether AI recommends my practice?",
        a: "Strongly. Reviews are one of the trust signals AI engines lean on to decide who to name. A thin or poor review profile makes a model hesitate; a strong, recent one makes recommending you feel safe. Reputation has become a visibility factor, not just a vanity metric.",
      },
      {
        q: "What star rating should a clinic aim for?",
        a: "A visible, well-maintained rating that patients trust — and, just as importantly, a steady stream of recent reviews so the rating looks current. A high rating from years ago carries less weight than a solid, actively-refreshed one.",
      },
    ],
  },
  {
    category: "Website & Content",
    items: [
      {
        q: "Does my medical practice really need a new website?",
        a: "Not always — sometimes fixing speed, mobile experience and service pages on the current one is enough. You need a new site when the old one is slow, hard to update, invisible to search, or gives patients no clear path to book.",
      },
      {
        q: "What makes a healthcare website rank well?",
        a: "Clear service pages for each treatment, fast mobile performance, trustworthy content, obvious contact and booking paths, and technical health search engines can read. Ranking follows a site that's genuinely useful and easy for both patients and crawlers.",
      },
      {
        q: "Should a doctor write a blog, and does it actually bring patients?",
        a: "Useful, question-answering content can bring patients and feed the AI answers they now rely on — but only if it targets real questions and is genuinely helpful. Generic filler posts do little. Quality and relevance beat volume every time.",
      },
      {
        q: "How do I turn website visitors into booked appointments?",
        a: "Make the next step obvious and easy — clear calls to action, simple booking or contact, reassurance about what to expect, and no friction on mobile. Traffic that doesn't convert usually means the path to booking is unclear or too much work.",
      },
      {
        q: "Why is my website slow on mobile, and does it matter?",
        a: "It matters a lot — most patients arrive on a phone, and slow pages lose them and hurt rankings. Slowness usually comes from heavy images, bloated code or too much loading at once. It's fixable, and the payoff in bookings is direct.",
      },
      {
        q: "What are service pages and why does my practice need them?",
        a: "A service page is a dedicated page for one treatment you offer, written to answer exactly what a patient searching for it wants to know. They're how you rank for specific treatments instead of hoping one general page covers everything.",
      },
    ],
  },
  {
    category: "Paid Ads & Budget",
    items: [
      {
        q: "Are Google Ads worth it for a medical practice?",
        a: "They can be, especially for competitive treatments where you need patients now. But ads only pay off with the right targeting, landing pages and tracking — otherwise you're buying clicks that never become bookings. Worth it depends entirely on execution.",
      },
      {
        q: "How much should a clinic spend on marketing per month?",
        a: "It varies by market, competition and goals, so treat any single number with caution. The better question is what each new patient is worth to you, then working back to a budget that produces them profitably — not a figure pulled from thin air.",
      },
      {
        q: "Why are my healthcare ads getting disapproved?",
        a: "Health and medical advertising has stricter rules than most categories — around claims, certain treatments, and how you can target. Disapprovals usually trace to wording or policy specifics. The fix is compliant copy and setup, not fighting the platform.",
      },
      {
        q: "What's a realistic cost per new patient from ads?",
        a: "It depends heavily on your treatment, location and competition, so there's no universal figure. What matters is measuring it accurately for your practice and comparing it to what a patient is worth to you over time — that tells you if ads are working.",
      },
    ],
  },
  {
    category: "Compliance & Trust",
    items: [
      {
        q: "What marketing rules apply to healthcare and medical practices?",
        a: "Healthcare marketing is more regulated than most fields — covering truthful claims, patient privacy, testimonials, and platform-specific ad policies. The rules vary by region and treatment, so marketing should be built to be compliant from the start, not corrected later.",
      },
      {
        q: "Can I show patient photos or testimonials in my marketing?",
        a: "Sometimes, with proper consent and within the rules for your region and treatment type — but privacy and advertising regulations set real limits. Get explicit permission and check what's allowed before publishing; assumptions here are risky.",
      },
      {
        q: "How do I keep my marketing compliant with patient-privacy rules?",
        a: "Avoid exposing any patient information without clear consent, be careful with tracking and data on your site, and keep claims honest and evidence-based. This is an area where general guidance isn't enough — confirm specifics for your jurisdiction. (This isn't legal advice.)",
      },
      {
        q: "How do I market a practice without sounding salesy?",
        a: "Lead with genuinely useful answers to what patients are worried about, be honest about what you do and don't do, and let clarity and reputation carry the message. Trust, not hype, is what converts in healthcare — and it's also what AI engines reward.",
      },
    ],
  },
  {
    category: "Measuring & Working With an Agency",
    items: [
      {
        q: "How do I measure whether my marketing is actually working?",
        a: "Track outcomes that matter — new patient enquiries and bookings — not just traffic or vanity metrics. Good measurement ties the marketing spend to real patients and lets you see a clear trend over time rather than a one-off snapshot.",
      },
      {
        q: "What should a healthcare marketing agency report to me each month?",
        a: "The numbers that matter, compared to last month on the same basis — visibility, enquiries and results — in plain language, including the months that didn't move. If a report is all jargon and no honest read, it's hiding something.",
      },
      {
        q: "Why hire a healthcare-only agency instead of a general one?",
        a: "Healthcare has its own rules, patient behaviour and trust dynamics. An agency that works only in healthcare already understands the compliance limits and how patients actually choose a provider, so less of your budget is spent learning your world on the job.",
      },
      {
        q: "How is your agency different from every other SEO company?",
        a: "We work only in healthcare, we measure AI visibility — how often the engines patients now use actually name you — not just Google rankings, and we publish our methods openly. If a month doesn't move the number, we tell you plainly.",
      },
      {
        q: "What happens if my numbers don't improve in a given month?",
        a: "We say so, plainly — flat months get reported too, not buried. Then we look at why and adjust. Honest reporting is the whole point; a number you can trust is worth more than a flattering one you can't.",
      },
      {
        q: "Do I have to sign a long-term contract?",
        a: "No. The work is month to month. If the results stop moving, you can leave without a penalty or notice period. We'd rather earn each month than lock you into one. (Specific terms are confirmed in writing before you start.)",
      },
      {
        q: "How involved do I need to be day to day?",
        a: "Very little day to day — you'll work directly with the person doing the work, not an account layer, and we handle the execution. Your input matters most on direction and priorities, not on managing tasks.",
      },
    ],
  },
  {
    category: "Getting Started",
    items: [
      {
        q: "How much does healthcare marketing cost?",
        a: "It depends on your goals, market and where you're starting from, so a real figure comes after we understand your situation — not before. The honest first step is a free look at how visible you are now, which costs you nothing.",
      },
      {
        q: "What's the first step to improving my practice's visibility?",
        a: "See where you actually stand. We run your practice through the AI engines and searches patients use, count how often you're named versus your competitors, and show you the gap. From there the priorities are obvious.",
      },
      {
        q: "Can I get a free assessment of how visible my practice is?",
        a: "Yes. We'll run a set of real patient questions across the major AI engines, count how often your practice is named, show which competitors appear instead, and send you the report — no call required, and it's yours to keep either way.",
      },
    ],
  },
  {
    category: "Hair Restoration (specialty)",
    items: [
      {
        q: "How do hair restoration clinics get new patients online?",
        a: "These patients research privately for months, mostly through search and increasingly through AI, before ever making contact. Winning them means being consistently visible and trusted across exactly those channels — quietly present through the whole long research phase.",
      },
      {
        q: "Why do hair restoration patients research differently from other patients?",
        a: "It's a personal, high-consideration decision, so patients investigate discreetly and thoroughly on their own before reaching out — rarely via a referral. That makes search and AI visibility unusually decisive: if you're not present during that private research, you're never even considered.",
      },
    ],
  },
];
