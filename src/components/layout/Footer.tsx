import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

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
      company_address: "123 Innovation Drive, San Francisco, CA",
    };
  }
}

export default async function Footer() {
  const settings = await getSettings();

  const footerLinks = [
    {
      title: "Services",
      links: [
        { label: "Software Solutions", href: "/services" },
        { label: "Hardware Projects", href: "/services" },
        { label: "Request a Quote", href: "/quote" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/#about" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-primary)",
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background: "var(--gradient-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={18} color="white" />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {settings.company_name || "AIP Inc"}
              </span>
            </Link>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              Building the future, one solution at a time. Professional software
              and hardware solutions for businesses of all sizes.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 16,
                }}
              >
                {group.title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      transition: "color var(--transition-fast)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {settings.company_email && (
                <a
                  href={`mailto:${settings.company_email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  <Mail size={16} style={{ color: "var(--accent-light)", flexShrink: 0 }} />
                  {settings.company_email}
                </a>
              )}
              {settings.company_phone && (
                <a
                  href={`tel:${settings.company_phone}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  <Phone size={16} style={{ color: "var(--accent-light)", flexShrink: 0 }} />
                  {settings.company_phone}
                </a>
              )}
              {settings.company_address && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  <MapPin size={16} style={{ color: "var(--accent-light)", flexShrink: 0, marginTop: 2 }} />
                  {settings.company_address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-primary)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            &copy; {new Date().getFullYear()} {settings.company_name || "AIP Inc"}. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <Link
              href="/quote"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
