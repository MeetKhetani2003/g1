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
  Building2,
  Stethoscope,
  HeartHandshake,
  Pill,
  Printer,
  ArrowRight,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { healthStore } from "../utils/healthStore";
import G1DigitalHealthCard from "../components/health-card/G1DigitalHealthCard";
import { Link } from "../utils/navigation";

export default function ProfilePage() {
  const { user, updateProfilePhoto } = useAuth();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("card"); // 'card' | 'schemes' | 'insurance' | 'prescriptions' | 'bookings' | 'labtests' | 'nearby' | 'camps'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [bookings, setBookings] = useState([]);
  const [labInquiries, setLabInquiries] = useState([]);
  const [camps, setCamps] = useState([]);
  const [providers, setProviders] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState("All");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoStorageNotice, setPhotoStorageNotice] = useState("");

  const refreshData = () => {
    const p = healthStore.getPatient(user);
    setPatient(p);
    setEditForm(p);
    setBookings(healthStore.getBookings());
    setLabInquiries(healthStore.getLabInquiries());
    setCamps(healthStore.getActiveCamps());
    setProviders(healthStore.getProviders());
    setDoctors(healthStore.getDoctors());
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
          <div className="mt-8 flex gap-2 border-t border-slate-100 pt-4 overflow-x-auto scrollbar-none pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "card"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <IdCard className="h-3.5 w-3.5" /> G1 Health Card
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("schemes")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "schemes"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" /> Govt Schemes ({patient?.governmentSchemes?.length || 0})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("insurance")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "insurance"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <HeartHandshake className="h-3.5 w-3.5" /> Insurance ({patient?.insurancePolicies?.length || 0})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("prescriptions")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "prescriptions"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Pill className="h-3.5 w-3.5" /> Prescriptions ({patient?.consultationHistory?.length || 0})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("nearby")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "nearby"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" /> Nearby Care ({patient?.city || "Ahmedabad"})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Bookings ({bookings.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("labtests")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "labtests"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Lab Tests ({labInquiries.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("camps")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "camps"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-teal-700 bg-teal-50 hover:bg-teal-100"
              }`}
            >
              <Heart className="h-3.5 w-3.5" /> Free Camps ({camps.length})
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

        {/* Tab: Government Healthcare Schemes */}
        {activeTab === "schemes" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-teal-100 px-3 py-0.5 text-xs font-black uppercase text-teal-800">
                      National & State Empanelled
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {(patient?.governmentSchemes || []).length} Active Coverages
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-black text-navy mt-1">
                    Eligible Government Healthcare Schemes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Linked to G1 Digital Health ID <strong className="text-navy">{patient?.healthId}</strong>. Present this digital pass at hospital TPA desk for cashless admission.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="h-4 w-4" /> 100% Cashless Empanelled
                  </span>
                </div>
              </div>

              {/* Schemes Cards Grid */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {(patient?.governmentSchemes || []).map((scheme) => (
                  <div
                    key={scheme.id}
                    className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-navy text-white px-3 py-1 font-mono text-xs font-extrabold uppercase">
                          {scheme.schemeName}
                        </span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-black">
                          {scheme.status || "Active & Verified"}
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white border border-slate-200 p-3.5 space-y-1.5 text-xs shadow-2xs">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-500">Card / Golden ID:</span>
                          <span className="font-mono font-bold text-teal-800">{scheme.cardNo}</span>
                        </div>
                        {scheme.familyId && (
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-500">Family / Ration Token:</span>
                            <span className="font-mono font-bold text-navy">{scheme.familyId}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-500">Annual Cashless Limit:</span>
                          <span className="font-display font-black text-emerald-700 text-sm">{scheme.coverageAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Validity:</span>
                          <span className="font-semibold text-slate-700">{scheme.validTill || "Lifetime / Annual Renewal"}</span>
                        </div>
                      </div>

                      {/* Covered Treatments */}
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                          Covered Treatments & Procedures:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(scheme.treatmentsCovered || []).map((t, i) => (
                            <span
                              key={i}
                              className="rounded-lg bg-teal-50 border border-teal-100 px-2 py-0.5 text-[10.5px] font-semibold text-teal-900"
                            >
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="text-[11px]">Empanelled with 14,000+ Hospitals</span>
                      <span className="text-emerald-700 font-bold">Admin Verified ✓</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informational Box */}
              <div className="mt-6 rounded-2xl bg-teal-50/70 border border-teal-200 p-4 text-xs text-teal-900 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong>Need to add another State or Central Scheme?</strong>
                  <p className="text-teal-800/80">
                    In Phase 1, government scheme verification and custom card mapping are administered directly by your facility or via the G1 Admin Desk. Contact hospital desk with your Aadhaar / Ration card for automatic linkage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Insurance Policies */}
        {activeTab === "insurance" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="rounded-full bg-purple-100 px-3 py-0.5 text-xs font-black uppercase text-purple-800">
                    Cashless Health Insurance
                  </span>
                  <h3 className="font-display text-xl font-black text-navy mt-1">
                    Insurance Policies & TPA Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active private and employer group health coverages linked to your patient dossier.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                    ✓ Cashless Desk Pre-Approved
                  </span>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {(patient?.insurancePolicies || []).map((ins) => (
                  <div
                    key={ins.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-base font-black text-navy">
                        {ins.provider}
                      </h4>
                      <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                        {ins.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">{ins.policyType}</p>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-500">Policy Number</span>
                        <span className="font-mono font-bold text-navy">{ins.policyNo}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-500">Sum Insured</span>
                        <span className="font-display font-black text-emerald-700 text-sm">{ins.sumInsured}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-slate-500">Assigned TPA Desk</span>
                        <span className="font-bold text-navy">{ins.tpaDesk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Valid Till</span>
                        <span className="font-semibold text-slate-700">{ins.validTill}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Instant TPA Approval</span>
                      <span className="font-bold text-teal-700">Cashless Available 24x7</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Prescriptions & Past Consultations */}
        {activeTab === "prescriptions" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="rounded-full bg-cyan-100 px-3 py-0.5 text-xs font-black uppercase text-cyan-800">
                    Medical Dossier
                  </span>
                  <h3 className="font-display text-xl font-black text-navy mt-1">
                    Past Doctor Consultations & Digital Prescriptions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Full consultation history, clinical diagnoses, and prescribed medication dosages.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {(patient?.consultationHistory || []).map((cons) => (
                  <div
                    key={cons.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                      <div className="flex items-center gap-3">
                        {cons.doctorImage ? (
                          <img
                            src={cons.doctorImage}
                            alt={cons.doctorName}
                            className="h-12 w-12 rounded-2xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 font-bold">
                            Dr
                          </div>
                        )}
                        <div>
                          <h4 className="font-display text-base font-black text-navy">{cons.doctorName}</h4>
                          <p className="text-xs text-slate-500">{cons.specialty} · {cons.hospital}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="font-mono text-xs font-bold text-teal-800">{cons.id}</span>
                        <p className="text-xs text-slate-500">{cons.date} ({cons.mode})</p>
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="rounded-2xl bg-teal-50/60 p-3.5 border border-teal-100 text-xs">
                      <span className="text-[10px] uppercase font-bold text-teal-800 block mb-0.5">
                        Clinical Diagnosis:
                      </span>
                      <strong className="text-navy text-sm font-display">{cons.diagnosis}</strong>
                      {cons.doctorNotes && (
                        <p className="text-slate-600 mt-1 italic">
                          Notes: {cons.doctorNotes}
                        </p>
                      )}
                    </div>

                    {/* Medication Table */}
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                        Prescribed Medication Regimen:
                      </span>
                      <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b text-slate-500 font-bold text-[11px]">
                            <tr>
                              <th className="p-3">Medicine / Formulation</th>
                              <th className="p-3">Dosage & Frequency</th>
                              <th className="p-3">Instructions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(cons.prescription || []).map((med, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="p-3 font-bold text-navy">{med.medicine}</td>
                                <td className="p-3 font-semibold text-teal-800">{med.dosage}</td>
                                <td className="p-3 text-slate-600">{med.instructions}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Nearby Care & Disease Filter */}
        {activeTab === "nearby" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-teal-100 px-3 py-0.5 text-xs font-black uppercase text-teal-800">
                      Location Matching
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      City: {patient?.city || "Ahmedabad"}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-black text-navy mt-1">
                    Nearby Hospitals & Doctors
                  </h3>
                  <p className="text-xs text-slate-500">
                    Filtered by your residential location and target disease condition.
                  </p>
                </div>

                {/* Filter by disease */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Filter Condition:</span>
                  <select
                    value={selectedDiseaseFilter}
                    onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-navy focus:border-teal-600"
                  >
                    <option value="All">All Specialties</option>
                    <option value="Cardiology">Cardiology / Heart</option>
                    <option value="Internal Medicine">Diabetes / Internal Med</option>
                    <option value="Orthopedics">Orthopedics / Knee Joint</option>
                    <option value="Neurology">Neurology / Stroke</option>
                    <option value="Pediatrics">Pediatrics / Child Care</option>
                    <option value="Dermatology">Dermatology / Skin</option>
                  </select>
                </div>
              </div>

              {/* Nearby Hospitals */}
              <div>
                <h4 className="font-display text-base font-black text-navy mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-600" /> Nearby Hospitals & Trauma Bays
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {providers
                    .filter((p) => selectedDiseaseFilter === "All" || p.specialty?.toLowerCase().includes(selectedDiseaseFilter.toLowerCase()))
                    .slice(0, 4)
                    .map((prov) => (
                      <div key={prov.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy text-sm">{prov.name}</span>
                          <span className="text-xs font-bold text-amber-600">★ {prov.rating}</span>
                        </div>
                        <p className="text-xs text-slate-500">{prov.specialty} · {prov.address}, {prov.city}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-emerald-700 font-semibold">{prov.distance || "2.4 km away"}</span>
                          <Link to="/explore" className="text-xs font-bold text-teal-700 hover:underline">
                            View Facility →
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Nearby Doctors */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-display text-base font-black text-navy mb-3 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-teal-600" /> Specialist Doctors Nearby
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {doctors
                    .filter((d) => selectedDiseaseFilter === "All" || d.department?.toLowerCase().includes(selectedDiseaseFilter.toLowerCase()) || d.specialty?.toLowerCase().includes(selectedDiseaseFilter.toLowerCase()))
                    .slice(0, 3)
                    .map((doc) => (
                      <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <img src={doc.image} alt={doc.name} className="h-12 w-12 rounded-xl object-cover" />
                          <div>
                            <strong className="text-navy text-xs block">{doc.name}</strong>
                            <span className="text-[10.5px] text-slate-500">{doc.department}</span>
                            <span className="text-[10px] text-teal-800 font-bold block">{doc.city}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t text-xs">
                          <span className="font-bold text-navy">₹{doc.consultationFee}</span>
                          <Link to="/doctors" className="font-bold text-teal-700 hover:underline">
                            Book Visit →
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Free Health Camps */}
        {activeTab === "camps" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-black uppercase text-red-800">
                  Live Outreach & Camps
                </span>
                <h3 className="font-display text-xl font-black text-navy mt-1">
                  Active Free Health Camps in Your City
                </h3>
                <p className="text-xs text-slate-500">
                  Free specialist screening, ECG, random blood sugar tests, and medicines distribution.
                </p>
              </div>

              <div className="space-y-4">
                {camps.map((camp) => (
                  <div
                    key={camp.id}
                    className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50/50 to-white p-6 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                      <div>
                        <span className="rounded-full bg-teal-600 text-white px-2.5 py-0.5 text-[10px] font-bold">
                          100% Free Public Camp
                        </span>
                        <h4 className="font-display text-lg font-black text-navy mt-1">{camp.title}</h4>
                        <p className="text-xs text-slate-600">Organized by: {camp.organizer}</p>
                      </div>

                      <div className="sm:text-right">
                        <span className="font-bold text-teal-800 text-xs block">{camp.startDate} to {camp.endDate}</span>
                        <span className="text-[11px] text-slate-500">{camp.timings}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(camp.servicesOffered || []).map((srv, i) => (
                        <span key={i} className="rounded-lg bg-white border border-teal-200 px-2.5 py-1 text-xs font-semibold text-teal-900">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-teal-600" /> {camp.venue}, {camp.city}
                      </span>
                      <span className="font-bold text-emerald-700">
                        {camp.registeredCount || 0} Citizens Registered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
