"use client";

import { motion } from "framer-motion";

const specialties = [
  { name: "Dental Practices", href: "/services" },
  { name: "Dermatology Clinics", href: "/services" },
  { name: "Med Spas", href: "/services" },
  { name: "Plastic Surgery Practices", href: "/services" },
  { name: "Orthodontists", href: "/services" },
  {
    name: "Hair Transplant & Restoration",
    href: "/services",
    featured: true,
  },
];

export default function WhoWeServe() {
  return (
    <section className="px-8 py-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl sm:text-4xl font-bold">Who We Serve</h2>
        <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
          We don&apos;t run one playbook for every industry. Each specialty gets
          its own strategy, built around how that patient actually searches
          and decides.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {specialties.map((s, i) => (
          <motion.a
            key={s.name}
            href={s.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-2xl border transition-colors ${
              s.featured
                ? "border-accent bg-accent/5"
                : "border-foreground/10 hover:border-foreground/25"
            }`}
          >
            <h3 className="font-semibold">{s.name}</h3>
            {s.featured && (
              <p className="mt-2 text-sm text-accent font-medium">
                Live client: Kaja Hair Studio
              </p>
            )}
          </motion.a>
        ))}
      </div>
    </section>
  );
}