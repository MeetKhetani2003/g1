// src/views/DoctorDetailPage.jsx
"use client";

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "../utils/navigation";
import { motion } from "framer-motion";
import {
  Stethoscope,
  MapPin,
  Star,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Phone,
  ArrowLeft,
  Award,
  Globe,
  MessageSquare,
  BadgeCheck,
  Check,
  Heart,
  Share2,
} from "lucide-react";
import { healthStore } from "../utils/healthStore";
import DoctorBookingModal from "../components/booking/DoctorBookingModal";
import DemoBadge from "../components/ui/DemoBadge";

export default function DoctorDetailPage({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params?.slug;
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedConsultType, setSelectedConsultType] = useState("in-clinic");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (slug) {
      const doc = healthStore.getDoctorBySlug(slug);
      setDoctor(doc);
      if (doc?.timingSlots?.length) {
        setSelectedSlot(doc.timingSlots[0]);
      }
      setLoading(false);
    }
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-500">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
              <Stethoscope className="h-7 w-7" />
            </div>
            <h2 className="font-display text-xl font-bold text-navy">Doctor Not Found</h2>
            <p className="mt-2 text-sm text-slate-600">
              The doctor profile you are looking for may have moved or is temporarily unavailable.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-navy-800 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back to All Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const consultationFee = doctor.consultationFee || 750;
  const discountedFee = Math.round(consultationFee * 0.8); // 20% off for G1 Health Card members

  return (
    <div className="min-h-screen bg-slate-50/70 pt-20 pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-teal-600 transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/doctors" className="hover:text-teal-600 transition">
              Doctors
            </Link>
            <span>/</span>
            <span className="text-navy font-bold truncate max-w-[200px] sm:max-w-none">
              {doctor.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <Share2 className="h-3.5 w-3.5 text-slate-500" />
              <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
            </button>
            <DemoBadge label="Verified Specialist" variant="verified" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Doctor Profile Hero Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Doctor Portrait */}
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <div className="h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-2xl border-2 border-slate-100 shadow-sm bg-slate-100">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white shadow-md border-2 border-white">
                    <BadgeCheck className="h-5 w-5" />
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-teal-700 border border-teal-100">
                      {doctor.department}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Available Today
                    </span>
                  </div>

                  <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-black text-navy tracking-tight">
                    {doctor.name}
                  </h1>

                  <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
                    {doctor.qualification}
                  </p>
                  <p className="text-xs font-medium text-teal-600 mt-0.5">{doctor.specialty}</p>

                  {/* Rating & Experience Stats Pill Strip */}
                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 rounded-xl bg-amber-50/80 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200/60">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-500 font-normal">
                        ({doctor.reviewsCount || 340} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{doctor.experience} Experience</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                      <span>MCI / State Verified</span>
                    </div>
                  </div>

                  {/* Languages Spoken */}
                  {doctor.languages?.length > 0 && (
                    <div className="mt-3 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-600">Speaks:</span>
                      <span>{doctor.languages.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hospital Affiliation & Clinic Banner */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Primary Hospital Affiliation
                    </span>
                    <p className="text-xs font-bold text-navy">{doctor.hospitalAffiliation}</p>
                    <p className="text-[11px] text-slate-500">{doctor.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Clinic Address
                    </span>
                    <p className="text-xs font-semibold text-navy line-clamp-1">
                      {doctor.clinicAddress || `${doctor.city} Main Healthcare Center`}
                    </p>
                    <p className="text-[11px] text-slate-500">{doctor.availability}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About / Clinical Biography */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-600" />
                About Dr. {doctor.name.replace(/^Dr\.\s*/i, "")}
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-slate-600 space-y-3">
                <p>{doctor.about}</p>
                <p>
                  Practicing with evidence-based diagnostic protocols, Dr. {doctor.name.replace(/^Dr\.\s*/i, "")} prioritizes patient-first treatment plans, conservative intervention, and thorough preventative lifestyle counseling.
                </p>
              </div>

              {/* Specializations & Conditions Managed */}
              {doctor.specializations?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Areas of Expertise & Conditions Treated
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition"
                      >
                        <Check className="h-3 w-3 text-teal-600" />
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards & Recognitions */}
              {doctor.awards?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500" /> Awards & Recognitions
                  </h3>
                  <ul className="space-y-2">
                    {doctor.awards.map((award, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Patient Reviews Section */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-teal-600" />
                    Verified Patient Reviews
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real feedback from consultations booked through G1 Healthcare
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-800 text-xs font-bold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating} / 5.0</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-navy">Pooja Trivedi</span>
                    <span className="text-[10px] text-slate-400 font-medium">3 days ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    "Very patient and explained the entire diagnostic report line by line. The prescribed medication helped me recover within 48 hours without unnecessary tests."
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-navy">Manish Kumar</span>
                    <span className="text-[10px] text-slate-400 font-medium">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    "Had an in-clinic OPD consultation. The hospital staff was very supportive and Dr. provided a detailed diagnosis and prescription. Excellent healthcare standard!"
                  </p>
                </div>
              </div>
            </div>

            {/* Quality & Consultation Guarantees */}
            <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-navy">G1 Patient Protection Assurance</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Free follow-up consultation included within 7 days. If you are not satisfied with your consultation experience, 100% money-back guarantee applies.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-display text-base font-extrabold text-navy">
                      In-Clinic Consultation
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Physical visit at hospital / clinic
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Fee</span>
                    <span className="font-display text-xl font-black text-navy">₹{consultationFee}</span>
                  </div>
                </div>

                {/* G1 Card Discount Callout */}
                <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wide text-emerald-800 block">
                      With G1 Health Card
                    </span>
                    <span className="text-xs font-medium text-emerald-700">Save 20% on booking</span>
                  </div>
                  <span className="text-base font-black text-emerald-700">₹{discountedFee}</span>
                </div>

                {/* Available Slots Preview */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-teal-600" /> Next Available Slots
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">Today</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(doctor.timingSlots || ["10:00 AM", "11:30 AM", "02:30 PM", "04:30 PM"]).map(
                      (slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl py-2 px-2 text-xs font-bold border transition ${
                            selectedSlot === slot
                              ? "border-teal-600 bg-teal-50 text-teal-700"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {slot}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Instant Booking CTA Button */}
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-navy py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-navy-800 transition transform active:scale-98"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-400">
                  Instant SMS & WhatsApp confirmation • No cancellation charges
                </p>

                {/* Contact Helpline */}
                <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-500 block mb-1">
                    Need assistance booking this doctor?
                  </span>
                  <a
                    href="tel:1800123445"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call Tele-Care 1800-123-445
                  </a>
                </div>
              </div>

              {/* Quick Trust Badges */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Verified Medical Credentials & Degrees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Zero Waiting Time Priority Lane</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Digital Prescription saved to your G1 Card</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <DoctorBookingModal
        doctor={doctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialSlot={selectedSlot}
      />
    </div>
  );
}
