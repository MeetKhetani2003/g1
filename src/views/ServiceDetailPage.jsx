// src/views/ServiceDetailPage.jsx
"use client";

import { Link, useParams, useNavigate } from "../utils/navigation";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  FlaskConical,
  HousePlus,
  Pill,
  Ambulance,
  HeartHandshake,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Star,
  Sparkles,
  Lock,
  Stethoscope,
} from "lucide-react";
import { services } from "../data/services";
import { providers } from "../data/providers";
import DemoBadge from "../components/ui/DemoBadge";
import { healthStore } from "../utils/healthStore";
import DiagnosticModal from "../components/services/DiagnosticModal";
import DoctorBookingModal from "../components/booking/DoctorBookingModal";
import FacilityServiceBookingModal from "../components/booking/FacilityServiceBookingModal";

const iconMap = {
  Building2,
  FlaskConical,
  HousePlus,
  Pill,
  Ambulance,
  HeartHandshake,
  ShieldCheck,
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState(null);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    const storeService = healthStore.getServiceBySlug(slug);
    const staticService = services.find((s) => s.slug === slug);
    if (storeService) {
      setServiceData(storeService);
    } else if (staticService) {
      setServiceData({
        ...staticService,
        diagnosticSteps: [
          {
            id: "step-1",
            question: `What primary symptoms do you require ${staticService.title} for?`,
            type: "multiselect",
            options: ["Acute Discomfort", "Routine Second Opinion", "Post-Surgical Follow-up", "Preventive"],
          },
          {
            id: "step-2",
            question: "How long have you observed these symptoms?",
            type: "singleselect",
            options: ["Less than 3 days", "1 to 2 weeks", "Chronic / Ongoing"],
          },
        ],
        packages: [
          {
            id: `${slug}-silver`,
            name: "Standard Consultation",
            tier: "Standard",
            price: 799,
            originalPrice: 1499,
            features: ["Senior Doctor Consult", "Digital Prescription", "3-Day Free Chat Follow-up"],
          },
          {
            id: `${slug}-gold`,
            name: "Priority Comprehensive Care",
            tier: "Priority",
            popular: true,
            price: 1899,
            originalPrice: 3200,
            features: [
              "HOD / Senior Specialist Review",
              "Priority Hospital Booking",
              "Diagnostic Lab Test Co-ordination",
              "Personalized Care Roadmap",
            ],
          },
        ],
      });
    }
  }, [slug]);

  const related = useMemo(() => {
    if (!serviceData) return [];
    return providers.filter((p) => p.category === serviceData.category).slice(0, 3);
  }, [serviceData]);

  const others = useMemo(() => services.filter((s) => s.slug !== slug).slice(0, 4), [slug]);

  if (!serviceData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="font-display text-5xl font-extrabold text-navy/15">404</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-navy">Service not found</h1>
        <p className="mt-2 text-muted">The requested healthcare service could not be loaded.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-6 text-[14px] font-bold text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Go back
          </button>
          <Link
            to="/explore"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-6 text-[14px] font-bold text-white"
          >
            Explore care <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[serviceData.icon] || Building2;

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-navy text-white">
        {serviceData.image && (
          <img
            src={serviceData.image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,0.4),#0B2545)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-[13.5px] font-bold text-white transition hover:bg-white hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white">
                  <Icon className="h-4 w-4" /> {serviceData.category}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                  Razorpay & Triage Enabled
                </span>
              </p>
              <h1
                className="mt-4 font-display text-[32px] font-extrabold leading-tight text-white drop-shadow-sm sm:text-[44px]"
                style={{ color: "#ffffff" }}
              >
                {serviceData.title}
              </h1>
              <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-white/80">
                {serviceData.description || serviceData.short}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setDiagnosticModalOpen(true)}
                  className="inline-flex h-[52px] items-center gap-2 rounded-full px-8 font-display text-[15px] font-bold text-white shadow-lg shadow-teal-500/30 transition hover:opacity-95"
                  style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                >
                  <Stethoscope className="h-5 w-5" /> Start Triage & Select Package
                </button>
                <Link
                  to="/health-card"
                  className="inline-flex h-[52px] items-center rounded-full border border-white/25 px-7 font-display text-[15px] font-bold text-white transition hover:bg-white hover:text-navy"
                >
                  Get G1 Health Card
                </Link>
              </div>
            </div>
            {serviceData.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden overflow-hidden rounded-[20px] border border-white/15 shadow-lift lg:block"
              >
                <img
                  src={serviceData.image}
                  alt={serviceData.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* Packages Section */}
            {serviceData.packages && serviceData.packages.length > 0 && (
              <div className="rounded-[24px] border border-line bg-white p-6 shadow-soft sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-dark">
                      Transparent Healthcare Pricing
                    </span>
                    <h2 className="font-display text-2xl font-extrabold text-navy">
                      Available Service & Consultation Packages
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-muted">
                    Razorpay Secured · 100% Verified
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {serviceData.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative rounded-2xl border p-5 transition flex flex-col justify-between ${
                        pkg.popular
                          ? "border-teal-brand bg-gradient-to-b from-teal-50/50 to-white shadow-md ring-1 ring-teal-brand/30"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 right-4 rounded-full bg-navy px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                          Most Popular
                        </span>
                      )}

                      <div>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                          {pkg.tier}
                        </span>
                        <h3 className="mt-2 font-display text-lg font-bold text-navy">{pkg.name}</h3>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-display text-2xl font-black text-navy">₹{pkg.price}</span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-muted line-through">₹{pkg.originalPrice}</span>
                          )}
                        </div>

                        <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-ink/80">
                          {pkg.features?.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-teal-brand shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDiagnosticModalOpen(true)}
                        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-navy py-3 text-xs font-bold text-white shadow-xs transition hover:bg-teal-brand"
                      >
                        Choose Package <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            {serviceData.features && (
              <div className="rounded-[20px] border border-line bg-white p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-xl font-extrabold text-navy">
                  What this clinical service includes
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {serviceData.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 rounded-xl bg-cream p-3.5 text-[14px] font-semibold text-navy"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-brand text-white">
                        <Check className="h-4 w-4" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Providers */}
            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-extrabold text-navy">
                  Sample {serviceData.category} Reference Centers
                </h2>
                <DemoBadge />
              </div>
              {related.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <article
                      key={p.id}
                      className="overflow-hidden rounded-[18px] border border-line bg-white shadow-soft"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-[130px] w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-display text-[14.5px] font-extrabold text-navy clamp-2">
                          {p.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-[12.5px] text-muted">
                          <MapPin className="h-3.5 w-3.5" /> {p.city} · {p.distance}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-[12.5px] font-bold text-navy">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {p.rating}{" "}
                          <span className="font-medium text-muted">({p.reviews})</span>
                        </p>
                        <div className="mt-3 pt-2.5 border-t border-line">
                          <button
                            type="button"
                            onClick={() => {
                              if (p.category === "Doctor" || p.type === "Doctor") {
                                setSelectedDoctor(p);
                              } else {
                                setSelectedFacility(p);
                              }
                            }}
                            className="w-full rounded-full bg-navy py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
                          >
                            {p.category === "Doctor" || p.type === "Doctor" ? "Book Dr. Consultation" : "Book Facility"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-[20px] border border-line bg-navy p-6 text-white space-y-3">
              <h3 className="font-display text-[17px] font-extrabold">Instant Clinical Help</h3>
              <p className="text-[13px] text-white/70 leading-relaxed">
                Start our dynamic triage flow. Answer symptom questions and our system will match you
                with the ideal consultation tier and senior doctor.
              </p>
              <button
                type="button"
                onClick={() => setDiagnosticModalOpen(true)}
                className="w-full mt-2 flex h-12 items-center justify-center gap-2 rounded-full font-display text-[14.5px] font-bold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
              >
                <Stethoscope className="h-4.5 w-4.5" /> Start Assessment
              </button>
              <Link
                to="/health-card"
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 text-xs font-bold text-white hover:bg-white/10"
              >
                View G1 Health Card
              </Link>
            </div>

            <div className="rounded-[20px] border border-line bg-white p-6 shadow-soft">
              <h3 className="font-display text-[16px] font-extrabold text-navy">Other Services</h3>
              <ul className="mt-4 space-y-2">
                {others.map((o) => {
                  const OIcon = iconMap[o.icon] || Building2;
                  return (
                    <li key={o.slug}>
                      <Link
                        to={`/services/${o.slug}`}
                        className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-cream"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-dark transition group-hover:bg-navy group-hover:text-white">
                          <OIcon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block font-display text-[13.5px] font-bold text-navy">
                            {o.title}
                          </span>
                          <span className="block text-[12px] text-muted">{o.category}</span>
                        </span>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-navy" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Dynamic Diagnostic & Razorpay Modal */}
      <DiagnosticModal
        service={serviceData}
        isOpen={diagnosticModalOpen}
        onClose={() => setDiagnosticModalOpen(false)}
        onComplete={() => {}}
      />

      {/* Doctor Consultation Booking Modal */}
      <DoctorBookingModal
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />

      {/* Facility Service Booking Modal */}
      <FacilityServiceBookingModal
        facility={selectedFacility}
        isOpen={!!selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
    </div>
  );
}
