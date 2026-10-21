// src/components/admin/AdminCampsSection.jsx
"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit,
  Users,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { healthStore } from "../../utils/healthStore";

export default function AdminCampsSection() {
  const [camps, setCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null); // For viewing attendees
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    specialty: "Free Multi-Specialty Health Camp",
    venue: "Community Health Center",
    city: "Ahmedabad",
    startDate: "2026-11-01",
    endDate: "2026-11-03",
    timing: "9:00 AM - 4:00 PM",
    organizer: "G1 Health Foundation & Red Cross",
    maxCapacity: 300,
    doctorsInput: "Dr. Arvind Mehta, Dr. Priya Shah",
    servicesInput: "BP & Sugar Screening, ECG, Eye Checkup, Free Generic Medicines, Doctor Consultation",
  });

  const loadCamps = () => {
    setCamps(healthStore.getCamps());
    if (selectedCamp) {
      const refreshed = healthStore.getCamps().find((c) => c.id === selectedCamp.id);
      setSelectedCamp(refreshed || null);
    }
  };

  useEffect(() => {
    loadCamps();
    const handleUpdate = () => loadCamps();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAdd = () => {
    setFormData({
      id: "",
      title: "Mega Free Cardiac & Diabetes Health Camp",
      specialty: "Cardiology & General Medicine",
      venue: "Shree Ram Hall, Paldi",
      city: "Ahmedabad",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
      timing: "9:00 AM - 3:00 PM Daily",
      organizer: "G1 Healthcare Foundation & Apollo Hospitals",
      maxCapacity: 250,
      doctorsInput: "Dr. Arvind Mehta (Cardiologist), Dr. Neha Joshi (Physician)",
      servicesInput: "Free 12-Lead ECG, Blood Sugar & HbA1c, Consultation, Free 7-Day Medicines",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setFormData({
      id: c.id,
      title: c.title || "",
      specialty: c.specialty || "",
      venue: c.venue || "",
      city: c.city || "Ahmedabad",
      startDate: c.startDate || "",
      endDate: c.endDate || "",
      timing: c.timing || "9:00 AM - 4:00 PM",
      organizer: c.organizer || "G1 Healthcare",
      maxCapacity: c.maxCapacity || 200,
      doctorsInput: Array.isArray(c.doctorsPresent) ? c.doctorsPresent.join(", ") : "",
      servicesInput: Array.isArray(c.servicesOffered) ? c.servicesOffered.join(", ") : "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.venue.trim()) {
      alert("Please provide camp title and venue.");
      return;
    }

    const payload = {
      id: formData.id || `camp-${Date.now()}`,
      title: formData.title.trim(),
      specialty: formData.specialty.trim(),
      venue: formData.venue.trim(),
      city: formData.city.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      timing: formData.timing.trim(),
      organizer: formData.organizer.trim(),
      maxCapacity: Number(formData.maxCapacity) || 200,
      doctorsPresent: formData.doctorsInput
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      servicesOffered: formData.servicesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    healthStore.saveCamp(payload);
    setIsModalOpen(false);
    showToast(`Health camp "${payload.title}" saved!`);
  };

  const handleDelete = (c) => {
    if (confirm(`Delete camp "${c.title}"?`)) {
      healthStore.deleteCamp(c.id);
      showToast(`Removed "${c.title}"`);
      if (selectedCamp?.id === c.id) setSelectedCamp(null);
    }
  };

  const handleToggleAttendance = (campId, attendeeIndex) => {
    const allCamps = healthStore.getCamps();
    const camp = allCamps.find((c) => c.id === campId);
    if (!camp || !camp.attendees || !camp.attendees[attendeeIndex]) return;

    const currentStatus = camp.attendees[attendeeIndex].attendanceStatus || "Registered";
    camp.attendees[attendeeIndex].attendanceStatus =
      currentStatus === "Attended" ? "Registered" : "Attended";

    healthStore.saveCamp(camp);
    showToast("Attendee status updated!");
  };

  const now = new Date();

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-navy px-5 py-3 text-xs font-bold text-white shadow-xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-navy">
                Community Health Camps Management
              </h1>
              <p className="text-xs text-slate-500">
                Scheduled camps automatically appear below the Home Hero section & in Patient Profiles until the end date passes.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 transition"
        >
          <Plus className="h-4 w-4" /> Schedule New Health Camp
        </button>
      </div>

      {/* Camps Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {camps.map((c) => {
          const end = new Date(c.endDate);
          end.setHours(23, 59, 59, 999);
          const isExpired = end < now;
          const attendeeCount = c.attendees?.length || 0;
          const newRegistrationsCount =
            c.attendees?.filter((a) => a.isNewRegistration)?.length || 0;
          const attendedCount =
            c.attendees?.filter((a) => a.attendanceStatus === "Attended")?.length || 0;

          return (
            <div
              key={c.id}
              className={`rounded-3xl border bg-white p-6 shadow-xs space-y-4 transition ${
                isExpired ? "border-slate-200 opacity-75" : "border-teal-200 ring-1 ring-teal-400/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isExpired
                          ? "bg-slate-100 text-slate-600"
                          : "bg-emerald-100 text-emerald-800 animate-pulse"
                      }`}
                    >
                      {isExpired ? "Ended / Archived" : "Active Camp Banner Live"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ID: {c.id}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-navy">{c.title}</h3>
                  <p className="text-xs text-teal-700 font-semibold">{c.specialty}</p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="rounded-full p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition"
                    title="Edit Camp"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete Camp"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Venue & Date */}
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs space-y-1.5">
                <p className="text-slate-700 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold">{c.venue}</span>, {c.city}
                </p>
                <p className="text-slate-600 flex items-center gap-1.5 font-mono text-[11px]">
                  <CalendarDays className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  {c.startDate} to {c.endDate} · {c.timing}
                </p>
                <p className="text-slate-500 text-[11px]">Organizer: {c.organizer}</p>
              </div>

              {/* Services Offered */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Free Services Offered
                </span>
                <div className="flex flex-wrap gap-1">
                  {c.servicesOffered?.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attendees & Registration Analytics Bar */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <div>
                  <span className="font-bold text-navy text-sm">
                    {attendeeCount} / {c.maxCapacity}
                  </span>{" "}
                  <span className="text-slate-500 text-[11px]">Registered Attendees</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                    <span className="text-emerald-700 font-bold">
                      {attendedCount} Attended
                    </span>
                    <span>•</span>
                    <span className="text-purple-700 font-bold">
                      {newRegistrationsCount} New Signups from Camp
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCamp(c)}
                  className="rounded-full bg-navy px-4 py-1.5 text-xs font-bold text-white hover:bg-navy/90 transition"
                >
                  Inspect Roster ({attendeeCount})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ATTENDEE ROSTER DRAWER / MODAL */}
      {selectedCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700">{selectedCamp.id}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Camp Attendees & New Registrations Tracking
                </h3>
                <p className="text-xs text-slate-500">{selectedCamp.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCamp(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-teal-50 p-3 text-center border border-teal-100">
                <span className="text-[10px] uppercase font-bold text-teal-700">Total Registered</span>
                <p className="font-display text-xl font-black text-teal-900 mt-1">
                  {selectedCamp.attendees?.length || 0}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-center border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Verified Attended</span>
                <p className="font-display text-xl font-black text-emerald-900 mt-1">
                  {selectedCamp.attendees?.filter((a) => a.attendanceStatus === "Attended")?.length || 0}
                </p>
              </div>
              <div className="rounded-2xl bg-purple-50 p-3 text-center border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-purple-700">New Patients Added</span>
                <p className="font-display text-xl font-black text-purple-900 mt-1">
                  {selectedCamp.attendees?.filter((a) => a.isNewRegistration)?.length || 0}
                </p>
              </div>
            </div>

            {/* Attendees Table */}
            {(!selectedCamp.attendees || selectedCamp.attendees.length === 0) ? (
              <div className="p-8 text-center text-slate-400">
                <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-xs">No patients registered for this camp yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Attendee Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Health ID / Tag</th>
                      <th className="p-3">Registered At</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedCamp.attendees.map((att, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-bold text-navy">{att.name}</p>
                          {att.isNewRegistration && (
                            <span className="inline-block rounded-sm bg-purple-100 px-1.5 py-0.2 text-[9px] font-bold text-purple-800">
                              ★ New Patient from Camp
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-700">{att.phone}</td>
                        <td className="p-3 font-mono text-[11px] text-teal-700">
                          {att.healthId || "Camp Walk-in"}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px] font-mono">
                          {att.registeredAt
                            ? new Date(att.registeredAt).toLocaleDateString("en-IN")
                            : "N/A"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              att.attendanceStatus === "Attended"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {att.attendanceStatus || "Registered"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(selectedCamp.id, idx)}
                            className={`rounded-full px-3 py-1 font-bold text-[11px] transition ${
                              att.attendanceStatus === "Attended"
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {att.attendanceStatus === "Attended" ? "Mark Absent" : "Mark Attended ✓"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT CAMP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">
                {formData.id ? "Edit Health Camp" : "Schedule New Health Camp"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Camp Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Free Mega Cardiac & Diabetes Screening Camp"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Cardiology & General Medicine"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Max Attendee Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    placeholder="300"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Town Hall / Primary Health Center"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ahmedabad"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">End Date (Auto-Expires)</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Daily Timing</label>
                  <input
                    type="text"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    placeholder="9:00 AM - 4:00 PM"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Organizer / Partners</label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="G1 Health Foundation & Red Cross"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Doctors Present (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.doctorsInput}
                  onChange={(e) => setFormData({ ...formData, doctorsInput: e.target.value })}
                  placeholder="Dr. Arvind Mehta, Dr. Priya Shah"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Services Offered (Comma Separated)</label>
                <textarea
                  rows={2}
                  value={formData.servicesInput}
                  onChange={(e) => setFormData({ ...formData, servicesInput: e.target.value })}
                  placeholder="Free ECG, Blood Sugar, Eye Exam, Free Medicines"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-teal-600 px-6 py-2 font-bold text-white shadow hover:bg-teal-700"
                >
                  Save Health Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
