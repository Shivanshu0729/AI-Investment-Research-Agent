import { FinancialData, CompanyProfile } from "@/types/InvestmentState";

async function yahooFetch(ticker: string, module: string) {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=${module}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
    }
  );
  const data = await res.json();
  return data?.quoteSummary?.result?.[0] || null;
}

export async function fetchCompanyProfile(ticker: string): Promise<CompanyProfile | null> {
  try {
    const data = await yahooFetch(ticker, "assetProfile,price");
    if (!data) return null;

    const profile = data.assetProfile;
    const price = data.price;

    if (!price?.longName && !price?.shortName) return null;

    return {
      companyName: price?.longName || price?.shortName || ticker,
      ticker,
      sector: profile?.sector || "Unknown",
      industry: profile?.industry || "Unknown",
      marketCap: price?.marketCap?.raw || 0,
      description: profile?.longBusinessSummary || "",
      employees: profile?.fullTimeEmployees || 0,
      website: profile?.website || "",
      country: profile?.country || "USA",
    };
  } catch {
    return null;
  }
}

export async function fetchFinancialData(ticker: string): Promise<FinancialData | null> {
  try {
    const data = await yahooFetch(
      ticker,
      "financialData,defaultKeyStatistics,incomeStatementHistory"
    );
    if (!data) return null;

    const fin = data.financialData;
    const stats = data.defaultKeyStatistics;
    const income = data.incomeStatementHistory?.incomeStatementHistory;

    const latest = income?.[0];
    const prev = income?.[1];

    const revenue = latest?.totalRevenue?.raw || fin?.totalRevenue?.raw || 0;
    const prevRevenue = prev?.totalRevenue?.raw || 1;
    const netIncome = latest?.netIncome?.raw || 0;

    return {
      revenue,
      revenueGrowth: prevRevenue > 1 ? (revenue - prevRevenue) / prevRevenue : 0,
      netIncome,
      netMargin: fin?.profitMargins?.raw || (revenue > 0 ? netIncome / revenue : 0),
      eps: stats?.trailingEps?.raw || 0,
      peRatio: stats?.trailingPE?.raw || 0,
      debtToEquity: fin?.debtToEquity?.raw ? fin.debtToEquity.raw / 100 : 0,
      currentRatio: fin?.currentRatio?.raw || 0,
      freeCashFlow: fin?.freeCashflow?.raw || 0,
      returnOnEquity: fin?.returnOnEquity?.raw || 0,
    };
  } catch {
    return null;
  }
}