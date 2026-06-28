"use client";
import { useState, useRef } from "react";
import CompanyForm from "@/components/CompanyForm";
import StreamingProgress from "@/components/StreamingProgress";
import ScoreCard from "@/components/ScoreCard";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import RiskCard from "@/components/RiskCard";
import NewsCard from "@/components/NewsCard";
import ReportCard from "@/components/ReportCard";
import Loading from "@/components/Loading";
import { InvestmentState } from "@/types/InvestmentState";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvestmentState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamEvents, setStreamEvents] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const handleAnalyze = async (companyName: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setResult(null);
    setError(null);
    setStreamEvents([]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error("Analysis failed");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "progress") setStreamEvents((prev) => [...prev, parsed.message]);
              else if (parsed.type === "result") { setResult(parsed.data); setLoading(false); }
              else if (parsed.type === "error") { setError(parsed.message); setLoading(false); }
            } catch { }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="dot-grid" />
      <div className="content">
        <nav className="glass" style={{ position: "sticky", top: 0, zIndex: 50, borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "white" }}>IR</div>
              <div>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>Investment Research Agent</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "10px" }}>Institutional Grade Analysis</span>
              </div>
            </div>
            {(result || loading) && (
              <CompanyForm onAnalyze={handleAnalyze} loading={loading} compact />
            )}
          </div>
        </nav>

        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
          {!result && !loading && !error && (
            <div style={{ textAlign: "center", paddingTop: "60px", paddingBottom: "80px", position: "relative" }}>
              <div className="hero-glow" />
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "100px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "12px", color: "#818cf8", fontWeight: 500 }}>AI-Powered Research Pipeline</span>
              </div>

              <h1 style={{ fontSize: "52px", fontWeight: 800, lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-0.02em" }}>
                Should you <span className="gradient-text">invest?</span>
              </h1>
              <p style={{ fontSize: "17px", color: "var(--text-secondary)", maxWidth: "540px", margin: "0 auto 48px", lineHeight: 1.7 }}>
                Enter any company name. Our multi-agent pipeline analyzes financials, news sentiment, and risk factors to deliver an institutional-grade investment verdict.
              </p>

              <CompanyForm onAnalyze={handleAnalyze} loading={loading} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", maxWidth: "600px", margin: "60px auto 0" }}>
                {[
                  { icon: "", label: "Financial Metrics", desc: "Revenue, margins, debt, FCF" },
                  { icon: "", label: "News Sentiment", desc: "Real-time catalyst analysis" },
                  { icon: "", label: "Risk Assessment", desc: "Evidence-based risk scoring" },
                ].map((item) => (
                  <div key={item.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "10px" }}>{item.icon}</div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{item.label}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div style={{ paddingTop: "24px" }}>
              <StreamingProgress events={streamEvents} done={false} />
              <Loading />
            </div>
          )}

          {error && !loading && (
            <div style={{ marginTop: "32px", padding: "20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "14px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444", marginBottom: "6px" }}>Analysis Failed</p>
              <p style={{ fontSize: "13px", color: "rgba(239,68,68,0.7)" }}>{error}</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "4px" }}>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {result.companyProfile?.companyName || result.companyName}
                  </h2>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Investment Research Report · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <ScoreCard
                  score={result.investmentScore}
                  recommendation={result.recommendation}
                  companyName={result.companyProfile?.companyName || result.companyName}
                  ticker={result.resolvedTicker}
                  sector={result.companyProfile?.sector}
                  country={result.companyProfile?.country}
                />
                <ScoreBreakdown factors={result.scoreFactors} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <RiskCard riskAnalysis={result.riskAnalysis} />
                <NewsCard articles={result.newsArticles} newsAnalysis={result.newsAnalysis} />
              </div>

              <ReportCard
                report={result.finalReport}
                decisionRationale={result.decisionRationale}
                ticker={result.resolvedTicker}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}