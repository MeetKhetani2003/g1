// src/views/RegisterPage.jsx
"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  Pill,
  HeartHandshake,
  IdCard,
  Stethoscope,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
  MapPin,
  Phone,
  Mail,
  FileText,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { healthStore } from "../utils/healthStore";

const ROLES = [
  {
    id: "hospital",
    label: "Hospital / Healthcare Institution",
    short: "Hospital",
    icon: Building2,
    badge: "Institutional Onboarding",
    description: "Multispecialty hospitals, nursing homes, and daycare surgical centers.",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "staff",
    label: "Hospital / Clinical Staff",
    short: "Staff & Nurses",
    icon: Users,
    badge: "Clinical Staff Roster",
    description: "Staff nurses, hospital receptionists, lab technicians, and care coordinators.",
    color: "from-teal-600 to-emerald-700",
  },
  {
    id: "pharmacy",
    label: "Medical Store (Pharmacy / Chemist)",
    short: "Medical Store",
    icon: Pill,
    badge: "Pharmacy Network",
    description: "Retail pharmacies, 24x7 chemists, surgical goods stores, and Jan Aushadhi Kendras.",
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "asha_worker",
    label: "ASHA Worker (Community Health Activist)",
    short: "ASHA Worker",
    icon: HeartHandshake,
    badge: "Grassroots Healthcare",
    description: "Accredited Social Health Activists, village healthcare workers, and Anganwadi staff.",
    color: "from-rose-600 to-pink-700",
  },
  {
    id: "patient",
    label: "Patient Register (G1 Health ID)",
    short: "Patient",
    icon: IdCard,
    badge: "Digital Health Dossier",
    description: "Patients & family members looking for digital health card, records, and discounts.",
    color: "from-navy to-slate-800",
  },
  {
    id: "doctor",
    label: "Doctor Register (Hospital / Attached Specialist)",
    short: "Specialist Doctor",
    icon: Stethoscope,
    badge: "Specialist Directory",
    description: "Full-time and visiting consultant specialists attached to hospitals.",
    color: "from-cyan-600 to-blue-700",
  },
  {
    id: "clinic",
    label: "Individual Outer Doctor Clinic (Private Practice)",
    short: "Private Clinic",
    icon: Briefcase,
    badge: "Independent Practice",
    description: "Independent doctors running their own outpatient private consulting chambers.",
    color: "from-amber-600 to-orange-700",
  },
];

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState("hospital");
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    city: "Ahmedabad",
    address: "",
    // Role specific fields
    bedCapacity: "100 Beds",
    hasICU: true,
    hasEmergency: true,
    designation: "Staff Nurse (B.Sc)",
    drugLicenseNo: "",
    discountPercent: "15%",
    offersDelivery: true,
    ashaId: "",
    affiliatedPhc: "",
    coveredFamilies: "",
    age: "32",
    gender: "Female",
    bloodGroup: "O+",
    medicalCouncilRegNo: "",
    qualification: "MBBS, MD",
    department: "Cardiology",
    consultationFee: "600",
    clinicName: "",
    consultingHours: "05:00 PM – 08:30 PM",
  });

  const [submittedReg, setSubmittedReg] = useState(null);

  const activeRoleConfig = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide the required organization/individual name and phone number.");
      return;
    }

    const reg = healthStore.saveRegistration({
      role: selectedRole,
      roleLabel: activeRoleConfig.label,
      name: formData.name,
      contactPerson: formData.contactPerson || formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      address: formData.address,
      roleDetails: {
        ...(selectedRole === "hospital" && {
          bedCapacity: formData.bedCapacity,
          hasICU: formData.hasICU,
          hasEmergency: formData.hasEmergency,
        }),
        ...(selectedRole === "staff" && {
          designation: formData.designation,
          department: formData.department,
        }),
        ...(selectedRole === "pharmacy" && {
          drugLicenseNo: formData.drugLicenseNo,
          discountPercent: formData.discountPercent,
          offersDelivery: formData.offersDelivery,
        }),
        ...(selectedRole === "asha_worker" && {
          ashaId: formData.ashaId,
          affiliatedPhc: formData.affiliatedPhc,
          coveredFamilies: formData.coveredFamilies,
        }),
        ...(selectedRole === "patient" && {
          age: formData.age,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
        }),
        ...(selectedRole === "doctor" && {
          medicalCouncilRegNo: formData.medicalCouncilRegNo,
          qualification: formData.qualification,
          department: formData.department,
          consultationFee: formData.consultationFee,
        }),
        ...(selectedRole === "clinic" && {
          clinicName: formData.clinicName || formData.name,
          consultingHours: formData.consultingHours,
          consultationFee: formData.consultationFee,
        }),
      },
    });

    setSubmittedReg(reg);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cream/40">
      {/* Header */}
      <section className="relative overflow-hidden bg-navy text-white py-12 sm:py-16 px-4 sm:px-6 border-b border-line">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            G1 Onboarding & Network Registration
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
            Choose Your Healthcare Role & Register <br />
            <span className="text-teal-400">Institutional, Professional & Patient Portal</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Join the G1 unified ecosystem. Tailored registration flows for hospitals, staff, pharmacies, ASHA workers, patients, and independent clinics.
          </p>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-4">
          <h2 className="font-display text-base font-extrabold text-navy">
            Step 1: Select Your Registration Category (7 Available Roles)
          </h2>
          <p className="text-xs text-slate-500">
            Click on any role below to render its specialized registration form.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id);
                  setSubmittedReg(null);
                }}
                className={`rounded-2xl border p-3.5 text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/80 shadow-md ring-2 ring-teal-500"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      isSelected ? "bg-teal-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-xs font-black text-navy block mt-3 leading-snug">
                    {role.short}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    {role.badge}
                  </span>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${isSelected ? "text-teal-700" : "text-slate-400"}`}>
                    {isSelected ? "Active Form ✓" : "Select"}
                  </span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-teal-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-16">
        {submittedReg ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 uppercase">
                {submittedReg.roleLabel}
              </span>
              <h3 className="font-display text-2xl font-black text-navy mt-2">
                Registration Successfully Recorded!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your profile has been saved to the centralized G1 healthcare registry and is accessible in the admin panel.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Reference Token</span>
                <span className="font-mono font-bold text-teal-800 text-sm">{submittedReg.refId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Registered Name</span>
                <span className="font-bold text-navy">{submittedReg.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Contact Number</span>
                <span className="font-bold text-navy">{submittedReg.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">City / Jurisdiction</span>
                <span className="font-medium text-navy">{submittedReg.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-700">Verified & Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmittedReg(null)}
              className="rounded-full bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700"
            >
              Submit Another Registration
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
                <activeRoleConfig.icon className="h-4 w-4" />
                <span>Step 2: Fill {activeRoleConfig.label} Profile</span>
              </div>
              <h3 className="font-display text-xl font-black text-navy mt-1">
                {activeRoleConfig.label} Registration Form
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{activeRoleConfig.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Common Primary Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {selectedRole === "patient" ? "Patient Full Name *" : "Organization / Practice Name *"}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={
                      selectedRole === "hospital"
                        ? "e.g. Shalby Multispecialty Hospital"
                        : selectedRole === "clinic"
                        ? "e.g. Dr. Sanghavi Heart Clinic"
                        : selectedRole === "pharmacy"
                        ? "e.g. WellServe 24x7 Pharmacy"
                        : selectedRole === "asha_worker"
                        ? "e.g. Sitaben K. Vaghela"
                        : "e.g. Alex Sharma"
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Dr. / Mr. / Ms. Contact Head"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile / Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Work / Personal Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Ahmedabad, Mumbai"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Physical Address / Clinic Location *
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, landmark, pin code..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-navy focus:border-teal-600 focus:outline-hidden"
                  required
                />
              </div>

              {/* ROLE SPECIFIC FIELDS */}

              {/* 1. Hospital Fields */}
              {selectedRole === "hospital" && (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Hospital Facility Details
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Total Bed Capacity</label>
                      <input
                        type="text"
                        value={formData.bedCapacity}
                        onChange={(e) => setFormData({ ...formData, bedCapacity: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">ICU Facility Available</label>
                      <select
                        value={formData.hasICU ? "yes" : "no"}
                        onChange={(e) => setFormData({ ...formData, hasICU: e.target.value === "yes" })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      >
                        <option value="yes">Yes (ICU Available)</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">24x7 Emergency / Trauma</label>
                      <select
                        value={formData.hasEmergency ? "yes" : "no"}
                        onChange={(e) => setFormData({ ...formData, hasEmergency: e.target.value === "yes" })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      >
                        <option value="yes">Yes (24x7 Open)</option>
                        <option value="no">Daycare Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Staff Fields */}
              {selectedRole === "staff" && (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Clinical Staff Designation
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Role / Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g. Senior Staff Nurse (ICU) / Front Desk Admin"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Allotted Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Cardiology, OPD, Emergency"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Pharmacy Fields */}
              {selectedRole === "pharmacy" && (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Pharmacy Drug License & Delivery
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Drug License Number</label>
                      <input
                        type="text"
                        value={formData.drugLicenseNo}
                        onChange={(e) => setFormData({ ...formData, drugLicenseNo: e.target.value })}
                        placeholder="e.g. DL-GJ-2023-4921"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Discount Offered</label>
                      <input
                        type="text"
                        value={formData.discountPercent}
                        onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                        placeholder="e.g. 15%"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Home Delivery Service</label>
                      <select
                        value={formData.offersDelivery ? "yes" : "no"}
                        onChange={(e) => setFormData({ ...formData, offersDelivery: e.target.value === "yes" })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      >
                        <option value="yes">Yes (Under 45 Mins)</option>
                        <option value="no">Counter Pickup Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ASHA Worker Fields */}
              {selectedRole === "asha_worker" && (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    ASHA Government Affiliation
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">ASHA Registration ID</label>
                      <input
                        type="text"
                        value={formData.ashaId}
                        onChange={(e) => setFormData({ ...formData, ashaId: e.target.value })}
                        placeholder="e.g. ASHA-GJ-SANAND-084"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Affiliated PHC / CHC</label>
                      <input
                        type="text"
                        value={formData.affiliatedPhc}
                        onChange={(e) => setFormData({ ...formData, affiliatedPhc: e.target.value })}
                        placeholder="e.g. Sanathal Primary Health Centre"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Assigned Village / Ward</label>
                      <input
                        type="text"
                        value={formData.coveredFamilies}
                        onChange={(e) => setFormData({ ...formData, coveredFamilies: e.target.value })}
                        placeholder="e.g. Ward 4 (350 Families)"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Patient Fields */}
              {selectedRole === "patient" && (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Patient Profile & Health Details
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Age</label>
                      <input
                        type="text"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Doctor Fields */}
              {selectedRole === "doctor" && (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Specialist Doctor Credentials
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Medical Council Reg No</label>
                      <input
                        type="text"
                        value={formData.medicalCouncilRegNo}
                        onChange={(e) => setFormData({ ...formData, medicalCouncilRegNo: e.target.value })}
                        placeholder="e.g. MCI-2015-88492"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Qualification</label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        placeholder="e.g. MBBS, MD, DM"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Individual Outer Doctor Clinic Fields */}
              {selectedRole === "clinic" && (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Private Clinic & Consulting Hours
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Private Clinic Name</label>
                      <input
                        type="text"
                        value={formData.clinicName}
                        onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                        placeholder="e.g. Sanghavi Cardiac Care Clinic"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Consulting Hours</label>
                      <input
                        type="text"
                        value={formData.consultingHours}
                        onChange={(e) => setFormData({ ...formData, consultingHours: e.target.value })}
                        placeholder="e.g. Mon-Sat: 05:00 PM – 08:30 PM"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-navy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Instant registration with G1 Reference Token.
                </span>

                <button
                  type="submit"
                  className="rounded-full px-8 py-3 font-display text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                >
                  Complete Registration as {activeRoleConfig.short}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
