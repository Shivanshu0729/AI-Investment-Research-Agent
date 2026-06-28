import { InvestmentState } from "@/types/InvestmentState";
import { callGroq } from "@/services/groq";
import { decisionPrompt } from "@/prompts/decisionPrompt";

export async function decisionAgent(
  state: InvestmentState
): Promise<Partial<InvestmentState>> {
  state.onProgress?.("Generating investment decision...");

  const prompt = decisionPrompt(
    state.companyProfile.companyName,
    state.investmentScore,
    state.recommendation,
    state.financialAnalysis,
    state.newsAnalysis,
    state.riskAnalysis
  );

  const decisionRationale = await callGroq(prompt);

  state.onProgress?.("Decision rationale ready");

  return { decisionRationale };
}