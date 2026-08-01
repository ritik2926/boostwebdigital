"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="px-8 py-28 text-center border-t border-foreground/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="font-display text-3xl sm:text-5xl font-medium">
          Ready to Grow Your Practice?
        </h2>
        <p className="mt-5 text-foreground/70">
          Tell us about your practice. We&apos;ll tell you, specifically,
          what&apos;s costing you patients online — no generic audit
          template, no upsell pressure.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-8 bg-accent text-white px-7 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Get a Free Growth Plan →
        </Link>
        <p className="mt-3 text-xs text-foreground/50">
          No obligation. 20-minute call. You&apos;ll leave with 3 things to
          fix even if you never hire us.
        </p>
      </motion.div>
    </section>
  );
}