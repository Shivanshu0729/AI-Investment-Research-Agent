import { InvestmentState } from "@/types/InvestmentState";
import { researchAgent } from "@/agents/researchAgent";
import { financialAgent } from "@/agents/financialAgent";
import { newsAgent } from "@/agents/newsAgent";
import { riskAgent } from "@/agents/riskAgent";
import { scoringAgent } from "@/agents/scoringAgent";
import { decisionAgent } from "@/agents/decisionAgent";
import { reportAgent } from "@/agents/reportAgent";

export async function runInvestmentGraph(
  companyName: string,
  onProgress: (message: string) => void
): Promise<InvestmentState> {
  let state: InvestmentState = {
    companyName,
    resolvedTicker: "",
    companyProfile: {} as InvestmentState["companyProfile"],
    financialData: {} as InvestmentState["financialData"],
    newsArticles: [],
    financialAnalysis: "",
    newsAnalysis: "",
    riskAnalysis: "",
    scoreFactors: [],
    investmentScore: 0,
    recommendation: "PASS",
    decisionRationale: "",
    finalReport: "",
    streamEvents: [],
    onProgress,
  };

  const nodes = [
    researchAgent,
    financialAgent,
    newsAgent,
    riskAgent,
    scoringAgent,
    decisionAgent,
    reportAgent,
  ];

  for (const node of nodes) {
    const update = await node(state);
    state = { ...state, ...update, onProgress };
  }

  return state;
}