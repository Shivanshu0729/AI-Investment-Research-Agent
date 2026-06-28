import { InvestmentState } from "@/types/InvestmentState";
import { calculateScore, getRecommendation } from "@/utils/scoring";

export async function scoringAgent(
  state: InvestmentState
): Promise<Partial<InvestmentState>> {
  state.onProgress?.("Calculating investment score...");

  const { factors, total } = calculateScore({
    financialData: state.financialData,
    newsArticles: state.newsArticles,
    riskAnalysis: state.riskAnalysis,
    companyProfile: state.companyProfile,
  });

  const recommendation = getRecommendation(total);

  state.onProgress?.(`Score: ${total}/100 → ${recommendation}`);

  return {
    scoreFactors: factors,
    investmentScore: total,
    recommendation,
  };
}