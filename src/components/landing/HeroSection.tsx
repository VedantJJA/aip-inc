import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function HeroSection() {
  const settingsArray = await prisma.siteSetting.findMany({
    where: { key: { in: ['hero_heading', 'hero_subtext'] } }
  });
  const heading = settingsArray.find(s => s.key === 'hero_heading')?.value || "We Build Digital Solutions That Drive Results";
  const subtext = settingsArray.find(s => s.key === 'hero_subtext')?.value || "From stunning websites to innovative hardware projects, we deliver end-to-end solutions tailored to your business.";
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(108, 92, 231, 0.15), transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 184, 148, 0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720 }}>
          {/* Tag */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "rgba(108, 92, 231, 0.1)",
              border: "1px solid rgba(108, 92, 231, 0.2)",
              borderRadius: "var(--radius-full)",
              marginBottom: 28,
              fontSize: "0.85rem",
              color: "var(--accent-light)",
              fontWeight: 500,
            }}
          >
            <Sparkles size={14} />
            Software & Hardware Solutions
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              fontFamily: "var(--font-display)",
            }}
          >
            {heading}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 560,
            }}
          >
            {subtext}
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link href="/quote" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
              Get a Free Quote
              <ArrowRight size={18} />
            </Link>
            <Link href="/services" className="btn-secondary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
              Explore Services
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up delay-400"
            style={{
              display: "flex",
              gap: 48,
              marginTop: 64,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "24/7", label: "Support Available" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="gradient-text"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
