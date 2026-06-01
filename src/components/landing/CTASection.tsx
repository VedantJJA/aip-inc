import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function CTASection() {
  const settingsArray = await prisma.siteSetting.findMany({
    where: { key: { in: ['cta_heading', 'cta_subtext'] } }
  });
  const heading = settingsArray.find(s => s.key === 'cta_heading')?.value || "Ready to Start Your Project?";
  const subtext = settingsArray.find(s => s.key === 'cta_subtext')?.value || "Tell us about your vision. We'll provide a personalized quote and show you exactly how we can bring it to life.";
  return (
    <section
      className="section"
      style={{
        background: "var(--bg-secondary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108, 92, 231, 0.1), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              marginBottom: 20,
              fontFamily: "var(--font-display)",
              lineHeight: 1.2,
            }}
          >
            {heading}
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: 36,
            }}
          >
            {subtext}
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/quote" className="btn-primary" style={{ fontSize: "1.05rem", padding: "16px 36px" }}>
              Request a Free Quote
              <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ fontSize: "1.05rem", padding: "16px 36px" }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
