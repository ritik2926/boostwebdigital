"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-foreground/10"
    >
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <Link href="/" className="font-display font-medium text-lg tracking-tight">
          Boost Web Digital
        </Link>

        <div className="hidden sm:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="relative group">
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden sm:inline-block bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Get a Growth Plan
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}