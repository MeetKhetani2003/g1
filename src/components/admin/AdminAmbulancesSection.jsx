// src/components/admin/AdminAmbulancesSection.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Plus,
  Trash2,
  Edit,
  Phone,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { healthStore } from "../../utils/healthStore";

export default function AdminAmbulancesSection() {
  const [ambulances, setAmbulances] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("fleet"); // "fleet" | "bookings"
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    vehicleNumber: "GJ-01-AX-9901",
    hospitalName: "Apollo Hospitals International",
    specialty: "Advanced Cardiac & ICU on Wheels",
    driverName: "Ramesh Solanki",
    driverPhone: "+91 98251 44556",
    status: "Available",
    baseLocation: "Bhat, Gandhinagar - Ahmedabad Ring Road",
    city: "Ahmedabad",
    responseTimeMinutes: 10,
    equipmentInput: "Ventilator, Defibrillator, Syringe Pump, Multi-para Monitor, 2x Jumbo Oxygen Cylinders, Spine Board",
  });

  const loadData = () => {
    setAmbulances(healthStore.getAmbulances());
    setBookings(healthStore.getAmbulanceBookings());
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

  const handleOpenAdd = () => {
    setFormData({
      id: "",
      vehicleNumber: `GJ-01-HC-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalName: "Zydus Hospital",
      specialty: "ICU on Wheels (Ventilator Equipped)",
      driverName: "Dinesh Patel",
      driverPhone: "+91 98250 88990",
      status: "Available",
      baseLocation: "SG Highway, Thaltej",
      city: "Ahmedabad",
      responseTimeMinutes: 12,
      equipmentInput: "Defibrillator, Ventilator, Oxygen Flowmeter, Emergency Cardiac Drug Kit, BLS Stretcher",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (amb) => {
    setFormData({
      id: amb.id,
      vehicleNumber: amb.vehicleNumber || "",
      hospitalName: amb.hospitalName || "",
      specialty: amb.specialty || "",
      driverName: amb.driverName || "",
      driverPhone: amb.driverPhone || "",
      status: amb.status || "Available",
      baseLocation: amb.baseLocation || "",
      city: amb.city || "Ahmedabad",
      responseTimeMinutes: amb.responseTimeMinutes || 12,
      equipmentInput: Array.isArray(amb.equipment) ? amb.equipment.join(", ") : "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicleNumber.trim() || !formData.hospitalName.trim()) {
      alert("Please provide vehicle number and hospital name.");
      return;
    }

    const payload = {
      id: formData.id || `amb-${Date.now()}`,
      vehicleNumber: formData.vehicleNumber.trim(),
      hospitalName: formData.hospitalName.trim(),
      specialty: formData.specialty.trim(),
      driverName: formData.driverName.trim(),
      driverPhone: formData.driverPhone.trim(),
      status: formData.status,
      baseLocation: formData.baseLocation.trim(),
      city: formData.city.trim(),
      responseTimeMinutes: Number(formData.responseTimeMinutes) || 12,
      equipment: formData.equipmentInput
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
    };

    healthStore.saveAmbulance(payload);
    setIsModalOpen(false);
    showToast(`Ambulance "${payload.vehicleNumber}" saved!`);
  };

  const handleDelete = (amb) => {
    if (confirm(`Remove ambulance "${amb.vehicleNumber}" (${amb.hospitalName}) from 24x7 emergency network?`)) {
      healthStore.deleteAmbulance(amb.id);
      showToast(`Removed "${amb.vehicleNumber}"`);
    }
  };

  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    healthStore.updateAmbulanceBookingStatus(bookingId, newStatus);
    showToast(`Dispatch status updated to "${newStatus}"!`);
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
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-navy">
                Ambulance Fleet & 24x7 Dispatch Desk
              </h1>
              <p className="text-xs text-slate-500">
                Manage hospital-affiliated ambulances, vehicle registration numbers, ICU specialties, and emergency dispatches.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-red-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Ambulance Vehicle
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab("fleet")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-bold transition ${
            activeSubTab === "fleet"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-navy"
          }`}
        >
          <Truck className="h-4 w-4" />
          Active Fleet ({ambulances.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("bookings")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-bold transition ${
            activeSubTab === "bookings"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-navy"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Emergency Dispatches ({bookings.length})
        </button>
      </div>

      {/* SUBTAB 1: FLEET LIST */}
      {activeSubTab === "fleet" && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Vehicle Number</th>
                  <th className="p-4">Affiliated Hospital</th>
                  <th className="p-4">Specialty & Category</th>
                  <th className="p-4">Driver & Contact</th>
                  <th className="p-4">Base Station & City</th>
                  <th className="p-4">Equipment Onboard</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ambulances.map((amb) => (
                  <tr key={amb.id} className="hover:bg-slate-50/70 transition">
                    {/* Vehicle Number */}
                    <td className="p-4">
                      <span className="font-mono font-black text-sm text-navy bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {amb.vehicleNumber}
                      </span>
                    </td>

                    {/* Hospital Name */}
                    <td className="p-4">
                      <p className="font-bold text-navy">{amb.hospitalName}</p>
                      <span className="text-[11px] text-slate-500">G1 Empanelled Fleet</span>
                    </td>

                    {/* Specialty */}
                    <td className="p-4">
                      <span className="inline-block rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-800">
                        {amb.specialty}
                      </span>
                    </td>

                    {/* Driver */}
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{amb.driverName}</p>
                      <a
                        href={`tel:${amb.driverPhone}`}
                        className="inline-flex items-center gap-1 font-mono text-teal-700 hover:underline text-[11px]"
                      >
                        <Phone className="h-3 w-3" /> {amb.driverPhone}
                      </a>
                    </td>

                    {/* Base Station */}
                    <td className="p-4">
                      <p className="font-medium text-slate-700">{amb.baseLocation}</p>
                      <span className="text-[11px] text-slate-500">{amb.city} · ~{amb.responseTimeMinutes} mins</span>
                    </td>

                    {/* Equipment */}
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {amb.equipment?.slice(0, 3).map((eq, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-700"
                          >
                            {eq}
                          </span>
                        ))}
                        {amb.equipment?.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-bold">
                            +{amb.equipment.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          amb.status === "Available"
                            ? "bg-emerald-100 text-emerald-800"
                            : amb.status === "On Duty"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            amb.status === "Available"
                              ? "bg-emerald-500 animate-pulse"
                              : amb.status === "On Duty"
                              ? "bg-amber-500"
                              : "bg-slate-500"
                          }`}
                        />
                        {amb.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(amb)}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-navy transition"
                        title="Edit Ambulance"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(amb)}
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
      )}

      {/* SUBTAB 2: EMERGENCY DISPATCHES LOG */}
      {activeSubTab === "bookings" && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Truck className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm text-slate-600">No emergency dispatches requested yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Dispatches triggered from the public 24x7 Ambulance page will appear here immediately.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Dispatch ID</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Pickup Address</th>
                    <th className="p-4">Emergency Type</th>
                    <th className="p-4">Assigned Vehicle</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-mono font-bold text-teal-700">{b.id}</td>
                      <td className="p-4 font-bold text-navy">{b.patientName}</td>
                      <td className="p-4 font-mono text-slate-700">{b.contactPhone}</td>
                      <td className="p-4 max-w-xs truncate text-slate-600">{b.pickupAddress}</td>
                      <td className="p-4">
                        <span className="rounded-md bg-red-100 text-red-800 px-2 py-0.5 font-bold text-[10px]">
                          {b.emergencyType || "Critical Emergency"}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-navy">{b.vehicleNumber}</p>
                        <span className="text-[10px] text-slate-500">{b.hospitalName}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                            b.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "Dispatched"
                              ? "bg-blue-100 text-blue-800"
                              : b.status === "Arrived"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status || "Pending"}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Arrived">Arrived</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">
                {formData.id ? "Edit Ambulance" : "Add Emergency Ambulance"}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Vehicle Registration Number</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="e.g. GJ-01-AX-9901"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold text-navy focus:border-red-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Hospital Affiliation</label>
                  <input
                    type="text"
                    required
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    placeholder="e.g. Apollo Hospitals"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-red-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Specialty / Category</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-red-600 focus:outline-hidden"
                >
                  <option value="Advanced Cardiac & ICU on Wheels">Advanced Cardiac & ICU on Wheels</option>
                  <option value="ICU on Wheels (Ventilator Equipped)">ICU on Wheels (Ventilator Equipped)</option>
                  <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                  <option value="Neonatal & Pediatric Care ICU">Neonatal & Pediatric Care ICU</option>
                  <option value="Patient Transport Van">Patient Transport Van</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Driver / EMT Name</label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    placeholder="e.g. Ramesh Solanki"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium text-navy focus:border-red-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Driver Phone (24x7 Direct)</label>
                  <input
                    type="text"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    placeholder="+91 98250 00000"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono text-navy focus:border-red-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ahmedabad"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-red-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Avg ETA (Mins)</label>
                  <input
                    type="number"
                    value={formData.responseTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, responseTimeMinutes: e.target.value })}
                    placeholder="10"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-red-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-red-600 focus:outline-hidden"
                  >
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Base Station Address</label>
                <input
                  type="text"
                  value={formData.baseLocation}
                  onChange={(e) => setFormData({ ...formData, baseLocation: e.target.value })}
                  placeholder="e.g. Ring Road Junction, Bhat Circle"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-red-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Life-Saving Equipment (Comma Separated)</label>
                <textarea
                  rows={2}
                  value={formData.equipmentInput}
                  onChange={(e) => setFormData({ ...formData, equipmentInput: e.target.value })}
                  placeholder="Ventilator, Defibrillator, Syringe Pump, Jumbo Oxygen"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-red-600 focus:outline-hidden"
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
                  className="rounded-full bg-red-600 px-6 py-2 font-bold text-white shadow hover:bg-red-700"
                >
                  Save Ambulance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
