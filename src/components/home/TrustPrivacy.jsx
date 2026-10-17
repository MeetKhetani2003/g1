"use client";

import { Link } from "../../utils/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, FileCheck, ArrowRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Privacy-first principles",
    desc: "Minimal collection, clear consent, and no selling of personal information — by design.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    desc: "Encrypted transmission and careful access controls planned for production launch.",
  },
  {
    icon: EyeOff,
    title: "You control visibility",
    desc: "Choose what appears on your profile and who can request to see it.",
  },
  {
    icon: FileCheck,
    title: "Honest demo labelling",
    desc: "Sample providers, sample reviews, and sample IDs are always marked as demo.",
  },
];

export default function TrustPrivacy() {
  return (
    <section aria-labelledby="trust-heading" className="bg-cream py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div id="trust-heading">
          <SectionHeading
            eyebrow="Trust & Privacy"
            title="Healthcare demands trust. We design for it."
            description="G1 is built around transparency — about data, about demo content, and about what Phase 1 does and does not do."
          />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-[20px] border border-line bg-white p-6 shadow-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-dark">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-[16px] font-extrabold text-navy">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[20px] border border-amber-200 bg-amber-50 p-6 sm:flex-row sm:items-center"
          role="note"
        >
          <div>
            <p className="font-display text-[15px] font-extrabold text-navy">Important: Phase 1 is a demonstration</p>
            <p className="mt-1 max-w-2xl text-[13.5px] text-ink/80">
              No real appointments, medicine orders, payments, or emergency dispatches occur here. In an emergency,
              always call your local emergency number. Sample data never leaves your browser.
            </p>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <Link
              to="/privacy"
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-navy px-5 text-[13.5px] font-bold text-white transition hover:bg-navy-800"
            >
              Privacy <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/terms"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-navy/20 bg-white px-5 text-[13.5px] font-bold text-navy transition hover:border-navy"
            >
              Terms
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
