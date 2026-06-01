"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Map } from "lucide-react";
import Link from "next/link";

export default function TrackSearchPage() {
  const router = useRouter();
  const [quoteId, setQuoteId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteId.trim()) {
      router.push(`/track/${quoteId.trim()}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)" }}>
      <div className="card" style={{ padding: "48px 32px", maxWidth: 500, width: "100%", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gradient-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Map size={32} color="white" />
          </div>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 16 }}>Track Your Project</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
          Enter the secure Quote ID provided in your confirmation email to check the real-time status of your request.
        </p>
        
        <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            required
            className="form-input"
            style={{ textAlign: "center", letterSpacing: "1px", fontSize: "1.1rem" }}
            placeholder="e.g. cltx..."
            value={quoteId}
            onChange={(e) => setQuoteId(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: 14 }}>
            <Search size={20} /> Locate Project
          </button>
        </form>

        <div style={{ marginTop: 24 }}>
          <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.9rem", textDecoration: "none" }}>&larr; Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
}
