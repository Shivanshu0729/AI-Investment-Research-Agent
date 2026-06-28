"use client";
import { ScoreFactor } from "@/types/InvestmentState";

interface Props { factors: ScoreFactor[]; }

export default function ScoreBreakdown({ factors }: Props) {
  const total = factors.reduce((s, f) => s + f.score, 0);
  const maxTotal = factors.reduce((s, f) => s + f.maxScore, 0);

  const getColor = (score: number, max: number) => {
    const p = score / max;
    return p >= 0.8 ? "#10b981" : p >= 0.55 ? "#f59e0b" : "#ef4444";
  };

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Score Breakdown</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>{total}</span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>/ {maxTotal}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {factors.map((factor) => {
          const color = getColor(factor.score, factor.maxScore);
          const pct = Math.round((factor.score / factor.maxScore) * 100);
          return (
            <div key={factor.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>{factor.name}</span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "1px 6px", borderRadius: "4px", border: "1px solid var(--border)" }}>{factor.maxScore}pts</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color }}>{pct}%</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{factor.score}<span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>/{factor.maxScore}</span></span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "5px", lineHeight: 1.5 }}>{factor.rationale}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}