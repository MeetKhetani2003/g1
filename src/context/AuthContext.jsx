"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoginModalOpen: false,
  loginError: null,
  loginNotice: null,
  loading: true,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  clearNotice: () => {},
  loginWithGoogle: () => {},
  loginAsDemo: () => {},
  updatePhoneNumber: () => {},
  updateProfilePhoto: () => {},
  logout: () => {},
});

const STORAGE_KEY = "g1_healthcare_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loginNotice, setLoginNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved user on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }

    // Check for login query parameter or OAuth redirect params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      if (params.get("login") === "true") {
        setIsLoginModalOpen(true);
      }

      if (params.get("login_error")) {
        setLoginError(params.get("login_error"));
        setIsLoginModalOpen(true);
      }

      if (params.get("login_demo") === "true" || params.get("msg")) {
        setLoginNotice(
          params.get("msg") ||
            "Please paste your Google Client ID into .env.local (or use the input in this modal) to connect real Google accounts."
        );
        setIsLoginModalOpen(true);
      }

      if (params.get("login_success") === "1") {
        let profile = null;

        // 1. Try parsing full JSON user object from callback
        const userParam = params.get("user");
        if (userParam) {
          try {
            profile = JSON.parse(userParam);
          } catch (e) {
            console.error("Failed to parse user param:", e);
          }
        }

        // 2. Fallback to individual fields if full JSON not present
        if (!profile) {
          profile = {
            name: params.get("name") || "Google User",
            email: params.get("email") || "",
            picture: params.get("picture") || "",
            phone: params.get("phone") || "",
            healthId: "G1-" + Math.floor(100000 + Math.random() * 900000),
            provider: "google",
          };
        }

        if (profile) {
          setUser(profile);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          } catch {
            // ignore
          }
        }

        // Clean URL to keep it clean
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginError(null);
    setLoginNotice(null);
  };

  const clearNotice = () => {
    setLoginError(null);
    setLoginNotice(null);
  };

  const loginWithGoogle = (customClientId) => {
    const customId = typeof customClientId === "string" ? customClientId.trim() : "";
    const storedId =
      typeof window !== "undefined" ? (localStorage.getItem("g1_google_client_id") || "").trim() : "";
    const envId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();

    const id = customId || storedId || envId;

    if (id && id.length > 10 && !id.includes("your-google-client-id")) {
      window.location.href = `/api/auth/google?client_id=${encodeURIComponent(id)}`;
    } else {
      window.location.href = `/api/auth/google`;
    }
  };

  const loginAsDemo = (customData = {}) => {
    const demoUser = {
      name: customData.name || "Alex Sharma",
      email: customData.email || "alex.sharma@gmail.com",
      phone: customData.phone || "+91 98765 43210",
      picture:
        customData.picture ||
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=120&w=120",
      healthId: "G1-748291",
      provider: "google",
      ...customData,
    };
    setUser(demoUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    } catch {
      // ignore
    }
    setIsLoginModalOpen(false);
    setLoginError(null);
    setLoginNotice(null);
  };

  const updatePhoneNumber = (newPhone) => {
    if (!user) return;
    const updated = { ...user, phone: newPhone };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateProfilePhoto = (newPhotoUrl) => {
    if (!newPhotoUrl) return;
    setUser((prev) => {
      const updated = prev
        ? { ...prev, picture: newPhotoUrl, photo: newPhotoUrl }
        : { picture: newPhotoUrl, photo: newPhotoUrl };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = "g1_user=; Max-Age=0; path=/;";
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoginModalOpen,
        loginError,
        loginNotice,
        loading,
        openLoginModal,
        closeLoginModal,
        clearNotice,
        loginWithGoogle,
        loginAsDemo,
        updatePhoneNumber,
        updateProfilePhoto,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
