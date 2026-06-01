import Link from "next/link";
import { ArrowRight, Globe, Cpu } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseFeatures } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our software development and hardware project guidance services. Custom solutions starting at competitive prices.",
};

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={28} />,
  cpu: <Cpu size={28} />,
};

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        {/* Header */}
        <section
          className="section"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.1), transparent)",
          }}
        >
          <div className="container" style={{ textAlign: "center" }}>
            <h1
              className="section-title animate-fade-in-up"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
            >
              Our <span className="gradient-text">Services</span>
            </h1>
            <p
              className="section-subtitle animate-fade-in-up delay-100"
              style={{ margin: "0 auto" }}
            >
              Comprehensive solutions to bring your ideas to life — from concept
              to deployment.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{ paddingBottom: 100 }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: 32,
              }}
            >
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className={`card animate-fade-in-up delay-${(i + 1) * 100}`}
                  style={{ padding: 40, display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "var(--radius-md)",
                        background: "var(--accent-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-light)",
                      }}
                    >
                      {iconMap[service.iconName] || <Globe size={28} />}
                    </div>
                    <div>
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
                        }}
                      >
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: 12,
                      color: "var(--text-primary)",
                    }}
                  >
                    {service.title}
                  </h2>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    {service.shortDescription}
                  </p>

                  {/* Features */}
                  <div style={{ marginBottom: 28, flex: 1 }}>
                    <h4
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 14,
                      }}
                    >
                      What&apos;s Included
                    </h4>
                    <div style={{ display: "grid", gap: 8 }}>
                      {parseFeatures(service.features).map((feature, fi) => (
                        <div
                          key={fi}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--accent)",
                              flexShrink: 0,
                            }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div
                    style={{
                      borderTop: "1px solid var(--border-primary)",
                      paddingTop: 24,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Starting at
                      </span>
                      <div
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-display)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatPrice(service.startingPrice)}
                      </div>
                    </div>
                    <Link
                      href={`/quote?service=${service.id}`}
                      className="btn-primary"
                      style={{ padding: "10px 24px" }}
                    >
                      Get Quote <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
