// src/components/admin/AdminProvidersRankingSection.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  ArrowUpDown,
  CheckCircle2,
  X,
  Search,
  Phone,
  MapPin,
  Star,
  ShieldCheck,
} from "lucide-react";
import { healthStore } from "../../utils/healthStore";

export default function AdminProvidersRankingSection() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [editingRankId, setEditingRankId] = useState(null);
  const [rankInput, setRankInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "Hospital",
    city: "Ahmedabad",
    address: "",
    rating: 4.8,
    reviewsCount: 320,
    beds: 350,
    emergency24x7: true,
    phone: "+91 79 4000 0001",
    specialtiesInput: "Cardiology, Neurology, Oncology, Orthopedics, Emergency ICU",
    priorityRank: "",
    accredited: "NABH / NABL Accredited",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
  });

  const loadProviders = () => {
    setProviders(healthStore.getProviders());
  };

  useEffect(() => {
    loadProviders();
    const handleUpdate = () => loadProviders();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleRankSave = (providerId) => {
    const rankVal = rankInput === "" ? null : Number(rankInput);
    healthStore.updateProviderPriorityRank(providerId, rankVal);
    setEditingRankId(null);
    setRankInput("");
    showToast("Hospital priority rank updated successfully!");
  };

  const handleOpenAdd = () => {
    setFormData({
      id: "",
      name: "",
      type: "Super Specialty Hospital",
      city: "Ahmedabad",
      address: "S.G. Highway, Ahmedabad, Gujarat 380054",
      rating: 4.8,
      reviewsCount: 150,
      beds: 200,
      emergency24x7: true,
      phone: "+91 79 2680 0000",
      specialtiesInput: "Cardiology, Emergency ICU, Multi-Organ Transplant, Nephrology",
      priorityRank: "",
      accredited: "NABH Accredited",
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setFormData({
      id: p.id,
      name: p.name,
      type: p.type || "Hospital",
      city: p.city || "Ahmedabad",
      address: p.address || "",
      rating: p.rating || 4.8,
      reviewsCount: p.reviewsCount || 100,
      beds: p.beds || 150,
      emergency24x7: p.emergency24x7 ?? true,
      phone: p.phone || "",
      specialtiesInput: Array.isArray(p.specialties) ? p.specialties.join(", ") : "",
      priorityRank: p.priorityRank ?? "",
      accredited: p.accredited || "NABH Accredited",
      image: p.image || "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter hospital name");
      return;
    }

    const payload = {
      id: formData.id || `prov-${Date.now()}`,
      name: formData.name.trim(),
      type: formData.type.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      rating: Number(formData.rating) || 4.5,
      reviewsCount: Number(formData.reviewsCount) || 50,
      beds: Number(formData.beds) || 100,
      emergency24x7: Boolean(formData.emergency24x7),
      phone: formData.phone.trim(),
      specialties: formData.specialtiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      priorityRank: formData.priorityRank === "" ? null : Number(formData.priorityRank),
      accredited: formData.accredited.trim(),
      image: formData.image.trim() || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
    };

    healthStore.saveProvider(payload);
    setIsModalOpen(false);
    showToast(`Hospital "${payload.name}" saved!`);
  };

  const handleDelete = (p) => {
    if (confirm(`Remove hospital "${p.name}" from public network directory?`)) {
      healthStore.deleteProvider(p.id);
      showToast(`Removed "${p.name}"`);
    }
  };

  const filtered = providers.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.specialties && p.specialties.some((s) => s.toLowerCase().includes(q)))
    );
  });

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
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-navy">
                Hospitals & Priority Ranking Hub
              </h1>
              <p className="text-xs text-slate-500">
                Rank any hospital (e.g. elevate #57 to #1) to control placement across the G1 Healthcare portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Partner Hospital
          </button>
        </div>
      </div>

      {/* Info notice about priority rank */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 text-xs text-teal-900 flex items-start gap-3">
        <ArrowUpDown className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Dynamic Priority Sorting Active</p>
          <p className="text-teal-800 mt-0.5">
            Hospitals with assigned rank (1, 2, 3...) appear first on the public hospital directory and search pages. Hospitals without a rank are sorted automatically by patient ratings. Click the rank badge next to any hospital to instantly set or change its position.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospital name, city, specialty..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-navy placeholder:text-slate-400 focus:border-teal-600 focus:outline-hidden"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} of {providers.length} empanelled hospitals
        </span>
      </div>

      {/* Providers Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4 w-28">Priority Rank</th>
                <th className="p-4">Hospital Name & City</th>
                <th className="p-4">Type & Capacity</th>
                <th className="p-4">Key Specialties</th>
                <th className="p-4">Rating & Phone</th>
                <th className="p-4">Accreditation</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p, index) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  {/* Priority Rank column */}
                  <td className="p-4">
                    {editingRankId === p.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          autoFocus
                          value={rankInput}
                          onChange={(e) => setRankInput(e.target.value)}
                          placeholder="e.g. 1"
                          className="w-16 rounded-lg border border-teal-500 px-2 py-1 text-xs font-black text-navy focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleRankSave(p.id)}
                          className="rounded-lg bg-teal-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-teal-700"
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRankId(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRankId(p.id);
                          setRankInput(p.priorityRank ?? "");
                        }}
                        className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-black transition ${
                          p.priorityRank
                            ? "bg-amber-100 text-amber-900 ring-1 ring-amber-400/60 shadow-xs"
                            : "bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-700"
                        }`}
                        title="Click to set priority rank"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        {p.priorityRank ? `#${p.priorityRank}` : "Set Rank"}
                      </button>
                    )}
                  </td>

                  {/* Hospital Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=120&q=80"}
                        alt={p.name}
                        className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-navy text-sm">{p.name}</p>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="h-3 w-3 text-teal-600" />
                          {p.city}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type & Capacity */}
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{p.type}</p>
                    <span className="text-[11px] text-slate-500">
                      {p.beds} Beds · {p.emergency24x7 ? "24x7 Emergency" : "Standard OPD"}
                    </span>
                  </td>

                  {/* Key Specialties */}
                  <td className="p-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {p.specialties?.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800"
                        >
                          {spec}
                        </span>
                      ))}
                      {p.specialties?.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          +{p.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Rating & Phone */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{p.rating}</span>
                      <span className="text-slate-400 text-[10px] font-normal">({p.reviewsCount})</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5">{p.phone}</p>
                  </td>

                  {/* Accreditation */}
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      {p.accredited || "Empanelled"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="rounded-full p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition"
                      title="Edit Hospital"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">
                {formData.id ? "Edit Partner Hospital" : "Add Partner Hospital"}
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
                <label className="font-bold text-slate-700">Hospital Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shalby Multispecialty Hospital"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Facility Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Super Specialty Hospital"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Priority Rank (1 = Top)</label>
                  <input
                    type="number"
                    value={formData.priorityRank}
                    onChange={(e) => setFormData({ ...formData, priorityRank: e.target.value })}
                    placeholder="Leave empty for auto"
                    className="mt-1 w-full rounded-xl border border-amber-300 bg-amber-50/40 p-2.5 font-bold text-navy focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ahmedabad"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Beds Capacity</label>
                  <input
                    type="number"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    placeholder="250"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Complete Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Area, City, State, PIN"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Emergency Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 79 4000 0000"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Accreditation Badge</label>
                  <input
                    type="text"
                    value={formData.accredited}
                    onChange={(e) => setFormData({ ...formData, accredited: e.target.value })}
                    placeholder="NABH / NABL Accredited"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Key Specialties (Comma Separated)</label>
                <textarea
                  rows={2}
                  value={formData.specialtiesInput}
                  onChange={(e) => setFormData({ ...formData, specialtiesInput: e.target.value })}
                  placeholder="Cardiology, Neurology, Joint Replacement, ICU"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Hospital Banner Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono text-slate-600 focus:border-teal-600 focus:outline-hidden"
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
                  Save Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
