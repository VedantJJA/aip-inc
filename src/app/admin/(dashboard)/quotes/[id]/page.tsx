import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  getBudgetLabel,
  getTimelineLabel,
  getStatusInfo,
} from "@/lib/utils";
import { ArrowLeft, Mail, Phone, Building2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import QuoteStatusForm from "./QuoteStatusForm";

export const metadata: Metadata = { title: "Quote Detail" };

async function getQuote(id: string) {
  return prisma.quoteRequest.findUnique({
    where: { id },
    include: { service: true, assignedTo: true, assignedTeam: true },
  });
}

async function getTeamMembers() {
  return prisma.teamMember.findMany({
    select: { id: true, name: true }
  });
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [quote, teamMembers, teams] = await Promise.all([
    getQuote(id),
    prisma.teamMember.findMany({ select: { id: true, name: true } }),
    prisma.team.findMany({ select: { id: true, name: true } })
  ]);
  if (!quote) notFound();

  const statusInfo = getStatusInfo(quote.status);

  return (
    <div>
      <Link
        href="/admin/quotes"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          marginBottom: 24,
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={16} /> Back to Quotes
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              marginBottom: 4,
            }}
          >
            {quote.clientName}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Submitted {formatDate(quote.createdAt)}
          </p>
        </div>
        <span
          className={`badge ${statusInfo.color}`}
          style={{ padding: "8px 18px", fontSize: "0.85rem" }}
        >
          {statusInfo.label}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 28,
          alignItems: "flex-start",
        }}
      >
        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Contact Info */}
          <div className="card" style={{ padding: 28 }}>
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              Contact Information
            </h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Mail size={16} style={{ color: "var(--accent-light)" }} />
                <a
                  href={`mailto:${quote.clientEmail}`}
                  style={{ color: "var(--text-primary)", textDecoration: "none" }}
                >
                  {quote.clientEmail}
                </a>
              </div>
              {quote.clientPhone && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Phone size={16} style={{ color: "var(--accent-light)" }} />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {quote.clientPhone}
                  </span>
                </div>
              )}
              {quote.companyName && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Building2 size={16} style={{ color: "var(--accent-light)" }} />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {quote.companyName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="card" style={{ padding: 28 }}>
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              Project Details
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {quote.projectDetails}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Quick Info */}
          <div className="card" style={{ padding: 28 }}>
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              Request Details
            </h3>
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Service
                </span>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {quote.service.title}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Budget
                </span>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {getBudgetLabel(quote.budget)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Timeline
                </span>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {getTimelineLabel(quote.timeline)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Assigned Team & Lead
                </span>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {quote.assignedTeam?.name || "No Team"} 
                  <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: 6 }}>
                    ({quote.assignedTo?.name || "Unassigned lead"})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Notes Form */}
          <QuoteStatusForm
            quoteId={quote.id}
            currentStatus={quote.status}
            currentNotes={quote.adminNotes || ""}
            currentAssignee={quote.assignedToId}
            currentTeam={quote.assignedTeamId}
            currentMilestone={quote.currentMilestone}
            currentProgress={quote.progressPercent}
            teamMembers={teamMembers}
            teams={teams}
          />
        </div>
      </div>
    </div>
  );
}
