"use client";

import { useEffect, useState } from "react";
import { Link } from "../utils/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, QrCode, ShieldCheck, Fingerprint, Bell, Check, Loader2, IdCard, Phone, Mail, UserCheck, ArrowRight, Camera, UploadCloud, Droplet, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import DemoBadge from "../components/ui/DemoBadge";
import { useAuth } from "../context/AuthContext";
import G1DigitalHealthCard from "../components/health-card/G1DigitalHealthCard";
import { healthStore } from "../utils/healthStore";

const features = [
  { icon: Fingerprint, title: "Single patient profile", desc: "Keep your basic details and demonstration Health ID together — no repeated paperwork in the concept flow." },
  { icon: QrCode, title: "QR check-in concept", desc: "An illustrative QR placeholder shows how front-desk identification could work at participating providers." },
  { icon: Bell, title: "Request updates", desc: "Follow demonstration service requests and status changes from one dashboard in later phases." },
  { icon: ShieldCheck, title: "Consent-led sharing", desc: "Nothing is shared without your action. You decide what each provider request can see." },
];

export default function HealthCardPage() {
  const { user, updateProfilePhoto } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone ? user.phone.replace(/[^0-9]/g, "").slice(-10) : "",
    city: user?.address || "",
    bloodGroup: "O+",
    age: "32",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    consent: false,
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoNotice, setPhotoNotice] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [demoId, setDemoId] = useState(user?.healthId || "G1-849201");

  const loadPatientData = () => {
    const p = healthStore.getPatient(user);
    if (p) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || p.name || user?.name || "",
        phone: prev.phone || (p.phone ? p.phone.replace(/[^0-9]/g, "").slice(-10) : (user?.phone ? user.phone.replace(/[^0-9]/g, "").slice(-10) : "")),
        city: prev.city || (p.address ? p.address.split(",")[0].trim() : ""),
        bloodGroup: p.bloodGroup || prev.bloodGroup || "O+",
        age: p.age || prev.age || "32",
        photo: p.photo || prev.photo,
      }));
      if (p.healthId || user?.healthId) {
        setDemoId(p.healthId || user?.healthId);
      }
    }
  };

  useEffect(() => {
    loadPatientData();
    const handleStoreUpdate = () => loadPatientData();
    window.addEventListener("g1-store-update", handleStoreUpdate);
    return () => window.removeEventListener("g1-store-update", handleStoreUpdate);
  }, [user]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoNotice("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "photos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload photo");
      }

      setForm((prev) => ({ ...prev, photo: data.url }));

      // Immediately save to persistent healthStore and user state so browser refresh keeps it
      healthStore.updatePatient({ photo: data.url });
      if (typeof updateProfilePhoto === "function") {
        updateProfilePhoto(data.url);
      }

      setPhotoNotice(
        data.storage === "mongodb_gridfs"
          ? "✓ Stored in MongoDB GridFS & Saved"
          : "✓ Profile photo attached & Saved"
      );
    } catch (err) {
      console.error("Photo upload error:", err);
      alert(err.message || "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "Enter your full name (min 3 characters).";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
    if (!form.city.trim()) e.city = "Enter your city.";
    if (!form.consent) e.consent = "Please accept the demo consent to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    const newId = user?.healthId || `G1-${Math.floor(100000 + Math.random() * 900000)}`;
    setDemoId(newId);

    // Save to central healthStore with the uploaded GridFS photo
    healthStore.updatePatient({
      name: form.name,
      phone: form.phone.startsWith("+91") ? form.phone : `+91 ${form.phone}`,
      address: `${form.city}, India`,
      photo: form.photo,
      bloodGroup: form.bloodGroup,
      age: form.age,
      healthId: newId,
    });
    if (typeof updateProfilePhoto === "function" && form.photo) {
      updateProfilePhoto(form.photo);
    }

    setTimeout(() => {
      try {
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      } catch (err) {}
      setStatus("success");
    }, 1000);
  };

  const reset = () => {
    setForm({
      name: "",
      phone: "",
      city: "",
      bloodGroup: "O+",
      age: "32",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      consent: false,
    });
    setPhotoNotice("");
    setErrors({});
    setStatus("idle");
    setDemoId("");
  };

  return (
    <div className="bg-cream">
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
                <IdCard className="h-4 w-4" /> G1 Health Card
              </p>
              <h1 className="mt-3 max-w-2xl font-display text-[30px] font-extrabold leading-tight text-white sm:text-[40px]">
                One Health Card. A connected care journey.
              </h1>
              <p className="mt-2 max-w-xl text-[15px] text-white/70">
                Explore the concept, preview a sample card, and try the demonstration request flow. Sample data only.
              </p>
            </div>
            <DemoBadge label="Concept preview · Demo" className="border-white/20 bg-white/10 text-white" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left: card preview + features */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <G1DigitalHealthCard
                patient={{
                  name: form.name || user?.name || "Dr. Ananya Sharma",
                  healthId: demoId || user?.healthId || "G1-849201",
                  phone: form.phone || user?.phone || "+91 98765 43210",
                  bloodGroup: form.bloodGroup || "O+",
                  age: form.age || "32",
                  gender: "Female",
                  address: form.city ? `${form.city}, India` : "42, Green Valley Enclave, Ring Road, Ahmedabad",
                  photo: form.photo,
                }}
                showActions={true}
              />

              <div className="text-center pt-2">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy/90 transition"
                >
                  Go to Full Patient Profile & History <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="rounded-[18px] border border-line bg-white p-5 shadow-soft"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-dark">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-[15.5px] font-extrabold text-navy">{f.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: demo request form */}
          <aside>
            <div className="lg:sticky lg:top-24 rounded-[20px] border border-line bg-white p-6 shadow-card sm:p-7">
              {status === "success" ? (
                <div className="text-center" role="status">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-brand/15 text-emerald-brand">
                    <Check className="h-8 w-8" />
                  </span>
                  <h2 className="mt-4 font-display text-xl font-extrabold text-navy">Demo request received</h2>
                  <p className="mt-2 text-[14px] text-muted">
                    Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}. Your demonstration Health ID is:
                  </p>
                  <p className="mx-auto mt-3 w-fit rounded-xl bg-cream px-5 py-3 font-mono text-lg font-extrabold tracking-wide text-navy">
                    {demoId}
                  </p>
                  <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12.5px] text-amber-800">
                    Demo only — this ID is generated in your browser and is not stored or usable anywhere.
                  </p>
                  <div className="mt-5 grid gap-2.5">
                    <Link to="/explore" className="flex h-12 items-center justify-center rounded-full bg-navy font-display text-[14.5px] font-bold text-white transition hover:bg-navy-800">
                      Discover providers
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="flex h-12 items-center justify-center rounded-full border border-line font-display text-[14.5px] font-bold text-navy transition hover:border-navy"
                    >
                      Try another demo
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  {user && (
                    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 p-3.5">
                      <img
                        src={user.picture || "/brand/g1-icon.svg"}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-brand/30"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-teal-dark">
                          <UserCheck className="h-3.5 w-3.5" /> Google Profile Connected
                        </div>
                        <p className="font-display text-[13.5px] font-bold text-navy truncate">{user.name}</p>
                        <p className="text-[12px] text-muted truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <h2 className="font-display text-xl font-extrabold text-navy">Request your demo card</h2>
                  <p className="mt-1.5 text-[13.5px] text-muted">
                    {user
                      ? "Your name and mobile number from Google have been pre-filled below."
                      : "Fill this demonstration form to preview card generation. Nothing is sent to a server."}
                  </p>

                  <div className="mt-5 space-y-4">
                    {/* Patient Photo Upload via MongoDB GridFS */}
                    <div className="rounded-2xl border border-line bg-cream/70 p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img
                            src={form.photo}
                            alt="Patient Card Preview"
                            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-teal-brand/30 shadow-xs"
                          />
                          {uploadingPhoto && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-navy/60 text-white">
                              <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-navy flex items-center gap-1.5">
                              <Camera className="h-4 w-4 text-teal-dark" /> Health Card Photo (GridFS)
                            </span>
                            {photoNotice && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {photoNotice}
                              </span>
                            )}
                          </div>
                          <p className="text-[11.5px] text-muted mt-0.5">
                            Upload your passport photo for the digital health card & QR verification.
                          </p>
                          <label className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-navy shadow-2xs hover:bg-slate-50 cursor-pointer">
                            <UploadCloud className="h-3.5 w-3.5 text-teal-brand" />
                            <span>{uploadingPhoto ? "Uploading to GridFS..." : "Choose Photo"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingPhoto}
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-bold text-navy">Full name *</span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className={`h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium text-navy focus:bg-white ${errors.name ? "border-red-400" : "border-line focus:border-teal-brand"}`}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "hc-name-err" : undefined}
                      />
                      {errors.name && <span id="hc-name-err" className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.name}</span>}
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-bold text-navy">Mobile number *</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className={`h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium text-navy focus:bg-white ${errors.phone ? "border-red-400" : "border-line focus:border-teal-brand"}`}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "hc-phone-err" : undefined}
                      />
                      {errors.phone && <span id="hc-phone-err" className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.phone}</span>}
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="mb-1.5 block text-[13px] font-bold text-navy">Blood Group *</span>
                        <select
                          value={form.bloodGroup}
                          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                          className="h-[50px] w-full rounded-xl border border-line bg-cream/50 px-4 text-[14px] font-bold text-navy focus:bg-white focus:border-teal-brand"
                        >
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block text-[13px] font-bold text-navy">Age</span>
                        <input
                          type="number"
                          value={form.age}
                          onChange={(e) => setForm({ ...form, age: e.target.value })}
                          placeholder="e.g. 32"
                          className="h-[50px] w-full rounded-xl border border-line bg-cream/50 px-4 text-[15px] font-medium text-navy focus:bg-white focus:border-teal-brand"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-bold text-navy">City / Address *</span>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className={`h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium text-navy focus:bg-white ${errors.city ? "border-red-400" : "border-line focus:border-teal-brand"}`}
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? "hc-city-err" : undefined}
                      />
                      {errors.city && <span id="hc-city-err" className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.city}</span>}
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-cream/50 p-3.5">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[#00A896]"
                      />
                      <span className="text-[13px] leading-relaxed text-ink">
                        I understand this is a <span className="font-bold">demonstration only</span> and no real Health Card, benefits, or account is created.
                      </span>
                    </label>
                    {errors.consent && <span className="block text-[12.5px] font-semibold text-red-600">{errors.consent}</span>}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-teal-brand font-display text-[15px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-70"
                    >
                      {status === "loading" ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Generating demo card…</>
                      ) : (
                        <>Generate demo preview</>
                      )}
                    </button>
                    <p className="text-center text-[12px] text-muted">No OTP · No payment · No real data stored</p>
                  </div>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
