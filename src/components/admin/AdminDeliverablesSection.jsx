// src/components/admin/AdminDeliverablesSection.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Pill,
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
  FileText,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { healthStore } from "../../utils/healthStore";

export default function AdminDeliverablesSection() {
  const [activeTab, setActiveTab] = useState("labs"); // "labs" | "pharmacies"
  const [labs, setLabs] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  // Priority Rank quick-editing for Labs
  const [editingRankId, setEditingRankId] = useState(null);
  const [rankInput, setRankInput] = useState("");

  // Managing tests for a specific laboratory
  const [managingLabTests, setManagingLabTests] = useState(null);
  const [newTestForm, setNewTestForm] = useState({
    name: "",
    price: 399,
    originalPrice: 800,
    fasting: "10-12 hrs fasting",
    sample: "Blood",
    turnaround: "Report within 12 Hours",
  });

  // Managing inventory for a specific pharmacy
  const [managingPharmacyMedicines, setManagingPharmacyMedicines] = useState(null);
  const [newMedForm, setNewMedForm] = useState({
    name: "",
    category: "General Medicine",
    price: 150,
    discountPrice: 120,
    prescriptionRequired: false,
    inStock: true,
  });

  // Add / Edit Lab Modal
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [labFormData, setLabFormData] = useState({
    id: "",
    name: "",
    tagline: "",
    city: "Ahmedabad",
    address: "",
    phone: "",
    rating: 4.8,
    accreditation: "NABL / ICMR Approved",
    homeCollection: true,
    priorityRank: "",
  });

  // Add / Edit Pharmacy Modal
  const [pharmacyModalOpen, setPharmacyModalOpen] = useState(false);
  const [pharmacyFormData, setPharmacyFormData] = useState({
    id: "",
    name: "",
    tagline: "",
    city: "Ahmedabad",
    address: "",
    phone: "",
    rating: 4.8,
    deliveryTimeMinutes: 45,
    discountPercent: 18,
    licenseNumber: "GJ-AHM-2023-PH-991",
  });

  const loadData = () => {
    setLabs(healthStore.getLaboratories());
    setPharmacies(healthStore.getPharmacies());
    setOrders(healthStore.getPharmacyOrders());
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

  // Rank Save for Labs
  const handleLabRankSave = (labId) => {
    const rankVal = rankInput === "" ? null : Number(rankInput);
    healthStore.updateLabPriorityRank(labId, rankVal);
    setEditingRankId(null);
    setRankInput("");
    showToast("Laboratory priority rank updated successfully!");
  };

  // Add / Save Lab
  const handleSaveLab = (e) => {
    e.preventDefault();
    if (!labFormData.name.trim()) return;

    const payload = {
      id: labFormData.id || `lab-${Date.now()}`,
      name: labFormData.name.trim(),
      tagline: labFormData.tagline.trim(),
      city: labFormData.city.trim(),
      address: labFormData.address.trim(),
      phone: labFormData.phone.trim(),
      rating: Number(labFormData.rating) || 4.8,
      accreditation: labFormData.accreditation.trim(),
      homeCollection: Boolean(labFormData.homeCollection),
      priorityRank: labFormData.priorityRank === "" ? null : Number(labFormData.priorityRank),
      tests: labFormData.tests || [],
    };

    healthStore.saveLaboratory(payload);
    setLabModalOpen(false);
    showToast(`Laboratory "${payload.name}" saved!`);
  };

  // Add / Save Pharmacy
  const handleSavePharmacy = (e) => {
    e.preventDefault();
    if (!pharmacyFormData.name.trim()) return;

    const payload = {
      id: pharmacyFormData.id || `pharma-${Date.now()}`,
      name: pharmacyFormData.name.trim(),
      tagline: pharmacyFormData.tagline.trim(),
      city: pharmacyFormData.city.trim(),
      address: pharmacyFormData.address.trim(),
      phone: pharmacyFormData.phone.trim(),
      rating: Number(pharmacyFormData.rating) || 4.8,
      deliveryTimeMinutes: Number(pharmacyFormData.deliveryTimeMinutes) || 45,
      discountPercent: Number(pharmacyFormData.discountPercent) || 15,
      licenseNumber: pharmacyFormData.licenseNumber.trim(),
      inventory: pharmacyFormData.inventory || [],
    };

    healthStore.savePharmacy(payload);
    setPharmacyModalOpen(false);
    showToast(`Medical Store "${payload.name}" saved!`);
  };

  // Add Test to Laboratory
  const handleAddTestToLab = (e) => {
    e.preventDefault();
    if (!newTestForm.name.trim() || !managingLabTests) return;

    const testItem = {
      id: `test-${Date.now()}`,
      name: newTestForm.name.trim(),
      price: Number(newTestForm.price) || 0,
      originalPrice: Number(newTestForm.originalPrice) || 0,
      fasting: newTestForm.fasting.trim(),
      sample: newTestForm.sample.trim(),
      turnaround: newTestForm.turnaround.trim(),
    };

    const updatedLab = {
      ...managingLabTests,
      tests: [...(managingLabTests.tests || []), testItem],
    };

    healthStore.saveLaboratory(updatedLab);
    setManagingLabTests(updatedLab);
    setNewTestForm({
      name: "",
      price: 399,
      originalPrice: 800,
      fasting: "10-12 hrs fasting",
      sample: "Blood",
      turnaround: "Report within 12 Hours",
    });
    showToast(`Added test "${testItem.name}" to ${managingLabTests.name}`);
  };

  const handleDeleteTestFromLab = (testId) => {
    if (!managingLabTests) return;
    const updatedLab = {
      ...managingLabTests,
      tests: (managingLabTests.tests || []).filter((t) => t.id !== testId),
    };
    healthStore.saveLaboratory(updatedLab);
    setManagingLabTests(updatedLab);
    showToast("Test removed from laboratory catalog.");
  };

  // Add Medicine to Pharmacy
  const handleAddMedToPharmacy = (e) => {
    e.preventDefault();
    if (!newMedForm.name.trim() || !managingPharmacyMedicines) return;

    const medItem = {
      id: `med-${Date.now()}`,
      name: newMedForm.name.trim(),
      category: newMedForm.category.trim(),
      price: Number(newMedForm.price) || 0,
      discountPrice: Number(newMedForm.discountPrice) || 0,
      prescriptionRequired: Boolean(newMedForm.prescriptionRequired),
      inStock: Boolean(newMedForm.inStock),
    };

    const updatedPharmacy = {
      ...managingPharmacyMedicines,
      inventory: [...(managingPharmacyMedicines.inventory || []), medItem],
    };

    healthStore.savePharmacy(updatedPharmacy);
    setManagingPharmacyMedicines(updatedPharmacy);
    setNewMedForm({
      name: "",
      category: "General Medicine",
      price: 150,
      discountPrice: 120,
      prescriptionRequired: false,
      inStock: true,
    });
    showToast(`Added medicine "${medItem.name}" to ${managingPharmacyMedicines.name}`);
  };

  const handleDeleteMedFromPharmacy = (medId) => {
    if (!managingPharmacyMedicines) return;
    const updatedPharmacy = {
      ...managingPharmacyMedicines,
      inventory: (managingPharmacyMedicines.inventory || []).filter((m) => m.id !== medId),
    };
    healthStore.savePharmacy(updatedPharmacy);
    setManagingPharmacyMedicines(updatedPharmacy);
    showToast("Medicine removed from pharmacy inventory.");
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
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-navy">
                Laboratories & Medical Stores Deliverable Network
              </h1>
              <p className="text-xs text-slate-500">
                Manage diagnostic laboratories, their individual test menus & priority ranks, plus medical store pharmacies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "labs" ? (
            <button
              type="button"
              onClick={() => {
                setLabFormData({
                  id: "",
                  name: "",
                  tagline: "NABL Certified Diagnostic Center",
                  city: "Ahmedabad",
                  address: "Commerce Six Roads, Navrangpura",
                  phone: "+91 79 2640 0000",
                  rating: 4.8,
                  accreditation: "NABL / ICMR Approved",
                  homeCollection: true,
                  priorityRank: "",
                });
                setLabModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 transition"
            >
              <Plus className="h-4 w-4" /> Add Partner Laboratory
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPharmacyFormData({
                  id: "",
                  name: "",
                  tagline: "24x7 Prescription Deliveries",
                  city: "Ahmedabad",
                  address: "Near Drive-In Cinema, Thaltej",
                  phone: "+91 79 2749 0000",
                  rating: 4.8,
                  deliveryTimeMinutes: 45,
                  discountPercent: 18,
                  licenseNumber: "GJ-AHM-2023-PH-992",
                });
                setPharmacyModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan-700 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-cyan-800 transition"
            >
              <Plus className="h-4 w-4" /> Add Partner Medical Store
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("labs")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-bold transition ${
            activeTab === "labs"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-navy"
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          Laboratories & Tests Catalog ({labs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pharmacies")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-bold transition ${
            activeTab === "pharmacies"
              ? "border-cyan-700 text-cyan-800"
              : "border-transparent text-slate-500 hover:text-navy"
          }`}
        >
          <Pill className="h-4 w-4" />
          Medical Stores & Deliveries ({pharmacies.length})
        </button>
      </div>

      {/* TAB 1: LABORATORIES */}
      {activeTab === "labs" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs text-teal-900 flex items-center justify-between">
            <span className="font-semibold">
              Tip: Click on <strong>"Manage Tests"</strong> on any lab to add, edit, or remove the individual diagnostic tests performed by that specific laboratory. Set Priority Rank to position featured labs first.
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4 w-28">Priority Rank</th>
                    <th className="p-4">Laboratory Name & City</th>
                    <th className="p-4">Accreditation</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Home Collection</th>
                    <th className="p-4">Lab Tests Offered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {labs.map((lab) => (
                    <tr key={lab.id} className="hover:bg-slate-50/70 transition">
                      {/* Priority Rank */}
                      <td className="p-4">
                        {editingRankId === lab.id ? (
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
                              onClick={() => handleLabRankSave(lab.id)}
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
                              setEditingRankId(lab.id);
                              setRankInput(lab.priorityRank ?? "");
                            }}
                            className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-black transition ${
                              lab.priorityRank
                                ? "bg-amber-100 text-amber-900 ring-1 ring-amber-400/60 shadow-xs"
                                : "bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-700"
                            }`}
                            title="Click to set priority rank"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                            {lab.priorityRank ? `#${lab.priorityRank}` : "Set Rank"}
                          </button>
                        )}
                      </td>

                      {/* Lab Name */}
                      <td className="p-4">
                        <p className="font-bold text-navy text-sm">{lab.name}</p>
                        <p className="text-[11px] text-slate-500">{lab.tagline || lab.address}</p>
                        <span className="text-[10px] text-teal-700 font-semibold">{lab.city}</span>
                      </td>

                      {/* Accreditation */}
                      <td className="p-4">
                        <span className="inline-block rounded-md bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
                          {lab.accreditation || "Accredited"}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="p-4 font-mono text-slate-700">{lab.phone}</td>

                      {/* Home Collection */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            lab.homeCollection
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lab.homeCollection ? "Available" : "At Lab Only"}
                        </span>
                      </td>

                      {/* Tests Offered */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-navy">
                            {lab.tests?.length || 0} Tests
                          </span>
                          <button
                            type="button"
                            onClick={() => setManagingLabTests(lab)}
                            className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-[11px] font-bold text-teal-800 hover:bg-teal-600 hover:text-white transition"
                          >
                            Manage Tests →
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            setLabFormData({
                              id: lab.id,
                              name: lab.name,
                              tagline: lab.tagline || "",
                              city: lab.city || "Ahmedabad",
                              address: lab.address || "",
                              phone: lab.phone || "",
                              rating: lab.rating || 4.8,
                              accreditation: lab.accreditation || "NABL",
                              homeCollection: lab.homeCollection ?? true,
                              priorityRank: lab.priorityRank ?? "",
                              tests: lab.tests || [],
                            });
                            setLabModalOpen(true);
                          }}
                          className="rounded-full p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition"
                          title="Edit Lab"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete laboratory "${lab.name}" and all its tests?`)) {
                              healthStore.deleteLaboratory(lab.id);
                              showToast(`Removed "${lab.name}"`);
                            }
                          }}
                          className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Lab"
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
        </div>
      )}

      {/* TAB 2: MEDICAL STORES */}
      {activeTab === "pharmacies" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-3.5 text-xs text-cyan-900 flex items-center justify-between">
            <span className="font-semibold">
              Manage retail pharmacies, prescription upload dispatch radius, medicine inventory catalogs, and discount percentages.
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Medical Store Name</th>
                    <th className="p-4">License Number</th>
                    <th className="p-4">Delivery Speed</th>
                    <th className="p-4">Discount Offered</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Medicine Inventory</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pharmacies.map((pharma) => (
                    <tr key={pharma.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <p className="font-bold text-navy text-sm">{pharma.name}</p>
                        <span className="text-[11px] text-slate-500">{pharma.address}, {pharma.city}</span>
                      </td>

                      <td className="p-4 font-mono text-slate-700 font-bold">{pharma.licenseNumber}</td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900">
                          <Clock className="h-3 w-3 text-amber-600" />
                          ~{pharma.deliveryTimeMinutes} mins
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-black">
                          {pharma.discountPercent}% OFF
                        </span>
                      </td>

                      <td className="p-4 font-mono text-slate-700">{pharma.phone}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-navy">
                            {pharma.inventory?.length || 0} Items
                          </span>
                          <button
                            type="button"
                            onClick={() => setManagingPharmacyMedicines(pharma)}
                            className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-[11px] font-bold text-cyan-800 hover:bg-cyan-700 hover:text-white transition"
                          >
                            Manage Medicines →
                          </button>
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPharmacyFormData({
                              id: pharma.id,
                              name: pharma.name,
                              tagline: pharma.tagline || "",
                              city: pharma.city || "Ahmedabad",
                              address: pharma.address || "",
                              phone: pharma.phone || "",
                              rating: pharma.rating || 4.8,
                              deliveryTimeMinutes: pharma.deliveryTimeMinutes || 45,
                              discountPercent: pharma.discountPercent || 15,
                              licenseNumber: pharma.licenseNumber || "",
                              inventory: pharma.inventory || [],
                            });
                            setPharmacyModalOpen(true);
                          }}
                          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-navy transition"
                          title="Edit Pharmacy"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete medical store "${pharma.name}"?`)) {
                              healthStore.deletePharmacy(pharma.id);
                              showToast(`Removed "${pharma.name}"`);
                            }
                          }}
                          className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Pharmacy"
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
        </div>
      )}

      {/* MANAGE LAB TESTS DRAWER / MODAL */}
      {managingLabTests && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700">{managingLabTests.id}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Lab Tests Conducted by {managingLabTests.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Add, update or remove tests performed specifically at this center.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManagingLabTests(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form to Add Test to Lab */}
            <form onSubmit={handleAddTestToLab} className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 space-y-3 text-xs">
              <span className="font-bold uppercase text-[10px] text-teal-900 block">
                Add New Lab Test to this Laboratory
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Test Title / Package Name</label>
                  <input
                    type="text"
                    required
                    value={newTestForm.name}
                    onChange={(e) => setNewTestForm({ ...newTestForm, name: e.target.value })}
                    placeholder="e.g. Complete Hemogram (CBC)"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Special Discount Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newTestForm.price}
                    onChange={(e) => setNewTestForm({ ...newTestForm, price: e.target.value })}
                    placeholder="399"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-bold text-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Fasting Requirement</label>
                  <input
                    type="text"
                    value={newTestForm.fasting}
                    onChange={(e) => setNewTestForm({ ...newTestForm, fasting: e.target.value })}
                    placeholder="10-12 hrs fasting"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Sample Type</label>
                  <input
                    type="text"
                    value={newTestForm.sample}
                    onChange={(e) => setNewTestForm({ ...newTestForm, sample: e.target.value })}
                    placeholder="Blood / Urine"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Report Turnaround</label>
                  <input
                    type="text"
                    value={newTestForm.turnaround}
                    onChange={(e) => setNewTestForm({ ...newTestForm, turnaround: e.target.value })}
                    placeholder="Report within 12 Hours"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="rounded-full bg-teal-700 px-5 py-2 font-bold text-white hover:bg-teal-800"
                >
                  + Add Test to Catalog
                </button>
              </div>
            </form>

            {/* Existing tests list */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-navy uppercase text-[10px]">
                Currently Configured Tests ({managingLabTests.tests?.length || 0})
              </span>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Test Title</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Sample</th>
                      <th className="p-3">Turnaround</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {managingLabTests.tests?.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-bold text-navy">{t.name}</p>
                          <span className="text-[10px] text-slate-500">{t.fasting}</span>
                        </td>
                        <td className="p-3 font-black text-navy">₹{t.price}</td>
                        <td className="p-3 text-slate-600">{t.sample}</td>
                        <td className="p-3 text-slate-600">{t.turnaround}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteTestFromLab(t.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE PHARMACY MEDICINES MODAL */}
      {managingPharmacyMedicines && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-800">{managingPharmacyMedicines.id}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Inventory for {managingPharmacyMedicines.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Manage medicine SKUs, OTC vs prescription requirements, and stock availability.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManagingPharmacyMedicines(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form to Add Medicine */}
            <form onSubmit={handleAddMedToPharmacy} className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4 space-y-3 text-xs">
              <span className="font-bold uppercase text-[10px] text-cyan-900 block">
                Add Medicine to Store Inventory
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Medicine Name & Dosage</label>
                  <input
                    type="text"
                    required
                    value={newMedForm.name}
                    onChange={(e) => setNewMedForm({ ...newMedForm, name: e.target.value })}
                    placeholder="e.g. Paracetamol 650mg"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <input
                    type="text"
                    value={newMedForm.category}
                    onChange={(e) => setNewMedForm({ ...newMedForm, category: e.target.value })}
                    placeholder="Fever & Pain / Antibiotics"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">MRP (₹)</label>
                  <input
                    type="number"
                    value={newMedForm.price}
                    onChange={(e) => setNewMedForm({ ...newMedForm, price: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={newMedForm.discountPrice}
                    onChange={(e) => setNewMedForm({ ...newMedForm, discountPrice: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Rx Required?</label>
                  <select
                    value={newMedForm.prescriptionRequired ? "yes" : "no"}
                    onChange={(e) => setNewMedForm({ ...newMedForm, prescriptionRequired: e.target.value === "yes" })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
                  >
                    <option value="no">No (OTC)</option>
                    <option value="yes">Yes (Prescription Required)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="rounded-full bg-cyan-700 px-5 py-2 font-bold text-white hover:bg-cyan-800"
                >
                  + Add Medicine to Inventory
                </button>
              </div>
            </form>

            {/* Inventory Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Medicine Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Prescription</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managingPharmacyMedicines.inventory?.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-navy">{m.name}</td>
                      <td className="p-3 text-slate-600">{m.category}</td>
                      <td className="p-3">
                        <span className="font-black text-navy">₹{m.discountPrice || m.price}</span>
                        {m.price && m.discountPrice && (
                          <span className="ml-1 text-[10px] text-slate-400 line-through">₹{m.price}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            m.prescriptionRequired
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {m.prescriptionRequired ? "Rx Required" : "OTC"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteMedFromPharmacy(m.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT LAB MODAL */}
      {labModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">
                {labFormData.id ? "Edit Laboratory" : "Add Partner Diagnostic Lab"}
              </h3>
              <button
                type="button"
                onClick={() => setLabModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLab} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Laboratory Name</label>
                <input
                  type="text"
                  required
                  value={labFormData.name}
                  onChange={(e) => setLabFormData({ ...labFormData, name: e.target.value })}
                  placeholder="e.g. Sterling Accuris Diagnostics"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Accreditation</label>
                  <input
                    type="text"
                    value={labFormData.accreditation}
                    onChange={(e) => setLabFormData({ ...labFormData, accreditation: e.target.value })}
                    placeholder="NABL / ICMR Approved"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Priority Rank (1 = Top)</label>
                  <input
                    type="number"
                    value={labFormData.priorityRank}
                    onChange={(e) => setLabFormData({ ...labFormData, priorityRank: e.target.value })}
                    placeholder="Leave empty for auto"
                    className="mt-1 w-full rounded-xl border border-amber-300 bg-amber-50/40 p-2 font-bold text-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={labFormData.city}
                    onChange={(e) => setLabFormData({ ...labFormData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    value={labFormData.phone}
                    onChange={(e) => setLabFormData({ ...labFormData, phone: e.target.value })}
                    placeholder="+91 79 4000 0000"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-mono text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Center Address</label>
                <input
                  type="text"
                  value={labFormData.address}
                  onChange={(e) => setLabFormData({ ...labFormData, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLabModalOpen(false)}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-teal-600 px-6 py-2 font-bold text-white shadow hover:bg-teal-700"
                >
                  Save Laboratory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PHARMACY MODAL */}
      {pharmacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">
                {pharmacyFormData.id ? "Edit Medical Store" : "Add Partner Medical Store"}
              </h3>
              <button
                type="button"
                onClick={() => setPharmacyModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePharmacy} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Medical Store / Pharmacy Name</label>
                <input
                  type="text"
                  required
                  value={pharmacyFormData.name}
                  onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, name: e.target.value })}
                  placeholder="e.g. Apollo Pharmacy 24x7"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Drug License Number</label>
                  <input
                    type="text"
                    value={pharmacyFormData.licenseNumber}
                    onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, licenseNumber: e.target.value })}
                    placeholder="GJ-AHM-2023-PH-991"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-mono text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Delivery Speed (Mins)</label>
                  <input
                    type="number"
                    value={pharmacyFormData.deliveryTimeMinutes}
                    onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, deliveryTimeMinutes: e.target.value })}
                    placeholder="45"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={pharmacyFormData.city}
                    onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Discount Offered (%)</label>
                  <input
                    type="number"
                    value={pharmacyFormData.discountPercent}
                    onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, discountPercent: e.target.value })}
                    placeholder="18"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Store Address</label>
                <input
                  type="text"
                  value={pharmacyFormData.address}
                  onChange={(e) => setPharmacyFormData({ ...pharmacyFormData, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-navy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPharmacyModalOpen(false)}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-cyan-700 px-6 py-2 font-bold text-white shadow hover:bg-cyan-800"
                >
                  Save Medical Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
