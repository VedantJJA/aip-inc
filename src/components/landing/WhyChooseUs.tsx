"use client";

import { Shield, Clock, Headphones, Code2 } from "lucide-react";

const reasons = [
  {
    icon: <Code2 size={24} />,
    title: "Modern Tech Stack",
    description:
      "We use cutting-edge technologies to build fast, scalable, and maintainable solutions that stand the test of time.",
  },
  {
    icon: <Shield size={24} />,
    title: "Quality Guaranteed",
    description:
      "Every project goes through rigorous testing and review. We don't ship until it's pixel-perfect and production-ready.",
  },
  {
    icon: <Clock size={24} />,
    title: "On-Time Delivery",
    description:
      "We respect deadlines. Our streamlined process ensures your project is delivered on schedule without compromising quality.",
  },
  {
    icon: <Headphones size={24} />,
    title: "Dedicated Support",
    description:
      "From initial consultation to post-launch support, we're with you every step of the way. Your success is our priority.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left — Text */}
          <div>
            <h2
              className="section-title"
              style={{ marginBottom: 20 }}
            >
              Why Choose{" "}
              <span className="gradient-text">AIP Inc</span>?
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                marginBottom: 40,
              }}
            >
              We combine technical expertise with a passion for innovation. Our
              team delivers solutions that don&apos;t just meet expectations — they
              exceed them.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {reasons.map((reason, i) => (
                <div
                  key={i}
                  className={`animate-fade-in-up delay-${(i + 1) * 100}`}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-md)",
                      background: "var(--accent-glow)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-light)",
                      flexShrink: 0,
                    }}
                  >
                    {reason.icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        marginBottom: 4,
                        color: "var(--text-primary)",
                      }}
                    >
                      {reason.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                aspectRatio: "1",
                borderRadius: "var(--radius-xl)",
                background: "var(--gradient-card)",
                border: "1px solid var(--border-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative Circles */}
              <div
                style={{
                  position: "absolute",
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  border: "1px solid var(--border-primary)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  border: "1px solid rgba(108, 92, 231, 0.1)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  border: "1px solid rgba(108, 92, 231, 0.05)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Center Icon */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--gradient-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 60px var(--accent-glow)",
                  zIndex: 1,
                }}
              >
                <Code2 size={36} color="white" />
              </div>

              {/* Floating badges */}
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  right: 40,
                  padding: "8px 16px",
                  background: "rgba(0, 184, 148, 0.15)",
                  border: "1px solid rgba(0, 184, 148, 0.3)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--emerald)",
                }}
              >
                99.9% Uptime
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 60,
                  left: 30,
                  padding: "8px 16px",
                  background: "rgba(108, 92, 231, 0.15)",
                  border: "1px solid rgba(108, 92, 231, 0.3)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--accent-light)",
                }}
              >
                TypeSafe Code
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
