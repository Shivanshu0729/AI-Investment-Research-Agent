"use client";
import { useState } from "react";

interface Props {
  onAnalyze: (company: string) => void;
  loading: boolean;
  compact?: boolean;
}

const SUGGESTIONS = ["Apple", "NVIDIA", "Tesla", "Microsoft", "Reliance Industries"];

export default function CompanyForm({ onAnalyze, loading, compact }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !loading) onAnalyze(value.trim());
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search company..."
          disabled={loading}
          className="input-field"
          style={{ width: "220px", padding: "9px 14px", fontSize: "13px" }}
        />
        <button type="submit" disabled={loading || !value.trim()} className="btn-primary" style={{ padding: "9px 18px", fontSize: "13px" }}>
          {loading ? "..." : "Analyze"}
        </button>
      </form>
    );
  }

  return (
    <div style={{ maxWidth: "580px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter company name (e.g. Apple, NVIDIA, Reliance...)"
            disabled={loading}
            className="input-field"
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={loading || !value.trim()} className="btn-primary">
            {loading ? "Analyzing..." : "Analyze →"}
          </button>
        </div>
      </form>

      <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setValue(s); onAnalyze(s); }}
            disabled={loading}
            className="suggestion-btn"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}