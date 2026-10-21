// src/views/BimariDoctorPage.jsx
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Stethoscope,
  Heart,
  Activity,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText,
  Clock,
  Star,
  Video,
} from "lucide-react";
import { Link } from "../utils/navigation";
import { healthStore } from "../utils/healthStore";
import DoctorBookingModal from "../components/booking/DoctorBookingModal";

export default function BimariDoctorPage() {
  const diseases = healthStore.getDiseases();
  const doctors = healthStore.getDoctors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Booking modal state
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDisease, setBookingDisease] = useState("");
  const [bookingMode, setBookingMode] = useState("in_clinic");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(diseases.map((d) => d.category));
    return ["All", ...Array.from(set)];
  }, [diseases]);

  const filteredDiseases = useMemo(() => {
    return diseases.filter((d) => {
      const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        d.name.toLowerCase().includes(q) ||
        d.hindiName.toLowerCase().includes(q) ||
        d.recommendedSpecialist.toLowerCase().includes(q) ||
        d.commonSymptoms.some((s) => s.toLowerCase().includes(q)) ||
        d.diagnosticTests.some((t) => t.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [diseases, selectedCategory, searchQuery]);

  const handleBookDoctorForDisease = (diseaseObj, doctorSlug, mode = "in_clinic") => {
    // Find matching doctor from healthStore
    let doc = doctors.find((d) => d.slug === doctorSlug || d.id === doctorSlug);
    if (!doc) {
      doc = doctors[0]; // fallback
    }
    setBookingDoctor(doc);
    setBookingDisease(diseaseObj.name);
    setBookingMode(mode);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy text-white py-12 sm:py-16 px-4 sm:px-6 border-b border-line">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            Triage & Specialist Matcher
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
            बीमारी और उसका सही डॉक्टर <br />
            <span className="text-teal-400">Disease & Doctor Finder</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Search your disease, condition, or symptoms in Hindi or English. Get mapped immediately to the exact super-specialist, general physician triage, and emergency-equipped hospitals.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-white shadow-xl shadow-navy/20 p-2 border border-slate-200">
              <Search className="h-5 w-5 text-teal-600 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search disease, symptoms e.g. Chest pain, Diabetes, Knee दर्द, Fever, Migraine..."
                className="w-full bg-transparent px-3 py-2 text-sm font-semibold text-navy placeholder:text-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-2 text-xs text-slate-400 hover:text-navy"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick condition tags */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Popular Searches:</span>
              {[
                "Chest pain / Heart",
                "Diabetes / Sugar",
                "Knee Arthritis",
                "Brain Migraine",
                "Dengue Fever",
                "Kidney Stone",
                "Skin Allergy",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag.split(" / ")[0])}
                  className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-[11px] font-semibold text-teal-200 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-[11px] font-bold text-slate-400 ml-auto shrink-0 hidden md:block">
            Showing {filteredDiseases.length} Medical Conditions
          </span>
        </div>
      </section>

      {/* Disease Cards Listing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
        {filteredDiseases.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-display text-base font-bold text-navy">No exact disease found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with common symptoms like "pain", "fever", "sugar", or "swelling".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-full bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          filteredDiseases.map((disease) => {
            const matchedDoc = doctors.find(
              (d) => d.slug === disease.specialistDoctorSlug || d.id === disease.specialistDoctorSlug
            ) || doctors[0];

            return (
              <div
                key={disease.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md"
              >
                {/* Header of Disease */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-teal-100 px-3 py-0.5 text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">
                        {disease.category}
                      </span>
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                        {disease.severity}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                        {disease.badge}
                      </span>
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl font-black text-navy pt-1">
                      {disease.name}
                    </h2>
                    <p className="text-xs font-bold text-teal-700">
                      {disease.hindiName}
                    </p>
                  </div>

                  {/* Actions: Book In-Clinic or Video */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => handleBookDoctorForDisease(disease, disease.specialistDoctorSlug, "in_clinic")}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-display text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                    >
                      <Building2 className="h-3.5 w-3.5" /> Book Offline In-Clinic (₹{matchedDoc?.consultationFee || 600})
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBookDoctorForDisease(disease, disease.specialistDoctorSlug, "online_video")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 bg-purple-50 px-4 py-2.5 font-display text-xs font-bold text-purple-800 transition hover:bg-purple-100 active:scale-95 cursor-pointer"
                    >
                      <Video className="h-3.5 w-3.5" /> Online Video Call
                    </button>
                  </div>
                </div>

                {/* 3-Column Doctor & Hospital Mapping Grid */}
                <div className="grid lg:grid-cols-12 gap-6 pt-5">
                  {/* Left Column (5 Cols): Symptoms & First-line GP triage */}
                  <div className="lg:col-span-4 space-y-4">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                        Common Symptoms (लक्षण)
                      </h3>
                      <ul className="space-y-1.5">
                        {disease.commonSymptoms.map((symptom, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1">
                        <Stethoscope className="h-3.5 w-3.5" /> General Physician Role (फर्स्ट एड व प्राथमिक जांच)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {disease.generalPhysicianRole}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column (4 Cols): Recommended Specialist Doctor */}
                  <div className="lg:col-span-4 rounded-2xl border border-teal-200/80 bg-teal-50/40 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
                          Recommended Specialist
                        </span>
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                          {disease.recommendedSpecialist.split(" / ")[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={matchedDoc?.image || disease.specialistDoctorImage}
                          alt={matchedDoc?.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-teal-200 shadow-2xs"
                        />
                        <div>
                          <p className="font-display text-sm font-black text-navy">
                            {matchedDoc?.name}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-600">
                            {matchedDoc?.qualification}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-0.5 font-bold text-amber-600">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {matchedDoc?.rating || 4.9}
                            </span>
                            <span>·</span>
                            <span>{matchedDoc?.city}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 italic">
                        "{matchedDoc?.about?.slice(0, 110)}..."
                      </p>
                    </div>

                    <div className="pt-2 border-t border-teal-100/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 block">Consultation</span>
                        <span className="font-display text-base font-black text-navy">₹{matchedDoc?.consultationFee || 600}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBookDoctorForDisease(disease, matchedDoc?.slug, "in_clinic")}
                        className="rounded-full bg-teal-600 hover:bg-teal-700 px-4 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                      >
                        Book Consultation →
                      </button>
                    </div>
                  </div>

                  {/* Right Column (4 Cols): Equipped Hospitals & Diagnostic Tests */}
                  <div className="lg:col-span-4 space-y-4">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-teal-600" /> Equipped Hospitals (सुविधा युक्त अस्पताल)
                      </h3>
                      <div className="space-y-2">
                        {disease.equippedHospitals.map((hosp, idx) => (
                          <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs">
                            <div className="flex items-center justify-between">
                              <strong className="text-navy">{hosp.name}</strong>
                              <span className="text-[10px] text-slate-500">{hosp.city}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                              {hosp.hasCathLab && <span className="text-emerald-700 font-bold">✓ 24x7 Cath Lab</span>}
                              <span>• {hosp.icuBeds} ICU Beds</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                        Suggested Diagnostics
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {disease.diagnosticTests.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-cyan-50 border border-cyan-100 px-2 py-0.5 text-[10.5px] font-semibold text-cyan-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Triage / Emergency Tip */}
                    <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-2.5 text-[11px] text-amber-900 leading-tight">
                      <strong>Doctor Tip:</strong> {disease.immediateTriageTip}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Booking Modal */}
      {isBookingOpen && bookingDoctor && (
        <DoctorBookingModal
          doctor={bookingDoctor}
          isOpen={isBookingOpen}
          initialDisease={bookingDisease}
          initialMode={bookingMode}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => {
            setIsBookingOpen(false);
          }}
        />
      )}
    </div>
  );
}
