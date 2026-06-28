"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  report: string;
  decisionRationale: string;
  ticker?: string;
}

export default function ReportCard({ report, decisionRationale, ticker }: Props) {
  const [expanded, setExpanded] = useState(false);

  const clean = decisionRationale
    .replace(/I firmly believe/gi, "Based on available data,")
    .replace(/I believe/gi, "The analysis indicates")
    .replace(/I think/gi, "The data suggests")
    .replace(/we believe/gi, "The analysis indicates")
    .replace(/I am recommending/gi, "The assigned rating is")
    .replace(/leading me to conclude/gi, "The evidence indicates")
    .replace(/leads me to believe/gi, "data supports")
    .replace(/I am confident/gi, "The evidence supports");

  return (
    <div className="card fade-in">
      <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
        <p className="section-label">Executive Investment Summary</p>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8 }}>{clean}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          {ticker && <span style={{ fontFamily: "monospace", color: "var(--text-muted)", marginRight: "8px" }}>{ticker}</span>}
          Full Research Report
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
        >
          {expanded ? "Collapse ▲" : "Expand ▼"}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}
          className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-hr:border-gray-800">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}