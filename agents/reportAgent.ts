import { InvestmentState } from "@/types/InvestmentState";
import { callGroq } from "@/services/groq";
import { reportPrompt } from "@/prompts/reportPrompt";

export async function reportAgent(
  state: InvestmentState
): Promise<Partial<InvestmentState>> {
  state.onProgress?.("Generating final report...");

  const prompt = reportPrompt(
    state.companyProfile.companyName,
    state.resolvedTicker,
    state.investmentScore,
    state.recommendation,
    state.financialAnalysis,
    state.newsAnalysis,
    state.riskAnalysis,
    state.decisionRationale,
    state.scoreFactors
  );

  const finalReport = await callGroq(prompt);

  state.onProgress?.("Report complete!");

  return { finalReport };
}