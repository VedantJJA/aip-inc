"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

const milestoneOptions = [
  { value: "SUBMITTED", label: "Submitted", progress: 0 },
  { value: "UNDER_REVIEW", label: "Under Review", progress: 15 },
  { value: "PROPOSAL_SENT", label: "Proposal Sent", progress: 30 },
  { value: "IN_PROGRESS", label: "In Progress", progress: 50 },
  { value: "TESTING", label: "Testing & QA", progress: 75 },
  { value: "DELIVERED", label: "Delivered", progress: 95 },
  { value: "CLOSED", label: "Closed", progress: 100 },
];

export default function QuoteStatusForm({
  quoteId,
  currentStatus,
  currentNotes,
  currentAssignee,
  currentTeam,
  currentMilestone,
  currentProgress,
  teamMembers,
  teams,
}: {
  quoteId: string;
  currentStatus: string;
  currentNotes: string;
  currentAssignee: string | null;
  currentTeam: string | null;
  currentMilestone: string;
  currentProgress: number;
  teamMembers: { id: string; name: string }[];
  teams: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [assignedToId, setAssignedToId] = useState(currentAssignee || "");
  const [assignedTeamId, setAssignedTeamId] = useState(currentTeam || "");
  const [milestone, setMilestone] = useState(currentMilestone || "SUBMITTED");
  const [progress, setProgress] = useState(currentProgress || 0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleMilestoneChange = (value: string) => {
    setMilestone(value);
    // Auto-set progress based on milestone
    const option = milestoneOptions.find((o) => o.value === value);
    if (option) setProgress(option.progress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes: notes,
          assignedToId: assignedToId || null,
          assignedTeamId: assignedTeamId || null,
          currentMilestone: milestone,
          progressPercent: progress,
        }),
      });

      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ padding: 28 }}
    >
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
        Update Status
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="NEW">New</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="CONTACTED">Contacted</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="CLOSED">Closed (Archived)</option>
        </select>
      </div>

      {/* Project Milestone Tracker */}
      <div
        style={{
          padding: 16,
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-primary)",
          marginBottom: 16,
        }}
      >
        <h4
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--accent-light)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 12,
          }}
        >
          📦 Client Milestone Tracker
        </h4>

        <div style={{ marginBottom: 12 }}>
          <label className="form-label">Current Milestone</label>
          <select
            className="form-select"
            value={milestone}
            onChange={(e) => handleMilestoneChange(e.target.value)}
          >
            {milestoneOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">
            Progress: {progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--accent)",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Assign Team</label>
          <select
            className="form-select"
            value={assignedTeamId}
            onChange={(e) => setAssignedTeamId(e.target.value)}
          >
            <option value="">Ungrouped</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Assign Lead</label>
          <select
            className="form-select"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Internal Notes</label>
        <textarea
          className="form-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add private notes about this quote..."
          style={{ minHeight: 100 }}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "12px",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <>
            <Save size={16} />
            Save Changes
          </>
        )}
      </button>

      {saved && (
        <div
          style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--emerald)",
          }}
        >
          ✓ Changes saved successfully
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
