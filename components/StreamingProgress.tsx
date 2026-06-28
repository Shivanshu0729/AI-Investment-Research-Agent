"use client";

interface Props {
  events: string[];
  done?: boolean;
}

const NODES = [
  { key: "Research", label: "Research" },
  { key: "Financial", label: "Financial" },
  { key: "News", label: "News" },
  { key: "Risk", label: "Risk" },
  { key: "Scoring", label: "Scoring" },
  { key: "Decision", label: "Decision" },
  { key: "Report", label: "Report" },
];

export default function StreamingProgress({ events, done }: Props) {
  const completed = NODES.filter((n) =>
    events.some((e) => e.toLowerCase().includes(n.key.toLowerCase()) && e.includes("✅"))
  );
  const activeIndex = completed.length;

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="card" style={{ padding: "20px" }}>
        <p className="section-label">Agent Workflow</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
          {NODES.map((node, i) => {
            const isDone = i < activeIndex;
            const isActive = i === activeIndex && !done;
            return (
              <div key={node.key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className={`node-chip ${isDone ? "node-done" : isActive ? "node-active" : "node-pending"}`}>
                  <span style={{ fontSize: "10px" }}>{isDone ? "✓" : isActive ? "●" : "○"}</span>
                  {node.label}
                </span>
                {i < NODES.length - 1 && (
                  <span style={{ fontSize: "11px", color: isDone ? "rgba(16,185,129,0.4)" : "var(--border-light)" }}>→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "80px", overflowY: "auto" }}>
          {events.slice(-4).map((event, i) => (
            <p key={i} style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{event}</p>
          ))}
          {!done && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[0, 150, 300].map((delay) => (
                  <span key={delay} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: `pulse 1.2s ${delay}ms ease-in-out infinite` }} />
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "#6366f1" }}>Processing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}