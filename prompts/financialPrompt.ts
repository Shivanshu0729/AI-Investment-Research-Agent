export function financialPrompt(companyName: string, data: {
  revenue: number;
  revenueGrowth: number;
  netMargin: number;
  eps: number;
  peRatio: number;
  debtToEquity: number;
  freeCashFlow: number;
  returnOnEquity: number;
}): string {
  return `Write a 2 sentence objective financial summary for ${companyName} using only these exact numbers:

Revenue: $${(data.revenue / 1e9).toFixed(2)}B
Revenue Growth YoY: ${(data.revenueGrowth * 100).toFixed(1)}%
Net Margin: ${(data.netMargin * 100).toFixed(1)}%
EPS: $${data.eps?.toFixed(2)}
P/E Ratio: ${data.peRatio?.toFixed(1)}x
Debt/Equity: ${data.debtToEquity?.toFixed(2)}
Free Cash Flow: $${(data.freeCashFlow / 1e9).toFixed(2)}B
Return on Equity: ${(data.returnOnEquity * 100).toFixed(1)}%

Rules: use only the numbers above, no first person, objective analyst tone only.`;
}