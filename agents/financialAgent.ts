import { InvestmentState } from "@/types/InvestmentState";
import { fetchFinancialData } from "@/services/financialApi";
import { callGroq } from "@/services/groq";
import { financialPrompt } from "@/prompts/financialPrompt";

export async function financialAgent(
  state: InvestmentState
): Promise<Partial<InvestmentState>> {
  state.onProgress?.("Fetching financial data...");

  let financialData = await fetchFinancialData(state.resolvedTicker);

  if (!financialData) {
    state.onProgress?.("Using AI for financial data...");

    const raw = await callGroq(
      `Return ONLY valid JSON with the most accurate and recent publicly known annual financial data for ${state.companyProfile.companyName}. Use real figures from their latest annual report. No explanation, no text, just JSON:
{
  "revenue": 0,
  "revenueGrowth": 0,
  "netIncome": 0,
  "netMargin": 0,
  "eps": 0,
  "peRatio": 0,
  "debtToEquity": 0,
  "currentRatio": 0,
  "freeCashFlow": 0,
  "returnOnEquity": 0
}
All values must be numbers. Revenue in absolute dollars. Growth and margins as decimals (0.15 = 15%).`
    );

    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) financialData = JSON.parse(match[0]);
    } catch {}
  }

  if (!financialData) {
    financialData = {
      revenue: 0, revenueGrowth: 0, netIncome: 0, netMargin: 0,
      eps: 0, peRatio: 0, debtToEquity: 0, currentRatio: 0,
      freeCashFlow: 0, returnOnEquity: 0,
    };
  }

  const financialAnalysis = await callGroq(
    financialPrompt(state.companyProfile.companyName, financialData)
  );

  state.onProgress?.("Financial analysis complete");
  return { financialData, financialAnalysis };
}