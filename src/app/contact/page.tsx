import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AIP Inc. We're here to help with your software and hardware project needs.",
};

async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => (map[s.key] = s.value));
    return map;
  } catch {
    return {
      company_name: "AIP Inc",
      company_email: "hello@aipinc.com",
      company_phone: "+1 (555) 123-4567",
      company_address: "123 Innovation Drive, Suite 100, San Francisco, CA 94105",
      social_twitter: "",
      social_linkedin: "",
      social_github: "",
    };
  }
}

export default async function ContactPage() {
  const settings = await getSettings();

  const contactItems = [
    {
      icon: <Mail size={24} />,
      label: "Email",
      value: settings.company_email || "hello@aipinc.com",
      href: `mailto:${settings.company_email}`,
    },
    {
      icon: <Phone size={24} />,
      label: "Phone",
      value: settings.company_phone || "+1 (555) 123-4567",
      href: `tel:${settings.company_phone}`,
    },
    {
      icon: <MapPin size={24} />,
      label: "Address",
      value: settings.company_address || "San Francisco, CA",
      href: null,
    },
  ];

  const socials = [
    { key: "social_twitter", label: "Twitter / X" },
    { key: "social_linkedin", label: "LinkedIn" },
    { key: "social_github", label: "GitHub" },
  ].filter((s) => settings[s.key]);

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
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h1
                className="section-title animate-fade-in-up"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                Get in <span className="gradient-text">Touch</span>
              </h1>
              <p
                className="section-subtitle animate-fade-in-up delay-100"
                style={{ margin: "0 auto" }}
              >
                Have a question or want to discuss a project? We&apos;d love to hear
                from you.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 28,
                maxWidth: 960,
                margin: "0 auto",
              }}
            >
              {contactItems.map((item, i) => (
                <div
                  key={item.label}
                  className={`card animate-fade-in-up delay-${(i + 1) * 100}`}
                  style={{
                    padding: 32,
                    textAlign: "center",
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
                      margin: "0 auto 16px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 8,
                    }}
                  >
                    {item.label}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        color: "var(--text-primary)",
                        fontSize: "1.05rem",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      style={{
                        color: "var(--text-primary)",
                        fontSize: "1.05rem",
                        fontWeight: 500,
                      }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div
                className="animate-fade-in-up delay-400"
                style={{
                  textAlign: "center",
                  marginTop: 48,
                }}
              >
                <h3
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 20,
                  }}
                >
                  Follow Us
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  {socials.map((social) => (
                    <a
                      key={social.key}
                      href={settings[social.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: "10px 20px", fontSize: "0.85rem" }}
                    >
                      {social.label}
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div
              className="animate-fade-in-up delay-500"
              style={{
                textAlign: "center",
                marginTop: 64,
                padding: 48,
                background: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-xl)",
                maxWidth: 600,
                margin: "64px auto 0",
              }}
            >
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  marginBottom: 12,
                  fontFamily: "var(--font-display)",
                }}
              >
                Ready to start a project?
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: 24,
                  lineHeight: 1.7,
                }}
              >
                Get a personalized quote tailored to your needs.
              </p>
              <Link href="/quote" className="btn-primary">
                Request a Quote
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
