import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Globe, Cpu, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseFeatures } from "@/lib/utils";
import type { Metadata } from "next";

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={32} />,
  cpu: <Cpu size={32} />,
};

async function getService(slug: string) {
  try {
    return await prisma.service.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

async function getCurrency() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "currency" } });
    return setting?.value || "USD";
  } catch {
    return "USD";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, currency] = await Promise.all([getService(slug), getCurrency()]);
  if (!service) notFound();

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
            <Link
              href="/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginBottom: 32,
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} /> Back to Services
            </Link>

            <div className="service-detail-grid">
              {/* Left Content */}
              <div className="animate-fade-in-up">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "var(--radius-lg)",
                      background: "var(--accent-glow)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-light)",
                    }}
                  >
                    {iconMap[service.iconName] || <Globe size={32} />}
                  </div>
                  <span
                    className="badge"
                    style={{
                      background:
                        service.category === "SOFTWARE"
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(0, 184, 148, 0.15)",
                      color:
                        service.category === "SOFTWARE"
                          ? "var(--accent-light)"
                          : "var(--emerald)",
                      fontSize: "0.8rem",
                      padding: "6px 14px",
                    }}
                  >
                    {service.category}
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: "clamp(2rem, 4vw, 2.8rem)",
                    fontWeight: 800,
                    marginBottom: 20,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {service.title}
                </h1>

                <div
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    fontSize: "1.05rem",
                  }}
                >
                  {service.description.split("\n").map((paragraph, i) => (
                    <p key={i} style={{ marginBottom: 16 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right — Pricing Card */}
              <div
                className="card animate-fade-in-up delay-200"
                style={{
                  padding: 32,
                  position: "sticky",
                  top: 100,
                }}
              >
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Starting at
                  </span>
                  <div
                    className="gradient-text"
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {formatPrice(service.startingPrice, { currency })}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border-primary)",
                    paddingTop: 24,
                    marginBottom: 24,
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 16,
                    }}
                  >
                    What&apos;s Included
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {parseFeatures(service.features).map((feature, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Check
                          size={16}
                          style={{ color: "var(--emerald)", flexShrink: 0 }}
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/quote?service=${service.id}`}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px 24px",
                    fontSize: "1rem",
                  }}
                >
                  Request a Quote <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
