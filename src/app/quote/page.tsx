"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface Service {
  id: string;
  title: string;
  category: string;
}

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  serviceId: string;
  projectDetails: string;
  budget: string;
  timeline: string;
}

interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export default function QuotePage() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<CustomerSession | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      serviceId: preselectedService,
      budget: "",
      timeline: "",
    },
  });

  const selectedServiceId = watch("serviceId");

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setServices(res.data);
      })
      .catch(() => {});

    // Check if customer is logged in and auto-fill their info
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.role === "CUSTOMER") {
          setCustomer(data.user);
          if (data.user.name) setValue("clientName", data.user.name);
          if (data.user.email) setValue("clientEmail", data.user.email);
        }
      })
      .catch(() => {});
  }, [setValue]);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          customerId: customer?.id || undefined,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 72, minHeight: "100vh", display: "flex", alignItems: "center" }}>
          <div className="container">
            <div
              className="card animate-fade-in-up"
              style={{
                maxWidth: 560,
                margin: "0 auto",
                padding: 48,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--emerald-glow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <CheckCircle size={36} style={{ color: "var(--emerald)" }} />
              </div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  marginBottom: 12,
                  fontFamily: "var(--font-display)",
                }}
              >
                Quote Request Sent!
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: 32,
                }}
              >
                Thank you for your interest! We&apos;ve received your request and will
                get back to you within 24 hours with a personalized quote.
              </p>
              <a href="/" className="btn-primary" style={{ justifyContent: "center" }}>
                Back to Home
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <section
          className="section"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.1), transparent)",
          }}
        >
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h1
                className="section-title animate-fade-in-up"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                Request a <span className="gradient-text">Quote</span>
              </h1>
              <p
                className="section-subtitle animate-fade-in-up delay-100"
                style={{ margin: "0 auto" }}
              >
                Tell us about your project and we&apos;ll provide a tailored estimate.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card animate-fade-in-up delay-200"
              style={{
                maxWidth: 720,
                margin: "0 auto",
                padding: 40,
              }}
            >
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

              {/* Service Selection */}
              <div style={{ marginBottom: 24 }}>
                <label className="form-label">Service *</label>
                <select
                  className="form-select"
                  {...register("serviceId", { required: "Please select a service" })}
                >
                  <option value="">Select a service...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <p className="form-error">{errors.serviceId.message}</p>
                )}
              </div>

              {/* Dynamic info based on selected service */}
              {selectedService && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(59, 130, 246, 0.08)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: 24,
                    fontSize: "0.85rem",
                    color: "var(--accent-light)",
                  }}
                >
                  Category: <strong>{selectedService.category}</strong> — The form
                  fields below are tailored for this service type.
                </div>
              )}

              {/* Name & Email Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    placeholder="John Doe"
                    {...register("clientName", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Min 2 characters" },
                    })}
                  />
                  {errors.clientName && (
                    <p className="form-error">{errors.clientName.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="john@example.com"
                    {...register("clientEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email",
                      },
                    })}
                  />
                  {errors.clientEmail && (
                    <p className="form-error">{errors.clientEmail.message}</p>
                  )}
                </div>
              </div>

              {/* Phone & Company Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <div>
                  <label className="form-label">Phone (Optional)</label>
                  <input
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    {...register("clientPhone")}
                  />
                </div>
                <div>
                  <label className="form-label">Company (Optional)</label>
                  <input
                    className="form-input"
                    placeholder="Acme Corp"
                    {...register("companyName")}
                  />
                </div>
              </div>

              {/* Budget & Timeline */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <div>
                  <label className="form-label">Budget Range *</label>
                  <select
                    className="form-select"
                    {...register("budget", { required: "Please select a budget range" })}
                  >
                    <option value="">Select budget...</option>
                    <option value="UNDER_1K">Under $1,000</option>
                    <option value="ONE_TO_5K">$1,000 – $5,000</option>
                    <option value="FIVE_TO_10K">$5,000 – $10,000</option>
                    <option value="TEN_TO_25K">$10,000 – $25,000</option>
                    <option value="ABOVE_25K">$25,000+</option>
                  </select>
                  {errors.budget && (
                    <p className="form-error">{errors.budget.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Timeline *</label>
                  <select
                    className="form-select"
                    {...register("timeline", { required: "Please select a timeline" })}
                  >
                    <option value="">Select timeline...</option>
                    <option value="ASAP">As soon as possible</option>
                    <option value="ONE_MONTH">Within 1 month</option>
                    <option value="ONE_TO_3_MONTHS">1 – 3 months</option>
                    <option value="THREE_PLUS_MONTHS">3+ months</option>
                    <option value="FLEXIBLE">Flexible</option>
                  </select>
                  {errors.timeline && (
                    <p className="form-error">{errors.timeline.message}</p>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div style={{ marginBottom: 32 }}>
                <label className="form-label">
                  {selectedService?.category === "HARDWARE"
                    ? "Describe Your Hardware Project *"
                    : "Describe Your Project *"}
                </label>
                <textarea
                  className="form-input"
                  placeholder={
                    selectedService?.category === "HARDWARE"
                      ? "Tell us about the hardware you need help with — what components, what problem it solves, where you are in the design process..."
                      : "Tell us about the website or application you envision — features, target audience, design preferences..."
                  }
                  {...register("projectDetails", {
                    required: "Please describe your project",
                    minLength: {
                      value: 20,
                      message: "Please provide at least 20 characters",
                    },
                  })}
                />
                {errors.projectDetails && (
                  <p className="form-error">{errors.projectDetails.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px 24px",
                  fontSize: "1rem",
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Quote Request
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
