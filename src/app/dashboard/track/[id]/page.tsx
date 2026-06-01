"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Send,
  Search,
  Code2,
  FlaskConical,
  PackageCheck,
  Archive,
} from "lucide-react";

interface ProjectDetail {
  id: string;
  clientName: string;
  projectDetails: string;
  budget: string;
  timeline: string;
  status: string;
  currentMilestone: string;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  service: { title: string; slug: string; iconName: string };
  assignedTeam: { name: string } | null;
  assignedTo: { name: string } | null;
}

const milestones = [
  {
    key: "SUBMITTED",
    label: "Submitted",
    description: "Your request has been received",
    icon: Send,
  },
  {
    key: "UNDER_REVIEW",
    label: "Under Review",
    description: "Our team is evaluating your requirements",
    icon: Search,
  },
  {
    key: "PROPOSAL_SENT",
    label: "Proposal Sent",
    description: "We've prepared a detailed proposal for you",
    icon: FileText,
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    description: "Development is actively underway",
    icon: Code2,
  },
  {
    key: "TESTING",
    label: "Testing & QA",
    description: "Quality assurance and testing phase",
    icon: FlaskConical,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Project has been delivered successfully",
    icon: PackageCheck,
  },
  {
    key: "CLOSED",
    label: "Closed",
    description: "Project complete and archived",
    icon: Archive,
  },
];

const budgetLabels: Record<string, string> = {
  UNDER_1K: "Under $1,000",
  ONE_TO_5K: "$1,000 – $5,000",
  FIVE_TO_10K: "$5,000 – $10,000",
  TEN_TO_25K: "$10,000 – $25,000",
  ABOVE_25K: "$25,000+",
};

const timelineLabels: Record<string, string> = {
  ASAP: "ASAP",
  ONE_MONTH: "Within 1 month",
  ONE_TO_3_MONTHS: "1 – 3 months",
  THREE_PLUS_MONTHS: "3+ months",
  FLEXIBLE: "Flexible",
};

export default function ProjectTrackingPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customer/quotes/${params.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProject(res.data);
        else setError(res.error || "Project not found");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load project");
        setLoading(false);
      });
  }, [params.id]);

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

  if (error || !project) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          className="card"
          style={{ padding: 48, maxWidth: 500, textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Project Not Found
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            {error}
          </p>
          <Link
            href="/dashboard"
            className="btn-primary"
            style={{ justifyContent: "center" }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = milestones.findIndex(
    (m) => m.key === project.currentMilestone
  );

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard"
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
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 16,
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
            {project.service.title}{" "}
            <span className="gradient-text">Project</span>
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Submitted on{" "}
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Progress Circle */}
        <div
          style={{
            position: "relative",
            width: 80,
            height: 80,
          }}
        >
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--border-primary)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="3"
              strokeDasharray={`${project.progressPercent}, 100`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
            <defs>
              <linearGradient id="progress-gradient">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#00b894" />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "var(--text-primary)",
            }}
          >
            {project.progressPercent}%
          </div>
        </div>
      </div>

      {/* Milestone Tracker — Delivery Style */}
      <div className="card" style={{ padding: 36, marginBottom: 28 }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            marginBottom: 32,
            paddingBottom: 16,
            borderBottom: "1px solid var(--border-primary)",
            color: "var(--text-primary)",
          }}
        >
          Project Milestones
        </h3>

        <div style={{ position: "relative" }}>
          {milestones.map((milestone, index) => {
            const isActive = index === currentIndex;
            const isPassed = index <= currentIndex;
            const isLast = index === milestones.length - 1;
            const Icon = milestone.icon;

            return (
              <div
                key={milestone.key}
                style={{
                  display: "flex",
                  gap: 20,
                  position: "relative",
                  paddingBottom: isLast ? 0 : 36,
                }}
              >
                {/* Vertical Line */}
                {!isLast && (
                  <div
                    style={{
                      position: "absolute",
                      left: 20,
                      top: 42,
                      bottom: 0,
                      width: 2,
                      background: isPassed
                        ? "var(--accent)"
                        : "var(--border-primary)",
                      transition: "background 0.4s ease",
                    }}
                  />
                )}

                {/* Icon Circle */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    minWidth: 42,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isPassed
                      ? isActive
                        ? "var(--gradient-accent)"
                        : "var(--accent)"
                      : "var(--bg-tertiary)",
                    border: `2px solid ${isPassed ? "var(--accent)" : "var(--border-primary)"}`,
                    color: isPassed ? "white" : "var(--text-muted)",
                    transition: "all 0.4s ease",
                    boxShadow: isActive
                      ? "0 0 20px var(--accent-glow)"
                      : "none",
                    animation: isActive ? "pulse-glow 2s infinite" : "none",
                  }}
                >
                  {isPassed && !isActive ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: isPassed ? 700 : 500,
                      color: isPassed
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                      marginBottom: 4,
                      transition: "color 0.3s",
                    }}
                  >
                    {milestone.label}
                    {isActive && (
                      <span
                        style={{
                          marginLeft: 10,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(59, 130, 246, 0.15)",
                          color: "var(--accent-light)",
                        }}
                      >
                        CURRENT
                      </span>
                    )}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: isPassed
                        ? "var(--text-secondary)"
                        : "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <div className="card" style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            <Calendar size={16} />
            Timeline
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>
            {timelineLabels[project.timeline] || project.timeline}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            <DollarSign size={16} />
            Budget
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>
            {budgetLabels[project.budget] || project.budget}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            <Users size={16} />
            Assigned Team
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>
            {project.assignedTeam?.name || "Pending"}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            <Clock size={16} />
            Last Updated
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>
            {new Date(project.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="card" style={{ padding: 32 }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--text-primary)",
          }}
        >
          Project Description
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
          }}
        >
          {project.projectDetails}
        </p>
      </div>
    </div>
  );
}
