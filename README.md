# AI Investment Research Agent

---

## Overview

The AI Investment Research Agent takes any publicly listed company name as input, runs it through a 7-node sequential agent pipeline, and delivers an investment verdict — **INVEST**, **CONSIDER**, or **PASS** — with transparent, explainable reasoning behind every decision.

The agent fetches real financial data from Yahoo Finance, analyzes recent news sentiment via NewsAPI, identifies evidence-based risks, calculates a deterministic score across six weighted factors, and generates a structured equity research report — streamed live to the UI as each agent node completes.

**Key differentiators:**
- Scoring is fully deterministic — no LLM decides the score, every point is justified with a specific rationale and benchmark comparison
- Real financial data from Yahoo Finance — no hallucinated numbers
- News is filtered for relevance and classified by sentiment per article
- Risks include evidence, impact rating, and probability
- Agent workflow is visible in real time as each node completes via SSE streaming
- Recommendation includes a confidence score and an investment checklist

---

## How to Run

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/yourusername/ai-investment-agent
cd ai-investment-agent
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```
GROQ_API_KEY=your_groq_api_key
NEWS_API_KEY=your_newsapi_key
```

**Where to get free API keys:**
- **Groq**: https://console.groq.com — free, no credit card required
- **NewsAPI**: https://newsapi.org/register — free tier, 100 requests/day

> Financial data is fetched directly from Yahoo Finance's public API — no key required.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

### Architecture

Built on **Next.js 15** (App Router) with a sequential agent pipeline on the backend and a React frontend that streams agent progress in real time via **Server-Sent Events (SSE)**.

```
User Input (Company Name)
        │
        ▼
┌──────────────────────────────────────────────────┐
│              Agent Pipeline                       │
│                                                   │
│  ResearchAgent → FinancialAgent → NewsAgent       │
│       → RiskAgent → ScoringAgent                  │
│           → DecisionAgent → ReportAgent           │
└──────────────────────────────────────────────────┘
        │
        ▼
   SSE Stream → React Frontend → Live Dashboard
```

### Agent Pipeline (7 Nodes)

| Node | What it does |
|------|-------------|
| **Research Agent** | Resolves company name to ticker via Yahoo Finance search, fetches company profile |
| **Financial Agent** | Fetches income statement, key ratios, and cash flow from Yahoo Finance |
| **News Agent** | Fetches recent news via NewsAPI, filters irrelevant articles, classifies per-article sentiment |
| **Risk Agent** | Uses Groq LLM to identify 4 risks — each with evidence, impact rating, and probability |
| **Scoring Agent** | Deterministic scoring across 6 weighted factors — no LLM involved in the score |
| **Decision Agent** | Generates an objective third-person investment rationale using Groq |
| **Report Agent** | Generates a structured markdown equity research report |

### Scoring System

The investment score is calculated deterministically across six factors totaling 100 points:

| Factor | Weight | What is measured |
|--------|--------|-----------------|
| Revenue Growth | 20pts | YoY revenue growth benchmarked against sector median |
| Profitability | 20pts | Net margin compared to industry averages |
| Debt Level | 15pts | Debt-to-equity ratio |
| News Sentiment | 20pts | Ratio of positive to negative classified articles |
| Market Position | 15pts | Market cap tier |
| Risk Exposure | 10pts | Keyword severity analysis on identified risks |

**Thresholds:**
- **INVEST**: Score ≥ 80
- **CONSIDER**: Score 60–79  
- **PASS**: Score < 60

Every factor shows a rationale explaining exactly why that score was given — for example: *"Revenue grew 14% YoY vs sector median ~10% → 16/20"*

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (App Router) |
| LLM | Groq — Llama 3.3 70B with automatic fallback to llama-3.1-8b-instant, gemma2-9b-it, mixtral-8x7b-32768 |
| Financial Data | Yahoo Finance public API (no key needed) |
| News | NewsAPI |
| Streaming | Server-Sent Events (SSE) |

### Streaming

The `/api/analyze` route streams progress updates from each agent node to the frontend via SSE. The UI updates the Agent Workflow panel live as each node completes, so users see exactly what the agent is doing at every step.

### LLM Fallback

Groq implements automatic model fallback — if one model hits a rate limit, the request retries across three other models automatically, so the app never fails due to rate limiting.

---

## Key Decisions & Trade-offs

### Deterministic Scoring, Not LLM Scoring
The scoring engine in `utils/scoring.ts` is pure rule-based logic. LLM-generated scores are inconsistent across runs and cannot be explained point by point. A deterministic system produces the same score for the same inputs every time and every point has a specific justification. This is closer to how real quant models work.

Trade-off: Weights are manually calibrated and do not automatically adapt to sector-specific norms.

### Sequential Pipeline
Each node waits for the previous to complete because later nodes depend on earlier outputs — the Risk Agent needs financial analysis and news analysis, and the Scoring Agent needs sentiment-tagged articles. Parallel execution would have required more complex state management for limited gain.

Trade-off: Total latency is 30–45 seconds. Parallel execution could reduce this to ~15 seconds.

### Yahoo Finance Direct API
FMP discontinued their free v3 API in August 2025. Alpha Vantage limits free users to 25 requests per day. Yahoo Finance's public `quoteSummary` endpoint provides real-time data for every publicly listed company worldwide with no rate limits and no API key.

Trade-off: Yahoo Finance is not an officially supported public API and could change without notice. In production, a paid provider like Polygon.io would be used.

### Groq over OpenAI
Groq's inference is significantly faster than OpenAI for the same model size, and the free tier is sufficient for this use case. The multi-model fallback means rate limits on any single model never block a request.

Trade-off: Smaller context window than GPT-4, which limits the length of financial reports.

### What Was Left Out
- **Competitor comparison** — would require multiple additional API calls per analysis
- **Historical score tracking** — storing past analyses to track a company over time
- **PDF export** — downloadable formatted research report
- **Proper LangGraph StateGraph** — the pipeline mimics LangGraph's node pattern but uses a sequential loop rather than a full `StateGraph` with conditional edges

---

## Example Runs

### Apple (AAPL)
```
Score: 84/100 — INVEST — Confidence: 91%

Revenue Growth:  14/20 — Grew 2% YoY, below sector median
Profitability:   20/20 — Net margin 24%, well above industry avg
Debt Level:       7/15 — Elevated D/E of 1.87
News Sentiment:  18/20 — 8/10 articles positive
Market Position: 15/15 — Mega-cap, dominant market leader
Risk Exposure:   10/10 — No significant risks identified
```

### Tesla (TSLA)
```
Score: 58/100 — CONSIDER — Confidence: 78%

Revenue Growth:   6/20 — Near-flat growth of 1% YoY
Profitability:    7/20 — Net margin 7.3%, thin
Debt Level:      15/15 — Very low D/E of 0.08
News Sentiment:  11/20 — Mixed, 4 positive / 3 negative
Market Position: 15/15 — Mega-cap, dominant EV leader
Risk Exposure:    4/10 — Multiple high-severity risks

Key Risks: Competition (HIGH), Valuation at 79x P/E (HIGH), Regulatory (MEDIUM)
```

### NVIDIA (NVDA)
```
Score: 91/100 — INVEST — Confidence: 95%

Revenue Growth:  20/20 — Revenue grew 114% YoY
Profitability:   20/20 — Net margin 56%
Debt Level:      12/15 — Manageable D/E of 0.42
News Sentiment:  18/20 — Strongly positive AI demand coverage
Market Position: 15/15 — Mega-cap, AI chip monopoly
Risk Exposure:    6/10 — Export restriction and competition risks
```

---

## What I Would Improve With More Time

1. **Proper LangGraph StateGraph** — implement conditional edges so the pipeline can skip nodes or retry them based on data quality, rather than always running all 7 nodes sequentially

2. **Competitor benchmarking** — automatically identify 2–3 competitors and compare key metrics side by side — the single biggest upgrade to research quality

3. **Sector-aware scoring** — current weights are generic across all industries; a SaaS company and a retailer need different margin benchmarks

4. **Historical score tracking** — store analyses in a database and show how a company's investment score has changed over time

5. **PDF export** — downloadable research report formatted like an actual equity research note

6. **International stock calibration** — Yahoo Finance handles global tickers but the scoring benchmarks are calibrated for US markets; Indian and European companies need different baseline comparisons

---

## LLM Chat Logs

All conversations used while building this project are in:

```
docs/llm-conversations.md
```

This includes every session used to scaffold the architecture, generate component code, debug errors, and refine the UI — from initial setup through final polish.

---

*Built by Shivanshu Gangwar*#   A I - I n v e s t m e n t - R e s e a r c h - A g e n t  
 