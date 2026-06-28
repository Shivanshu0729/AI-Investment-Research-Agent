export function reportPrompt(
  companyName: string,
  ticker: string,
  score: number,
  recommendation: string,
  financialAnalysis: string,
  newsAnalysis: string,
  riskAnalysis: string,
  decisionRationale: string,
  scoreFactors: { name: string; score: number; maxScore: number; rationale: string }[]
): string {
  const factorText = scoreFactors
    .map((f) => `${f.name}: ${f.score}/${f.maxScore} — ${f.rationale}`)
    .join("\n");

  return `Write a structured equity research report for ${companyName} (${ticker}).

Score: ${score}/100 | Rating: ${recommendation}
Factors: ${factorText}
Financials: ${financialAnalysis}
News: ${newsAnalysis}
Rationale: ${decisionRationale}

Format in Markdown. Keep every section to 2 sentences maximum. No first person. No filler sentences.

# ${companyName} (${ticker})

## Rating: ${recommendation} | ${score}/100

## Financial Health
[2 sentences with specific numbers]

## Market Sentiment
[1 sentence]

## Key Risks
- [risk 1]
- [risk 2]
- [risk 3]

## Conclusion
[1 sentence verdict]`;
}