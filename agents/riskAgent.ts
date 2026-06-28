import { InvestmentState } from "@/types/InvestmentState";
import { callGroq } from "@/services/groq";
import { riskPrompt } from "@/prompts/riskPrompt";

function extractJSON(raw: string): string {
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  return raw;
}

export async function riskAgent(
  state: InvestmentState
): Promise<Partial<InvestmentState>> {
  state.onProgress?.("Analyzing investment risks...");

  const prompt = riskPrompt(
    state.companyProfile.companyName,
    state.companyProfile.sector,
    state.financialAnalysis,
    state.newsAnalysis
  );

  const raw = await callGroq(prompt);
  const riskAnalysis = extractJSON(raw);

  state.onProgress?.("Risk analysis complete");
  return { riskAnalysis };
}