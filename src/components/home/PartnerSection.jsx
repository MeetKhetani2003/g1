"use client";

import { Link } from "../../utils/navigation";
import { motion } from "framer-motion";
import { Building2, FlaskConical, Pill, Stethoscope, Ambulance, HeartHandshake, ArrowRight, Check } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const partnerTypes = [
  { icon: Building2, title: "Hospitals & Clinics", desc: "Showcase departments, doctors, and OPD availability." },
  { icon: FlaskConical, title: "Laboratories", desc: "List test menus, collection options, and timelines." },
  { icon: Pill, title: "Pharmacies", desc: "Receive prescription orders and manage delivery zones." },
  { icon: Stethoscope, title: "Doctors", desc: "Offer verified in-clinic consultations with rich profiles." },
  { icon: Ambulance, title: "Ambulance Operators", desc: "Define service areas, fleets, and response types." },
  { icon: HeartHandshake, title: "Home Care Agencies", desc: "Publish nursing, physio, and elder-care plans." },
];

const benefits = [
  "Dedicated partner profile page (demo)",
  "Category and city-wise discovery",
  "Service request inbox concept",
  "Simple onboarding checklist",
];

export default function PartnerSection() {
  return (
    <section aria-labelledby="partner-heading" className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="dot-grid-navy pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div id="partner-heading">
          <SectionHeading
            eyebrow="Partner With G1"
            title="Grow with the connected network"
            description="Hospitals, clinics, laboratories, pharmacies, doctors, and ambulance operators can join the G1 network. Start with a demonstration registration of interest."
          />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partnerTypes.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group rounded-[20px] border border-line bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-brand/40 hover:bg-white hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white transition group-hover:bg-teal-brand">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-[16px] font-extrabold text-navy">{p.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-8 overflow-hidden rounded-[24px] border border-line bg-navy p-7 sm:p-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h3 className="font-display text-[22px] font-extrabold text-white sm:text-[26px]">
                Registration takes minutes in the demo flow
              </h3>
              <p className="mt-2 max-w-lg text-[14.5px] text-white/70">
                Tell us about your facility, choose your services, and preview how your profile could appear to patients.
                No real onboarding or verification happens in Phase 1.
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-[14px] font-medium text-white/85">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-brand/20 text-emerald-brand">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="font-display text-[15px] font-bold text-white">Ready to join the demo network?</p>
              <p className="text-[13.5px] text-white/65">Open the partner registration form with validation and instant feedback.</p>
              <Link
                to="/partner"
                className="mt-1 inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-teal-brand px-7 font-display text-[15px] font-bold text-white transition hover:bg-emerald-brand"
              >
                Register as a Partner <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-center text-[12px] text-white/45">Demo only · No fees · No verification claimed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
