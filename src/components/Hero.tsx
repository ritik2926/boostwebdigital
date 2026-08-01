"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center px-8 max-w-4xl mx-auto text-center">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p
          variants={item}
          className="text-sm font-medium tracking-wide uppercase text-accent mb-4"
        >
          Healthcare-Only Marketing Agency
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-4xl sm:text-6xl font-medium tracking-tight leading-[1.1]"
        >
          The Marketing Agency Built Only for Healthcare Practices
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-lg text-foreground/70 max-w-2xl mx-auto"
        >
          Not a generalist agency that also &quot;does healthcare.&quot; We work
          exclusively with medical, dental, and aesthetic practices — because a
          dentist&apos;s patient never searches the way a SaaS buyer does.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/contact"
            className="bg-accent text-white px-7 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Get a Free Growth Plan →
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium underline underline-offset-4 text-foreground/70 hover:text-foreground transition-colors"
          >
            See who we serve
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}