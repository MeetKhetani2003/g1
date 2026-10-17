"use client";

import { Link } from "../../utils/navigation";
import { MapPin, Mail, Phone, ShieldCheck, HeartHandshake, ArrowUpRight } from "lucide-react";
import { services } from "../../data/services";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { openLoginModal, user } = useAuth();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-white" role="contentinfo">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-2xl font-extrabold text-white">Ready to explore connected care?</h3>
            <p className="mt-1.5 max-w-xl text-[15px] text-white/70">
              Search demonstration providers, preview the Health Card, or register your facility as a partner.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-teal-brand px-7 font-display font-bold text-white transition hover:bg-emerald-brand"
            >
              Find Healthcare <ArrowUpRight className="h-5 w-5" />
            </Link>
            <Link
              to="/partner"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-7 font-display font-bold text-white transition hover:bg-white hover:text-navy"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="G1 Healthcare Aggregator home">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1">
                <img src="/brand/g1-icon.svg" alt="" className="h-full w-full object-contain" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-extrabold text-white">G1 Healthcare</span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-brand">Aggregator</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/65">
              One connected platform to discover hospitals, doctors, diagnostic labs, pharmacies, and essential
              healthcare services. Phase 1 is a premium UI foundation with demonstration data only.
            </p>
            <div className="mt-5 space-y-2.5 text-[14px] text-white/70">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-brand" />
                Demonstration address — no physical location claimed
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-brand" />
                Demo contact via the Contact page form
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-brand" />
                Not an emergency service — call local emergency numbers
              </p>
            </div>
          </div>

          <nav aria-label="Services">
            <h4 className="font-display text-[13px] font-extrabold uppercase tracking-[0.14em] text-white/50">Services</h4>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-[14px] text-white/75 transition hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h4 className="font-display text-[13px] font-extrabold uppercase tracking-[0.14em] text-white/50">Company</h4>
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/75">
              <li><Link to="/explore" className="transition hover:text-white">Explore Care</Link></li>
              <li><Link to="/health-card" className="transition hover:text-white">Health Card</Link></li>
              <li><Link to="/how-it-works" className="transition hover:text-white">How It Works</Link></li>
              <li><Link to="/partner" className="transition hover:text-white">Partner With Us</Link></li>
              <li><Link to="/contact" className="transition hover:text-white">Contact</Link></li>
              <li>
                {user ? (
                  <span className="text-teal-brand font-semibold">Signed in as {user.name.split(" ")[0]}</span>
                ) : (
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="transition hover:text-white text-left cursor-pointer"
                  >
                    Sign in with Google
                  </button>
                )}
              </li>
            </ul>
          </nav>

          <nav aria-label="Trust and legal">
            <h4 className="font-display text-[13px] font-extrabold uppercase tracking-[0.14em] text-white/50">Trust & Legal</h4>
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/75">
              <li><Link to="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition hover:text-white">Terms of Use</Link></li>
              <li><Link to="/how-it-works#privacy" className="transition hover:text-white">Data & Privacy</Link></li>
              <li><Link to="/partner" className="transition hover:text-white">Partner Standards</Link></li>
            </ul>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 font-display text-[13px] font-bold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-brand" /> Privacy-first demo
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">
                Sample data only. Nothing you enter leaves your browser in Phase 1.
              </p>
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-[13px] text-white/55 sm:px-6 md:flex-row">
          <p>© {year} G1 Healthcare Aggregator · Phase 1 UI Foundation. All providers shown are sample data.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/admin" className="text-white/35 hover:text-white/70 transition">
              Staff & Ops Portal
            </Link>
            <span className="text-white/20">·</span>
            <p className="flex items-center gap-1.5 text-white/55">
              <HeartHandshake className="h-4 w-4 text-emerald-brand" /> Designed for connected, accessible care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
