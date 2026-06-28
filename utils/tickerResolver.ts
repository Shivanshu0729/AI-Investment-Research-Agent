export async function resolveTicker(companyName: string): Promise<string> {
  const name = companyName.trim();

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(name)}&quotesCount=10&newsCount=0`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
      }
    );
    const data = await res.json();
    const quotes = data?.quotes || [];

    if (quotes.length > 0) {
      const equity = quotes.find(
        (q: { quoteType: string; exchDisp?: string }) =>
          q.quoteType === "EQUITY"
      );
      if (equity) return equity.symbol;
      return quotes[0].symbol;
    }
  } catch {}

  try {
    const { callGroq } = await import("@/services/groq");
    const raw = await callGroq(
      `Return ONLY the stock ticker symbol for "${name}". No explanation. Just the ticker. Examples: Microsoft=MSFT, Google=GOOGL, Reliance Industries=RELIANCE.NS, TCS=TCS.NS`
    );
    const ticker = raw.trim().toUpperCase().replace(/[^A-Z0-9.\-]/g, "").slice(0, 12);
    if (ticker.length > 0) return ticker;
  } catch {}

  return name.toUpperCase().replace(/\s+/g, "").slice(0, 6);
}