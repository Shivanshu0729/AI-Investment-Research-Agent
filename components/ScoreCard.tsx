"use client";

interface Props {
  score: number;
  recommendation: "INVEST" | "CONSIDER" | "PASS";
  companyName: string;
  ticker: string;
  sector?: string;
  country?: string;
}

export default function ScoreCard({ score, recommendation, companyName, ticker, sector, country }: Props) {
  const confidence = Math.min(99, Math.round(50 + score * 0.49));
  const riskLevel = score >= 80 ? "Low" : score >= 60 ? "Medium" : "High";
  const ringColor = recommendation === "INVEST" ? "#10b981" : recommendation === "CONSIDER" ? "#f59e0b" : "#ef4444";
  const textColor = recommendation === "INVEST" ? "#10b981" : recommendation === "CONSIDER" ? "#f59e0b" : "#ef4444";
  const badgeClass = recommendation === "INVEST" ? "badge-invest" : recommendation === "CONSIDER" ? "badge-consider" : "badge-pass";
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (score / 100) * circumference;

  const checklist = [
    { label: "Revenue Growth", ok: score >= 55 },
    { label: "Profitability", ok: score >= 60 },
    { label: "Debt Level", ok: score >= 50 },
    { label: "News Sentiment", ok: score >= 65 },
    { label: "Market Position", ok: score >= 45 },
    { label: "Risk Profile", ok: score >= 70 },
  ];

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{companyName}</h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "6px", border: "1px solid var(--border)" }}>{ticker}</span>
            {sector && <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{sector}</span>}
            {country && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>· {country}</span>}
          </div>
        </div>
        <span className={`badge ${badgeClass}`}>{recommendation}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "20px" }}>
        <div className="score-ring-container">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="48" fill="none" stroke="#1e1e2e" strokeWidth="9" />
            <circle
              cx="55" cy="55" r="48" fill="none"
              stroke={ringColor} strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div className="score-center">
            <span style={{ fontSize: "28px", fontWeight: 800, color: textColor, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>/ 100</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {[
            { label: "Recommendation", value: recommendation, color: textColor },
            { label: "Confidence", value: `${confidence}%`, color: "var(--text-primary)" },
            { label: "Risk Level", value: riskLevel, color: riskLevel === "Low" ? "#10b981" : riskLevel === "Medium" ? "#f59e0b" : "#ef4444" },
          ].map((row) => (
            <div className="stat-row" key={row.label}>
              <span className="stat-label">{row.label}</span>
              <span className="stat-value" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />
      <p className="section-label">Investment Checklist</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
        {checklist.map((item) => (
          <div className="checklist-item" key={item.label}>
            <span style={{ fontSize: "13px", color: item.ok ? "#10b981" : "var(--text-muted)", fontWeight: 700 }}>{item.ok ? "✓" : "○"}</span>
            <span style={{ fontSize: "12px", color: item.ok ? "var(--text-secondary)" : "var(--text-muted)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}