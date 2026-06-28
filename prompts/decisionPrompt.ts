export function decisionPrompt(
  companyName: string,
  score: number,
  recommendation: string,
  financialAnalysis: string,
  newsAnalysis: string,
  riskAnalysis: string
): string {
  return `Write a 3 sentence investment rationale for ${companyName}.

Score: ${score}/100
Rating: ${recommendation}
Financials: ${financialAnalysis}
News: ${newsAnalysis}
Risks: ${riskAnalysis}

Rules:
- Start with "Based on available financial data,"
- Reference at least 2 specific financial metrics with numbers
- Third person objective analyst language only
- Never use I, we, believe, think, firmly, conclude
- Maximum 3 sentences total`;
}