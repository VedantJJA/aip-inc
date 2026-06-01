import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Zap, LayoutDashboard, FolderKanban, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Only allow customers to access the dashboard
  const role = (session.user as any).role;
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Top Nav */}
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

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/dashboard"
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link
              href="/quote"
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FolderKanban size={16} />
              New Quote
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginLeft: 8,
                paddingLeft: 16,
                borderLeft: "1px solid var(--border-primary)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "var(--gradient-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                {session.user.name}
              </span>
              <Link
                href="/api/auth/signout"
                style={{
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main
        style={{
          paddingTop: 100,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 24px 60px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
