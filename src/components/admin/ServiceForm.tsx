"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { slugify, parseFeatures } from "@/lib/utils";

interface ServiceFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    shortDescription: string;
    startingPrice: number;
    features: string;
    iconName: string;
    isActive: boolean;
    displayOrder: number;
  };
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "SOFTWARE");
  const [description, setDescription] = useState(initialData?.description || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [startingPrice, setStartingPrice] = useState(
    initialData ? (initialData.startingPrice / 100).toString() : ""
  );
  const [features, setFeatures] = useState(
    initialData ? parseFeatures(initialData.features).join("\n") : ""
  );
  const [iconName, setIconName] = useState(initialData?.iconName || "globe");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [displayOrder, setDisplayOrder] = useState(
    initialData?.displayOrder?.toString() || "0"
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      title,
      slug,
      category,
      description,
      shortDescription,
      startingPrice: Math.round(parseFloat(startingPrice) * 100),
      features: JSON.stringify(
        features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean)
      ),
      iconName,
      isActive,
      displayOrder: parseInt(displayOrder),
    };

    try {
      const url = isEditing
        ? `/api/services/${initialData.id}`
        : "/api/services";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        router.push("/admin/services");
        router.refresh();
      } else {
        setError(result.error || "Failed to save service");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/services"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          marginBottom: 24,
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={16} /> Back to Services
      </Link>

      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          marginBottom: 32,
        }}
      >
        {isEditing ? "Edit Service" : "Add New Service"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ padding: 32, maxWidth: 720 }}
      >
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(225, 112, 85, 0.1)",
              border: "1px solid rgba(225, 112, 85, 0.3)",
              borderRadius: "var(--radius-md)",
              marginBottom: 24,
              color: "var(--rose)",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div>
            <label className="form-label">Service Title *</label>
            <input
              className="form-input"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Website Development"
              required
            />
          </div>
          <div>
            <label className="form-label">URL Slug *</label>
            <input
              className="form-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. website-development"
              required
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div>
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="SOFTWARE">Software</option>
              <option value="HARDWARE">Hardware</option>
            </select>
          </div>
          <div>
            <label className="form-label">Starting Price ($) *</label>
            <input
              className="form-input"
              type="number"
              step="0.01"
              min="0"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="499.00"
              required
            />
          </div>
          <div>
            <label className="form-label">Icon Name</label>
            <select
              className="form-select"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
            >
              <option value="globe">Globe (Web)</option>
              <option value="cpu">CPU (Hardware)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Short Description *</label>
          <input
            className="form-input"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="1-2 sentences for the service card preview"
            maxLength={200}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Full Description *</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed service description. Supports multiple paragraphs."
            style={{ minHeight: 160 }}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Features (one per line) *</label>
          <textarea
            className="form-input"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder={"Fully Responsive Design\nSEO Optimized\nCustom UI/UX Design"}
            style={{ minHeight: 120 }}
            required
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <label className="form-label">Display Order</label>
            <input
              className="form-input"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Visibility</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: "none",
                  background: isActive ? "var(--accent)" : "var(--border-primary)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background var(--transition-fast)",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    top: 3,
                    left: isActive ? 25 : 3,
                    transition: "left var(--transition-fast)",
                  }}
                />
              </button>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                {isActive ? "Active (visible on website)" : "Hidden from website"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{
            padding: "14px 32px",
            fontSize: "1rem",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <>
              <Save size={18} />
              {isEditing ? "Update Service" : "Create Service"}
            </>
          )}
        </button>
      </form>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
