// src/components/admin/AdminRegistrationsSection.jsx
"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X,
  Building2,
  Stethoscope,
  Pill,
  HeartHandshake,
  Users,
  ShieldCheck,
} from "lucide-react";
import { healthStore } from "../../utils/healthStore";

const ROLE_FILTERS = [
  { id: "ALL", label: "All Registrations" },
  { id: "hospital", label: "Hospitals" },
  { id: "staff", label: "Hospital Staff" },
  { id: "pharmacy", label: "Medical Stores" },
  { id: "asha", label: "ASHA Workers" },
  { id: "patient", label: "Patients" },
  { id: "doctor", label: "Doctors" },
  { id: "clinic", label: "Clinics" },
];

export default function AdminRegistrationsSection() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [inspectItem, setInspectItem] = useState(null);

  const loadData = () => {
    setRegistrations(healthStore.getRegistrations());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleUpdateStatus = (token, newStatus) => {
    healthStore.updateRegistrationStatus(token, newStatus);
    showToast(`Status updated to "${newStatus}"!`);
    if (inspectItem?.token === token) {
      setInspectItem({ ...inspectItem, status: newStatus });
    }
  };

  const filtered = registrations.filter((r) => {
    const matchesRole = selectedRole === "ALL" || r.role === selectedRole;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.token?.toLowerCase().includes(q) ||
      r.name?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q) ||
      r.city?.toLowerCase().includes(q) ||
      r.hospitalName?.toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case "hospital":
        return <Building2 className="h-3.5 w-3.5 text-blue-600" />;
      case "doctor":
      case "clinic":
        return <Stethoscope className="h-3.5 w-3.5 text-teal-600" />;
      case "pharmacy":
        return <Pill className="h-3.5 w-3.5 text-cyan-600" />;
      case "asha":
        return <HeartHandshake className="h-3.5 w-3.5 text-rose-600" />;
      case "staff":
        return <Users className="h-3.5 w-3.5 text-purple-600" />;
      default:
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "hospital":
        return "bg-blue-100 text-blue-800";
      case "doctor":
        return "bg-teal-100 text-teal-800";
      case "clinic":
        return "bg-emerald-100 text-emerald-800";
      case "pharmacy":
        return "bg-cyan-100 text-cyan-800";
      case "asha":
        return "bg-rose-100 text-rose-800";
      case "staff":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

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
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-navy">
                Multi-Role Partner Registrations Desk
              </h1>
              <p className="text-xs text-slate-500">
                Review and approve applications across Hospitals, Staff, Medical Stores, ASHA Workers, Patients, Doctors & Clinics.
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200">
          Total Applications: {registrations.length}
        </span>
      </div>

      {/* Role Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {ROLE_FILTERS.map((f) => {
          const count =
            f.id === "ALL"
              ? registrations.length
              : registrations.filter((r) => r.role === f.id).length;

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedRole(f.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                selectedRole === f.id
                  ? "bg-navy text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  selectedRole === f.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by token, applicant name, phone, city..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-navy placeholder:text-slate-400 focus:border-teal-600 focus:outline-hidden"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Reg Token</th>
                <th className="p-4">Role / Sector</th>
                <th className="p-4">Applicant & Entity</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">City / Location</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4">Application Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.token} className="hover:bg-slate-50/70 transition">
                  {/* Token */}
                  <td className="p-4">
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {r.token}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${getRoleBadgeClass(
                        r.role
                      )}`}
                    >
                      {getRoleIcon(r.role)}
                      {r.role}
                    </span>
                  </td>

                  {/* Applicant */}
                  <td className="p-4">
                    <p className="font-bold text-navy text-sm">{r.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {r.hospitalName || r.clinicName || r.storeName || r.designation || r.specialization || "Individual"}
                    </p>
                  </td>

                  {/* Contact */}
                  <td className="p-4">
                    <span className="font-mono text-slate-700">{r.phone}</span>
                    {r.email && <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{r.email}</p>}
                  </td>

                  {/* City */}
                  <td className="p-4 text-slate-700 font-medium">{r.city || "Ahmedabad"}</td>

                  {/* Status */}
                  <td className="p-4">
                    <select
                      value={r.status || "Under Verification"}
                      onChange={(e) => handleUpdateStatus(r.token, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold border focus:outline-hidden ${
                        r.status === "Verified & Empanelled"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : r.status === "Action Required"
                          ? "bg-rose-50 text-rose-800 border-rose-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      <option value="Under Verification">Under Verification</option>
                      <option value="Verified & Empanelled">Verified & Empanelled</option>
                      <option value="Action Required">Action Required</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Date */}
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("en-IN") : "2026-10-21"}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => setInspectItem(r)}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-bold text-navy hover:bg-teal-600 hover:text-white transition"
                    >
                      <Eye className="h-3.5 w-3.5" /> Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT APPLICANT DOSSIER MODAL */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700">{inspectItem.token}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Application Dossier ({inspectItem.role?.toUpperCase()})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-navy">{inspectItem.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono font-bold text-teal-700">{inspectItem.phone}</span>
                </div>
                {inspectItem.email && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-700">{inspectItem.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">City / District:</span>
                  <span className="font-medium text-slate-800">{inspectItem.city}</span>
                </div>
              </div>

              {/* Dynamic role details */}
              <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 space-y-2">
                <span className="font-bold uppercase text-[10px] text-teal-900 block">
                  Submitted Credentials & Affiliations
                </span>
                {Object.entries(inspectItem)
                  .filter(([k]) => !["token", "name", "phone", "email", "city", "status", "submittedAt", "role"].includes(k))
                  .map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[11px] border-b border-teal-100 pb-1">
                      <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <span className="font-bold text-navy max-w-[250px] truncate text-right">
                        {String(val)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Quick Approval Actions */}
              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                <span className="text-slate-500 font-bold">Verification Decision:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(inspectItem.token, "Verified & Empanelled")}
                    className="rounded-full bg-emerald-600 px-4 py-1.5 font-bold text-white hover:bg-emerald-700"
                  >
                    Empanel Partner ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(inspectItem.token, "Rejected")}
                    className="rounded-full bg-red-100 text-red-700 px-4 py-1.5 font-bold hover:bg-red-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
