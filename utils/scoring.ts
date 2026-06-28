import { FinancialData, NewsArticle, ScoreFactor } from "@/types/InvestmentState";

interface ScoringInput {
  financialData: FinancialData;
  newsArticles: NewsArticle[];
  riskAnalysis: string;
  companyProfile: { marketCap: number; sector: string };
}

export function calculateScore(input: ScoringInput): {
  factors: ScoreFactor[];
  total: number;
} {
  const { financialData, newsArticles, riskAnalysis } = input;
  const factors: ScoreFactor[] = [];

  // Factor 1: Revenue Growth (20 pts) 
  const growth = financialData.revenueGrowth || 0;
  let revenueScore = 0;
  let revenueRationale = "";
  if (growth >= 0.3) { revenueScore = 20; revenueRationale = `Exceptional revenue growth of ${(growth * 100).toFixed(1)}% YoY`; }
  else if (growth >= 0.2) { revenueScore = 17; revenueRationale = `Strong revenue growth of ${(growth * 100).toFixed(1)}% YoY vs sector median ~10%`; }
  else if (growth >= 0.1) { revenueScore = 14; revenueRationale = `Moderate revenue growth of ${(growth * 100).toFixed(1)}% YoY`; }
  else if (growth >= 0.05) { revenueScore = 10; revenueRationale = `Slow revenue growth of ${(growth * 100).toFixed(1)}% YoY, below expectations`; }
  else if (growth >= 0) { revenueScore = 6; revenueRationale = `Near-flat revenue growth of ${(growth * 100).toFixed(1)}% YoY`; }
  else { revenueScore = 2; revenueRationale = `Revenue declined ${(growth * 100).toFixed(1)}% YoY — concerning`; }
  factors.push({ name: "Revenue Growth", score: revenueScore, maxScore: 20, rationale: revenueRationale });

  // Factor 2: Profitability (20 pts)
  const margin = financialData.netMargin || 0;
  let profitScore = 0;
  let profitRationale = "";
  if (margin >= 0.25) { profitScore = 20; profitRationale = `Excellent net margin of ${(margin * 100).toFixed(1)}%, well above industry avg ~15%`; }
  else if (margin >= 0.15) { profitScore = 16; profitRationale = `Healthy net margin of ${(margin * 100).toFixed(1)}%, above industry avg`; }
  else if (margin >= 0.08) { profitScore = 12; profitRationale = `Acceptable net margin of ${(margin * 100).toFixed(1)}%`; }
  else if (margin >= 0) { profitScore = 7; profitRationale = `Thin net margin of ${(margin * 100).toFixed(1)}% — limited profitability`; }
  else { profitScore = 2; profitRationale = `Company is unprofitable with margin of ${(margin * 100).toFixed(1)}%`; }
  factors.push({ name: "Profitability", score: profitScore, maxScore: 20, rationale: profitRationale });

  // Factor 3: Debt Level (15 pts) 
  const dte = financialData.debtToEquity || 0;
  let debtScore = 0;
  let debtRationale = "";
  if (dte <= 0.3) { debtScore = 15; debtRationale = `Very low debt/equity of ${dte.toFixed(2)} — strong balance sheet`; }
  else if (dte <= 0.6) { debtScore = 12; debtRationale = `Low debt/equity of ${dte.toFixed(2)} — manageable leverage`; }
  else if (dte <= 1.0) { debtScore = 9; debtRationale = `Moderate debt/equity of ${dte.toFixed(2)} — within acceptable range`; }
  else if (dte <= 2.0) { debtScore = 5; debtRationale = `Elevated debt/equity of ${dte.toFixed(2)} — monitor closely`; }
  else { debtScore = 2; debtRationale = `High debt/equity of ${dte.toFixed(2)} — significant leverage risk`; }
  factors.push({ name: "Debt Level", score: debtScore, maxScore: 15, rationale: debtRationale });

  //  Factor 4: News Sentiment (20 pts)
  const total = newsArticles.length || 1;
  const positive = newsArticles.filter((a) => a.sentiment === "positive").length;
  const negative = newsArticles.filter((a) => a.sentiment === "negative").length;
  const sentimentRatio = positive / total;
  let newsScore = 0;
  let newsRationale = "";
  if (sentimentRatio >= 0.8) { newsScore = 20; newsRationale = `${positive}/${total} articles positive — overwhelmingly bullish coverage`; }
  else if (sentimentRatio >= 0.6) { newsScore = 16; newsRationale = `${positive}/${total} articles positive — mostly favorable coverage`; }
  else if (sentimentRatio >= 0.4) { newsScore = 11; newsRationale = `Mixed sentiment — ${positive} positive, ${negative} negative out of ${total}`; }
  else if (sentimentRatio >= 0.2) { newsScore = 6; newsRationale = `Mostly negative coverage — ${negative}/${total} articles negative`; }
  else { newsScore = 2; newsRationale = `Strongly negative coverage — ${negative}/${total} articles negative`; }
  factors.push({ name: "News Sentiment", score: newsScore, maxScore: 20, rationale: newsRationale });

  // Factor 5: Market Position (15 pts) 
  const marketCap = input.companyProfile?.marketCap || 0;
  let marketScore = 0;
  let marketRationale = "";
  if (marketCap >= 500_000_000_000) { marketScore = 15; marketRationale = `Mega-cap ($${(marketCap / 1e12).toFixed(2)}T) — dominant market leader`; }
  else if (marketCap >= 100_000_000_000) { marketScore = 13; marketRationale = `Large-cap ($${(marketCap / 1e9).toFixed(0)}B) — established market position`; }
  else if (marketCap >= 10_000_000_000) { marketScore = 10; marketRationale = `Mid-cap ($${(marketCap / 1e9).toFixed(0)}B) — solid market presence`; }
  else if (marketCap >= 1_000_000_000) { marketScore = 7; marketRationale = `Small-cap ($${(marketCap / 1e9).toFixed(1)}B) — growing but limited scale`; }
  else { marketScore = 4; marketRationale = `Micro-cap — limited market presence and liquidity`; }
  factors.push({ name: "Market Position", score: marketScore, maxScore: 15, rationale: marketRationale });

  //  Factor 6: Risk Exposure (10 pts)
  const riskLower = riskAnalysis.toLowerCase();
  const highRiskKeywords = ["severe", "critical", "bankruptcy", "fraud", "lawsuit", "investigation", "collapse"];
  const medRiskKeywords = ["regulatory", "competition", "supply chain", "inflation", "tariff", "volatile"];
  const highRiskCount = highRiskKeywords.filter((k) => riskLower.includes(k)).length;
  const medRiskCount = medRiskKeywords.filter((k) => riskLower.includes(k)).length;
  let riskScore = 0;
  let riskRationale = "";
  if (highRiskCount >= 2) { riskScore = 2; riskRationale = `Multiple high-severity risks identified — ${highRiskCount} critical flags`; }
  else if (highRiskCount === 1) { riskScore = 5; riskRationale = `One high-severity risk flag detected alongside ${medRiskCount} moderate risks`; }
  else if (medRiskCount >= 3) { riskScore = 7; riskRationale = `Several moderate risks — ${medRiskCount} factors flagged`; }
  else if (medRiskCount >= 1) { riskScore = 9; riskRationale = `Minor risks only — ${medRiskCount} moderate factor(s) noted`; }
  else { riskScore = 10; riskRationale = `No significant risks identified in analysis`; }
  factors.push({ name: "Risk Exposure", score: riskScore, maxScore: 10, rationale: riskRationale });

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);
  return { factors, total: totalScore };
}

export function getRecommendation(score: number): "INVEST" | "CONSIDER" | "PASS" {
  if (score >= 80) return "INVEST";
  if (score >= 60) return "CONSIDER";
  return "PASS";
}