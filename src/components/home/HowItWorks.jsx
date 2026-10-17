"use client";

import { Link } from "../../utils/navigation";
import { motion } from "framer-motion";
import { UserPlus, IdCard, SearchCheck, ClipboardList, ArrowRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  {
    n: "01",
    icon: UserPlus,
    title: "Register with G1",
    desc: "Create your free account in minutes with just your name, phone, and city.",
  },
  {
    n: "02",
    icon: IdCard,
    title: "Create your patient profile",
    desc: "Add basic details to generate your demonstration Health ID and card preview.",
  },
  {
    n: "03",
    icon: SearchCheck,
    title: "Find participating providers",
    desc: "Search by service, city, and specialty across the connected network.",
  },
  {
    n: "04",
    icon: ClipboardList,
    title: "Request & track status",
    desc: "Send demonstration requests and follow each status update in one place.",
  },
];

export default function HowItWorks({ showCta = true }) {
  return (
    <section aria-labelledby="how-heading" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div id="how-heading">
          <SectionHeading
            eyebrow="How It Works"
            title="Care in four simple steps"
            description="A clear path from registration to request tracking — designed to feel effortless on any device."
          />
        </div>

        <div className="relative mt-12">
          {/* Connector line (desktop) */}
          <div className="absolute left-0 right-0 top-[52px] hidden h-px bg-line lg:block" aria-hidden="true">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,#00A896_20%,#00A896_80%,transparent)] opacity-30" />
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-[20px] border border-line bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-brand/40 hover:bg-white hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="relative z-10 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-navy text-white shadow-soft transition group-hover:bg-teal-brand">
                    <s.icon className="h-7 w-7" />
                  </span>
                  <span className="font-display text-[40px] font-extrabold leading-none text-navy/10 transition group-hover:text-teal-brand/20">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[17px] font-extrabold text-navy">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.desc}</p>
                <span className="mt-4 block text-[12px] font-bold uppercase tracking-[0.12em] text-teal-dark">
                  Step {s.n}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        {showCta && (
          <div className="mt-10 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex h-[52px] items-center gap-2 rounded-full bg-navy px-8 font-display text-[15px] font-bold text-white transition hover:bg-navy-800"
            >
              See the full journey <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
