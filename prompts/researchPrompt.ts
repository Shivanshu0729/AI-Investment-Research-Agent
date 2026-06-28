export function researchPrompt(companyName: string, profile: {
  sector: string;
  industry: string;
  description: string;
  marketCap: number;
  employees: number;
  country: string;
}): string {
  return `You are a senior equity research analyst. Enrich this company profile with key insights.

Company: ${companyName}
Sector: ${profile.sector}
Industry: ${profile.industry}
Market Cap: $${(profile.marketCap / 1e9).toFixed(2)}B
Employees: ${profile.employees?.toLocaleString()}
Country: ${profile.country}
Description: ${profile.description?.slice(0, 500)}

Provide a concise 2-3 sentence analyst summary of what this company does, its competitive moat, and its strategic position. Be factual and professional.`;
}