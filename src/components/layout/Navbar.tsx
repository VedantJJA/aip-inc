"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap, LogIn, LayoutDashboard } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if customer session exists
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.role === "CUSTOMER") setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  return (
    <nav
      className="glass"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: "var(--gradient-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={22} color="white" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            AIP Inc
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          className="nav-desktop"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                borderRadius: "var(--radius-md)",
                transition: "all var(--transition-fast)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = "var(--bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{ marginLeft: 8, padding: "10px 22px", fontSize: "0.85rem" }}
            >
              <LayoutDashboard size={16} />
              My Projects
            </Link>
          ) : (
            <Link
              href="/login"
              className="btn-primary"
              style={{ marginLeft: 8, padding: "10px 22px", fontSize: "0.85rem" }}
            >
              <LogIn size={16} />
              Login / Register
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: 8,
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="nav-mobile-menu animate-fade-in"
          style={{
            padding: "16px 0 24px",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                padding: "12px 16px",
                fontSize: "1rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "none",
                borderRadius: "var(--radius-md)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: "8px 16px" }}>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="btn-primary"
                onClick={() => setIsOpen(false)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <LayoutDashboard size={16} />
                My Projects
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
                onClick={() => setIsOpen(false)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <LogIn size={16} />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
