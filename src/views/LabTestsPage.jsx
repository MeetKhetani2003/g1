// src/views/LabTestsPage.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  UploadCloud,
  CreditCard,
  Sparkles,
  Search,
  Filter,
  X,
  Phone,
  User,
  ArrowRight,
  Droplet,
} from "lucide-react";
import confetti from "canvas-confetti";
import { healthStore } from "../utils/healthStore";
import { useAuth } from "../context/AuthContext";
import { processRazorpayPayment } from "../utils/razorpay";
import { Link } from "../utils/navigation";

export default function LabTestsPage() {
  const { user } = useAuth();
  const [labTests, setLabTests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmedInquiry, setConfirmedInquiry] = useState(null);

  // Form state
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    slot: "07:30 AM - 08:30 AM (Fasting Sample)",
    address: "",
    notes: "",
    paymentMethod: "Razorpay",
    prescriptionFileName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLabTests(healthStore.getLabTests());
    const onStoreUpdate = () => setLabTests(healthStore.getLabTests());
    window.addEventListener("g1-store-update", onStoreUpdate);
    return () => window.removeEventListener("g1-store-update", onStoreUpdate);
  }, []);

  const openBookModal = (test) => {
    const patient = healthStore.getPatient(user);
    setSelectedTest(test);
    setForm({
      patientName: patient.name || user?.name || "",
      phone: patient.phone || user?.phone || "+91 98765 43210",
      email: patient.email || user?.email || "patient@example.com",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      slot: "07:30 AM - 08:30 AM (Fasting Sample)",
      address: patient.address || "Ahmedabad, Gujarat",
      notes: "",
      paymentMethod: "Razorpay",
      prescriptionFileName: "",
    });
    setConfirmedInquiry(null);
    setBookingModalOpen(true);
  };

  const categories = ["All", ...new Set(labTests.map((t) => t.category))];

  const filteredTests = labTests.filter((test) => {
    const matchCategory = selectedCategory === "All" || test.category === selectedCategory;
    const matchSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (form.paymentMethod === "Razorpay") {
      // Process Razorpay
      await processRazorpayPayment({
        amount: selectedTest.price,
        serviceTitle: "Diagnostic Lab Test",
        packageTitle: selectedTest.title,
        patient: {
          name: form.patientName,
          phone: form.phone,
          email: form.email,
        },
        onSuccess: (payRes) => {
          setIsSubmitting(false);
          const inq = healthStore.addLabInquiry({
            testTitle: selectedTest.title,
            patientName: form.patientName,
            phone: form.phone,
            email: form.email,
            amount: selectedTest.price,
            date: form.date,
            slot: form.slot,
            address: form.address,
            notes: form.notes,
            prescriptionUrl: form.prescriptionFileName ? "Uploaded by Patient" : null,
            paymentStatus: "PAID",
            paymentMethod: "Razorpay Online",
          });

          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch (err) {}

          setConfirmedInquiry(inq);
        },
        onFailure: (failRes) => {
          setIsSubmitting(false);
          // Save inquiry with pending payment
          const inq = healthStore.addLabInquiry({
            testTitle: selectedTest.title,
            patientName: form.patientName,
            phone: form.phone,
            email: form.email,
            amount: selectedTest.price,
            date: form.date,
            slot: form.slot,
            address: form.address,
            notes: `${form.notes ? form.notes + " | " : ""}Payment Attempt Incomplete: ${failRes.reason}`,
            paymentStatus: "FAILED_LEAD (Pay on Collection)",
            paymentMethod: "Razorpay Incomplete",
          });
          setConfirmedInquiry(inq);
        },
      });
    } else {
      // Pay on Collection
      setIsSubmitting(false);
      const inq = healthStore.addLabInquiry({
        testTitle: selectedTest.title,
        patientName: form.patientName,
        phone: form.phone,
        email: form.email,
        amount: selectedTest.price,
        date: form.date,
        slot: form.slot,
        address: form.address,
        notes: form.notes,
        paymentStatus: "Pay on Collection (Cash/UPI)",
        paymentMethod: "Cash on Collection",
      });
      setConfirmedInquiry(inq);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-slate-900 to-teal-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-bold text-teal-300 ring-1 ring-teal-400/30">
              <FlaskConical className="h-4 w-4" /> NABL & ICMR Certified Diagnostic Network
            </span>
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md"
              style={{ color: "#ffffff", textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}
            >
              Book Certified Lab Tests with Free Home Collection
            </h1>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed" style={{ color: "#f1f5f9" }}>
              100% accurate testing, cold-chain sample preservation, certified phlebotomists at your doorstep,
              and fast digital smart reports delivered in hours.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-teal-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free Doorstep Sample Pickup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Smart Digital Report via Email/SMS
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free Doctor Report Consultation
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-navy text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests (e.g., CBC, Thyroid, LFT)..."
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-navy placeholder-slate-400 focus:border-teal-600 focus:outline-hidden shadow-xs"
            />
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-teal-500/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
                    {test.category}
                  </span>
                  {test.popular && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                      Top Booked
                    </span>
                  )}
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-navy leading-tight">
                  {test.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">{test.description}</p>

                {/* Vitals badge row */}
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                    <FlaskConical className="h-3 w-3 text-teal-600" /> {test.parametersCount} Parameters
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                    <Droplet className="h-3 w-3 text-red-500" /> {test.sampleType}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                    <Clock className="h-3 w-3 text-amber-600" /> {test.turnaround}
                  </span>
                </div>

                {/* Inclusions list */}
                {test.inclusions && (
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Inclusions:
                    </span>
                    {test.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                    {test.inclusions.length > 3 && (
                      <p className="text-[11px] font-bold text-teal-700">
                        + {test.inclusions.length - 3} more tests included
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Price and CTA */}
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-xl font-black text-navy">₹{test.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    Save {test.discountPercentage || 50}% Today
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openBookModal(test)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                >
                  Book Test <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Home Collection Modal */}
      {bookingModalOpen && selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100">
            {confirmedInquiry ? (
              // Confirmation view
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy">
                  Lab Test Inquiry Confirmed!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your home sample collection has been scheduled. Our phlebotomist will arrive on{" "}
                  <strong className="text-navy">{confirmedInquiry.date}</strong> during the selected slot.
                </p>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inquiry ID:</span>
                    <span className="font-bold text-navy">{confirmedInquiry.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Test:</span>
                    <span className="font-bold text-navy">{confirmedInquiry.testTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Slot:</span>
                    <span className="font-bold text-navy">{confirmedInquiry.slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address:</span>
                    <span className="font-medium text-slate-700">{confirmedInquiry.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-bold text-emerald-700">{confirmedInquiry.paymentStatus}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-navy/90"
                  >
                    View in Profile / Close
                  </button>
                </div>
              </div>
            ) : (
              // Booking Form
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy">
                      Schedule Home Sample Collection
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedTest.title} · <strong className="text-emerald-700">₹{selectedTest.price}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        <User className="h-3 w-3" /> Patient Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.patientName}
                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Contact Phone
                      </label>
                      <input
                        type="text"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Time Slot
                      </label>
                      <select
                        value={form.slot}
                        onChange={(e) => setForm({ ...form, slot: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                      >
                        <option value="06:30 AM - 07:30 AM (Early Fasting)">06:30 AM - 07:30 AM (Early Fasting)</option>
                        <option value="07:30 AM - 08:30 AM (Fasting Sample)">07:30 AM - 08:30 AM (Fasting Sample)</option>
                        <option value="08:30 AM - 09:30 AM (Morning)">08:30 AM - 09:30 AM (Morning)</option>
                        <option value="11:00 AM - 01:00 PM (Afternoon)">11:00 AM - 01:00 PM (Afternoon)</option>
                        <option value="04:00 PM - 06:00 PM (Evening)">04:00 PM - 06:00 PM (Evening)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Sample Collection Address
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="House/Flat No., Landmark, City, Pincode"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <UploadCloud className="h-3 w-3 text-teal-600" /> Doctor's Prescription (Optional - MongoDB GridFS)
                      </span>
                      {form.prescriptionUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ Uploaded to GridFS
                        </span>
                      )}
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const fd = new FormData();
                          fd.append("file", file);
                          fd.append("type", "prescriptions");
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.url) {
                            setForm((prev) => ({
                              ...prev,
                              prescriptionFileName: file.name,
                              prescriptionUrl: data.url,
                            }));
                          }
                        } catch (err) {
                          console.error("Prescription upload error:", err);
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-teal-700"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Payment Option</label>
                    <div className="mt-1.5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: "Razorpay" })}
                        className={`rounded-2xl border p-3 text-left transition ${
                          form.paymentMethod === "Razorpay"
                            ? "border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="font-bold text-navy block">Pay Online (Razorpay)</span>
                        <span className="text-[10px] text-slate-500">UPI, Cards, NetBanking (₹{selectedTest.price})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: "COD" })}
                        className={`rounded-2xl border p-3 text-left transition ${
                          form.paymentMethod === "COD"
                            ? "border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="font-bold text-navy block">Pay on Sample Pickup</span>
                        <span className="text-[10px] text-slate-500">Pay phlebotomist directly</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setBookingModalOpen(false)}
                      className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-teal-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-teal-700 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Connecting..."
                        : form.paymentMethod === "Razorpay"
                        ? `Pay ₹${selectedTest.price} via Razorpay`
                        : "Confirm Free Home Pickup"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
