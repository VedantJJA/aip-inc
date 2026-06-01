"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Zap, LogIn, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
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
          maxWidth: 420,
          padding: 40,
          margin: 24,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
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
            Admin Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Sign in to manage your services and quotes
          </p>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="admin@aipinc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
            ← Back to website
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
