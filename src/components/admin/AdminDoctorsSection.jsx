// src/components/admin/AdminDoctorsSection.jsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "../../utils/navigation";
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Building2,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  X,
  Loader2,
  DollarSign,
  Users,
} from "lucide-react";
import { healthStore } from "../../utils/healthStore";

const DEPARTMENTS = [
  "All Departments",
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
  "Gynecology",
  "Oncology",
  "ENT",
];

const INITIAL_FORM = {
  id: "",
  name: "",
  qualification: "",
  department: "General Medicine",
  specialty: "",
  experience: "10 Years",
  rating: 4.9,
  reviewsCount: 150,
  image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  city: "Delhi NCR",
  hospitalAffiliation: "Max Super Speciality Hospital",
  clinicAddress: "Sector 19, Main Medical Enclave",
  consultationFee: 700,
  inClinicAvailable: true,
  status: "Active",
  languages: "English, Hindi",
  about: "Experienced medical specialist dedicated to evidence-based diagnostic protocols and personalized patient care.",
  specializations: "General Consultation, Preventive Health, Lifestyle Wellness",
  awards: "Clinical Excellence Award",
  availability: "Mon - Sat: 10:00 AM – 06:00 PM",
  timingSlots: "10:00 AM, 11:30 AM, 02:30 PM, 04:30 PM",
};

export default function AdminDoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const loadDoctors = () => {
    setDoctors(healthStore.getDoctors());
  };

  useEffect(() => {
    loadDoctors();
    const handleUpdate = () => loadDoctors();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAdd = () => {
    setForm({
      ...INITIAL_FORM,
      id: `doc-${Date.now()}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setForm({
      ...doc,
      languages: Array.isArray(doc.languages) ? doc.languages.join(", ") : doc.languages || "",
      specializations: Array.isArray(doc.specializations)
        ? doc.specializations.join(", ")
        : doc.specializations || "",
      awards: Array.isArray(doc.awards) ? doc.awards.join(", ") : doc.awards || "",
      timingSlots: Array.isArray(doc.timingSlots)
        ? doc.timingSlots.join(", ")
        : doc.timingSlots || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (doc) => {
    if (confirm(`Are you sure you want to remove Dr. ${doc.name} from the portal?`)) {
      healthStore.deleteDoctor(doc.id);
      loadDoctors();
      showToast(`Removed Dr. ${doc.name}`);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "doctor_photo");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setForm((prev) => ({ ...prev, image: data.url }));
      showToast("Photo uploaded via MongoDB GridFS!");
    } catch (err) {
      alert("Failed to upload doctor photo: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const languagesArray = typeof form.languages === "string"
      ? form.languages.split(",").map((s) => s.trim()).filter(Boolean)
      : form.languages || [];

    const specializationsArray = typeof form.specializations === "string"
      ? form.specializations.split(",").map((s) => s.trim()).filter(Boolean)
      : form.specializations || [];

    const awardsArray = typeof form.awards === "string"
      ? form.awards.split(",").map((s) => s.trim()).filter(Boolean)
      : form.awards || [];

    const timingSlotsArray = typeof form.timingSlots === "string"
      ? form.timingSlots.split(",").map((s) => s.trim()).filter(Boolean)
      : form.timingSlots || ["10:00 AM", "11:30 AM", "02:30 PM", "04:30 PM"];

    const doctorData = {
      ...form,
      consultationFee: Number(form.consultationFee) || 500,
      languages: languagesArray,
      specializations: specializationsArray,
      awards: awardsArray,
      timingSlots: timingSlotsArray,
    };

    healthStore.saveDoctor(doctorData);
    loadDoctors();
    setIsModalOpen(false);
    showToast(`Saved Dr. ${doctorData.name}`);
  };

  // Filtered doctors
  const filtered = doctors.filter((doc) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      doc.name?.toLowerCase().includes(q) ||
      doc.department?.toLowerCase().includes(q) ||
      doc.specialty?.toLowerCase().includes(q) ||
      doc.city?.toLowerCase().includes(q) ||
      doc.hospitalAffiliation?.toLowerCase().includes(q);

    const matchesDept =
      selectedDept === "All Departments" ||
      doc.department === selectedDept ||
      doc.specialty?.toLowerCase().includes(selectedDept.toLowerCase());

    return matchesSearch && matchesDept;
  });

  const totalSpecialties = new Set(doctors.map((d) => d.department)).size;
  const avgFee = Math.round(
    doctors.reduce((sum, d) => sum + (Number(d.consultationFee) || 0), 0) / (doctors.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-navy px-4 py-3 text-xs font-bold text-white shadow-xl flex items-center gap-2 border border-teal-500/40 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-navy flex items-center gap-2.5">
            <Stethoscope className="h-6 w-6 text-teal-600" />
            Verified Doctors Directory & Pricing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure doctors directory, in-clinic consultation fees, affiliations, bios, and upload portraits to MongoDB GridFS.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy-800 transition"
        >
          <Plus className="h-4 w-4" /> Add New Doctor
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Doctors
          </span>
          <span className="font-display text-2xl font-black text-navy">{doctors.length}</span>
          <span className="text-[11px] text-teal-600 font-semibold block mt-0.5">Active Specialists</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Specialties Covered
          </span>
          <span className="font-display text-2xl font-black text-navy">{totalSpecialties}</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Clinical Departments</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Avg In-Clinic Fee
          </span>
          <span className="font-display text-2xl font-black text-navy">₹{avgFee}</span>
          <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Standardized Rates</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Public Directory
          </span>
          <Link
            to="/doctors"
            target="_blank"
            className="inline-flex items-center gap-1 font-display text-sm font-bold text-teal-600 hover:text-teal-700 mt-2"
          >
            <span>Preview /doctors</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <span className="text-[10px] text-slate-400 block mt-1">Live patient view</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors by name, specialty, hospital, or city..."
            className="w-full rounded-full border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-medium text-navy placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-teal-500 focus:outline-none w-full sm:w-auto"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4 w-20">Priority Rank</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Department & Qualification</th>
                <th className="p-4">Hospital & City</th>
                <th className="p-4">In-Clinic Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((doc) => (
                  <tr key={doc.id || doc.slug} className="hover:bg-slate-50/70 transition">
                    {/* Priority Rank Inline Input */}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-bold text-xs">#</span>
                        <input
                          type="number"
                          min={1}
                          defaultValue={doc.priorityRank || ""}
                          placeholder="—"
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (val) {
                              healthStore.updateDoctorPriorityRank(doc.id, val);
                              setDoctors(healthStore.getDoctors());
                              showToast(`Updated rank for ${doc.name} to #${val}`);
                            }
                          }}
                          className="w-12 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-black text-teal-800 text-center focus:border-teal-600 focus:outline-hidden"
                          title="Type rank (e.g. 1) to position this doctor at the top"
                        />
                      </div>
                    </td>
                    {/* Doctor Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div>
                          <div className="font-bold text-navy text-xs flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            <span className="flex items-center text-amber-500 font-bold text-[10px]">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline" />
                              {doc.rating}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {doc.experience} Experience
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-4">
                      <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-100 block w-fit">
                        {doc.department}
                      </span>
                      <p className="text-[11px] font-semibold text-slate-600 mt-1 truncate max-w-[180px]">
                        {doc.qualification}
                      </p>
                    </td>

                    {/* Hospital & City */}
                    <td className="p-4">
                      <p className="font-bold text-navy truncate max-w-[160px]">
                        {doc.hospitalAffiliation}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{doc.city}</span>
                      </p>
                    </td>

                    {/* Fee */}
                    <td className="p-4">
                      <div className="text-xs">
                        <span className="font-extrabold text-navy text-[14px]">₹{doc.consultationFee}</span>
                        <span className="text-[10px] text-slate-400 block">In-Clinic OPD</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          doc.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {doc.status || "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/doctors/${doc.slug || doc.id}`}
                          target="_blank"
                          title="View Public Profile"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-navy transition"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(doc)}
                          title="Edit Doctor"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc)}
                          title="Delete Doctor"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-700 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No doctors found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-navy">
                    {form.id && doctors.some((d) => d.id === form.id)
                      ? `Edit Doctor: ${form.name}`
                      : "Add New Doctor Specialist"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill in qualifications, fees, and upload photo to MongoDB GridFS.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              {/* Doctor Photo with GridFS upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Doctor Portrait Photo (MongoDB GridFS)
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-16 w-16 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 rounded-full border border-teal-600 bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 cursor-pointer transition">
                      {uploadingPhoto ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading to GridFS...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-3.5 w-3.5" /> Upload File (GridFS)
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Or enter image URL here..."
                      className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-navy placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh K. Sharma"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    placeholder="e.g. MBBS, MD (Medicine), DM (Cardiology)"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
              </div>

              {/* Department & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department *</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-navy"
                  >
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specialty Sub-title</label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    placeholder="e.g. Interventional Cardiology & Angioplasty"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. 15 Years"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
              </div>

              {/* Hospital Affiliation & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hospital Affiliation *</label>
                  <input
                    type="text"
                    required
                    value={form.hospitalAffiliation}
                    onChange={(e) => setForm({ ...form, hospitalAffiliation: e.target.value })}
                    placeholder="e.g. Fortis Escorts Heart Institute"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Delhi NCR, Mumbai, Ahmedabad"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
              </div>

              {/* Clinic Address & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinic Address</label>
                  <input
                    type="text"
                    value={form.clinicAddress}
                    onChange={(e) => setForm({ ...form, clinicAddress: e.target.value })}
                    placeholder="e.g. Okhla Road, New Friends Colony, New Delhi"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Availability Schedule</label>
                  <input
                    type="text"
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    placeholder="e.g. Mon - Sat: 10:00 AM – 06:00 PM"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-navy"
                  />
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="w-full sm:w-1/2">
                  <label className="font-bold text-slate-700 block mb-1">
                    In-Clinic Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.consultationFee}
                    onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                  />
                </div>
                <div className="text-[11px] text-slate-500 sm:pt-4">
                  Standard in-clinic OPD consultation rate paid online or at hospital desk.
                </div>
              </div>

              {/* Bio / About */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Biography</label>
                <textarea
                  rows={3}
                  value={form.about}
                  onChange={(e) => setForm({ ...form, about: e.target.value })}
                  placeholder="Enter a brief background, approach to medicine, and clinical experience..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium text-navy"
                />
              </div>

              {/* Specializations & Awards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Specializations (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.specializations}
                    onChange={(e) => setForm({ ...form, specializations: e.target.value })}
                    placeholder="Angioplasty, Pacemaker, Heart Failure"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Awards (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.awards}
                    onChange={(e) => setForm({ ...form, awards: e.target.value })}
                    placeholder="Cardiologist of the Year, CSI Fellow"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium text-navy"
                  />
                </div>
              </div>

              {/* Languages & Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Languages (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.languages}
                    onChange={(e) => setForm({ ...form, languages: e.target.value })}
                    placeholder="English, Hindi, Bengali"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Timing Slots (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.timingSlots}
                    onChange={(e) => setForm({ ...form, timingSlots: e.target.value })}
                    placeholder="10:00 AM, 11:30 AM, 02:30 PM, 04:30 PM"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium text-navy"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-navy px-6 py-2 font-bold text-white shadow-xs hover:bg-navy-800 transition"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
