// src/views/ProfilePage.jsx
"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  ShieldCheck,
  Edit3,
  IdCard,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  Camera,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { healthStore } from "../utils/healthStore";
import G1DigitalHealthCard from "../components/health-card/G1DigitalHealthCard";
import { Link } from "../utils/navigation";

export default function ProfilePage() {
  const { user, updateProfilePhoto } = useAuth();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("card"); // 'card' | 'bookings' | 'labtests'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [bookings, setBookings] = useState([]);
  const [labInquiries, setLabInquiries] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoStorageNotice, setPhotoStorageNotice] = useState("");

  const refreshData = () => {
    const p = healthStore.getPatient(user);
    setPatient(p);
    setEditForm(p);
    setBookings(healthStore.getBookings());
    setLabInquiries(healthStore.getLabInquiries());
  };

  useEffect(() => {
    refreshData();
    const onStoreUpdate = () => refreshData();
    window.addEventListener("g1-store-update", onStoreUpdate);
    return () => window.removeEventListener("g1-store-update", onStoreUpdate);
  }, [user]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoStorageNotice("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "photos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload photo");
      }

      setEditForm((prev) => ({ ...prev, photo: data.url }));

      // Immediately persist to central healthStore and user state
      const updated = healthStore.updatePatient({ photo: data.url });
      setPatient(updated);
      if (typeof updateProfilePhoto === "function") {
        updateProfilePhoto(data.url);
      }

      setPhotoStorageNotice(
        data.storage === "mongodb_gridfs"
          ? "✓ Stored in MongoDB GridFS & Saved"
          : "✓ Photo saved to profile"
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = healthStore.updatePatient(editForm);
    setPatient(updated);
    if (typeof updateProfilePhoto === "function" && editForm.photo) {
      updateProfilePhoto(editForm.photo);
    }
    setEditModalOpen(false);
  };

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Profile Summary Bar */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative">
                <img
                  src={patient.photo}
                  alt={patient.name}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-teal-500/20 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white shadow">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-display text-2xl font-black text-navy">{patient.name}</h1>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-700 flex items-center gap-1">
                    <Droplet className="h-3 w-3 fill-current" /> {patient.bloodGroup}
                  </span>
                </div>
                <p className="font-mono text-sm font-bold text-teal-700 tracking-wide">
                  Healthcare ID: {patient.healthId}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-teal-600" /> {patient.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-teal-600" /> {patient.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" /> {patient.age} Yrs · {patient.gender}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-navy shadow-xs hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <Edit3 className="h-3.5 w-3.5 text-teal-600" /> Edit Profile
              </button>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-navy/90 transition"
              >
                Find Healthcare Providers
              </Link>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="mt-8 flex gap-2 border-t border-slate-100 pt-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition ${
                activeTab === "card"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <IdCard className="h-3.5 w-3.5" /> G1 Digital Health Card
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition ${
                activeTab === "bookings"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Bookings & Consultations ({bookings.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("labtests")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition ${
                activeTab === "labtests"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Lab Test Inquiries ({labInquiries.length})
            </button>
          </div>
        </div>

        {/* Tab 1: G1 Digital Health Card */}
        {activeTab === "card" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" /> Verified Health Card Details
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    Live Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-slate-50 p-3.5">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Blood Group</span>
                    <p className="mt-1 font-display text-base font-black text-red-600">{patient.bloodGroup}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3.5">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Age & DOB</span>
                    <p className="mt-1 font-display text-base font-black text-navy">{patient.age} Yrs ({patient.dob})</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3.5 col-span-2">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Emergency Contact</span>
                    <p className="mt-1 font-semibold text-navy">{patient.emergencyContact}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3.5 col-span-2">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Residential Address</span>
                    <p className="mt-1 font-medium text-slate-700">{patient.address}</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 col-span-2">
                    <span className="font-bold text-amber-800 uppercase text-[10px]">Documented Allergies</span>
                    <p className="mt-1 font-semibold text-amber-900">{patient.allergies || "None reported"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Card Preview Column */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-3">
                <G1DigitalHealthCard patient={patient} showActions={true} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bookings & Consultations */}
        {activeTab === "bookings" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-display text-lg font-bold text-navy">Consultations & Packages Bookings</h3>
                <p className="text-xs text-slate-500">
                  Track your booked packages, dynamic diagnostic answers, and payment status.
                </p>
              </div>
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" /> Book New Service
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {bookings.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No bookings found yet. Explore services to book a package.
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:bg-white hover:shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-teal-700">{b.id}</span>
                        <h4 className="font-display text-base font-bold text-navy">{b.serviceTitle}</h4>
                        <p className="text-xs text-slate-500 font-medium">{b.packageTitle}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between">
                        <span className="font-display text-base font-black text-navy">₹{b.amount}</span>
                        <span
                          className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            b.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.paymentStatus === "PAID" ? "Paid & Confirmed" : "Lead Captured (Pending Follow-up)"}
                        </span>
                      </div>
                    </div>

                    {/* Diagnostic Summary */}
                    {b.diagnosticResponses && b.diagnosticResponses.length > 0 && (
                      <div className="mt-3.5 rounded-xl bg-white p-3 border border-slate-200/80">
                        <span className="text-[11px] font-bold uppercase text-slate-500">
                          Diagnostic Questionnaire Responses
                        </span>
                        <div className="mt-2 space-y-1.5 text-xs">
                          {b.diagnosticResponses.map((r, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="font-medium text-slate-600">{r.question}</span>
                              <span className="font-bold text-navy sm:text-right">{r.answer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Lab Test Inquiries */}
        {activeTab === "labtests" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-display text-lg font-bold text-navy">Home Sample Collection & Lab Tests</h3>
                <p className="text-xs text-slate-500">
                  Phlebotomist schedule, test processing, and digital report status.
                </p>
              </div>
              <Link
                to="/lab-tests"
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" /> Book Lab Test
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {labInquiries.map((inq) => (
                <div key={inq.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-teal-700">{inq.id}</span>
                      <h4 className="font-display text-base font-bold text-navy">{inq.testTitle}</h4>
                      <p className="text-xs text-slate-500">Scheduled: {inq.date} · {inq.slot}</p>
                      <p className="text-xs text-slate-500">Address: {inq.address}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-base font-black text-navy">₹{inq.amount}</span>
                      <div className="mt-1">
                        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mt-1">
                        Phlebotomist: <span className="font-bold text-navy">{inq.assignedStaff}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">Edit G1 Health Card Details</h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-3.5 text-xs">
              {/* Photo Upload via MongoDB GridFS */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={editForm.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                    alt="Patient Preview"
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-teal-500/30"
                  />
                  {uploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-navy/60 text-white">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Camera className="h-3.5 w-3.5 text-teal-600" /> Patient Photo (MongoDB GridFS)
                    </span>
                    {photoStorageNotice && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {photoStorageNotice}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload high-res profile photo stored directly in MongoDB GridFS chunks.
                  </p>
                  <label className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-navy shadow-2xs hover:bg-slate-50 cursor-pointer">
                    <UploadCloud className="h-3.5 w-3.5 text-teal-600" />
                    <span>{uploadingPhoto ? "Uploading to GridFS..." : "Select New Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingPhoto}
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Patient Full Name</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Blood Group</label>
                  <select
                    value={editForm.bloodGroup || "O+"}
                    onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Age</label>
                  <input
                    type="number"
                    value={editForm.age || ""}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Gender</label>
                  <select
                    value={editForm.gender || "Female"}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Emergency Contact</label>
                <input
                  type="text"
                  value={editForm.emergencyContact || ""}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                  placeholder="Name (Phone - Relation)"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Residential Address</label>
                <textarea
                  rows={2}
                  value={editForm.address || ""}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-teal-600 px-6 py-2 font-bold text-white shadow-md hover:bg-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
