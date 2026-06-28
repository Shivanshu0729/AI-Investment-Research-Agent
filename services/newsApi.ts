import { NewsArticle } from "@/types/InvestmentState";

export async function fetchNewsArticles(companyName: string): Promise<NewsArticle[]> {
  try {
    const ticker = companyName.toUpperCase().slice(0, 5);
    const query = encodeURIComponent(`"${companyName}" stock earnings revenue`);
    const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=15&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) return [];

    const companyLower = companyName.toLowerCase();
    const words = companyLower.split(" ").filter(w => w.length > 3);

    const filtered = data.articles.filter((a: { title: string; description: string }) => {
      const text = `${a.title} ${a.description}`.toLowerCase();
      return words.some(w => text.includes(w)) && 
        !text.includes("fraud alert") &&
        !text.includes("class action") &&
        !text.includes("investors notified") &&
        !text.includes("securities fraud investigation");
    });

    return filtered.slice(0, 10).map((a: {
      title: string;
      description: string;
      url: string;
      publishedAt: string;
      source: { name: string };
    }) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt,
      source: a.source?.name || "Unknown",
      sentiment: "neutral" as const,
    }));
  } catch {
    return [];
  }
}