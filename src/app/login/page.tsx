"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Zap,
  LogIn,
  UserPlus,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCompany, setRegCompany] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // Fetch session to determine role and redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (regPassword !== regConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone || undefined,
          company: regCompany || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created! Please sign in.");
        setTab("login");
        setLoginEmail(regEmail);
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          paddingTop: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(108, 92, 231, 0.12), transparent), var(--bg-primary)",
        }}
      >
        <div
          className="card animate-fade-in-up"
          style={{
            width: "100%",
            maxWidth: 480,
            padding: 40,
            margin: 24,
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-md)",
                background: "var(--gradient-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Zap size={26} color="white" />
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                marginBottom: 4,
              }}
            >
              Client Portal
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Track your projects and manage your requests
            </p>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: "flex",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-secondary)",
              padding: 4,
              marginBottom: 28,
            }}
          >
            <button
              onClick={() => {
                setTab("login");
                setError("");
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                transition: "all 150ms",
                background:
                  tab === "login" ? "var(--gradient-accent)" : "transparent",
                color: tab === "login" ? "white" : "var(--text-muted)",
              }}
            >
              <LogIn
                size={16}
                style={{ marginRight: 6, verticalAlign: "middle" }}
              />{" "}
              Sign In
            </button>
            <button
              onClick={() => {
                setTab("register");
                setError("");
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                transition: "all 150ms",
                background:
                  tab === "register"
                    ? "var(--gradient-accent)"
                    : "transparent",
                color: tab === "register" ? "white" : "var(--text-muted)",
              }}
            >
              <UserPlus
                size={16}
                style={{ marginRight: 6, verticalAlign: "middle" }}
              />{" "}
              Register
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: "rgba(225, 112, 85, 0.1)",
                border: "1px solid rgba(225, 112, 85, 0.3)",
                borderRadius: "var(--radius-md)",
                marginBottom: 24,
                color: "var(--rose)",
                fontSize: "0.9rem",
              }}
            >
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">
                  <Mail
                    size={14}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Email
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="form-label">
                  <Lock
                    size={14}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Password
                </label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "14px",
                  fontSize: "1rem",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">
                  <User
                    size={14}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Full Name *
                </label>
                <input
                  className="form-input"
                  placeholder="John Doe"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">
                  <Mail
                    size={14}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Email *
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label className="form-label">
                    <Lock
                      size={14}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />
                    Password *
                  </label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="form-label">
                    <Lock
                      size={14}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />
                    Confirm *
                  </label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Repeat"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div>
                  <label className="form-label">
                    <Phone
                      size={14}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />
                    Phone
                  </label>
                  <input
                    className="form-input"
                    placeholder="Optional"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">
                    <Building2
                      size={14}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />
                    Company
                  </label>
                  <input
                    className="form-input"
                    placeholder="Optional"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "14px",
                  fontSize: "1rem",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            <Link
              href="/"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}
            >
              ← Back to website
            </Link>
          </p>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}
