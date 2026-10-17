"use client";

import { Link } from "../../utils/navigation";
import { motion } from "framer-motion";
import { Search, IdCard, Building2, ArrowUpRight } from "lucide-react";

export default function FinalCta() {
  return (
    <section aria-label="Get started" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] bg-navy px-6 py-12 text-center sm:px-12 sm:py-16"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-teal-brand/25 blur-[100px]" />
          <div className="absolute -bottom-24 -right-16 h-[300px] w-[380px] rounded-full bg-emerald-brand/20 blur-[100px]" />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        <div className="relative mx-auto max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
            Get started today
          </p>
          <h2 className="mt-4 font-display text-[28px] font-extrabold leading-tight text-white sm:text-[38px]">
            Your healthcare, connected — starting now.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/70">
            Explore demonstration providers, preview your Health Card, or bring your facility onto the network.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link
              to="/explore"
              className="group flex items-center gap-3 rounded-2xl bg-white p-4 text-left transition hover:bg-teal-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition group-hover:bg-teal-brand">
                <Search className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[14px] font-extrabold text-navy">Find Care</span>
                <span className="block text-[12px] text-muted">Search demo listings</span>
              </span>
            </Link>
            <Link
              to="/health-card"
              className="group flex items-center gap-3 rounded-2xl bg-white p-4 text-left transition hover:bg-teal-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-brand text-white transition group-hover:bg-navy">
                <IdCard className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[14px] font-extrabold text-navy">Health Card</span>
                <span className="block text-[12px] text-muted">Preview your ID</span>
              </span>
            </Link>
            <Link
              to="/partner"
              className="group flex items-center gap-3 rounded-2xl bg-white p-4 text-left transition hover:bg-teal-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-brand text-white transition group-hover:bg-navy">
                <Building2 className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[14px] font-extrabold text-navy">Partner</span>
                <span className="block text-[12px] text-muted">Join the network</span>
              </span>
            </Link>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] text-white/50">
            Phase 1 demo · No real bookings or payments <ArrowUpRight className="h-3.5 w-3.5" />
          </p>
        </div>
      </motion.div>
    </section>
  );
}
