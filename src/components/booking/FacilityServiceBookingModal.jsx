// src/components/booking/FacilityServiceBookingModal.jsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Star,
  User,
  Phone,
  FileText,
  Accessibility,
  HeartPulse,
  Loader2,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import { healthStore } from "../../utils/healthStore";
import { useAuth } from "../../context/AuthContext";

const DEPARTMENTS = [
  "Outpatient Department (OPD)",
  "Cardiology & Echo Checkup",
  "Radiology & Diagnostic Imaging",
  "Orthopedics & Joint Care",
  "Pediatric & Child Wellness",
  "General Surgery & Day Care",
  "Comprehensive Health Checkup",
];

const TIME_WINDOWS = [
  "Morning (09:00 AM – 12:00 PM)",
  "Afternoon (12:00 PM – 04:00 PM)",
  "Evening (04:00 PM – 08:00 PM)",
];

export default function FacilityServiceBookingModal({ facility, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [patient, setPatient] = useState({
    name: "",
    phone: "",
    age: "32",
    bloodGroup: "O+",
    healthId: "G1-849201",
  });
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(TIME_WINDOWS[0]);
  const [assistance, setAssistance] = useState({
    wheelchair: false,
    priority: false,
    seniorCitizen: false,
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      const p = healthStore.getPatient(user);
      setPatient({
        name: p?.name || user?.name || "Dr. Ananya Sharma",
        phone: p?.phone || user?.phone || "+91 98765 43210",
        age: p?.age || "32",
        bloodGroup: p?.bloodGroup || "O+",
        healthId: p?.healthId || user?.healthId || "G1-849201",
      });
      setConfirmedBooking(null);
      setNotes("");
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (confirmedBooking) {
      QRCode.toDataURL(`https://g1healthcare.in/hospital-pass/${confirmedBooking.id}`, {
        width: 160,
        margin: 1,
        color: { dark: "#0b2545", light: "#ffffff" },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [confirmedBooking]);

  if (!isOpen || !facility) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient.name || !patient.phone) {
      alert("Please provide patient name and phone number");
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      bookingType: "FACILITY_SERVICE",
      facilityName: facility.name,
      facilityType: facility.type || "Hospital",
      facilityAddress: facility.address || facility.city,
      facilityImage: facility.image,
      department: selectedDepartment,
      visitDate: selectedDate,
      timeWindow: selectedTimeWindow,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientAge: patient.age,
      patientBloodGroup: patient.bloodGroup,
      patientHealthId: patient.healthId,
      specialAssistance: Object.entries(assistance)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(", ") || "None",
      notes: notes || "General visit & consultation",
      amount: 0,
      paymentStatus: "CONFIRMED_AT_DESK",
      status: "Confirmed (Desk Pass Issued)",
    };

    setTimeout(() => {
      const saved = healthStore.addBooking(bookingPayload);
      setIsSubmitting(false);
      setConfirmedBooking(saved);

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}

      if (onSuccess) onSuccess(saved);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-dark">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-extrabold text-navy">
                Book Hospital / Facility Appointment
              </h3>
              <p className="text-[11px] font-semibold text-slate-500">
                Direct OPD & Care Registration · Skip Front-Desk Paperwork
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-navy transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {!confirmedBooking ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Facility Info Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-500/20 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-teal-800">
                      {facility.type || "Hospital"}
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {facility.rating || "4.8"}
                    </span>
                  </div>
                  <h4 className="font-display text-[15px] font-extrabold text-navy mt-0.5">{facility.name}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" /> {facility.address || facility.city}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                  ✓ Priority Desk Access
                </span>
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Department / Care Specialty
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-teal-brand focus:outline-hidden"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Window */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  <Calendar className="inline h-3.5 w-3.5 mr-1 text-teal-600" /> Preferred Visit Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-teal-brand focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  <Clock className="inline h-3.5 w-3.5 mr-1 text-teal-600" /> Preferred Arrival Window
                </label>
                <select
                  value={selectedTimeWindow}
                  onChange={(e) => setSelectedTimeWindow(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-teal-brand focus:outline-hidden"
                >
                  {TIME_WINDOWS.map((win) => (
                    <option key={win} value={win}>
                      {win}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Details */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-navy flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-teal-600" /> Patient Details (G1 Health Card)
                </span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-800">
                  {patient.healthId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Name</label>
                  <input
                    type="text"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    className="w-full mt-0.5 rounded-lg border border-slate-200 bg-white p-2 font-bold text-navy"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Phone</label>
                  <input
                    type="text"
                    value={patient.phone}
                    onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                    className="w-full mt-0.5 rounded-lg border border-slate-200 bg-white p-2 font-bold text-navy"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Age</label>
                  <input
                    type="text"
                    value={patient.age}
                    onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                    className="w-full mt-0.5 rounded-lg border border-slate-200 bg-white p-2 font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Blood Group</label>
                  <input
                    type="text"
                    value={patient.bloodGroup}
                    onChange={(e) => setPatient({ ...patient, bloodGroup: e.target.value })}
                    className="w-full mt-0.5 rounded-lg border border-slate-200 bg-white p-2 font-bold text-navy"
                  />
                </div>
              </div>
            </div>

            {/* Special Assistance Requirements */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Special Assistance Required
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={assistance.wheelchair}
                    onChange={(e) => setAssistance({ ...assistance, wheelchair: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700">Wheelchair Assistance</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={assistance.priority}
                    onChange={(e) => setAssistance({ ...assistance, priority: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700">Priority Admission Desk</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={assistance.seniorCitizen}
                    onChange={(e) => setAssistance({ ...assistance, seniorCitizen: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-700">Senior Citizen Escort</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Additional Notes / Past Hospital Registration ID (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any ongoing treatments or previous UHID numbers..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-navy focus:border-teal-brand focus:outline-hidden"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-full font-display text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:opacity-95 flex items-center justify-center gap-2 bg-navy"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Issuing Digital Hospital Pass...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Generate G1 Hospital Fast-Pass
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Pass */
          <div className="p-6 text-center space-y-4">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-7 w-7" />
            </span>

            <h3 className="font-display text-xl font-extrabold text-navy">
              Hospital Fast-Pass Generated!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your appointment at <strong className="text-navy">{confirmedBooking.facilityName}</strong> has been logged.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 max-w-md mx-auto text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booking Pass ID</span>
                  <p className="font-mono text-base font-black text-navy">{confirmedBooking.id}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Department</span>
                  <p className="font-bold text-navy">{confirmedBooking.department}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Date & Window</span>
                  <p className="font-bold text-navy">{confirmedBooking.visitDate}</p>
                  <p className="text-[10px] text-slate-500">{confirmedBooking.timeWindow}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Patient Name</span>
                  <p className="font-bold text-navy">{confirmedBooking.patientName} ({confirmedBooking.patientHealthId})</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Special Assistance</span>
                  <p className="font-bold text-teal-800">{confirmedBooking.specialAssistance}</p>
                </div>
              </div>

              {qrCodeDataUrl && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <div className="text-[11px] text-slate-500">
                    <p className="font-bold text-navy">Hospital Fast-Pass QR</p>
                    <p>Show at G1 Priority Counter</p>
                  </div>
                  <img src={qrCodeDataUrl} alt="Token QR" className="h-16 w-16 rounded-lg bg-white p-1 border" />
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-navy/90"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
