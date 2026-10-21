// src/views/AdminPage.jsx
"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  IdCard,
  Stethoscope,
  Building2,
  FlaskConical,
  Users,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  UserCheck,
  ShieldAlert,
  Save,
  MessageCircle,
  LogOut,
  Loader2,
  ShieldCheck,
  Truck,
  CalendarDays,
  UserPlus,
  Video,
  Activity,
  FileCheck,
} from "lucide-react";
import { healthStore } from "../utils/healthStore";
import G1DigitalHealthCard from "../components/health-card/G1DigitalHealthCard";
import { Link } from "../utils/navigation";
import AdminLoginGate from "../components/admin/AdminLoginGate";
import AdminDoctorsSection from "../components/admin/AdminDoctorsSection";
import AdminGovSchemesSection from "../components/admin/AdminGovSchemesSection";
import AdminProvidersRankingSection from "../components/admin/AdminProvidersRankingSection";
import AdminAmbulancesSection from "../components/admin/AdminAmbulancesSection";
import AdminCampsSection from "../components/admin/AdminCampsSection";
import AdminDeliverablesSection from "../components/admin/AdminDeliverablesSection";
import AdminRegistrationsSection from "../components/admin/AdminRegistrationsSection";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard");

  // Store data states
  const [patient, setPatient] = useState(null);
  const [services, setServices] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [labInquiries, setLabInquiries] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [govSchemes, setGovSchemes] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  // Inspection & Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedHealthCardModal, setSelectedHealthCardModal] = useState(false);
  const [serviceModal, setServiceModal] = useState({ open: false, service: null });
  const [labTestModal, setLabTestModal] = useState({ open: false, test: null });
  const [staffModal, setStaffModal] = useState({ open: false, member: null });

  // Patient Health Card management modals
  const [linkSchemeModal, setLinkSchemeModal] = useState({
    open: false,
    schemeId: "",
    cardNumber: "",
    balance: "₹5,00,000 / year",
    validTill: "2027-12-31",
    treatmentsInput: "",
  });
  const [addInsuranceModal, setAddInsuranceModal] = useState({
    open: false,
    provider: "Star Health & Allied Insurance",
    policyNumber: "G1-POL-88219",
    sumInsured: "₹10,00,000",
    type: "Family Floater Cashless Mediclaim",
    tpa: "Medi Assist TPA Desk",
  });
  const [addConsultationModal, setAddConsultationModal] = useState({
    open: false,
    doctorName: "Dr. Arvind Mehta",
    specialty: "Cardiology",
    disease: "Chest Pain / Hypertension",
    mode: "In-Clinic OPD",
    date: "2026-10-21",
    medicinesInput: "Tab Telmisartan 40mg (1 OD), Tab Aspirin 75mg (1 OD)",
    advice: "Follow low-sodium diet and daily BP log",
  });

  // Filters for CRM Bookings
  const [bookingFilter, setBookingFilter] = useState("ALL"); // ALL | PAID | FAILED_LEAD
  const [doctorFilter, setDoctorFilter] = useState("ALL");
  const [diseaseFilter, setDiseaseFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("ALL"); // ALL | ONLINE | OFFLINE
  const [consultedFilter, setConsultedFilter] = useState("ALL"); // ALL | CONSULTED | PENDING
  const [searchTerm, setSearchTerm] = useState("");

  const refreshAll = () => {
    setPatient(healthStore.getPatient());
    setServices(healthStore.getServices());
    setLabTests(healthStore.getLabTests());
    setLabInquiries(healthStore.getLabInquiries());
    setStaffList(healthStore.getStaff());
    setBookings(healthStore.getBookings());
    setGovSchemes(healthStore.getGovSchemes());
    setDoctorsList(healthStore.getDoctors());
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          refreshAll();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const handleUpdate = () => refreshAll();
      window.addEventListener("g1-store-update", handleUpdate);
      return () => window.removeEventListener("g1-store-update", handleUpdate);
    }
  }, [isAuthenticated]);

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400 mb-3" />
        <p className="text-xs font-mono text-slate-400">Verifying secure admin environment...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginGate
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          setAdminUser(user);
          refreshAll();
        }}
      />
    );
  }

  // Metrics calculations
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const totalPaidBookings = bookings.filter((b) => b.paymentStatus === "PAID").length;
  const totalFailedLeads = bookings.filter((b) => b.paymentStatus === "FAILED_LEAD").length;

  // Filtered bookings with Doctor, Disease, Mode, and Consulted filters
  const filteredBookings = bookings.filter((b) => {
    const matchFilter = bookingFilter === "ALL" || b.paymentStatus === bookingFilter;
    const matchDoc = doctorFilter === "ALL" || b.doctorId === doctorFilter || b.doctorName === doctorFilter;
    const matchDisease =
      !diseaseFilter ||
      (b.disease && b.disease.toLowerCase().includes(diseaseFilter.toLowerCase())) ||
      (b.serviceTitle && b.serviceTitle.toLowerCase().includes(diseaseFilter.toLowerCase()));
    const bMode = (b.consultationMode || b.mode || "offline").toLowerCase();
    const matchMode =
      modeFilter === "ALL" ||
      (modeFilter === "ONLINE"
        ? bMode.includes("online") || bMode.includes("video")
        : !bMode.includes("online") && !bMode.includes("video"));
    const matchConsulted =
      consultedFilter === "ALL" ||
      (consultedFilter === "CONSULTED" ? Boolean(b.isConsulted) : !b.isConsulted);
    const matchSearch =
      !searchTerm ||
      b.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.includes(searchTerm);

    return matchFilter && matchDoc && matchDisease && matchMode && matchConsulted && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100/80 text-navy flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-navy text-white flex-shrink-0 flex flex-col justify-between p-5 border-r border-navy/40">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <img src="/logo.png" alt="G1 Healthcare" className="h-9 w-auto bg-white/95 rounded-lg px-2 py-0.5" />
            <div>
              <span className="block font-display text-sm font-bold leading-tight">Admin Console</span>
              <span className="text-[10px] font-semibold text-teal-300">G1 Healthcare Ops</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "dashboard" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Operations Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "bookings" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center gap-3">
                <CreditCard className="h-4 w-4" /> Bookings & Leads CRM
              </span>
              {totalFailedLeads > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold text-navy">
                  {totalFailedLeads}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("healthcards")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "healthcards" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <IdCard className="h-4 w-4" /> Health Cards & Patients
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("govschemes")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "govschemes" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Govt Schemes Manager
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("doctors")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "doctors" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Stethoscope className="h-4 w-4 text-cyan-300" /> Doctors & Priority Rank
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("providers")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "providers" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Building2 className="h-4 w-4 text-blue-300" /> Hospitals & Ranking
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ambulances")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "ambulances" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Truck className="h-4 w-4 text-red-400" /> Ambulances & 24x7 Fleet
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("camps")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "camps" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <CalendarDays className="h-4 w-4 text-amber-300" /> Health Camps Outreach
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("deliverables")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "deliverables" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <FlaskConical className="h-4 w-4 text-purple-300" /> Labs & Medical Stores
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("registrations")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "registrations" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <UserPlus className="h-4 w-4 text-rose-300" /> Multi-Role Registrations
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "services" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Activity className="h-4 w-4" /> Services & Triage Builder
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("labtests")}
              className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "labtests" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center gap-3">
                <FlaskConical className="h-4 w-4" /> Pathology Catalogs
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                {labInquiries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 transition ${
                activeTab === "staff" ? "bg-teal-600 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Users className="h-4 w-4" /> Doctors & Staff Assign
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <span className="text-[10px] uppercase font-bold text-teal-300 block">Authenticated Admin</span>
            <p className="text-xs font-bold text-white truncate mt-0.5">{adminUser?.username || "admin"}</p>
            <span className="inline-block mt-1 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
              SUPER_ADMIN
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/25 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Lock & Log Out
          </button>

          <Link
            to="/"
            className="flex items-center justify-between text-xs text-slate-400 font-bold hover:text-white pt-1"
          >
            <span>Exit to Public Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-5 sm:p-8">
        {/* TAB 1: OPERATIONS DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-navy">Healthcare Operations Hub</h1>
                <p className="text-xs text-slate-500">
                  Real-time analytics across consultations, health cards, lab tests, and lead recoveries.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Live System Active
              </span>
            </div>

            {/* Metrics KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Total Revenue Collected</span>
                  <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    ₹
                  </div>
                </div>
                <p className="mt-3 font-display text-2xl font-black text-navy">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
                  {totalPaidBookings} Completed Razorpay Transactions
                </span>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Failed / Drop-off Leads</span>
                  <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-2xl font-black text-amber-800">
                  {totalFailedLeads} Leads
                </p>
                <span className="text-[11px] font-bold text-amber-700 mt-1 block">
                  Preserved with full diagnostic triage answers
                </span>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Health Cards Issued</span>
                  <div className="h-9 w-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <IdCard className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-2xl font-black text-navy">
                  1 Active (G1 Series)
                </p>
                <span className="text-[11px] font-bold text-teal-700 mt-1 block">
                  QR Medical Dossier Enabled
                </span>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Lab Home Inquiries</span>
                  <div className="h-9 w-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-2xl font-black text-navy">
                  {labInquiries.length} Scheduled
                </p>
                <span className="text-[11px] font-bold text-cyan-700 mt-1 block">
                  Phlebotomists assigned in real-time
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Feed */}
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-display text-base font-bold text-navy">
                    Recent Consultation Bookings & Leads
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs font-bold text-teal-600 hover:text-navy"
                  >
                    View All CRM Leads →
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100/70 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-700">{b.id}</span>
                          <span className="font-display text-sm font-bold text-navy">{b.patientName}</span>
                          <span className="text-xs text-slate-500">({b.patientId})</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {b.serviceTitle} · {b.packageTitle}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-display text-sm font-bold text-navy">₹{b.amount}</span>
                        <div className="mt-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              b.paymentStatus === "PAID"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Health Card Inspector */}
              <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-display text-base font-bold text-navy">
                  Active G1 Health Card
                </h3>
                {patient && (
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-navy to-slate-900 p-4 text-white text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-300 font-bold">{patient.healthId}</span>
                      <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {patient.bloodGroup}
                      </span>
                    </div>
                    <p className="font-display text-base font-bold">{patient.name}</p>
                    <p className="text-[11px] text-slate-300">{patient.phone}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{patient.address}</p>

                    <button
                      type="button"
                      onClick={() => setSelectedHealthCardModal(true)}
                      className="mt-3 w-full rounded-xl bg-teal-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-500"
                    >
                      Inspect Digital Card & QR
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS & LEADS CRM */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-navy">Bookings & Recovered Leads CRM</h1>
                <p className="text-xs text-slate-500">
                  Track online video vs offline clinic consultations, filter by doctor or disease, and record consultation completion.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBookingFilter("ALL")}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    bookingFilter === "ALL" ? "bg-navy text-white" : "bg-white border text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingFilter("PAID")}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    bookingFilter === "PAID" ? "bg-emerald-700 text-white" : "bg-white border text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  Paid ({totalPaidBookings})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingFilter("FAILED_LEAD")}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    bookingFilter === "FAILED_LEAD" ? "bg-amber-600 text-white" : "bg-white border text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  Failed Leads ({totalFailedLeads})
                </button>
              </div>
            </div>

            {/* Advanced Filters: Doctor, Disease, Mode, Consulted Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl bg-white p-4 border border-slate-200 text-xs shadow-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Filter by Doctor</label>
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                >
                  <option value="ALL">All Doctors ({doctorsList.length})</option>
                  {doctorsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Filter by Disease / Condition</label>
                <input
                  type="text"
                  value={diseaseFilter}
                  onChange={(e) => setDiseaseFilter(e.target.value)}
                  placeholder="e.g. Chest Pain, Diabetes..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 font-medium text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Consultation Mode</label>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                >
                  <option value="ALL">All Modes (Online & Offline)</option>
                  <option value="ONLINE">Online Video Call</option>
                  <option value="OFFLINE">Offline In-Clinic / OPD</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Consultation Status</label>
                <select
                  value={consultedFilter}
                  onChange={(e) => setConsultedFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CONSULTED">Consulted ✓</option>
                  <option value="PENDING">Pending Consultation</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Patient & Health ID</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Doctor & Disease</th>
                      <th className="p-4">Mode</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Consultation Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400">
                          No consultations match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => {
                        const isOnline = (b.consultationMode || b.mode || "").toLowerCase().includes("online");
                        return (
                          <tr key={b.id} className="hover:bg-slate-50/70 transition">
                            <td className="p-4 font-mono font-bold text-teal-700">{b.id}</td>
                            <td className="p-4">
                              <p className="font-bold text-navy">{b.patientName}</p>
                              <span className="font-mono text-[10px] text-slate-500">{b.patientHealthId || b.patientId}</span>
                            </td>
                            <td className="p-4 font-mono font-medium text-slate-700">{b.patientPhone || b.phone}</td>
                            <td className="p-4">
                              <p className="font-bold text-navy">
                                {b.doctorName ? `Dr. ${b.doctorName.replace(/^Dr\.\s*/i, "")}` : (b.facilityName || b.serviceTitle || "Healthcare Booking")}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] text-slate-500">
                                  {b.doctorSpecialty || b.department || b.packageTitle || "General Care"}
                                </span>
                                {b.disease && (
                                  <span className="rounded-md bg-amber-50 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold">
                                    {b.disease}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Mode badge */}
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  isOnline
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {isOnline ? (
                                  <>
                                    <Video className="h-3 w-3" /> Online Video
                                  </>
                                ) : (
                                  <>
                                    <Building2 className="h-3 w-3" /> Offline Clinic
                                  </>
                                )}
                              </span>
                            </td>

                            <td className="p-4 font-black text-navy">₹{b.amount}</td>

                            <td className="p-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                                  b.paymentStatus === "PAID"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {b.paymentStatus === "PAID" ? "PAID" : "FAILED LEAD"}
                              </span>
                            </td>

                            {/* Consultation Status & Direct "Mark as Consulted" */}
                            <td className="p-4">
                              {b.isConsulted ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Consulted
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    healthStore.updateBookingStatus(b.id, "Consulted");
                                    refreshAll();
                                  }}
                                  className="rounded-full bg-teal-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-teal-700 transition shadow-xs"
                                >
                                  Mark Consulted ✓
                                </button>
                              )}
                            </td>

                            <td className="p-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedBooking(b)}
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-navy hover:bg-teal-600 hover:text-white transition"
                              >
                                Inspect Lead
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HEALTH CARDS & PATIENT DIRECTORY */}
        {activeTab === "healthcards" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-navy">National G1 Health Card Directory</h1>
                <p className="text-xs text-slate-500">
                  Government & Reference Hospital verified digital health cards with dynamic QR medical history dossiers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHealthCardModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                <Eye className="h-4 w-4" /> Open Active Health Card
              </button>
            </div>

            {/* Patients Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Health ID</th>
                    <th className="p-4">Patient Full Name</th>
                    <th className="p-4">Age / Gender</th>
                    <th className="p-4">Blood Group</th>
                    <th className="p-4">Phone / Email</th>
                    <th className="p-4">Emergency Contact</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patient && (
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-4 font-mono font-bold text-amber-700">{patient.healthId}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={patient.photo} alt={patient.name} className="h-8 w-8 rounded-full object-cover" />
                          <span className="font-bold text-navy">{patient.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{patient.age} Yrs · {patient.gender}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-black text-red-700">
                          {patient.bloodGroup}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-navy">{patient.phone}</p>
                        <p className="text-[11px] text-slate-500">{patient.email}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{patient.emergencyContact}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Verified & Active
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedHealthCardModal(true)}
                          className="rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy/90"
                        >
                          View Card
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PATIENT EXTENDED MANAGEMENT: GOV SCHEMES, INSURANCE, AND CONSULTATIONS */}
            {patient && (
              <div className="space-y-6 pt-4">
                {/* Management Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy">
                      Clinical & Insurance Dossier: {patient.name} ({patient.healthId})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Link active empanelled government schemes, private/central health insurances, and digital consultation records.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const firstScheme = govSchemes[0] || null;
                        setLinkSchemeModal({
                          open: true,
                          schemeId: firstScheme?.id || "",
                          cardNumber: `PMJAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
                          balance: firstScheme?.coverageAmount || "₹5,00,000 / year",
                          validTill: "2027-12-31",
                          treatmentsInput: firstScheme?.treatmentsCovered?.join(", ") || "",
                        });
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Link Government Scheme
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setAddInsuranceModal({
                          open: true,
                          provider: "Star Health & Allied Insurance",
                          policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
                          sumInsured: "₹10,00,000",
                          type: "Family Floater Cashless Mediclaim",
                          tpa: "Medi Assist TPA Desk (24x7)",
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Insurance Policy
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setAddConsultationModal({
                          open: true,
                          doctorName: "Dr. Arvind Mehta",
                          specialty: "Cardiology",
                          disease: "Hypertension / Chest Heaviness",
                          mode: "In-Clinic OPD",
                          date: new Date().toISOString().split("T")[0],
                          medicinesInput: "Tab Telmisartan 40mg (1 OD Morning), Tab Rosuvastatin 10mg (1 HS)",
                          advice: "Maintain low sodium diet, avoid strenuous exertion, repeat ECG in 14 days.",
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Record Consultation & Rx
                    </button>
                  </div>
                </div>

                {/* Grid 1: Active Linked Government Schemes on Patient */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <h4 className="font-display text-sm font-bold text-navy">
                        Linked Government Healthcare Schemes ({patient.governmentSchemes?.length || 0})
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Configured via Government Schemes Management
                    </span>
                  </div>

                  {(!patient.governmentSchemes || patient.governmentSchemes.length === 0) ? (
                    <p className="text-xs text-slate-400 p-4 text-center">No government schemes linked to this patient yet.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {patient.governmentSchemes.map((gs) => (
                        <div key={gs.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="rounded-sm bg-emerald-600 text-white font-mono text-[9px] px-1.5 py-0.2 font-bold uppercase">
                                {gs.status || "Active Card"}
                              </span>
                              <h5 className="font-display text-sm font-bold text-navy mt-1">{gs.schemeName}</h5>
                              <p className="font-mono text-teal-800 text-[11px] font-bold">Card: {gs.cardNumber}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove scheme "${gs.schemeName}" from patient?`)) {
                                  healthStore.removeSchemeFromPatient(patient.id, gs.id);
                                  refreshAll();
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-bold p-1"
                              title="Remove Scheme"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-emerald-100 pt-2">
                            <span>Balance Coverage:</span>
                            <span className="font-black text-emerald-900">{gs.balanceRemaining || gs.coverageAmount}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Valid Till:</span>
                            <span className="font-mono">{gs.validTill}</span>
                          </div>

                          {gs.treatmentsCovered && gs.treatmentsCovered.length > 0 && (
                            <div className="pt-1">
                              <span className="text-[10px] text-slate-400 font-bold block mb-1">Eligible Treatments:</span>
                              <div className="flex flex-wrap gap-1">
                                {gs.treatmentsCovered.slice(0, 3).map((t, idx) => (
                                  <span key={idx} className="rounded-md bg-white border border-emerald-200 px-1.5 py-0.2 text-[9px] text-emerald-900 font-medium">
                                    {t}
                                  </span>
                                ))}
                                {gs.treatmentsCovered.length > 3 && (
                                  <span className="text-[9px] text-emerald-800 font-bold">+{gs.treatmentsCovered.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grid 2: Active Insurance Policies on Patient */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <h4 className="font-display text-sm font-bold text-navy">
                        Private & Central Health Insurance Policies ({patient.insurancePolicies?.length || 0})
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      TPA Cashless Empanelled
                    </span>
                  </div>

                  {(!patient.insurancePolicies || patient.insurancePolicies.length === 0) ? (
                    <p className="text-xs text-slate-400 p-4 text-center">No insurance policies recorded.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {patient.insurancePolicies.map((pol) => (
                        <div key={pol.id} className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="rounded-sm bg-blue-600 text-white font-mono text-[9px] px-1.5 py-0.2 font-bold uppercase">
                                {pol.cashlessStatus || "Cashless Active"}
                              </span>
                              <h5 className="font-display text-sm font-bold text-navy mt-1">{pol.provider}</h5>
                              <p className="font-mono text-blue-900 text-[11px] font-bold">Policy: {pol.policyNumber}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove insurance "${pol.provider}"?`)) {
                                  healthStore.removeInsuranceFromPatient(patient.id, pol.id);
                                  refreshAll();
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-bold p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-blue-100 pt-2">
                            <span>Sum Insured:</span>
                            <span className="font-black text-blue-900">{pol.sumInsured}</span>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            <span>TPA Desk: {pol.tpaDesk}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grid 3: Doctor Consultation & Prescription History */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-teal-600" />
                      <h4 className="font-display text-sm font-bold text-navy">
                        Recorded Doctor Consultations & Digital Prescriptions ({patient.consultationHistory?.length || 0})
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Syncs to Patient's Digital Health Card
                    </span>
                  </div>

                  {(!patient.consultationHistory || patient.consultationHistory.length === 0) ? (
                    <p className="text-xs text-slate-400 p-4 text-center">No consultations recorded.</p>
                  ) : (
                    <div className="space-y-3">
                      {patient.consultationHistory.map((c) => (
                        <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-navy text-sm">{c.doctorName}</span>
                                <span className="rounded-md bg-teal-100 text-teal-800 px-2 py-0.2 text-[10px] font-bold">
                                  {c.specialty}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-0.5">
                                Diagnosis / Condition: <strong className="text-navy">{c.diagnosis || c.disease}</strong>
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700">
                                {c.mode || "In-Clinic OPD"}
                              </span>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{c.date}</p>
                            </div>
                          </div>

                          {/* Prescribed Medicines */}
                          {c.prescriptions && c.prescriptions.length > 0 && (
                            <div className="pt-1 space-y-1">
                              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                Digital Prescription Medications (Rx)
                              </span>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px]">
                                  <thead className="text-slate-400 font-bold text-[10px]">
                                    <tr>
                                      <th>Medicine</th>
                                      <th>Dosage</th>
                                      <th>Frequency</th>
                                      <th>Instructions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200/50">
                                    {c.prescriptions.map((p, pIdx) => (
                                      <tr key={pIdx}>
                                        <td className="py-1 font-bold text-navy">{p.medicine}</td>
                                        <td className="py-1 text-slate-600">{p.dosage}</td>
                                        <td className="py-1 text-slate-700">{p.frequency}</td>
                                        <td className="py-1 text-slate-500">{p.instructions}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {c.doctorAdvice && (
                            <p className="text-[11px] text-teal-900 bg-teal-50/70 p-2 rounded-lg border border-teal-100">
                              <strong>Doctor Note:</strong> {c.doctorAdvice}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: DOCTORS DIRECTORY & PRICING CONFIGURATION */}
        {activeTab === "doctors" && <AdminDoctorsSection />}

        {/* TAB 4: SERVICES & DIAGNOSTIC BUILDER */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-navy">Services & Diagnostic Triage Builder</h1>
                <p className="text-xs text-slate-500">
                  Configure services, tier packages, and customize the multi-step diagnostic questions asked before payment.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setServiceModal({
                    open: true,
                    service: {
                      id: `srv-${Date.now()}`,
                      title: "New Healthcare Service",
                      slug: "new-service",
                      category: "Clinical Care",
                      short: "Short overview description of the new service.",
                      diagnosticSteps: [
                        {
                          id: "step-1",
                          question: "What symptoms are you experiencing?",
                          type: "multiselect",
                          options: ["Mild Discomfort", "Moderate Symptoms", "Severe"],
                        },
                      ],
                      packages: [
                        {
                          id: `pkg-${Date.now()}`,
                          name: "Standard Package",
                          tier: "Standard",
                          price: 999,
                          originalPrice: 1500,
                          features: ["Doctor Consultation", "Digital Prescription"],
                        },
                      ],
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" /> Add New Service
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {services.map((srv) => (
                <div key={srv.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
                        {srv.category}
                      </span>
                      <h3 className="mt-2 font-display text-lg font-bold text-navy">{srv.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{srv.short}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setServiceModal({ open: true, service: srv })}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete service "${srv.title}"?`)) {
                            healthStore.deleteService(srv.id);
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Diagnostic Questions Preview */}
                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Diagnostic Steps ({srv.diagnosticSteps?.length || 0})</span>
                      <span className="text-teal-600">Configurable</span>
                    </div>
                    {srv.diagnosticSteps?.map((st, i) => (
                      <div key={st.id || i} className="text-slate-600 flex items-center justify-between">
                        <span className="truncate max-w-[280px]">
                          {i + 1}. {st.question}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{st.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Packages Row */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="font-semibold text-slate-500">
                      {srv.packages?.length || 0} Tiered Packages
                    </span>
                    <span className="font-bold text-navy">
                      Starts from ₹{srv.packages?.[0]?.price || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LAB TESTS & INQUIRIES */}
        {activeTab === "labtests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-navy">Diagnostic Lab Tests & Home Inquiries</h1>
                <p className="text-xs text-slate-500">
                  Manage pathology test catalogs and track patient sample collection inquiries.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setLabTestModal({
                    open: true,
                    test: {
                      id: `lab-${Date.now()}`,
                      title: "New Diagnostic Test",
                      category: "Pathology",
                      price: 499,
                      originalPrice: 999,
                      parametersCount: 10,
                      fastingRequired: "8-10 hrs fasting recommended",
                      sampleType: "Blood",
                      turnaround: "Report within 12 Hours",
                      popular: false,
                      description: "Accurate clinical diagnostic test parameters.",
                      inclusions: ["Complete analysis", "Pathologist verification"],
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" /> Add New Lab Test
              </button>
            </div>

            {/* Inquiries Section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-display text-base font-bold text-navy">
                Home Sample Collection Inquiries ({labInquiries.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Inquiry ID</th>
                      <th className="p-3">Test Title</th>
                      <th className="p-3">Patient Name</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Scheduled Slot</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Assigned Phlebotomist</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-teal-700">{inq.id}</td>
                        <td className="p-3 font-bold text-navy">{inq.testTitle}</td>
                        <td className="p-3 font-semibold text-slate-800">{inq.patientName}</td>
                        <td className="p-3 text-slate-600">{inq.phone}</td>
                        <td className="p-3 text-slate-700">{inq.date} ({inq.slot})</td>
                        <td className="p-3 text-slate-500 max-w-[150px] truncate">{inq.address}</td>
                        <td className="p-3 font-bold text-teal-700">{inq.assignedStaff}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const phlebo = prompt("Enter Phlebotomist Name to Assign:", inq.assignedStaff);
                              if (phlebo) {
                                healthStore.updateLabInquiryStatus(inq.id, "Phlebotomist Assigned", phlebo);
                              }
                            }}
                            className="rounded-full bg-slate-100 px-3 py-1 font-bold text-navy hover:bg-teal-600 hover:text-white"
                          >
                            Assign Staff
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tests Catalog Cards */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-display text-base font-bold text-navy">
                Available Pathology Tests Catalog ({labTests.length})
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                {labTests.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
                        {t.category}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setLabTestModal({ open: true, test: t })}
                          className="text-slate-500 hover:text-teal-600"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete lab test "${t.title}"?`)) {
                              healthStore.deleteLabTest(t.id);
                            }
                          }}
                          className="text-slate-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-display text-sm font-bold text-navy line-clamp-1">{t.title}</h4>
                    <p className="text-xs font-black text-navy">
                      ₹{t.price} <span className="line-through text-slate-400 font-normal">₹{t.originalPrice}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DOCTORS & STAFF MANAGEMENT */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-navy">Staff & Medical Team Management</h1>
                <p className="text-xs text-slate-500">
                  Assign senior doctors, nurses, phlebotomists, and EMT ambulance drivers to incoming cases.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setStaffModal({
                    open: true,
                    member: {
                      id: `stf-${Date.now()}`,
                      name: "Dr. New Specialist",
                      role: "Senior Consultant",
                      department: "General Medicine",
                      experience: "10 Years",
                      phone: "+91 98250 00000",
                      email: "specialist@g1health.org",
                      status: "Active",
                      rating: 5.0,
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" /> Add Staff Member
              </button>
            </div>

            {/* Staff Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staffList.map((st) => (
                <div key={st.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"}
                      alt={st.name}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-teal-500/20"
                    />
                    <div>
                      <h4 className="font-display text-sm font-bold text-navy">{st.name}</h4>
                      <p className="text-xs text-teal-700 font-semibold">{st.role}</p>
                      <span className="text-[10px] text-slate-500">{st.department} · {st.experience}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 text-xs space-y-1">
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-teal-600" /> {st.phone}
                    </p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-teal-600" /> {st.email}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {st.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove staff member ${st.name}?`)) {
                          healthStore.deleteStaff(st.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: GOVT HEALTHCARE SCHEMES MANAGEMENT */}
        {activeTab === "govschemes" && <AdminGovSchemesSection />}

        {/* TAB 8: HOSPITALS & PRIORITY RANKING */}
        {activeTab === "providers" && <AdminProvidersRankingSection />}

        {/* TAB 9: AMBULANCES & 24x7 DISPATCH DESK */}
        {activeTab === "ambulances" && <AdminAmbulancesSection />}

        {/* TAB 10: COMMUNITY HEALTH CAMPS OUTREACH */}
        {activeTab === "camps" && <AdminCampsSection />}

        {/* TAB 11: DELIVERABLE SERVICES (LABS & PHARMACIES) */}
        {activeTab === "deliverables" && <AdminDeliverablesSection />}

        {/* TAB 12: MULTI-ROLE PARTNER REGISTRATIONS DESK */}
        {activeTab === "registrations" && <AdminRegistrationsSection />}
      </main>

      {/* INSPECT BOOKING / LEAD DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy/60 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700">{selectedBooking.id}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Booking & Lead Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Alert */}
            <div
              className={`rounded-2xl p-4 border text-xs ${
                selectedBooking.paymentStatus === "PAID"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedBooking.paymentStatus === "PAID" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
                <span>Status: {selectedBooking.paymentStatus}</span>
              </div>
              <p className="mt-1">
                {selectedBooking.paymentStatus === "PAID"
                  ? "Payment received and verified through Razorpay."
                  : "Payment abandoned/failed. Use patient phone number below to initiate recovery tele-consultation."}
              </p>
            </div>

            {/* Patient Details */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
              <span className="font-bold uppercase text-[10px] text-slate-500">Patient Profile</span>
              <div className="flex justify-between">
                <span className="text-slate-600">Full Name:</span>
                <span className="font-bold text-navy">{selectedBooking.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Health ID:</span>
                <span className="font-mono font-bold text-teal-700">{selectedBooking.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Phone:</span>
                <span className="font-semibold text-navy">{selectedBooking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Email:</span>
                <span className="font-semibold text-navy">{selectedBooking.email}</span>
              </div>
            </div>

            {/* Quick Contact Actions for Tele-calling */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${selectedBooking.phone}`}
                className="flex items-center justify-center gap-1.5 rounded-full bg-navy py-2.5 text-xs font-bold text-white shadow hover:bg-navy/90"
              >
                <Phone className="h-3.5 w-3.5" /> Call Patient
              </a>
              <a
                href={`https://wa.me/${selectedBooking.phone?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Lead
              </a>
            </div>

            {/* Exact Diagnostic Questionnaire Responses */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <span className="font-bold uppercase text-[10px] text-slate-500 block">
                Submitted Diagnostic Triage Answers
              </span>
              {selectedBooking.diagnosticResponses && selectedBooking.diagnosticResponses.length > 0 ? (
                selectedBooking.diagnosticResponses.map((r, i) => (
                  <div key={i} className="border-b border-slate-100 pb-2 text-xs">
                    <p className="font-bold text-slate-700">{r.question}</p>
                    <p className="mt-1 text-teal-800 font-semibold bg-teal-50/70 p-2 rounded-lg">
                      {r.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No triage steps recorded.</p>
              )}
            </div>

            {/* Consultation Mode & Clinical Diagnosis */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
              <span className="font-bold uppercase text-[10px] text-slate-500">Clinical Appointment Details</span>
              <div className="flex justify-between">
                <span className="text-slate-600">Consultation Mode:</span>
                <span className="font-bold text-navy">
                  {(selectedBooking.consultationMode || selectedBooking.mode || "").toLowerCase().includes("online")
                    ? "Online Video Call"
                    : "Offline In-Clinic Visit"}
                </span>
              </div>
              {selectedBooking.disease && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Chief Complaint / Disease:</span>
                  <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                    {selectedBooking.disease}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-600">Clinical Status:</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    selectedBooking.isConsulted
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedBooking.isConsulted ? "Consulted ✓" : "Pending Consultation"}
                </span>
              </div>

              {!selectedBooking.isConsulted && (
                <button
                  type="button"
                  onClick={() => {
                    healthStore.updateBookingStatus(selectedBooking.id, "Consulted");
                    setSelectedBooking({ ...selectedBooking, isConsulted: true, status: "Consulted" });
                    refreshAll();
                  }}
                  className="mt-2 w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                >
                  Mark as Consulted ✓
                </button>
              )}
            </div>

            {/* Payment Details */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
              <span className="font-bold uppercase text-[10px] text-slate-500">Transaction Details</span>
              <div className="flex justify-between">
                <span className="text-slate-600">Package Amount:</span>
                <span className="font-black text-navy text-sm">₹{selectedBooking.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Method:</span>
                <span className="font-semibold text-navy">{selectedBooking.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Razorpay Order ID:</span>
                <span className="font-mono text-slate-700">{selectedBooking.razorpayOrderId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment ID:</span>
                <span className="font-mono text-slate-700">{selectedBooking.razorpayPaymentId || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEALTH CARD INSPECTOR MODAL */}
      {selectedHealthCardModal && patient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-base font-bold text-navy">
                G1 National Health Card Inspector
              </h3>
              <button
                type="button"
                onClick={() => setSelectedHealthCardModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <G1DigitalHealthCard patient={patient} showActions={true} />
          </div>
        </div>
      )}

      {/* MODAL 1: LINK GOVERNMENT SCHEME TO PATIENT */}
      {linkSchemeModal.open && patient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700">Patient: {patient.name}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Link Government Healthcare Scheme
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLinkSchemeModal({ ...linkSchemeModal, open: false })}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedScheme = govSchemes.find((s) => s.id === linkSchemeModal.schemeId) || govSchemes[0];
                const newLinkedScheme = {
                  id: `pat-scheme-${Date.now()}`,
                  schemeId: matchedScheme?.id || "custom-scheme",
                  schemeName: matchedScheme?.name || "Ayushman Bharat PM-JAY",
                  cardNumber: linkSchemeModal.cardNumber.trim(),
                  balanceRemaining: linkSchemeModal.balance.trim(),
                  validTill: linkSchemeModal.validTill.trim(),
                  status: "Active Verified",
                  treatmentsCovered: linkSchemeModal.treatmentsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                };
                healthStore.addSchemeToPatient(patient.id, newLinkedScheme);
                setLinkSchemeModal({ ...linkSchemeModal, open: false });
                refreshAll();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700">Select Empanelled Scheme</label>
                <select
                  value={linkSchemeModal.schemeId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    const matched = govSchemes.find((s) => s.id === sid);
                    setLinkSchemeModal({
                      ...linkSchemeModal,
                      schemeId: sid,
                      balance: matched?.coverageAmount || "₹5,00,000 / year",
                      treatmentsInput: matched?.treatmentsCovered?.join(", ") || "",
                    });
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-emerald-600 focus:outline-hidden"
                >
                  {govSchemes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.coverageAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Patient Beneficiary Card Number</label>
                <input
                  type="text"
                  required
                  value={linkSchemeModal.cardNumber}
                  onChange={(e) => setLinkSchemeModal({ ...linkSchemeModal, cardNumber: e.target.value })}
                  placeholder="e.g. PMJAY-12345678"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold text-navy focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Annual Coverage Amount</label>
                  <input
                    type="text"
                    value={linkSchemeModal.balance}
                    onChange={(e) => setLinkSchemeModal({ ...linkSchemeModal, balance: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-emerald-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Validity Expiry Date</label>
                  <input
                    type="text"
                    value={linkSchemeModal.validTill}
                    onChange={(e) => setLinkSchemeModal({ ...linkSchemeModal, validTill: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono text-navy focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Covered Treatments (Auto-populated from Scheme)</label>
                <textarea
                  rows={2}
                  value={linkSchemeModal.treatmentsInput}
                  onChange={(e) => setLinkSchemeModal({ ...linkSchemeModal, treatmentsInput: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLinkSchemeModal({ ...linkSchemeModal, open: false })}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 px-6 py-2 font-bold text-white shadow hover:bg-emerald-700"
                >
                  Link to Patient Card ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD INSURANCE POLICY TO PATIENT */}
      {addInsuranceModal.open && patient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700">Patient: {patient.name}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Add Health Insurance Policy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddInsuranceModal({ ...addInsuranceModal, open: false })}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newPolicy = {
                  id: `ins-${Date.now()}`,
                  provider: addInsuranceModal.provider.trim(),
                  policyNumber: addInsuranceModal.policyNumber.trim(),
                  sumInsured: addInsuranceModal.sumInsured.trim(),
                  policyType: addInsuranceModal.type.trim(),
                  tpaDesk: addInsuranceModal.tpa.trim(),
                  cashlessStatus: "Cashless Empanelled",
                };
                healthStore.addInsuranceToPatient(patient.id, newPolicy);
                setAddInsuranceModal({ ...addInsuranceModal, open: false });
                refreshAll();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700">Insurance Company / Provider</label>
                <input
                  type="text"
                  required
                  value={addInsuranceModal.provider}
                  onChange={(e) => setAddInsuranceModal({ ...addInsuranceModal, provider: e.target.value })}
                  placeholder="e.g. Star Health & Allied Insurance"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Policy Number</label>
                  <input
                    type="text"
                    required
                    value={addInsuranceModal.policyNumber}
                    onChange={(e) => setAddInsuranceModal({ ...addInsuranceModal, policyNumber: e.target.value })}
                    placeholder="POL-88219"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Sum Insured (₹)</label>
                  <input
                    type="text"
                    value={addInsuranceModal.sumInsured}
                    onChange={(e) => setAddInsuranceModal({ ...addInsuranceModal, sumInsured: e.target.value })}
                    placeholder="₹10,00,000"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Policy Plan Type</label>
                  <input
                    type="text"
                    value={addInsuranceModal.type}
                    onChange={(e) => setAddInsuranceModal({ ...addInsuranceModal, type: e.target.value })}
                    placeholder="Family Floater Mediclaim"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">TPA Desk / Helpdesk</label>
                  <input
                    type="text"
                    value={addInsuranceModal.tpa}
                    onChange={(e) => setAddInsuranceModal({ ...addInsuranceModal, tpa: e.target.value })}
                    placeholder="Medi Assist TPA"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddInsuranceModal({ ...addInsuranceModal, open: false })}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-6 py-2 font-bold text-white shadow hover:bg-blue-700"
                >
                  Save Insurance Policy ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD DOCTOR CONSULTATION & RX */}
      {addConsultationModal.open && patient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700">Patient: {patient.name}</span>
                <h3 className="font-display text-lg font-bold text-navy">
                  Record Doctor Consultation & Rx
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddConsultationModal({ ...addConsultationModal, open: false })}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Parse prescribed medicines
                const parsedMeds = addConsultationModal.medicinesInput
                  .split(",")
                  .map((m) => m.trim())
                  .filter(Boolean)
                  .map((medStr) => ({
                    medicine: medStr,
                    dosage: "Standard dose",
                    frequency: "As directed",
                    instructions: "Post meals",
                  }));

                const newConsultation = {
                  id: `cons-${Date.now()}`,
                  doctorName: addConsultationModal.doctorName.trim(),
                  specialty: addConsultationModal.specialty.trim(),
                  diagnosis: addConsultationModal.disease.trim(),
                  disease: addConsultationModal.disease.trim(),
                  date: addConsultationModal.date,
                  mode: addConsultationModal.mode,
                  doctorAdvice: addConsultationModal.advice.trim(),
                  prescriptions: parsedMeds,
                };

                healthStore.addConsultationToPatient(patient.id, newConsultation);
                setAddConsultationModal({ ...addConsultationModal, open: false });
                refreshAll();
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Doctor Name</label>
                  <input
                    type="text"
                    required
                    value={addConsultationModal.doctorName}
                    onChange={(e) => setAddConsultationModal({ ...addConsultationModal, doctorName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Doctor Specialty</label>
                  <input
                    type="text"
                    required
                    value={addConsultationModal.specialty}
                    onChange={(e) => setAddConsultationModal({ ...addConsultationModal, specialty: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Disease Diagnosis / Chief Complaint</label>
                <input
                  type="text"
                  required
                  value={addConsultationModal.disease}
                  onChange={(e) => setAddConsultationModal({ ...addConsultationModal, disease: e.target.value })}
                  placeholder="e.g. Chest Pain, Type 2 Diabetes, Hypertension"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-teal-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Consultation Mode</label>
                  <select
                    value={addConsultationModal.mode}
                    onChange={(e) => setAddConsultationModal({ ...addConsultationModal, mode: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy font-semibold"
                  >
                    <option value="In-Clinic OPD">In-Clinic OPD Visit</option>
                    <option value="Online Video Call">Online Video Call</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Date of Visit</label>
                  <input
                    type="date"
                    value={addConsultationModal.date}
                    onChange={(e) => setAddConsultationModal({ ...addConsultationModal, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-mono text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Prescription Medicines (Comma Separated)</label>
                <textarea
                  rows={2}
                  value={addConsultationModal.medicinesInput}
                  onChange={(e) => setAddConsultationModal({ ...addConsultationModal, medicinesInput: e.target.value })}
                  placeholder="e.g. Tab Telmisartan 40mg (1 OD), Tab Rosuvastatin 10mg (1 HS)"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Doctor Advice / Next Review</label>
                <input
                  type="text"
                  value={addConsultationModal.advice}
                  onChange={(e) => setAddConsultationModal({ ...addConsultationModal, advice: e.target.value })}
                  placeholder="Follow low salt diet, review in 14 days"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-navy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddConsultationModal({ ...addConsultationModal, open: false })}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-teal-600 px-6 py-2 font-bold text-white shadow hover:bg-teal-700"
                >
                  Record Consultation & Rx ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE & DIAGNOSTIC BUILDER MODAL */}
      {serviceModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">
                Configure Service & Diagnostic Steps
              </h3>
              <button
                type="button"
                onClick={() => setServiceModal({ open: false, service: null })}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Service Title</label>
                <input
                  type="text"
                  value={serviceModal.service.title || ""}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      service: { ...serviceModal.service, title: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Category</label>
                <input
                  type="text"
                  value={serviceModal.service.category || ""}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      service: { ...serviceModal.service, category: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              {/* Diagnostic Steps Configurator */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-[10px] text-slate-500">
                    Dynamic Diagnostic Steps Questionnaire
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newSteps = [
                        ...(serviceModal.service.diagnosticSteps || []),
                        {
                          id: `step-${Date.now()}`,
                          question: "New Symptom / Diagnostic Question?",
                          type: "singleselect",
                          options: ["Option A", "Option B", "Option C"],
                        },
                      ];
                      setServiceModal({
                        ...serviceModal,
                        service: { ...serviceModal.service, diagnosticSteps: newSteps },
                      });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Add Diagnostic Step
                  </button>
                </div>

                {serviceModal.service.diagnosticSteps?.map((st, idx) => (
                  <div key={st.id || idx} className="rounded-xl bg-white p-3 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy">Step {idx + 1} Question:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = serviceModal.service.diagnosticSteps.filter((_, i) => i !== idx);
                          setServiceModal({
                            ...serviceModal,
                            service: { ...serviceModal.service, diagnosticSteps: updated },
                          });
                        }}
                        className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={st.question}
                      onChange={(e) => {
                        const updated = [...serviceModal.service.diagnosticSteps];
                        updated[idx].question = e.target.value;
                        setServiceModal({
                          ...serviceModal,
                          service: { ...serviceModal.service, diagnosticSteps: updated },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-200 p-2 font-medium text-navy"
                    />

                    <div>
                      <span className="text-[10px] text-slate-500">Predefined Options (Comma Separated):</span>
                      <input
                        type="text"
                        value={st.options?.join(", ") || ""}
                        onChange={(e) => {
                          const updated = [...serviceModal.service.diagnosticSteps];
                          updated[idx].options = e.target.value.split(",").map((s) => s.trim());
                          setServiceModal({
                            ...serviceModal,
                            service: { ...serviceModal.service, diagnosticSteps: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModal({ open: false, service: null })}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    healthStore.saveService(serviceModal.service);
                    setServiceModal({ open: false, service: null });
                  }}
                  className="rounded-full bg-teal-600 px-6 py-2 font-bold text-white shadow hover:bg-teal-700"
                >
                  Save Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB TEST MODAL */}
      {labTestModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">Add / Edit Lab Test</h3>
              <button
                type="button"
                onClick={() => setLabTestModal({ open: false, test: null })}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Test Title</label>
                <input
                  type="text"
                  value={labTestModal.test.title || ""}
                  onChange={(e) =>
                    setLabTestModal({
                      ...labTestModal,
                      test: { ...labTestModal.test, title: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <input
                    type="text"
                    value={labTestModal.test.category || ""}
                    onChange={(e) =>
                      setLabTestModal({
                        ...labTestModal,
                        test: { ...labTestModal.test, category: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={labTestModal.test.price || ""}
                    onChange={(e) =>
                      setLabTestModal({
                        ...labTestModal,
                        test: { ...labTestModal.test, price: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={labTestModal.test.description || ""}
                  onChange={(e) =>
                    setLabTestModal({
                      ...labTestModal,
                      test: { ...labTestModal.test, description: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLabTestModal({ open: false, test: null })}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    healthStore.saveLabTest(labTestModal.test);
                    setLabTestModal({ open: false, test: null });
                  }}
                  className="rounded-full bg-teal-600 px-6 py-2 font-bold text-white shadow hover:bg-teal-700"
                >
                  Save Lab Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {staffModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-navy">Add / Edit Staff Member</h3>
              <button
                type="button"
                onClick={() => setStaffModal({ open: false, member: null })}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Staff Full Name</label>
                <input
                  type="text"
                  value={staffModal.member.name || ""}
                  onChange={(e) =>
                    setStaffModal({
                      ...staffModal,
                      member: { ...staffModal.member, name: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Role</label>
                  <input
                    type="text"
                    value={staffModal.member.role || ""}
                    onChange={(e) =>
                      setStaffModal({
                        ...staffModal,
                        member: { ...staffModal.member, role: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={staffModal.member.department || ""}
                    onChange={(e) =>
                      setStaffModal({
                        ...staffModal,
                        member: { ...staffModal.member, department: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={staffModal.member.phone || ""}
                    onChange={(e) =>
                      setStaffModal({
                        ...staffModal,
                        member: { ...staffModal.member, phone: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Email</label>
                  <input
                    type="text"
                    value={staffModal.member.email || ""}
                    onChange={(e) =>
                      setStaffModal({
                        ...staffModal,
                        member: { ...staffModal.member, email: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-semibold text-navy"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStaffModal({ open: false, member: null })}
                  className="rounded-full px-5 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    healthStore.saveStaff(staffModal.member);
                    setStaffModal({ open: false, member: null });
                  }}
                  className="rounded-full bg-teal-600 px-6 py-2 font-bold text-white shadow hover:bg-teal-700"
                >
                  Save Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
