"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Mail, Users, UserPlus } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description: string | null;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
  teamId: string | null;
}

export default function AdminTeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [addingTeam, setAddingTeam] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [newMember, setNewMember] = useState({ name: "", role: "Developer", email: "", teamId: "" });

  const fetchData = async () => {
    setLoading(true);
    const [tRes, mRes] = await Promise.all([
      fetch("/api/teams").then(r => r.json()),
      fetch("/api/team").then(r => r.json())
    ]);
    if (tRes.success) setTeams(tRes.data);
    if (mRes.success) setMembers(mRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTeam(true);
    try {
      const r = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      });
      const res = await r.json();
      if (res.success) {
        setTeams([res.data, ...teams]);
        setNewTeam({ name: "", description: "" });
      } else alert(res.error);
    } finally {
      setAddingTeam(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingMember(true);
    try {
      const payload = { ...newMember, teamId: newMember.teamId === "" ? null : newMember.teamId };
      const r = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const res = await r.json();
      if (res.success) {
        setMembers([res.data, ...members]);
        setNewMember({ name: "", role: "Developer", email: "", teamId: "" });
      } else alert(res.error);
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Remove this team group?")) return;
    try {
      const r = await fetch(`/api/teams/${id}`, { method: "DELETE" });
      const res = await r.json();
      if (res.success) setTeams(teams.filter((t) => t.id !== id));
      else alert(res.error);
    } catch { alert("Failed to delete team"); }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    try {
      const r = await fetch(`/api/team/${id}`, { method: "DELETE" });
      const res = await r.json();
      if (res.success) setMembers(members.filter((m) => m.id !== id));
      else alert(res.error);
    } catch { alert("Failed to delete member"); }
  };

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading roster...</div>;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 }}>
          Organization & Team Management
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Create macro Team Groupings and assign your staff members directly.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32 }}>
        
        {/* TEAMS PANEL */}
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <Users size={20} className="text-primary"/> Team Groups
          </h2>
          
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <form onSubmit={handleAddTeam} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <input required className="form-input" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} placeholder="Team Name (e.g. Sales Division)"/>
              </div>
              <button type="submit" disabled={addingTeam} className="btn-primary" style={{ justifyContent: "center" }}>
                {addingTeam ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <><Plus size={16} /> Create Team</>}
              </button>
            </form>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {teams.length === 0 ? <p style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>No teams instantiated.</p> : teams.map(t => (
              <div key={t.id} className="card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t.id}</div>
                </div>
                <button onClick={() => handleDeleteTeam(t.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* STAFF PANEL */}
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <UserPlus size={20} className="text-secondary"/> Staff Members
          </h2>

          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <form onSubmit={handleAddMember} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input required className="form-input" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Staff Member Name"/>
              <input required className="form-input" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="Role / Title"/>
              <input type="email" className="form-input" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} placeholder="Email"/>
              <select className="form-select" value={newMember.teamId} onChange={e => setNewMember({...newMember, teamId: e.target.value})}>
                <option value="">No Team Assigned</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>

              <button type="submit" disabled={addingMember} className="btn-secondary" style={{ justifyContent: "center", marginTop: 4 }}>
                {addingMember ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <><Plus size={16} /> Add Staff</>}
              </button>
            </form>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {members.length === 0 ? <p style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>No members added.</p> : members.map(m => {
              const assignedTeamContent = teams.find(t => t.id === m.teamId)?.name || "Unassigned";
              return (
              <div key={m.id} className="card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{m.name} <span style={{fontWeight: 400, color: "var(--text-muted)", fontSize: "0.85rem"}}>– {m.role}</span></div>
                  <div style={{ display: "flex", gap: "10px", marginTop: "4px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {m.email && <span><Mail size={12} style={{display: "inline", marginRight: 4}}/>{m.email}</span>}
                    <span style={{ color: "var(--accent)" }}>Team: {assignedTeamContent}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteMember(m.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
