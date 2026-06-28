export function newsPrompt(companyName: string, articles: {
  title: string;
  description: string;
}[]): string {
  const articleText = articles
    .map((a, i) => `${i + 1}. ${a.title}`)
    .join("\n");

  return `Analyze these news articles about ${companyName}.

${articleText}

Return ONLY this JSON, no text before or after:
{
  "sentiment": "positive",
  "summary": "One objective sentence about overall news sentiment.",
  "articleSentiments": ["positive", "neutral", "negative"]
}

articleSentiments must have exactly ${articles.length} items. Values: positive, negative, or neutral only.`;
}