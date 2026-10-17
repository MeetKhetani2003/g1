// src/views/DoctorsPage.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Link } from "../utils/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Search,
  MapPin,
  Star,
  Building2,
  Calendar,
  Filter,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Phone,
  RotateCcw,
} from "lucide-react";
import { healthStore } from "../utils/healthStore";
import DoctorBookingModal from "../components/booking/DoctorBookingModal";
import DemoBadge from "../components/ui/DemoBadge";

const SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "General Medicine",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Dermatology",
];

const CITIES = [
  "All Cities",
  "Mumbai",
  "Bengaluru",
  "Delhi NCR",
  "Kolkata",
  "Chennai",
  "Ahmedabad",
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState("rating"); // 'rating' | 'experience' | 'fee_low'
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const loadDoctors = () => {
    setDoctors(healthStore.getDoctors());
  };

  useEffect(() => {
    loadDoctors();
    const handleUpdate = () => loadDoctors();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((d) => {
        const matchesSpecialty =
          selectedSpecialty === "All Specialties" ||
          d.department === selectedSpecialty ||
          d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

        const matchesCity =
          selectedCity === "All Cities" ||
          d.city.toLowerCase() === selectedCity.toLowerCase();

        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.qualification.toLowerCase().includes(q);

        return matchesSpecialty && matchesCity && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "experience") {
          const expA = parseInt(a.experience, 10) || 0;
          const expB = parseInt(b.experience, 10) || 0;
          return expB - expA;
        }
        if (sortBy === "fee_low") return a.consultationFee - b.consultationFee;
        return 0;
      });
  }, [doctors, searchQuery, selectedSpecialty, selectedCity, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All Specialties");
    setSelectedCity("All Cities");
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-slate-50/70">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-navy text-white border-b border-line">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(2,195,154,0.15),rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
                <Stethoscope className="h-4 w-4" /> Verified Doctor Network
              </p>
              <h1 className="mt-3 max-w-2xl font-display text-[30px] font-extrabold leading-tight text-white sm:text-[44px]">
                Consult Top Doctors & Board-Certified Specialists
              </h1>
              <p className="mt-2 max-w-xl text-[15px] text-white/75 leading-relaxed">
                Book physical in-clinic visits and hospital appointments. Every doctor is verified by G1 Medical Council protocols.
              </p>
            </div>
            <DemoBadge label="Verified Specialists · In-Clinic OPD" className="border-white/20 bg-white/10 text-white" />
          </div>

          {/* Search Bar Bar */}
          <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur-md p-2.5 border border-white/20 shadow-2xl max-w-2xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, condition..."
                className="w-full rounded-xl bg-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/50 focus:bg-white/20 focus:outline-hidden"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white focus:bg-white/20 focus:outline-hidden cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-navy bg-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Specialty Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpecialty(spec)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                selectedSpecialty === spec
                  ? "bg-navy text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Results Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <p className="text-xs font-bold text-slate-600">
            Showing <span className="text-navy">{filteredDoctors.length}</span> certified doctors
          </p>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-navy focus:outline-hidden cursor-pointer"
            >
              <option value="rating">Highest Rated ★</option>
              <option value="experience">Most Experienced</option>
              <option value="fee_low">Lowest Consultation Fee</option>
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doc, idx) => (
              <motion.article
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-lift transition-all duration-300"
              >
                <div>
                  {/* Top Header Card */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="h-20 w-20 rounded-2xl object-cover ring-2 ring-teal-500/30"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-black uppercase text-teal-800">
                          {doc.department}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {doc.experience}
                        </span>
                      </div>
                      <Link
                        to={`/doctors/${doc.slug || doc.id}`}
                        className="block font-display text-[16px] font-extrabold text-navy hover:text-teal-600 transition truncate"
                      >
                        {doc.name}
                      </Link>
                      <p className="text-[11px] font-semibold text-slate-500 truncate">
                        {doc.qualification}
                      </p>
                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          ({doc.reviewsCount} reviews)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Clinic and Hospital Info */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 font-medium truncate">
                      <Building2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doc.hospitalAffiliation}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.clinicAddress || doc.city}</span>
                    </p>
                  </div>

                  {/* Consultation Fee */}
                  <div className="mt-4 rounded-2xl bg-slate-50/80 p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">
                        In-Clinic Consultation Fee
                      </span>
                      <span className="font-display font-black text-navy text-[16px]">
                        ₹{doc.consultationFee}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 border border-teal-100">
                      <Clock className="h-3.5 w-3.5 text-teal-600" /> Confirmed OPD Slot
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                  <Link
                    to={`/doctors/${doc.slug || doc.id}`}
                    className="flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-navy hover:bg-slate-50 transition"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedDoctorForBooking(doc)}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-navy text-xs font-bold text-white shadow-xs hover:bg-navy-800 transition"
                  >
                    Book Now <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-3">
              <Stethoscope className="h-7 w-7" />
            </span>
            <h3 className="font-display text-lg font-bold text-navy">No Doctors Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No verified doctors match your active filter criteria. Try choosing a different specialty or resetting filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2 text-xs font-bold text-white shadow hover:bg-navy-800"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Doctor Booking Modal */}
      <DoctorBookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />
    </div>
  );
}
