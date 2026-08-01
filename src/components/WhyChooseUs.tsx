"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    title: "We speak your patient's language",
    body: "Every specialty page is built around real search behavior for that patient journey — not templated \"services\" copy that could belong to any industry.",
  },
  {
    title: "We build for how people search now",
    body: "Google, Google AI Overviews, ChatGPT, Perplexity, Gemini — your practice should show up whichever one a prospective patient asks.",
  },
  {
    title: "We don't sell everything to everyone",
    body: "If a service doesn't move your specific specialty's numbers, we don't pitch it. Fewer services, more focus.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-8 py-24 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl sm:text-4xl font-medium text-center mb-16"
      >
        Why Healthcare Practices Choose a Specialist, Not a Generalist
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-10 mb-20">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="w-8 h-1 bg-accent rounded-full mb-5" />
            <h3 className="font-semibold text-lg mb-2">{r.title}</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              {r.body}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-accent/20 bg-accent/5 p-10 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-wide text-accent mb-3">
          Real Results, Growing With Every Client
        </p>
        <p className="text-foreground/80 max-w-xl mx-auto">
          We&apos;re an early-stage, healthcare-only agency. Our first
          documented client — <strong>Kaja Hair Studio</strong>, a hair
          transplant &amp; restoration clinic — is live. As results land,
          they&apos;ll be published here with real numbers, not projections.
         </p>
        
          <a href="/case-studies"
          className="inline-block mt-5 text-sm font-medium underline underline-offset-4"
        >
          See our current case study →
        </a>
      </motion.div>
    </section>
  );
}