"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  FolderKanban,
  ArrowRight,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Project {
  id: string;
  clientName: string;
  projectDetails: string;
  budget: string;
  timeline: string;
  status: string;
  currentMilestone: string;
  progressPercent: number;
  createdAt: string;
  service: { title: string; slug: string; iconName: string };
  assignedTeam: { name: string } | null;
}

const milestoneLabels: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  PROPOSAL_SENT: "Proposal Sent",
  IN_PROGRESS: "In Progress",
  TESTING: "Testing & QA",
  DELIVERED: "Delivered",
  CLOSED: "Closed",
};

function getMilestoneColor(milestone: string): string {
  const colors: Record<string, string> = {
    SUBMITTED: "var(--accent-light)",
    UNDER_REVIEW: "var(--amber)",
    PROPOSAL_SENT: "#74b9ff",
    IN_PROGRESS: "var(--accent)",
    TESTING: "#fd79a8",
    DELIVERED: "var(--emerald)",
    CLOSED: "var(--text-muted)",
  };
  return colors[milestone] || "var(--text-muted)";
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/quotes")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <Loader2
          size={32}
          style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }}
        />
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              marginBottom: 8,
            }}
          >
            My <span className="gradient-text">Projects</span>
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Track the progress of your active projects and requests
          </p>
        </div>
        <Link
          href="/quote"
          className="btn-primary"
          style={{ padding: "12px 24px", fontSize: "0.9rem" }}
        >
          <FolderKanban size={18} />
          Request New Quote
        </Link>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div
          className="card"
          style={{
            padding: 64,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(108, 92, 231, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Package size={36} style={{ color: "var(--accent)" }} />
          </div>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            No projects yet
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: 28,
              maxWidth: 400,
              margin: "0 auto 28px",
            }}
          >
            Submit your first quote request and it will appear here for you to
            track in real-time.
          </p>
          <Link
            href="/quote"
            className="btn-primary"
            style={{ justifyContent: "center" }}
          >
            <FolderKanban size={18} />
            Get Started
          </Link>
        </div>
      )}

      {/* Project Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 20,
        }}
      >
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/track/${project.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              className="card"
              style={{
                padding: 28,
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      marginBottom: 4,
                      color: "var(--text-primary)",
                    }}
                  >
                    {project.service.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Clock
                      size={12}
                      style={{ verticalAlign: "middle", marginRight: 4 }}
                    />
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    borderRadius: "var(--radius-full)",
                    background: `${getMilestoneColor(project.currentMilestone)}20`,
                    color: getMilestoneColor(project.currentMilestone),
                    border: `1px solid ${getMilestoneColor(project.currentMilestone)}30`,
                  }}
                >
                  {project.currentMilestone === "DELIVERED" ? (
                    <CheckCircle2 size={12} />
                  ) : project.currentMilestone === "SUBMITTED" ? (
                    <AlertCircle size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                  {milestoneLabels[project.currentMilestone] ||
                    project.currentMilestone}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    Progress
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--accent-light)",
                    }}
                  >
                    {project.progressPercent}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-tertiary)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${project.progressPercent}%`,
                      background: "var(--gradient-accent)",
                      borderRadius: "var(--radius-full)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>

              {/* Description preview */}
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                {project.projectDetails}
              </p>

              {/* Bottom row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  {project.assignedTeam?.name || "Pending assignment"}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--accent-light)",
                  }}
                >
                  View Details <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
