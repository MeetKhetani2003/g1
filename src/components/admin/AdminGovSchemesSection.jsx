// src/components/admin/AdminGovSchemesSection.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { healthStore } from "../../utils/healthStore";

export default function AdminGovSchemesSection() {
  const [schemes, setSchemes] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    shortName: "",
    coverageAmount: "₹5,00,000 / year",
    type: "National Secondary & Tertiary Care",
    badge: "Government of India",
    description: "",
    treatmentsInput: "",
    eligibilityCriteria: "",
  });

  const loadSchemes = () => {
    setSchemes(healthStore.getGovSchemes());
  };

  useEffect(() => {
    loadSchemes();
    const handleUpdate = () => loadSchemes();
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
      name: "",
      shortName: "",
      coverageAmount: "₹5,00,000 / year",
      type: "State / Central Scheme",
      badge: "Empanelled Scheme",
      description: "",
      treatmentsInput: "Cardiology & Stenting, General Surgery, ICU, Joint Replacement, Dialysis",
      eligibilityCriteria: "All eligible BPL / NFSA cardholders and identified families.",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setFormData({
      id: s.id,
      name: s.name,
      shortName: s.shortName,
      coverageAmount: s.coverageAmount,
      type: s.type,
      badge: s.badge,
      description: s.description,
      treatmentsInput: (s.treatmentsCovered || []).join(", "),
      eligibilityCriteria: s.eligibilityCriteria,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete scheme: ${name}?`)) {
      healthStore.deleteGovScheme(id);
      showToast(`Deleted scheme: ${name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const treatments = formData.treatmentsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    healthStore.saveGovScheme({
      id: formData.id || undefined,
      name: formData.name,
      shortName: formData.shortName || formData.name,
      coverageAmount: formData.coverageAmount,
      type: formData.type,
      badge: formData.badge,
      description: formData.description,
      treatmentsCovered: treatments,
      eligibilityCriteria: formData.eligibilityCriteria,
      fieldsToCollect: [
        { key: "cardNo", label: `${formData.shortName || "Scheme"} Card / ID Number`, required: true },
        { key: "familyId", label: "Family / Beneficiary ID", required: false },
        { key: "validTill", label: "Validity / Renewal Status", required: false },
      ],
    });

    setIsModalOpen(false);
    showToast(`Saved Scheme: ${formData.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-navy px-4 py-3 text-xs font-bold text-white shadow-xl flex items-center gap-2 border border-teal-500/40">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-navy flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-teal-600" />
            Government Healthcare Schemes Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create and configure state and national healthcare schemes (AB-PMJAY, MAA Card, ESIC, CGHS). Configured schemes automatically become available for linking to patient health cards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy-800 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Government Scheme
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Configured Schemes
          </span>
          <span className="font-display text-2xl font-black text-navy">{schemes.length}</span>
          <span className="text-[11px] text-teal-600 font-semibold block mt-0.5">National & State</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Avg Cashless Limit
          </span>
          <span className="font-display text-2xl font-black text-emerald-700">₹5 Lakhs</span>
          <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Per Family / Year</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Patient Integration
          </span>
          <span className="font-display text-2xl font-black text-teal-800">Dynamic Forms</span>
          <span className="text-[11px] text-teal-600 font-semibold block mt-0.5">Auto-Linked in Patient Dossier</span>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {schemes.map((s) => (
          <div
            key={s.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-teal-100 text-teal-800 px-3 py-0.5 text-xs font-black uppercase">
                  {s.badge || "Govt Scheme"}
                </span>
                <span className="font-display font-black text-sm text-emerald-700">
                  {s.coverageAmount}
                </span>
              </div>

              <div>
                <h3 className="font-display text-base font-black text-navy">
                  {s.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {s.description}
                </p>
              </div>

              {/* Covered Treatments List */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Eligible Treatments Covered:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(s.treatmentsCovered || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10.5px] font-semibold text-slate-700"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                <strong className="text-navy text-[11px] block">Eligibility Criteria:</strong>
                {s.eligibilityCriteria}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Slug: <code className="text-slate-600 font-mono">{s.slug}</code>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(s)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy transition"
                  title="Edit Scheme"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id, s.name)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition"
                  title="Delete Scheme"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-display text-base font-extrabold text-navy">
                {formData.id ? "Edit Government Scheme" : "Create New Government Scheme"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Scheme Full Title *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ayushman Bharat - PM-JAY or State Health Card"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Short Name / Code
                  </label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="e.g. PM-JAY"
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Coverage Amount Limit *
                  </label>
                  <input
                    type="text"
                    value={formData.coverageAmount}
                    onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                    placeholder="e.g. ₹5,00,000 / year"
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Scheme Description & Purpose
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, cashless hospitalization scope..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Covered Treatments / Procedures (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={formData.treatmentsInput}
                  onChange={(e) => setFormData({ ...formData, treatmentsInput: e.target.value })}
                  placeholder="e.g. Cardiology & Stents, Joint Replacements, Laparoscopy, Oncology, ICU"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  value={formData.eligibilityCriteria}
                  onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                  placeholder="e.g. NFSA ration card, income certificate under 4 Lakhs"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                />
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
                  className="flex-1 rounded-full bg-teal-600 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 transition"
                >
                  Save Government Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
