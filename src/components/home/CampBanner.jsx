// src/components/home/CampBanner.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  Stethoscope,
  Phone,
  ShieldCheck,
  ArrowRight,
  Heart,
} from "lucide-react";
import confetti from "canvas-confetti";
import { healthStore } from "../../utils/healthStore";
import { useAuth } from "../../context/AuthContext";

export default function CampBanner() {
  const { user } = useAuth();
  const [activeCamps, setActiveCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [attendeeForm, setAttendeeForm] = useState({
    name: "",
    phone: "",
    healthId: "",
    isNewUser: false,
    notes: "",
  });
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  const loadCamps = () => {
    const list = healthStore.getActiveCamps();
    setActiveCamps(list);
    if (list.length > 0 && !selectedCamp) {
      setSelectedCamp(list[0]);
    }
  };

  useEffect(() => {
    loadCamps();
    const handleUpdate = () => loadCamps();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  useEffect(() => {
    if (user) {
      const p = healthStore.getPatient(user);
      setAttendeeForm((prev) => ({
        ...prev,
        name: p?.name || user?.name || "",
        phone: p?.phone || user?.phone || "",
        healthId: p?.healthId || user?.healthId || "",
      }));
    }
  }, [user]);

  // If no active camps or camp schedule ended, hide banner completely
  if (!activeCamps || activeCamps.length === 0) {
    return null;
  }

  const camp = selectedCamp || activeCamps[0];

  const handleOpenRegister = (targetCamp) => {
    setSelectedCamp(targetCamp);
    setRegisteredSuccess(null);
    setModalOpen(true);
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    if (!attendeeForm.name || !attendeeForm.phone) {
      alert("Please provide attendee name and mobile number");
      return;
    }

    const attendee = healthStore.registerCampAttendee(camp.id, {
      name: attendeeForm.name,
      phone: attendeeForm.phone,
      healthId: attendeeForm.healthId || `G1-${Math.floor(100000 + Math.random() * 900000)}`,
      isNewUser: attendeeForm.isNewUser,
      notes: attendeeForm.notes,
    });

    setRegisteredSuccess(attendee);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
  };

  const daysRemaining = () => {
    const end = new Date(camp.endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Ending Today";
    if (diff === 1) return "1 Day Left";
    return `${diff} Days Left`;
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-navy via-slate-900 to-navy text-white py-4 px-4 sm:px-6 border-y border-teal-500/30 shadow-md">
        {/* Decorative background glow */}
        <div className="absolute -left-20 top-0 h-44 w-44 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left badge & details */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/30 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-red-300">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  Free Health Camp Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 border border-teal-400/30 px-2.5 py-0.5 text-[11px] font-bold text-teal-300">
                  <Clock className="h-3 w-3" /> {daysRemaining()}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  Organized by: <strong className="text-white">{camp.organizer}</strong>
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-teal-400 shrink-0" />
                  {camp.title}
                </h3>
                <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-teal-400" />
                    {camp.startDate} to {camp.endDate} ({camp.timings})
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-400" />
                    {camp.venue}, {camp.city}
                  </span>
                </p>
              </div>

              {/* Services offered pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(camp.servicesOffered || []).slice(0, 4).map((service, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200 border border-white/10"
                  >
                    <Sparkles className="h-3 w-3 text-amber-300" /> {service}
                  </span>
                ))}
                {(camp.servicesOffered || []).length > 4 && (
                  <span className="text-[11px] text-teal-300 self-center">
                    +{(camp.servicesOffered || []).length - 4} more free services
                  </span>
                )}
              </div>
            </div>

            {/* Right side CTA & Capacity info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <div className="text-left sm:text-right hidden sm:block">
                <span className="text-[11px] uppercase font-bold text-slate-400 block">Registration Status</span>
                <p className="font-display text-xs font-black text-white">
                  <span className="text-teal-400">{camp.registeredCount || 0}</span> / {camp.capacity || 500} Free Slots
                </p>
                <span className="text-[10px] text-slate-400">100% Free · No Payment</span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister(camp)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-display text-xs font-extrabold text-navy shadow-lg shadow-teal-500/30 transition hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #02C39A 0%, #2DD4BF 100%)" }}
              >
                <span>Register for Free Camp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Camp Registration Modal */}
      {modalOpen && camp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-teal-50/70">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                  <Stethoscope className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-navy">
                    Free Health Camp Registration
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">{camp.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {registeredSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-black text-navy">
                    Registration Confirmed!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your token has been registered in the camp roster. Please show your Health ID at the reception desk.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Camp Token ID</span>
                    <span className="font-mono font-bold text-teal-800">{registeredSuccess.id}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Attendee Name</span>
                    <span className="font-bold text-navy">{registeredSuccess.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">G1 Health ID</span>
                    <span className="font-mono font-bold text-navy">{registeredSuccess.healthId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Venue</span>
                    <span className="font-medium text-navy truncate">{camp.venue}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-navy/90"
                >
                  Close & Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="p-6 space-y-4">
                {/* Camp Quick Info */}
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-teal-600" />
                    <strong>Schedule:</strong> {camp.startDate} to {camp.endDate} ({camp.timings})
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" />
                    <strong>Venue:</strong> {camp.venue}, {camp.city}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    100% Free Consultation, ECG & Tests under Camp CSR
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Patient / Attendee Full Name *
                    </label>
                    <input
                      type="text"
                      value={attendeeForm.name}
                      onChange={(e) => setAttendeeForm({ ...attendeeForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={attendeeForm.phone}
                        onChange={(e) => setAttendeeForm({ ...attendeeForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        G1 Health ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={attendeeForm.healthId}
                        onChange={(e) => setAttendeeForm({ ...attendeeForm, healthId: e.target.value })}
                        placeholder="e.g. G1-849201"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Current Health Concern / Symptoms
                    </label>
                    <textarea
                      rows={2}
                      value={attendeeForm.notes}
                      onChange={(e) => setAttendeeForm({ ...attendeeForm, notes: e.target.value })}
                      placeholder="e.g. Need blood sugar check and blood pressure evaluation..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-navy focus:border-teal-600 focus:outline-hidden"
                    />
                  </div>

                  {/* New user checkbox */}
                  <label className="flex items-start gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendeeForm.isNewUser}
                      onChange={(e) => setAttendeeForm({ ...attendeeForm, isNewUser: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-[11px] text-slate-600 leading-tight">
                      <strong>New to G1 Healthcare?</strong> Check this box to generate a new G1 Digital Health ID at the camp desk.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 rounded-full border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-teal-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition"
                  >
                    Confirm Camp Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
