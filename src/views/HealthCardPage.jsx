"use client";

import { useEffect, useState } from "react";
import { Link } from "../utils/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  QrCode,
  ShieldCheck,
  Fingerprint,
  Bell,
  Check,
  Loader2,
  IdCard,
  Phone,
  Mail,
  UserCheck,
  ArrowRight,
  Camera,
  UploadCloud,
  Droplet,
  Sparkles,
  User,
  Copy,
  ExternalLink,
  FileText,
  Pill,
  Building2,
  HeartHandshake,
  MapPin,
  AlertCircle,
  Calendar,
  Edit3,
  Clock,
  Stethoscope,
  Activity,
  Heart,
} from "lucide-react";
import confetti from "canvas-confetti";
import DemoBadge from "../components/ui/DemoBadge";
import { useAuth } from "../context/AuthContext";
import G1DigitalHealthCard from "../components/health-card/G1DigitalHealthCard";
import { healthStore } from "../utils/healthStore";

export default function HealthCardPage() {
  const { user, updateProfilePhoto } = useAuth();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'profile' | 'schemes' | 'records'
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    bloodGroup: "O+",
    age: "32",
    gender: "Female",
    dob: "1994-06-15",
    emergencyContact: "",
    allergies: "",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    consent: true,
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoNotice, setPhotoNotice] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [demoId, setDemoId] = useState("G1-849201");

  const loadPatientData = () => {
    const p = healthStore.getPatient(user);
    if (p) {
      setPatient(p);
      setForm({
        name: p.name || user?.name || "",
        phone: p.phone ? p.phone.replace(/[^0-9]/g, "").slice(-10) : "",
        email: p.email || user?.email || "",
        city: p.address ? p.address.split(",")[0].trim() : (p.city || ""),
        bloodGroup: p.bloodGroup || "O+",
        age: p.age || "32",
        gender: p.gender || "Female",
        dob: p.dob || "1994-06-15",
        emergencyContact: p.emergencyContact || "",
        allergies: p.allergies || "",
        photo: p.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        consent: true,
      });
      if (p.healthId || user?.healthId) {
        setDemoId(p.healthId || user?.healthId);
      }
    }
  };

  useEffect(() => {
    loadPatientData();
    const handleStoreUpdate = () => loadPatientData();
    window.addEventListener("g1-store-update", handleStoreUpdate);
    return () => window.removeEventListener("g1-store-update", handleStoreUpdate);
  }, [user]);

  const handleCopyId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(demoId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoNotice("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "photos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload photo");
      }

      setForm((prev) => ({ ...prev, photo: data.url }));

      healthStore.updatePatient({ photo: data.url });
      if (typeof updateProfilePhoto === "function") {
        updateProfilePhoto(data.url);
      }

      setPhotoNotice(
        data.storage === "mongodb_gridfs"
          ? "✓ Stored in MongoDB GridFS & Saved"
          : "✓ Profile photo attached & Saved"
      );
    } catch (err) {
      console.error("Photo upload error:", err);
      alert(err.message || "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "Enter your full name (min 3 characters).";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
    if (!form.city.trim()) e.city = "Enter your city.";
    if (!form.consent) e.consent = "Please accept the demo consent to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    const newId = demoId || user?.healthId || `G1-${Math.floor(100000 + Math.random() * 900000)}`;
    setDemoId(newId);

    const updated = healthStore.updatePatient({
      name: form.name,
      phone: form.phone.startsWith("+91") ? form.phone : `+91 ${form.phone}`,
      email: form.email || (user?.email || "patient@g1healthcare.com"),
      address: `${form.city}, India`,
      city: form.city,
      photo: form.photo,
      bloodGroup: form.bloodGroup,
      age: form.age,
      gender: form.gender,
      dob: form.dob,
      emergencyContact: form.emergencyContact || (patient?.emergencyContact || "Vikram Sharma (+91 98250 99881 - Brother)"),
      allergies: form.allergies || (patient?.allergies || "None reported"),
      healthId: newId,
    });

    setPatient(updated);

    if (typeof updateProfilePhoto === "function" && form.photo) {
      updateProfilePhoto(form.photo);
    }

    setTimeout(() => {
      try {
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      } catch (err) {}
      setStatus("success");
      setIsEditing(false);
    }, 700);
  };

  const currentPatientData = {
    name: patient?.name || form.name || user?.name || "Dr. Ananya Sharma",
    healthId: demoId || user?.healthId || "G1-849201",
    phone: patient?.phone || (form.phone ? `+91 ${form.phone}` : user?.phone || "+91 98765 43210"),
    email: patient?.email || form.email || user?.email || "ananya.sharma@example.com",
    bloodGroup: patient?.bloodGroup || form.bloodGroup || "O+",
    age: patient?.age || form.age || "32",
    gender: patient?.gender || form.gender || "Female",
    dob: patient?.dob || form.dob || "1994-06-15",
    address: patient?.address || (form.city ? `${form.city}, India` : "42, Green Valley Enclave, Ring Road, Ahmedabad, Gujarat 380054"),
    city: patient?.city || form.city || "Ahmedabad",
    photo: form.photo || patient?.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    emergencyContact: patient?.emergencyContact || form.emergencyContact || "Vikram Sharma (+91 98250 99881 - Brother)",
    allergies: patient?.allergies || form.allergies || "Penicillin, Dust Mites",
    chronicConditions: patient?.chronicConditions || "Mild Asthma (Controlled)",
    membershipTier: patient?.membershipTier || "Gold Life Member",
    validTill: patient?.validTill || "Lifetime Verified",
    issuedDate: patient?.issuedDate || "12 Oct 2024",
    governmentSchemes: patient?.governmentSchemes || [],
    insurancePolicies: patient?.insurancePolicies || [],
    consultationHistory: patient?.consultationHistory || [],
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Top Hero Banner */}
      <div className="border-b border-line bg-gradient-to-r from-navy via-navy-800 to-navy-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-300">
                  <IdCard className="h-3.5 w-3.5 text-teal-brand" /> Digital Health Card
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> ABHA & Universal ID Verified
                </span>
              </div>

              <h1 className="mt-3.5 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
                G1 Universal Health Card & Profile
              </h1>
              <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/80">
                Access your complete patient profile, verified ABHA identity, emergency vitals, linked PM-JAY schemes, and high-definition PVC card.
              </p>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <User className="h-3.5 w-3.5 text-teal-brand" />
                <span>Open Profile Dashboard</span>
              </Link>
              <Link
                to={`/medical-history/${demoId}`}
                className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-dark"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Medical Records</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Navigation Tabs Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "Full Profile & Card", icon: IdCard },
              { id: "profile", label: "Personal & Demographics", icon: User },
              { id: "schemes", label: `Govt Schemes & Insurance (${currentPatientData.governmentSchemes.length})`, icon: Building2 },
              { id: "records", label: `Prescriptions & History (${currentPatientData.consultationHistory.length})`, icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-navy text-white shadow-xs"
                      : "bg-white text-slate-700 border border-line hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-teal-brand" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-50/80 px-4 py-2 text-xs font-bold text-teal-900 transition hover:bg-teal-100 cursor-pointer shadow-2xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-teal-brand" />
              <span>{isEditing ? "Hide Edit Form" : "Edit Profile / Card"}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Main Column (8 cols): Health Card Preview + Complete Profile Breakdown */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. DIGITAL HEALTH CARD SECTION */}
            {(activeTab === "all" || activeTab === "card") && (
              <div className="rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                      <IdCard className="h-5 w-5 text-teal-brand" /> Interactive PVC Health Card
                    </h2>
                    <p className="text-xs text-slate-500">
                      High-definition double-sided smart card with EMV chip, QR verification, and emergency contact details.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    <Check className="h-3 w-3" /> Ready for Print & PDF
                  </span>
                </div>

                {/* The Digital Card Component */}
                <G1DigitalHealthCard
                  patient={currentPatientData}
                  showActions={true}
                />
              </div>
            )}

            {/* 2. COMPLETE PATIENT PROFILE DETAILS (The user requested full details) */}
            {(activeTab === "all" || activeTab === "profile") && (
              <div className="rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-soft space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                      <User className="h-5 w-5 text-teal-brand" /> Complete Patient Profile & Details
                    </h2>
                    <p className="text-xs text-slate-500">
                      Universal demographic and clinical baseline synchronized across the G1 Healthcare network.
                    </p>
                  </div>
                  <span className="rounded-full bg-navy/5 px-3 py-1 text-[11px] font-bold text-navy">
                    {currentPatientData.membershipTier}
                  </span>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Full Name & ABHA ID */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Full Legal Name
                    </span>
                    <p className="mt-1 font-display text-[16px] font-black text-navy">
                      {currentPatientData.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-dark border border-teal-200/60">
                        ID: {currentPatientData.healthId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-navy cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{copiedId ? "Copied!" : "Copy ID"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Blood Group & Age */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Blood Group
                        </span>
                        <p className="mt-1 font-display text-[18px] font-black text-red-600 flex items-center gap-1">
                          <Droplet className="h-4 w-4 fill-red-600" />
                          {currentPatientData.bloodGroup}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Age & Gender
                        </span>
                        <p className="mt-1 font-display text-[15px] font-bold text-navy">
                          {currentPatientData.age} Yrs · {currentPatientData.gender}
                        </p>
                        <span className="text-[11px] text-slate-500">DOB: {currentPatientData.dob}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Phone & Email */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Primary Contact Info
                    </span>
                    <p className="mt-1 text-[13.5px] font-bold text-navy flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-teal-brand" /> {currentPatientData.phone}
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-slate-600 flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-teal-brand" /> {currentPatientData.email}
                    </p>
                  </div>

                  {/* Emergency SOS Contact */}
                  <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                      Emergency SOS Contact
                    </span>
                    <p className="mt-1 font-bold text-[13.5px] text-rose-950 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-600 fill-rose-600" />
                      {currentPatientData.emergencyContact}
                    </p>
                    <p className="mt-1 text-[11.5px] text-rose-800">
                      Printed on the back of your PVC card for instant hospital front-desk SOS access.
                    </p>
                  </div>

                  {/* Residential Address */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:col-span-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Registered Address
                    </span>
                    <p className="mt-1 text-[13.5px] font-medium text-navy flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-teal-brand shrink-0 mt-0.5" />
                      <span>{currentPatientData.address}</span>
                    </p>
                  </div>

                  {/* Documented Allergies & Chronic Conditions */}
                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                      Documented Allergies
                    </span>
                    <p className="mt-1 font-bold text-[13.5px] text-amber-950 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      {currentPatientData.allergies || "None reported"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Chronic Conditions
                    </span>
                    <p className="mt-1 font-bold text-[13.5px] text-navy flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-teal-brand" />
                      {currentPatientData.chronicConditions || "None"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. GOVERNMENT HEALTH SCHEMES & INSURANCE */}
            {(activeTab === "all" || activeTab === "schemes") && (
              <div className="rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-soft space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-teal-brand" /> Linked Government Schemes & Insurance
                    </h2>
                    <p className="text-xs text-slate-500">
                      Entitlements, PM-JAY Ayushman cards, and active cashless hospital coverages.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                    Active & Verified
                  </span>
                </div>

                <div className="space-y-4">
                  {currentPatientData.governmentSchemes.map((scheme, idx) => (
                    <div
                      key={scheme.id || idx}
                      className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50/60 to-white p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-teal-100">
                        <div>
                          <span className="inline-block rounded-md bg-teal-600 px-2.5 py-0.5 text-[10.5px] font-bold text-white uppercase tracking-wider">
                            Government Entitlement
                          </span>
                          <h3 className="mt-1.5 font-display text-base font-extrabold text-navy">
                            {scheme.schemeName}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-lg font-black text-emerald-700">
                            {scheme.coverageAmount}
                          </span>
                          <span className="block text-[11px] font-semibold text-teal-800">
                            Status: {scheme.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3.5 grid gap-2 sm:grid-cols-2 text-xs">
                        <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                          <span className="text-slate-500 text-[10.5px] font-bold uppercase">Card Number</span>
                          <p className="font-mono font-bold text-navy">{scheme.cardNo}</p>
                        </div>
                        <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                          <span className="text-slate-500 text-[10.5px] font-bold uppercase">Family ID</span>
                          <p className="font-mono font-bold text-navy">{scheme.familyId || "NFSA-GJ-449102"}</p>
                        </div>
                      </div>

                      {scheme.treatmentsCovered && scheme.treatmentsCovered.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                            Treatments & Packages Covered:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {scheme.treatmentsCovered.map((t, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-white border border-teal-200/60 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                              >
                                ✓ {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ACTIVE PRESCRIPTIONS & CONSULTATION HISTORY */}
            {(activeTab === "all" || activeTab === "records") && (
              <div className="rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-soft space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy flex items-center gap-2">
                      <FileText className="h-5 w-5 text-teal-brand" /> Prescriptions & Care History
                    </h2>
                    <p className="text-xs text-slate-500">
                      Recent doctor visits, e-prescriptions, and diagnostic investigations.
                    </p>
                  </div>
                  <Link
                    to={`/medical-history/${demoId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-dark hover:underline"
                  >
                    View All Dossier <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {currentPatientData.consultationHistory.length > 0 ? (
                    currentPatientData.consultationHistory.map((rec, i) => (
                      <div
                        key={rec.id || i}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-dark font-bold">
                              <Stethoscope className="h-4.5 w-4.5" />
                            </span>
                            <div>
                              <p className="font-display text-[14px] font-bold text-navy">{rec.doctor}</p>
                              <p className="text-[12px] text-slate-500">{rec.facility} · {rec.date}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-teal-100/80 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                            {rec.specialty}
                          </span>
                        </div>
                        <div className="mt-3 rounded-xl bg-white p-3 border border-slate-100 text-xs text-slate-700">
                          <p className="font-semibold text-navy">Diagnosis: {rec.diagnosis}</p>
                          <p className="mt-1 text-slate-600">Prescription: {rec.prescription}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic py-2">No recent consultation records.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols): Profile Summary & Edit/Update Card Form */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Summary Widget */}
            <div className="rounded-[24px] border border-line bg-white p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <img
                  src={currentPatientData.photo}
                  alt={currentPatientData.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-brand/30 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-dark uppercase tracking-wider">
                    <UserCheck className="h-3.5 w-3.5" /> Verified Profile
                  </div>
                  <h3 className="font-display text-[16px] font-bold text-navy truncate">
                    {currentPatientData.name}
                  </h3>
                  <p className="text-[12px] font-mono font-bold text-slate-500">
                    {currentPatientData.healthId}
                  </p>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                  <span className="text-slate-600">Card Validity</span>
                  <span className="font-bold text-emerald-700">{currentPatientData.validTill}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                  <span className="text-slate-600">Blood Group</span>
                  <span className="font-bold text-red-600">{currentPatientData.bloodGroup}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                  <span className="text-slate-600">PM-JAY Scheme</span>
                  <span className="font-bold text-teal-800">Linked (₹5 Lakh)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsEditing((v) => !v)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-teal-brand font-display text-[13.5px] font-bold text-white shadow-xs transition hover:bg-teal-dark cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{isEditing ? "Close Update Form" : "Edit Health Card Info"}</span>
                </button>

                <Link
                  to="/profile"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white font-display text-[13.5px] font-bold text-navy shadow-2xs transition hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-teal-brand" />
                  <span>Open Complete Dashboard</span>
                </Link>
              </div>
            </div>

            {/* Edit / Update Form */}
            <AnimatePresence>
              {(isEditing || status === "success") && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="rounded-[24px] border border-teal-200 bg-white p-6 shadow-card"
                >
                  {status === "success" && !isEditing ? (
                    <div className="text-center py-4" role="status">
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                        <Check className="h-7 w-7" />
                      </span>
                      <h4 className="font-display text-base font-bold text-navy">Health Card Profile Updated!</h4>
                      <p className="mt-1 text-xs text-slate-500">
                        Changes are saved to localStorage and reflected on your PVC card and profile.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={submit} noValidate className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h3 className="font-display text-sm font-bold text-navy flex items-center gap-2">
                          <Edit3 className="h-4 w-4 text-teal-brand" /> Update Profile & Card Data
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="text-xs text-slate-400 hover:text-navy"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Photo Upload */}
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={form.photo}
                              alt="Card Preview"
                              className="h-12 w-12 rounded-xl object-cover ring-2 ring-teal-brand/30"
                            />
                            {uploadingPhoto && (
                              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-navy/60 text-white">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[12px] font-bold text-navy block">Card Photo (GridFS)</span>
                            <label className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] font-bold text-navy shadow-2xs hover:bg-slate-50 cursor-pointer">
                              <UploadCloud className="h-3 w-3 text-teal-brand" />
                              <span>{uploadingPhoto ? "Uploading..." : "Upload Photo"}</span>
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
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy mb-1">Full Legal Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Dr. Ananya Sharma"
                          className="h-10 w-full rounded-xl border border-line px-3 text-xs font-medium text-navy focus:border-teal-brand focus:outline-hidden"
                        />
                        {errors.name && <span className="text-[11px] text-red-600 font-semibold">{errors.name}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-navy mb-1">Mobile Number *</label>
                          <input
                            type="tel"
                            maxLength={10}
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="10-digit number"
                            className="h-10 w-full rounded-xl border border-line px-3 text-xs font-medium text-navy focus:border-teal-brand focus:outline-hidden"
                          />
                          {errors.phone && <span className="text-[11px] text-red-600 font-semibold">{errors.phone}</span>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy mb-1">Blood Group *</label>
                          <select
                            value={form.bloodGroup}
                            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                            className="h-10 w-full rounded-xl border border-line px-3 text-xs font-bold text-navy focus:border-teal-brand focus:outline-hidden"
                          >
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-navy mb-1">Age</label>
                          <input
                            type="number"
                            value={form.age}
                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                            className="h-10 w-full rounded-xl border border-line px-3 text-xs font-medium text-navy focus:border-teal-brand focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-navy mb-1">City / State *</label>
                          <input
                            type="text"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            placeholder="e.g. Ahmedabad"
                            className="h-10 w-full rounded-xl border border-line px-3 text-xs font-medium text-navy focus:border-teal-brand focus:outline-hidden"
                          />
                          {errors.city && <span className="text-[11px] text-red-600 font-semibold">{errors.city}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy mb-1">Emergency Contact & Phone</label>
                        <input
                          type="text"
                          value={form.emergencyContact}
                          onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                          placeholder="e.g. Vikram Sharma (+91 98250 99881 - Brother)"
                          className="h-10 w-full rounded-xl border border-line px-3 text-xs font-medium text-navy focus:border-teal-brand focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy mb-1">Known Allergies</label>
                        <input
                          type="text"
                          value={form.allergies}
                          onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                          placeholder="e.g. Penicillin, Dust Mites"
                          className="h-10 w-full rounded-xl border border-line px-3 text-xs font-medium text-navy focus:border-teal-brand focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-navy font-display text-[13.5px] font-bold text-white shadow-xs transition hover:bg-navy-800 disabled:opacity-70 cursor-pointer"
                      >
                        {status === "loading" ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Saving Changes…</>
                        ) : (
                          <>Save & Update Health Card</>
                        )}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </div>
  );
}
