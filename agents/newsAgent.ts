import { InvestmentState, NewsArticle } from "@/types/InvestmentState";
import { fetchNewsArticles } from "@/services/newsApi";
import { callGroq } from "@/services/groq";
import { newsPrompt } from "@/prompts/newsPrompt";

function extractJSON(raw: string): { summary: string; articleSentiments: string[] } {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return { summary: raw.slice(0, 300), articleSentiments: [] };
}

export async function newsAgent(
  state: InvestmentState
): Promise<Partial<InvestmentState>> {
  state.onProgress?.("Fetching latest news...");

  let articles = await fetchNewsArticles(state.companyProfile.companyName);

  if (articles.length === 0) {
    state.onProgress?.("Generating news analysis with AI...");

    const aiPrompt = `You are a financial news analyst. Provide recent news for ${state.companyProfile.companyName}.

Return ONLY this JSON with no other text:
{
  "articles": [
    {
      "title": "News headline here",
      "description": "Brief description",
      "url": "https://example.com",
      "publishedAt": "2025-01-01T00:00:00Z",
      "source": "Financial Times",
      "sentiment": "positive"
    }
  ],
  "summary": "Overall sentiment summary in 2 sentences."
}

Provide 5 items. sentiment must be positive, negative, or neutral only.`;

    const raw = await callGroq(aiPrompt);
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          newsArticles: parsed.articles || [],
          newsAnalysis: parsed.summary || "",
        };
      }
    } catch {}
    return { newsArticles: [], newsAnalysis: "News analysis unavailable." };
  }

  const prompt = newsPrompt(state.companyProfile.companyName, articles);
  const raw = await callGroq(prompt);
  const parsed = extractJSON(raw);

  const taggedArticles: NewsArticle[] = articles.map((article, i) => ({
    ...article,
    sentiment: (parsed.articleSentiments?.[i] as "positive" | "negative" | "neutral") || "neutral",
  }));

  state.onProgress?.(`Analyzed ${articles.length} news articles`);

  return {
    newsArticles: taggedArticles,
    newsAnalysis: parsed.summary || "",
  };
}