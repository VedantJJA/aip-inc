"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle2, Search, Clock, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { getBudgetLabel, getTimelineLabel } from "@/lib/utils";

interface TrackedQuote {
  id: string;
  clientName: string;
  projectDetails: string;
  budget: string;
  timeline: string;
  status: string;
  createdAt: string;
  service: { title: string };
  assignedTeam: { name: string } | null;
}

const statusSteps = ["NEW", "REVIEWED", "CONTACTED", "ACCEPTED"];
const rejectionSteps = ["NEW", "REVIEWED", "REJECTED"];
const closedSteps = ["NEW", "REVIEWED", "CONTACTED", "ACCEPTED", "CLOSED"]; // arbitrary for UI

export default function TrackingDetailPage() {
  const params = useParams();
  const [data, setData] = useState<TrackedQuote | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/track/${params.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError("We couldn't locate a project with that Quote ID. Please double check your link.");
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="spinner" size={32} /></div>;

  if (error || !data) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)" }}>
      <div className="card" style={{ padding: 48, maxWidth: 500, textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 16 }}>Quote Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <Link href="/track" className="btn-primary" style={{ justifyContent: "center" }}><Search size={18}/> Retry Search</Link>
      </div>
    </div>
  );

  let flow = statusSteps;
  if (data.status === "REJECTED") flow = rejectionSteps;
  if (data.status === "CLOSED") flow = closedSteps;

  const activeIndex = flow.indexOf(data.status);

  return (
    <div style={{ minHeight: "100vh", padding: "64px 24px", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: 800, width: "100%" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
           <div>
             <h1 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8 }}>{data.service.title} Project</h1>
             <p style={{ color: "var(--text-muted)" }}>Requested by {data.clientName} on {new Date(data.createdAt).toLocaleDateString()}</p>
           </div>
           <Link href="/track" style={{ color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Search size={16}/> Track Another</Link>
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 32 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-primary)" }}>Status Progress</h3>
          
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            <div style={{ position: "absolute", top: 16, left: 0, right: 0, height: 4, background: "var(--border-primary)", zIndex: 0 }} />
            <div style={{ position: "absolute", top: 16, left: 0, width: `${(activeIndex / (flow.length - 1)) * 100}%`, height: 4, background: "var(--accent)", transition: "width 0.5s ease", zIndex: 1 }} />
            
            {flow.map((step, index) => {
              const passed = index <= activeIndex;
              const isRejected = step === "REJECTED";
              return (
                <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, gap: 8 }}>
                  <div style={{ 
                    width: 36, height: 36, borderRadius: "50%", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: passed ? (isRejected ? "var(--destructive)" : "var(--accent)") : "var(--bg-primary)",
                    border: `2px solid ${passed ? (isRejected ? "var(--destructive)" : "var(--accent)") : "var(--border-primary)"}`,
                    color: passed ? "white" : "var(--text-muted)",
                    transition: "all 0.3s"
                  }}>
                    {passed ? <CheckCircle2 size={20} /> : <div style={{width: 10, height: 10, borderRadius: "50%", background: "var(--border-primary)"}} />}
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: passed ? 700 : 500, color: passed ? "var(--text-primary)" : "var(--text-muted)" }}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 32 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, color: "var(--text-muted)" }}><Clock size={18}/> Timeline</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{getTimelineLabel(data.timeline)}</div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, color: "var(--text-muted)" }}><Calendar size={18}/> Est. Budget</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{getBudgetLabel(data.budget)}</div>
          </div>
          <div className="card" style={{ padding: 24 }}>
             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, color: "var(--text-muted)" }}><Users size={18}/> Assigned Division</div>
             <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{data.assignedTeam?.name || "Pending Assignment"}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>Project Details Snapshot</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {data.projectDetails}
          </p>
        </div>

      </div>
    </div>
  );
}
