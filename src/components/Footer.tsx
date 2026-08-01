"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 bg-foreground/[0.02]">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-8 py-24 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl sm:text-6xl font-medium tracking-tight max-w-2xl"
        >
          Let&apos;s grow your practice.
        </motion.h2>

        <Link
          href="/contact"
          className="inline-block mt-8 bg-accent text-white px-7 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Start a conversation →
        </Link>

        <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div>
            <p className="font-semibold mb-4">Boost Web Digital</p>
            <p className="text-foreground/60 leading-relaxed">
              A healthcare-only marketing agency for dental, dermatology, med
              spa, and hair restoration practices.
            </p>
          </div>

          <div>
            <p className="font-semibold mb-4">Company</p>
            <ul className="space-y-2 text-foreground/60">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors">Services</Link></li>
              <li><Link href="/case-studies" className="hover:text-foreground transition-colors">Case Studies</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-4">Contact</p>
            <ul className="space-y-2 text-foreground/60">
              <li>hello@boostwebdigital.com</li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Book a call</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-4">Stay Updated</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="you@practice.com"
                className="bg-transparent border border-foreground/20 rounded-full px-4 py-2 text-sm flex-1 min-w-0 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="bg-accent text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
          <p>© {new Date().getFullYear()} Boost Web Digital. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}