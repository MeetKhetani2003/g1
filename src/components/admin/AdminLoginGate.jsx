// src/components/admin/AdminLoginGate.jsx
"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  FileKey,
} from "lucide-react";
import { Link } from "../../utils/navigation";

export default function AdminLoginGate({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.message || "Invalid credentials. Please verify your .env.local setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            ← Return to G1 Public Portal
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[11px] font-mono text-teal-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> Environment Protected
          </span>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 backdrop-blur-xl p-7 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-emerald-400 shadow-inner">
              <KeyRound className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-white tracking-tight">
                G1 Admin Command
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Restricted Operations Console & Patient CRM
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-10 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full font-display text-xs font-bold text-white shadow-lg shadow-teal-500/20 transition hover:opacity-95 flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Authenticate & Enter Console <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Banner */}
          <div className="border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Configured via <code className="text-teal-400 font-mono text-[10px]">ADMIN_USERNAME</code> &{" "}
              <code className="text-teal-400 font-mono text-[10px]">ADMIN_PASSWORD</code> in{" "}
              <code className="text-slate-400 font-mono text-[10px]">.env.local</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
