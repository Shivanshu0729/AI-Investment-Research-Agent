export function riskPrompt(
  companyName: string,
  sector: string,
  financialAnalysis: string,
  newsAnalysis: string
): string {
  return `Identify 4 investment risks for ${companyName} (${sector}).

Base risks on: ${financialAnalysis.slice(0, 300)} | ${newsAnalysis.slice(0, 200)}

Return ONLY this JSON, no explanation, no text before or after:
{
  "risks": [
    {
      "title": "Risk Name",
      "description": "One factual sentence.",
      "severity": "HIGH",
      "evidence": "Specific supporting fact.",
      "impact": "High",
      "probability": "Medium"
    }
  ]
}

severity must be HIGH, MEDIUM, or LOW. impact and probability must be High, Medium, or Low.`;
}