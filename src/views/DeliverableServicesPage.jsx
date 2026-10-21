// src/views/DeliverableServicesPage.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Pill,
  Search,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  UploadCloud,
  FileText,
  X,
  Truck,
  Percent,
  Plus,
} from "lucide-react";
import confetti from "canvas-confetti";
import { healthStore } from "../utils/healthStore";
import { useAuth } from "../context/AuthContext";

export default function DeliverableServicesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("laboratories"); // 'laboratories' | 'pharmacies'
  const [laboratories, setLaboratories] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Detailed modal views
  const [activeLabDetail, setActiveLabDetail] = useState(null);
  const [activePharmacyDetail, setActivePharmacyDetail] = useState(null);

  // Test Booking / Medicine Order Modal
  const [bookingTest, setBookingTest] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderForm, setOrderForm] = useState({
    patientName: "",
    phone: "",
    address: "",
    notes: "",
    prescriptionUrl: "",
  });

  const loadData = () => {
    setLaboratories(healthStore.getLaboratories());
    setPharmacies(healthStore.getPharmacies());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("g1-store-update", handleUpdate);
    return () => window.removeEventListener("g1-store-update", handleUpdate);
  }, []);

  useEffect(() => {
    if (user) {
      const p = healthStore.getPatient(user);
      setOrderForm((prev) => ({
        ...prev,
        patientName: p?.name || user?.name || "",
        phone: p?.phone || user?.phone || "",
        address: p?.address || "",
      }));
    }
  }, [user]);

  const filteredLabs = laboratories.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      (l.tests || []).some((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    );
  });

  const filteredPharmacies = pharmacies.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      (p.popularMedicines || []).some((m) => m.name.toLowerCase().includes(q))
    );
  });

  const handleBookLabTest = (test, lab) => {
    setBookingTest({ test, lab });
    setOrderSuccess(null);
    setOrderModalOpen(true);
  };

  const handleOrderMeds = (pharmacy, item = null) => {
    setBookingTest({ pharmacy, item });
    setOrderSuccess(null);
    setOrderModalOpen(true);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!orderForm.patientName || !orderForm.phone || !orderForm.address) {
      alert("Please enter patient name, phone number, and delivery address.");
      return;
    }

    if (bookingTest?.test) {
      // Lab test inquiry
      const res = healthStore.addLabInquiry({
        testTitle: `${bookingTest.test.name} (${bookingTest.lab.name})`,
        patientName: orderForm.patientName,
        phone: orderForm.phone,
        address: orderForm.address,
        amount: bookingTest.test.price,
        notes: orderForm.notes || "Home sample collection requested",
        status: "Phlebotomist Assigned",
      });
      setOrderSuccess({ type: "lab", ...res });
    } else if (bookingTest?.pharmacy) {
      // Pharmacy medicine order
      const res = healthStore.savePharmacyOrder({
        pharmacyName: bookingTest.pharmacy.name,
        patientName: orderForm.patientName,
        phone: orderForm.phone,
        deliveryAddress: orderForm.address,
        medicines: bookingTest.item ? [bookingTest.item.name] : ["Prescription Delivery Order"],
        totalAmount: bookingTest.item ? bookingTest.item.price : 250,
      });
      setOrderSuccess({ type: "med", ...res });
    }

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-cream/40">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy text-white py-12 sm:py-16 px-4 sm:px-6 border-b border-line">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            Deliverable Healthcare Services
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
            Laboratories & Medical Stores Network <br />
            <span className="text-teal-400">Diagnostic Pathology & Express Prescription Delivery</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Explore accredited clinical laboratories with test-by-test pricing, or order from verified 24x7 pharmacies with discounts and door-step delivery.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-white shadow-xl shadow-navy/20 p-2 border border-slate-200">
              <Search className="h-5 w-5 text-teal-600 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labs, medical stores, tests e.g. CBC, Lipid, BP meds, NovaPath..."
                className="w-full bg-transparent px-3 py-2 text-sm font-semibold text-navy placeholder:text-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-2 text-xs text-slate-400 hover:text-navy"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Primary Tab Navigation */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("laboratories");
                setActiveLabDetail(null);
                setActivePharmacyDetail(null);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === "laboratories"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
              }`}
            >
              <FlaskConical className="h-4 w-4" /> Diagnostic Laboratories ({laboratories.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("pharmacies");
                setActiveLabDetail(null);
                setActivePharmacyDetail(null);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === "pharmacies"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
              }`}
            >
              <Pill className="h-4 w-4" /> Medical Stores & Pharmacies ({pharmacies.length})
            </button>
          </div>

          <span className="text-xs text-slate-400 font-bold hidden sm:block">
            Sorted by Admin Priority Ranking
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* TAB 1: DIAGNOSTIC LABORATORIES */}
        {activeTab === "laboratories" && (
          <div className="space-y-8">
            {activeLabDetail ? (
              /* Inside View of A Specific Laboratory */
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() => setActiveLabDetail(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-900 transition"
                >
                  ← Back to All Laboratories
                </button>

                {/* Laboratory Banner Header */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-teal-100 text-teal-800 px-3 py-0.5 text-[11px] font-extrabold uppercase">
                          Priority #{activeLabDetail.priorityRank} Lab
                        </span>
                        <span className="rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 px-2.5 py-0.5 text-[11px] font-bold">
                          {activeLabDetail.accreditation}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-black text-navy mt-1.5">
                        {activeLabDetail.name}
                      </h2>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {activeLabDetail.address}
                        <span>·</span>
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {activeLabDetail.timing}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1 text-sm font-bold text-amber-600">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {activeLabDetail.rating} ({activeLabDetail.reviewsCount} Patient Reviews)
                      </div>
                      <a
                        href={`tel:${activeLabDetail.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline mt-1"
                      >
                        <Phone className="h-3 w-3" /> {activeLabDetail.phone}
                      </a>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeLabDetail.about}
                  </p>
                </div>

                {/* Tests Offered By This Laboratory */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-black text-navy">
                        All Tests Available at {activeLabDetail.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select any test to schedule home sample collection or direct lab walk-in.
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
                      {(activeLabDetail.tests || []).length} Tests Listed
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(activeLabDetail.tests || []).map((test) => (
                      <div
                        key={test.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              {test.code}
                            </span>
                            <span className="rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold">
                              {test.category}
                            </span>
                          </div>

                          <h4 className="font-display text-sm font-extrabold text-navy">
                            {test.name}
                          </h4>

                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {test.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-slate-600 pt-1">
                            <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-teal-800 font-semibold">
                              Sample: {test.sampleType}
                            </span>
                            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-800 font-semibold">
                              ⏱ {test.turnaroundTime}
                            </span>
                            {test.fastingRequired && (
                              <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-rose-800 font-semibold">
                                Fasting Required
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-display text-base font-black text-navy">₹{test.price}</span>
                              <span className="text-[11px] text-slate-400 line-through">₹{test.originalPrice}</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700">
                              {test.discount}% Off Today
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleBookLabTest(test, activeLabDetail)}
                            className="rounded-full bg-teal-600 hover:bg-teal-700 px-4 py-1.5 text-xs font-bold text-white shadow transition cursor-pointer"
                          >
                            Book Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* All Laboratories Listing Cards */
              <div className="grid md:grid-cols-3 gap-6">
                {filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-teal-100 text-teal-800 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider">
                          Rank #{lab.priorityRank}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {lab.rating} ({lab.reviewsCount})
                        </span>
                      </div>

                      <img
                        src={lab.image}
                        alt={lab.name}
                        className="h-40 w-full rounded-2xl object-cover border border-slate-100"
                      />

                      <div>
                        <span className="text-[10px] uppercase font-bold text-cyan-700 block">
                          {lab.accreditation}
                        </span>
                        <h3 className="font-display text-base font-black text-navy mt-0.5">
                          {lab.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {lab.address}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-100">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Tests Catalog</span>
                          <strong className="text-navy">{(lab.tests || []).length} Available Tests</strong>
                        </div>
                        <div className="flex items-center justify-between text-emerald-700 font-semibold">
                          <span>Home Collection</span>
                          <span>{lab.homeCollectionAvailable ? "✓ Free Available" : "Lab Walk-in"}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveLabDetail(lab)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold text-white shadow transition hover:opacity-95 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                    >
                      <span>Explore Lab Tests ({(lab.tests || []).length})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MEDICAL STORES / PHARMACIES */}
        {activeTab === "pharmacies" && (
          <div className="space-y-8">
            {activePharmacyDetail ? (
              /* Inside View of Specific Pharmacy */
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() => setActivePharmacyDetail(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-900 transition"
                >
                  ← Back to All Medical Stores
                </button>

                {/* Pharmacy Banner Header */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-teal-100 text-teal-800 px-3 py-0.5 text-[11px] font-extrabold uppercase">
                          Priority #{activePharmacyDetail.priorityRank} Chemist
                        </span>
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold">
                          {activePharmacyDetail.discountPercent}% Off All Orders
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-black text-navy mt-1.5">
                        {activePharmacyDetail.name}
                      </h2>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {activePharmacyDetail.address}
                        <span>·</span>
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {activePharmacyDetail.openHours}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="rounded-full bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 text-xs font-bold block mb-1">
                        ⚡ {activePharmacyDetail.deliveryTime} Delivery
                      </span>
                      <a
                        href={`tel:${activePharmacyDetail.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline"
                      >
                        <Phone className="h-3 w-3" /> {activePharmacyDetail.phone}
                      </a>
                    </div>
                  </div>

                  {/* Medicine Categories */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                      Available Therapeutic Categories:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(activePharmacyDetail.availableCategories || []).map((cat, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular Medicines & Direct Order */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-display text-lg font-black text-navy">
                        Popular Prescriptions & Wellness Products
                      </h3>
                      <p className="text-xs text-slate-500">
                        Delivered in cold-chain tamper proof packaging with valid GST tax invoice.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOrderMeds(activePharmacyDetail)}
                      className="rounded-full bg-navy hover:bg-slate-800 text-white px-5 py-2 text-xs font-bold shadow transition flex items-center gap-2 self-start"
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Upload Prescription & Order
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(activePharmacyDetail.popularMedicines || []).map((med, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-sm transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-700">
                              {med.stock}
                            </span>
                            {med.rxRequired && (
                              <span className="rounded-md bg-rose-50 text-rose-700 px-1.5 py-0.5 text-[9px] font-bold border border-rose-200">
                                Rx Required
                              </span>
                            )}
                          </div>

                          <h4 className="font-display text-xs font-extrabold text-navy">
                            {med.name}
                          </h4>
                          <p className="text-[10.5px] text-slate-500">{med.type}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="font-display text-sm font-black text-navy">₹{med.price}</span>
                            <span className="text-[10px] text-slate-400 line-through ml-1">₹{med.mrp}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOrderMeds(activePharmacyDetail, med)}
                            className="rounded-full bg-teal-600 hover:bg-teal-700 px-3 py-1 text-[11px] font-bold text-white transition cursor-pointer"
                          >
                            Order Med
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* All Pharmacies Listing */
              <div className="grid md:grid-cols-3 gap-6">
                {filteredPharmacies.map((pharm) => (
                  <div
                    key={pharm.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-teal-100 text-teal-800 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider">
                          Rank #{pharm.priorityRank}
                        </span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-black">
                          {pharm.discountPercent}% Flat Off
                        </span>
                      </div>

                      <img
                        src={pharm.image}
                        alt={pharm.name}
                        className="h-40 w-full rounded-2xl object-cover border border-slate-100"
                      />

                      <div>
                        <span className="text-[10px] uppercase font-bold text-purple-700 block">
                          ⚡ Express {pharm.deliveryTime} Delivery
                        </span>
                        <h3 className="font-display text-base font-black text-navy mt-0.5">
                          {pharm.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {pharm.address}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-100">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Drug License</span>
                          <span className="font-mono font-bold text-navy text-[11px]">{pharm.licenseNo}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Coverage Radius</span>
                          <strong>Up to {pharm.deliveryRadiusKm} Km</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePharmacyDetail(pharm)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold text-white shadow transition hover:opacity-95 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                    >
                      <span>Enter Medical Store</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Order / Booking Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-teal-50/80">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                  {bookingTest?.test ? <FlaskConical className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                </span>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-navy">
                    {bookingTest?.test ? "Book Diagnostic Test" : "Express Medicine Order"}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {bookingTest?.lab?.name || bookingTest?.pharmacy?.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-black text-navy">
                    {orderSuccess.type === "lab" ? "Test Booking Confirmed!" : "Medicine Order Placed!"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your order has been transmitted directly to the facility desk.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Order ID</span>
                    <span className="font-mono font-bold text-teal-800">{orderSuccess.id}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Patient Name</span>
                    <span className="font-bold text-navy">{orderSuccess.patientName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Status</span>
                    <span className="font-bold text-emerald-700">{orderSuccess.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Address</span>
                    <span className="font-medium text-navy truncate">{orderSuccess.address || orderSuccess.deliveryAddress}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-navy/90"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="p-6 space-y-4">
                {/* Order Item Summary */}
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[10.5px] uppercase font-bold block">Selected Service / Item</span>
                    <strong className="text-navy text-sm font-display">
                      {bookingTest?.test?.name || bookingTest?.item?.name || "Prescription Medicine Order"}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-base font-black text-navy">
                      ₹{bookingTest?.test?.price || bookingTest?.item?.price || "COD / Post-bill"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Patient / Customer Name *
                    </label>
                    <input
                      type="text"
                      value={orderForm.patientName}
                      onChange={(e) => setOrderForm({ ...orderForm, patientName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Delivery / Sample Collection Address *
                    </label>
                    <textarea
                      rows={2}
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      placeholder="e.g. 42, Green Valley Enclave, Ring Road, Ahmedabad..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Special Instructions / Prescription Note
                    </label>
                    <input
                      type="text"
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      placeholder="e.g. Ring doorbell, send home collection phlebotomist at 8:00 AM..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-navy focus:border-teal-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="flex-1 rounded-full border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-teal-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition"
                  >
                    Confirm {bookingTest?.test ? "Lab Booking" : "Medicine Order"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
