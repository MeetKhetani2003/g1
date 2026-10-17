"use client";

import { Link } from "../utils/navigation";
import { motion } from "framer-motion";
import { UserPlus, IdCard, SearchCheck, ClipboardList, ShieldCheck, ArrowRight, Check } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";

const steps = [
  {
    n: "01",
    icon: UserPlus,
    title: "Register with G1",
    desc: "Create your account with your name, mobile number, and city. Verification via OTP is planned for production — the demo skips this step.",
    points: ["2-minute demo form", "No documents needed for preview", "Mobile-friendly flow"],
  },
  {
    n: "02",
    icon: IdCard,
    title: "Create your patient profile",
    desc: "Add basic details to preview your Health Card with a demonstration Health ID, QR placeholder, and membership status.",
    points: ["Sample Health ID", "Editable demo details", "QR placeholder"],
  },
  {
    n: "03",
    icon: SearchCheck,
    title: "Find participating providers",
    desc: "Search the demonstration directory by service category, city, and specialty. Compare sample profiles side by side.",
    points: ["8 care categories", "City + specialty filters", "Sample ratings"],
  },
  {
    n: "04",
    icon: ClipboardList,
    title: "Request services & track status",
    desc: "Send demonstration requests — appointments, home collection, medicine orders — and follow each status update in one timeline.",
    points: ["Demo request inbox", "Status timeline concept", "No real fulfillment"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-cream">
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
            How It Works
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-[30px] font-extrabold leading-tight text-white sm:text-[40px]">
            From sign-up to tracked care in four steps
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-white/70">
            A transparent walkthrough of the Phase 1 demonstration journey — what works now and what arrives later.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <ol className="relative space-y-6">
          <div className="absolute bottom-8 left-[31px] top-8 hidden w-px bg-line sm:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative flex flex-col gap-5 rounded-[22px] border border-line bg-white p-6 shadow-soft sm:flex-row sm:gap-7 sm:p-8"
            >
              <div className="flex shrink-0 items-start gap-4 sm:flex-col sm:items-center">
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
                  <s.icon className="h-7 w-7" />
                </span>
                <span className="font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-teal-dark sm:mt-1">
                  Step {s.n}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-[20px] font-extrabold text-navy sm:text-[22px]">{s.title}</h2>
                <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted">{s.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3.5 py-1.5 text-[12.5px] font-bold text-navy">
                      <Check className="h-3.5 w-3.5 text-teal-brand" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="pointer-events-none absolute right-6 top-5 hidden font-display text-[56px] font-extrabold leading-none text-navy/5 lg:block">
                {s.n}
              </span>
            </motion.li>
          ))}
        </ol>

        {/* Privacy note */}
        <div id="privacy" className="mt-10 scroll-mt-28 rounded-[22px] border border-line bg-navy p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-brand/15 text-emerald-brand">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-display text-[20px] font-extrabold text-white">Your privacy at every step</h2>
              <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
                G1 collects only what is needed, never sells personal information, and gives you control over profile
                visibility. In this Phase 1 demo, form entries stay in your browser — nothing is transmitted to a server.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/privacy" className="inline-flex h-11 items-center rounded-full bg-white px-6 text-[14px] font-bold text-navy transition hover:bg-teal-50">
                  Read Privacy Policy
                </Link>
                <Link to="/terms" className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-[14px] font-bold text-white transition hover:bg-white hover:text-navy">
                  Terms of Use
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <SectionHeading
            eyebrow="Try it now"
            title="Start with the demo directory"
            description="No sign-up needed to browse. Preview providers, then try the Health Card demo."
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/explore" className="inline-flex h-[52px] items-center gap-2 rounded-full bg-teal-brand px-8 font-display text-[15px] font-bold text-white transition hover:bg-teal-dark">
              Explore Care <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/health-card" className="inline-flex h-[52px] items-center gap-2 rounded-full bg-navy px-8 font-display text-[15px] font-bold text-white transition hover:bg-navy-800">
              Preview Health Card
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
