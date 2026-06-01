import { prisma } from "@/lib/prisma";
import { formatDate, getStatusInfo, getBudgetLabel, getTimelineLabel } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quote Requests" };

async function getQuotes() {
  return prisma.quoteRequest.findMany({
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminQuotesPage() {
  const quotes = await getQuotes();

  const statusCounts = {
    all: quotes.length,
    NEW: quotes.filter((q) => q.status === "NEW").length,
    REVIEWED: quotes.filter((q) => q.status === "REVIEWED").length,
    CONTACTED: quotes.filter((q) => q.status === "CONTACTED").length,
    CLOSED: quotes.filter((q) => q.status === "CLOSED").length,
  };

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
          Quote Requests
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          View and manage incoming quote requests from clients.
        </p>
      </div>

      {/* Status Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(statusCounts).map(([key, count]) => {
          const info =
            key === "all"
              ? { label: "All", color: "bg-neutral-500/20 text-neutral-300" }
              : getStatusInfo(key);
          return (
            <span
              key={key}
              className={`badge ${info.color}`}
              style={{ padding: "6px 14px", fontSize: "0.8rem" }}
            >
              {info.label} ({count})
            </span>
          );
        })}
      </div>

      <div className="card" style={{ overflow: "hidden", padding: 0 }}>
        {quotes.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No quote requests yet. They&apos;ll appear here when clients submit the
            form.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Timeline</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => {
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
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {quote.clientEmail}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {quote.service.title}
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {getBudgetLabel(quote.budget)}
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {getTimelineLabel(quote.timeline)}
                    </td>
                    <td>
                      <span className={`badge ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
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
