import { prisma } from "@/lib/prisma";
import { formatDate, getStatusInfo, formatPrice } from "@/lib/utils";
import { Layers, MessageSquareQuote, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const [totalQuotes, newQuotes, activeServices, recentQuotes] =
    await Promise.all([
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.quoteRequest.findMany({
        include: { service: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return { totalQuotes, newQuotes, activeServices, recentQuotes };
}

export default async function AdminDashboardPage() {
  const { totalQuotes, newQuotes, activeServices, recentQuotes } =
    await getDashboardData();

  const stats = [
    {
      label: "Total Quotes",
      value: totalQuotes,
      icon: MessageSquareQuote,
      color: "var(--accent-light)",
      bg: "var(--accent-glow)",
    },
    {
      label: "New Quotes",
      value: newQuotes,
      icon: TrendingUp,
      color: "var(--emerald)",
      bg: "var(--emerald-glow)",
    },
    {
      label: "Active Services",
      value: activeServices,
      icon: Layers,
      color: "var(--amber)",
      bg: "rgba(253, 203, 110, 0.15)",
    },
    {
      label: "Est. Revenue",
      value: formatPrice(totalQuotes * 49900),
      icon: DollarSign,
      color: "var(--accent-light)",
      bg: "var(--accent-glow)",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            marginBottom: 4,
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card"
              style={{ padding: 24 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {stat.label}
                </span>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stat.color,
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)",
                }}
              >
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Quotes */}
      <div
        className="card"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-primary)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Recent Quote Requests
          </h2>
          <Link
            href="/admin/quotes"
            style={{
              fontSize: "0.85rem",
              color: "var(--accent-light)",
              textDecoration: "none",
            }}
          >
            View All →
          </Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No quote requests yet. They&apos;ll appear here when clients submit them.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((quote) => {
                const statusInfo = getStatusInfo(quote.status);
                return (
                  <tr key={quote.id}>
                    <td>
                      <Link
                        href={`/admin/quotes/${quote.id}`}
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 500,
                          textDecoration: "none",
                        }}
                      >
                        {quote.clientName}
                      </Link>
                      <div
                        style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                      >
                        {quote.clientEmail}
                      </div>
                    </td>
                    <td>{quote.service.title}</td>
                    <td>
                      <span
                        className={`badge ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {formatDate(quote.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
