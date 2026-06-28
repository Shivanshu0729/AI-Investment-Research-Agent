"use client";
import { useState } from "react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment?: string;
}

interface Props {
  articles: NewsArticle[];
  newsAnalysis: string;
}

export default function NewsCard({ articles, newsAnalysis }: Props) {
  const [showAll, setShowAll] = useState(false);
  const positive = articles.filter((a) => a.sentiment === "positive");
  const negative = articles.filter((a) => a.sentiment === "negative");

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Market & News Analysis</h3>
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>{positive.length} positive</span>
          <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>{negative.length} negative</span>
        </div>
      </div>

      {newsAnalysis && (
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
          {newsAnalysis}
        </p>
      )}

      {positive.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Positive Catalysts</p>
          {positive.slice(0, 3).map((a, i) => (
            <div className="news-catalyst news-positive" key={i}>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <span style={{ color: "#10b981", marginRight: "8px", fontWeight: 700 }}>↑</span>{a.title}
              </p>
            </div>
          ))}
        </div>
      )}

      {negative.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Negative Catalysts</p>
          {negative.slice(0, 3).map((a, i) => (
            <div className="news-catalyst news-negative" key={i}>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <span style={{ color: "#ef4444", marginRight: "8px", fontWeight: 700 }}>↓</span>{a.title}
              </p>
            </div>
          ))}
        </div>
      )}

      <button className="expand-btn" onClick={() => setShowAll(!showAll)}>
        <span style={{ fontSize: "14px" }}>{showAll ? "▲" : "▼"}</span>
        {showAll ? "Hide articles" : `View all ${articles.length} articles`}
      </button>

      {showAll && (
        <div style={{ marginTop: "8px", maxHeight: "260px", overflowY: "auto" }}>
          {articles.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" className="article-item">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" }}>
                <p style={{ fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.5, flex: 1 }}>{article.title}</p>
                <span style={{
                  fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "5px", flexShrink: 0,
                  background: article.sentiment === "positive" ? "rgba(16,185,129,0.1)" : article.sentiment === "negative" ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)",
                  color: article.sentiment === "positive" ? "#10b981" : article.sentiment === "negative" ? "#ef4444" : "#818cf8",
                }}>
                  {article.sentiment || "neutral"}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                {article.source} · {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}