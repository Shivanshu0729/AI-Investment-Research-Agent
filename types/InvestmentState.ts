export interface ScoreFactor {
  name: string;
  score: number;
  maxScore: number;
  rationale: string;
}

export interface CompanyProfile {
  companyName: string;
  ticker: string;
  sector: string;
  industry: string;
  marketCap: number;
  description: string;
  employees: number;
  website: string;
  country: string;
}

export interface FinancialData {
  revenue: number;
  revenueGrowth: number;
  netIncome: number;
  netMargin: number;
  eps: number;
  peRatio: number;
  debtToEquity: number;
  currentRatio: number;
  freeCashFlow: number;
  returnOnEquity: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment?: "positive" | "negative" | "neutral";
}

export interface InvestmentState {
  companyName: string;
  resolvedTicker: string;
  companyProfile: CompanyProfile;
  financialData: FinancialData;
  newsArticles: NewsArticle[];
  financialAnalysis: string;
  newsAnalysis: string;
  riskAnalysis: string;
  scoreFactors: ScoreFactor[];
  investmentScore: number;
  recommendation: "INVEST" | "CONSIDER" | "PASS";
  decisionRationale: string;
  finalReport: string;
  streamEvents: string[];
  onProgress?: (message: string) => void;
}