"use client";

import { Link } from "../../utils/navigation";
import { motion } from "framer-motion";
import { QrCode, BadgeCheck, ShieldCheck, ArrowRight, Fingerprint, Wallet } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import DemoBadge from "../ui/DemoBadge";

function QrPlaceholder() {
  // Decorative QR-style placeholder built with CSS grid (no external lib)
  const cells = Array.from({ length: 81 }, (_, i) => {
    const row = Math.floor(i / 9);
    const col = i % 9;
    const inCorner = (r, c) => (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
    if (inCorner(row, col)) {
      const lr = row % 3 === 0 || row % 3 === 2 || col % 3 === 0 || col % 3 === 2;
      const center = row % 3 === 1 && col % 3 === 1;
      return lr || center;
    }
    // pseudo-random stable pattern
    return (row * 7 + col * 11 + row * col) % 3 === 0;
  });
  return (
    <div className="rounded-xl bg-white p-2.5" role="img" aria-label="QR code placeholder">
      <div className="grid grid-cols-9 gap-[2px]">
        {cells.map((filled, i) => (
          <span key={i} className={`aspect-square rounded-[1px] ${filled ? "bg-navy" : "bg-white"}`} />
        ))}
      </div>
      <p className="mt-1.5 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-muted">QR · Demo</p>
    </div>
  );
}

export default function HealthCardPreview() {
  return (
    <section aria-labelledby="health-card-heading" className="relative overflow-hidden bg-navy py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-teal-brand/20 blur-[110px]" />
        <div className="absolute -bottom-32 -left-24 h-[320px] w-[420px] rounded-full bg-emerald-brand/15 blur-[110px]" />
        <div className="dot-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            dark
            eyebrow="G1 Health Card"
            title="One Health Card. A connected care journey."
            description="Preview how a single digital profile could keep your details accessible and help you discover participating providers. Sample data only — no real benefits claimed."
          />
          <ul className="mt-7 space-y-4">
            {[
              { icon: Fingerprint, title: "Portable patient profile", desc: "Basic details and a demonstration Health ID in one place." },
              { icon: QrCode, title: "Quick check-in concept", desc: "Illustrative QR placeholder for faster front-desk identification." },
              { icon: ShieldCheck, title: "Privacy-aware by design", desc: "You control what is shown. Nothing is shared without consent." },
            ].map((f) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-brand/15 text-emerald-brand">
                  <f.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-[15px] font-bold text-white">{f.title}</span>
                  <span className="mt-0.5 block text-[13.5px] text-white/65">{f.desc}</span>
                </span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/health-card"
              className="inline-flex h-[52px] items-center gap-2 rounded-full bg-teal-brand px-7 font-display text-[15px] font-bold text-white transition hover:bg-emerald-brand"
            >
              Explore Health Card <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/25 px-7 font-display text-[15px] font-bold text-white transition hover:bg-white hover:text-navy"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Card visual */}
        <motion.div
          initial={{ opacity: 0, y: 28, rotate: 1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[440px]"
        >
          <div className="absolute -inset-4 rounded-[32px] bg-emerald-brand/10 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[24px] border border-white/20 bg-[linear-gradient(135deg,#13315C_0%,#0B2545_55%,#0E3A3A_100%)] p-6 shadow-[0_32px_70px_-18px_rgba(0,0,0,0.6)] sm:p-7">
            <div className="dot-grid absolute inset-0 opacity-25" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                    <img src="/brand/g1-icon.svg" alt="G1" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <p className="font-display text-[16px] font-extrabold leading-none text-white">G1 Healthcare</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-brand">Health Card · Demo</p>
                  </div>
                </div>
                <DemoBadge label="Sample" className="border-white/20 bg-white/10 text-white" />
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Patient Name</p>
                  <p className="mt-1 font-display text-[20px] font-extrabold text-white">Aarav Sharma</p>
                  <p className="mt-1 text-[12px] font-medium text-white/60">Sample profile · Not a real person</p>
                </div>
                <QrPlaceholder />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Health ID</p>
                  <p className="mt-1 font-mono text-[14px] font-bold tracking-wide text-white">G1-DEMO-482913</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Status</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[14px] font-bold text-emerald-brand">
                    <BadgeCheck className="h-4 w-4" /> Active · Demo
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-white/95 px-4 py-3">
                <p className="flex items-center gap-2 text-[12.5px] font-bold text-navy">
                  <Wallet className="h-4 w-4 text-teal-dark" /> G1 · Connected Care
                </p>
                <p className="font-mono text-[12px] font-bold tracking-[0.2em] text-muted">•••• 2026</p>
              </div>

              <p className="mt-3 text-center text-[11px] text-white/45">
                Illustration only. No medical, insurance, or discount benefits implied.
              </p>
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-3 top-10 hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lift sm:flex"
          >
            <BadgeCheck className="h-5 w-5 text-teal-brand" />
            <div>
              <p className="font-display text-[12.5px] font-extrabold text-navy">Profile ready</p>
              <p className="text-[11px] text-muted">Demo check-in</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
