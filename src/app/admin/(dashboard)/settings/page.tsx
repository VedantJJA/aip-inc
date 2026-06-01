"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  group: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSettings(res.data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateValue = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: settings.map((s) => ({ key: s.key, value: s.value })),
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Group settings
  const groups: Record<string, Setting[]> = {};
  settings.forEach((s) => {
    if (!groups[s.group]) groups[s.group] = [];
    groups[s.group].push(s);
  });

  const groupLabels: Record<string, string> = {
    BRANDING: "Branding",
    CONTACT: "Contact Information",
    SOCIAL: "Social Media Links",
  };

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              marginBottom: 4,
            }}
          >
            Site Settings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Manage your website&apos;s global content and contact information.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary"
          disabled={saving}
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saving ? (
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <>
              <Save size={18} /> Save All Changes
            </>
          )}
        </button>
      </div>

      {saved && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(0, 184, 148, 0.1)",
            border: "1px solid rgba(0, 184, 148, 0.3)",
            borderRadius: "var(--radius-md)",
            marginBottom: 24,
            color: "var(--emerald)",
            fontSize: "0.9rem",
          }}
        >
          ✓ Settings saved successfully
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 720 }}>
        {Object.entries(groups).map(([group, groupSettings]) => (
          <div key={group} className="card" style={{ padding: 28 }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: "1px solid var(--border-primary)",
              }}
            >
              {groupLabels[group] || group}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {groupSettings.map((setting) => (
                <div key={setting.key}>
                  <label className="form-label">{setting.label}</label>
                  {setting.key === "theme_color" ? (
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={setting.value}
                        onChange={(e) => updateValue(setting.key, e.target.value)}
                        style={{ width: "40px", height: "40px", padding: "0", border: "1px solid var(--border-primary)", borderRadius: "var(--radius-sm)", cursor: "pointer", background: "transparent" }}
                      />
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontFamily: "monospace" }}>{setting.value}</span>
                    </div>
                  ) : setting.key === "currency" ? (
                    <select
                      className="form-select"
                      value={setting.value}
                      onChange={(e) => updateValue(setting.key, e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  ) : (
                    <input
                      className="form-input"
                      value={setting.value}
                      onChange={(e) => updateValue(setting.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
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
