// src/views/AmbulancePage.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Ambulance,
  Phone,
  Clock,
  ShieldCheck,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Radio,
  Navigation,
  FileText,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";
import { healthStore } from "../utils/healthStore";
import { useAuth } from "../context/AuthContext";

export default function AmbulancePage() {
  const { user } = useAuth();
  const [ambulances, setAmbulances] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    patientName: "",
    phone: "",
    pickupAddress: "",
    destinationHospital: "",
    emergencyType: "",
  });
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const loadAmbulances = () => {
    setAmbulances(healthStore.getAmbulances());
  };

  useEffect(() => {
    loadAmbulances();
    const handleUpdate = () => loadAmbulances();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  useEffect(() => {
    if (user) {
      const p = healthStore.getPatient(user);
      setBookingForm((prev) => ({
        ...prev,
        patientName: p?.name || user?.name || "",
        phone: p?.phone || user?.phone || "",
        pickupAddress: p?.address || "",
      }));
    }
  }, [user]);

  const categories = ["All", "ICU on Wheels", "Basic Life Support", "Neonatal & Pediatric ICU", "Patient Van"];

  const filteredAmbulances = ambulances.filter((a) => {
    if (selectedCategory === "All") return true;
    return a.category === selectedCategory;
  });

  const handleOpenBooking = (amb) => {
    setSelectedAmbulance(amb);
    setConfirmedBooking(null);
    setBookingForm((prev) => ({
      ...prev,
      destinationHospital: amb.hospitalAffiliation,
    }));
    setIsModalOpen(true);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!bookingForm.patientName || !bookingForm.phone || !bookingForm.pickupAddress) {
      alert("Please provide patient name, emergency phone, and pickup location.");
      return;
    }

    const booking = healthStore.bookAmbulance({
      ambulanceId: selectedAmbulance.id,
      vehicleNumber: selectedAmbulance.vehicleNumber,
      hospitalAffiliation: selectedAmbulance.hospitalAffiliation,
      specialty: selectedAmbulance.specialty,
      patientName: bookingForm.patientName,
      phone: bookingForm.phone,
      pickupAddress: bookingForm.pickupAddress,
      destinationHospital: bookingForm.destinationHospital || selectedAmbulance.hospitalAffiliation,
      emergencyType: bookingForm.emergencyType || "Acute Medical Emergency",
      driverName: selectedAmbulance.driverName,
      driverPhone: selectedAmbulance.driverPhone,
    });

    setConfirmedBooking(booking);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-cream/40">
      {/* Emergency Top Banner */}
      <section className="bg-red-600 text-white py-3 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
            <span>24x7 Critical Medical Emergency Hotlines: National Ambulance <strong>108 / 102</strong></span>
          </div>
          <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full font-bold">
            Average City Response: 12 - 18 Minutes
          </span>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy text-white py-12 sm:py-16 px-4 sm:px-6 border-b border-line">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-red-300">
            <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            G1 Emergency Fleet Network
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
            24x7 Ambulance & ICU on Wheels <br />
            <span className="text-teal-400">Hospital-Affiliated Emergency Response</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Directly connected to premier multispecialty hospitals. Equipped with ventilators, defibrillators, oxygen support, and certified trauma paramedics.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-navy text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-[11px] font-bold text-slate-400 ml-auto shrink-0 hidden md:block">
            {filteredAmbulances.length} Active Emergency Units Available
          </span>
        </div>
      </section>

      {/* Fleet Listing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {filteredAmbulances.map((amb) => (
            <div
              key={amb.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-extrabold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    {amb.status}
                  </span>
                  <span className="font-mono text-xs font-black bg-slate-100 text-navy px-2.5 py-1 rounded-lg border border-slate-200">
                    {amb.vehicleNumber}
                  </span>
                </div>

                {/* Hospital Affiliation & Specialty */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                    <Building2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>{amb.hospitalAffiliation}</span>
                  </div>
                  <h3 className="font-display text-lg font-black text-navy mt-1">
                    {amb.specialty}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" /> {amb.baseLocation}
                  </p>
                </div>

                {/* Equipment On Board */}
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Medical Equipment On-Board:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {amb.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-teal-50 border border-teal-100 px-2 py-0.5 text-[10.5px] font-semibold text-teal-900"
                      >
                        ✓ {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Driver & Response Time Details */}
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Crew On Duty</span>
                    <p className="font-bold text-navy truncate">{amb.driverName}</p>
                    <p className="text-[10px] text-slate-500">{amb.crewOnBoard}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Est. Dispatch Time</span>
                    <p className="font-bold text-emerald-700 flex items-center justify-end gap-1">
                      <Clock className="h-3.5 w-3.5" /> {amb.avgResponseTime}
                    </p>
                    <p className="text-[10px] text-slate-500">Base ₹{amb.baseCharge} + ₹{amb.perKmCharge}/km</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
                <a
                  href={`tel:${amb.emergencyPhone}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-red-300 bg-red-50 hover:bg-red-100 py-2.5 text-xs font-bold text-red-700 transition"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Driver ({amb.driverPhone})
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(amb)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-extrabold text-white shadow-md hover:opacity-95 transition cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                >
                  <Ambulance className="h-3.5 w-3.5" /> Book Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Dispatch Modal */}
      {isModalOpen && selectedAmbulance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/80">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                  <Ambulance className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-navy">
                    Dispatch Ambulance Request
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Vehicle {selectedAmbulance.vehicleNumber} · {selectedAmbulance.hospitalAffiliation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {confirmedBooking ? (
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-black text-navy">
                    Ambulance Dispatched!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your request has been routed to the hospital emergency bay. Driver is rolling out.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Request ID</span>
                    <span className="font-mono font-bold text-teal-800">{confirmedBooking.id}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Vehicle Number</span>
                    <span className="font-mono font-bold text-navy">{confirmedBooking.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Hospital</span>
                    <span className="font-bold text-navy truncate">{confirmedBooking.hospitalAffiliation}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Pickup Address</span>
                    <span className="font-medium text-navy truncate">{confirmedBooking.pickupAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver Contact</span>
                    <span className="font-bold text-red-600">{confirmedBooking.driverPhone}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3 justify-center">
                  <a
                    href={`tel:${confirmedBooking.driverPhone}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-600 text-white px-5 py-2 text-xs font-bold shadow hover:bg-red-700"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call Driver Now
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full bg-navy px-5 py-2 text-xs font-bold text-white shadow hover:bg-navy/90"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                <div className="rounded-2xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Keep the patient calm and in a safe position. Do not offer food or oral liquids in acute trauma or unconsciousness.
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.patientName}
                      onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-red-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Emergency Contact Phone *
                      </label>
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-red-600 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nature of Emergency
                      </label>
                      <input
                        type="text"
                        value={bookingForm.emergencyType}
                        onChange={(e) => setBookingForm({ ...bookingForm, emergencyType: e.target.value })}
                        placeholder="e.g. Chest pain, Stroke, Road accident"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-red-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Exact Pickup Location / Address *
                    </label>
                    <textarea
                      rows={2}
                      value={bookingForm.pickupAddress}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupAddress: e.target.value })}
                      placeholder="e.g. Flat 302, Green Valley Enclave, Near Ring Road, Ahmedabad..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-red-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Preferred Destination Hospital
                    </label>
                    <input
                      type="text"
                      value={bookingForm.destinationHospital}
                      onChange={(e) => setBookingForm({ ...bookingForm, destinationHospital: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-full border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition"
                  >
                    Confirm & Dispatch Ambulance
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
