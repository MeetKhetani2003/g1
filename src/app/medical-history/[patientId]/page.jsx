// src/app/medical-history/[patientId]/page.jsx
"use client";

import { use, useEffect, useState } from "react";
import {
  ShieldCheck,
  Droplet,
  Heart,
  Activity,
  AlertTriangle,
  FileText,
  Phone,
  QrCode,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Link } from "../../../utils/navigation";
import { healthStore } from "../../../utils/healthStore";

export default function MedicalHistoryPage({ params }) {
  const unwrappedParams = use(params);
  const patientId = unwrappedParams.patientId || "G1-849201";

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const data = healthStore.getPatient();
    setPatient({
      ...data,
      healthId: patientId,
    });
  }, [patientId]);

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Profile
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            G1 Verified Health Passport
          </span>
        </div>

        {/* Hero Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={patient.photo}
              alt={patient.name}
              className="h-28 w-28 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl font-extrabold text-navy">{patient.name}</h1>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-700 inline-flex items-center gap-1">
                  <Droplet className="h-3 w-3 fill-current" /> {patient.bloodGroup}
                </span>
              </div>

              <p className="mt-1 font-mono text-sm font-bold text-teal-700 tracking-wide">
                Patient ID: {patient.healthId}
              </p>

              <p className="mt-2 text-xs text-slate-600">
                {patient.age} Yrs · {patient.gender} · {patient.address}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href={`tel:${patient.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-bold text-white shadow hover:bg-navy/90"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Emergency: {patient.phone}
                </a>
                <button
                  type="button"
                  onClick={() => typeof window !== "undefined" && window.print()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Download className="h-3.5 w-3.5" /> Print Health Record
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Blood Pressure</span>
            <p className="mt-1 font-display text-lg font-black text-navy">120 / 80</p>
            <span className="text-[10px] text-emerald-600 font-bold">Optimal Range</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Pulse / Heart Rate</span>
            <p className="mt-1 font-display text-lg font-black text-navy">72 bpm</p>
            <span className="text-[10px] text-emerald-600 font-bold">Resting Normal</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">SpO2 Oxygen</span>
            <p className="mt-1 font-display text-lg font-black text-navy">99%</p>
            <span className="text-[10px] text-emerald-600 font-bold">Excellent</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Fasting Glucose</span>
            <p className="mt-1 font-display text-lg font-black text-navy">94 mg/dL</p>
            <span className="text-[10px] text-emerald-600 font-bold">Normal Fasting</span>
          </div>
        </div>

        {/* Critical Alerts & Allergies */}
        <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-display text-sm font-bold">Clinical Warnings & Known Allergies</h3>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl bg-white p-3 border border-amber-200/80">
              <span className="font-bold text-slate-700">Documented Drug Allergies:</span>
              <p className="mt-1 font-medium text-red-600">{patient.allergies || "None reported"}</p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-amber-200/80">
              <span className="font-bold text-slate-700">Chronic Medical Conditions:</span>
              <p className="mt-1 font-medium text-slate-800">{patient.chronicConditions || "None"}</p>
            </div>
          </div>
        </div>

        {/* Clinical History & Consultations Timeline */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" /> Clinical History & Hospital Visits
            </h3>
            <span className="text-xs text-slate-500">Last synchronized 2 hrs ago</span>
          </div>

          <div className="mt-5 space-y-5">
            <div className="relative pl-6 border-l-2 border-teal-500 space-y-1">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-navy">
                  Comprehensive Cardiac Screening & 2D Echo
                </span>
                <span className="text-xs font-semibold text-slate-500">12 Oct 2026</span>
              </div>
              <p className="text-xs text-slate-600">
                Dr. Rajesh K. Mehta · G1 Reference Heart Institute
              </p>
              <p className="text-xs text-slate-500">
                Resting ECG normal, LVEF 62%, normal chamber dimensions, mild sinus bradycardia noted.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-1">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-navy">
                  Annual Full Body Diagnostic Lab Test (83 Parameters)
                </span>
                <span className="text-xs font-semibold text-slate-500">04 Sep 2026</span>
              </div>
              <p className="text-xs text-slate-600">
                G1 Central Pathology Labs · Report Verified by Chief Biochemist
              </p>
              <p className="text-xs text-slate-500">
                Hb: 13.8 g/dL, HbA1c: 5.4%, Serum Creatinine: 0.9 mg/dL. All vital organs within healthy range.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400">
          This digital health record is encrypted and verified under the G1 Healthcare Aggregator Framework.
          Official use only.
        </p>
      </div>
    </div>
  );
}
