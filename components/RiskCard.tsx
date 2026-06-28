"use client";
import { useState } from "react";

interface Risk {
  title: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  evidence?: string;
  impact?: string;
  probability?: string;
}

interface Props { riskAnalysis: string; }

export default function RiskCard({ riskAnalysis }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  let risks: Risk[] = [];

  try {
    const clean = riskAnalysis.replace(/```json|```/g, "").trim();
    risks = JSON.parse(clean).risks || [];
  } catch {
    return (
      <div className="card fade-in">
        <p className="section-label">Risk Assessment</p>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{riskAnalysis}</p>
      </div>
    );
  }

  const sevColor = (s: string) =>
    s === "HIGH" ? { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.25)" }
    : s === "MEDIUM" ? { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.25)" }
    : { bg: "rgba(99,102,241,0.1)", color: "#818cf8", border: "rgba(99,102,241,0.25)" };

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Risk Assessment</h3>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["HIGH", "MEDIUM", "LOW"] as const).map((s) => {
            const count = risks.filter((r) => r.severity === s).length;
            if (!count) return null;
            const c = sevColor(s);
            return (
              <span key={s} style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                {count} {s}
              </span>
            );
          })}
        </div>
      </div>

      {risks.map((risk, i) => {
        const c = sevColor(risk.severity);
        const isOpen = openIndex === i;
        return (
          <div className="risk-item" key={i}>
            <div className="risk-header" onClick={() => setOpenIndex(isOpen ? null : i)}>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: c.bg, color: c.color, border: `1px solid ${c.border}`, flexShrink: 0 }}>
                {risk.severity}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{risk.title}</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
            </div>
            {isOpen && (
              <div className="risk-body open">
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "10px" }}>{risk.description}</p>
                {risk.evidence && (
                  <div className="risk-grid">
                    {[
                      { label: "Evidence", value: risk.evidence },
                      { label: "Impact", value: risk.impact || "Medium" },
                      { label: "Probability", value: risk.probability || "Medium" },
                    ].map((item) => (
                      <div className="risk-meta" key={item.label}>
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</p>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}