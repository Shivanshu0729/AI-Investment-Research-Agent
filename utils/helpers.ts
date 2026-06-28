export function formatCurrency(value: number): string {
  if (!value || isNaN(value)) return "N/A";
  if (value >= 1_000_000_000_000)
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  return `${(value * 100).toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  if (!value || isNaN(value)) return "N/A";
  return value.toLocaleString();
}

export function sanitizeCompanyName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s\-\.]/g, "")
    .slice(0, 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

export function getRecommendationColor(
  rec: "INVEST" | "CONSIDER" | "PASS"
): string {
  if (rec === "INVEST") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (rec === "CONSIDER") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
}