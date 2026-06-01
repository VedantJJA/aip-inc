import Link from "next/link";
import { ArrowRight, Globe, Cpu } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

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

async function getCurrency() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "currency" } });
    return setting?.value || "USD";
  } catch {
    return "USD";
  }
}

export default async function ServicesPreview() {
  const [services, currency] = await Promise.all([getServices(), getCurrency()]);

  return (
    <section className="section" id="services" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 className="section-title gradient-text">Our Services</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Comprehensive solutions for your digital and hardware needs
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {services.map((service, i) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className={`card animate-fade-in-up delay-${(i + 1) * 100}`}
              style={{
                padding: 36,
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
              }}
            >
              {/* Icon */}
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
                  marginBottom: 20,
                }}
              >
                {iconMap[service.iconName] || <Globe size={28} />}
              </div>

              {/* Category Badge */}
              <span
                className="badge"
                style={{
                  alignSelf: "flex-start",
                  marginBottom: 12,
                  background:
                    service.category === "SOFTWARE"
                      ? "rgba(108, 92, 231, 0.15)"
                      : "rgba(0, 184, 148, 0.15)",
                  color:
                    service.category === "SOFTWARE"
                      ? "var(--accent-light)"
                      : "var(--emerald)",
                }}
              >
                {service.category}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: 10,
                  color: "var(--text-primary)",
                }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: 20,
                  flex: 1,
                }}
              >
                {service.shortDescription}
              </p>

              {/* Price & CTA */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                  paddingTop: 20,
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Starting at
                  </span>
                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {formatPrice(service.startingPrice, { currency })}
                  </div>
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--accent-light)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  Learn More <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {services.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Services coming soon. Check back shortly!
          </p>
        )}
      </div>
    </section>
  );
}
