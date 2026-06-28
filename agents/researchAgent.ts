import { InvestmentState } from "@/types/InvestmentState";
import { resolveTicker } from "@/utils/tickerResolver";
import { fetchCompanyProfile } from "@/services/financialApi";
import { callGroq } from "@/services/groq";

export async function researchAgent(
  state: InvestmentState
): Promise<Partial<InvestmentState>> {
  state.onProgress?.("Resolving company...");

  const ticker = await resolveTicker(state.companyName);
  state.onProgress?.(`Ticker: ${ticker}`);

  let profile = await fetchCompanyProfile(ticker);

  if (!profile || !profile.companyName) {
    state.onProgress?.("Building profile with AI...");

    const raw = await callGroq(
      `Return ONLY valid JSON with accurate real data for the company "${state.companyName}". No placeholders, use real values:
{
  "companyName": "Tesla, Inc.",
  "ticker": "TSLA",
  "sector": "Consumer Cyclical",
  "industry": "Auto Manufacturers",
  "marketCap": 800000000000,
  "description": "Accurate 2 sentence description.",
  "employees": 127855,
  "website": "https://tesla.com",
  "country": "USA"
}`
    );

    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const fakes = ["full company", "official name", "company name here", "example"];
        const isFake = fakes.some(f => parsed.companyName?.toLowerCase().includes(f));
        if (!isFake && parsed.companyName) profile = parsed;
      }
    } catch {}
  }

  if (!profile || !profile.companyName) {
    throw new Error(
      `Could not find "${state.companyName}". Please enter a valid publicly listed company name or ticker symbol.`
    );
  }

  state.onProgress?.(`Found: ${profile.companyName}`);
  return { resolvedTicker: ticker, companyProfile: profile };
}