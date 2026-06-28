# AI Investment Research Agent
---

## What It Does

Enter any publicly listed company name. The agent runs a **7-node research pipeline**, fetches real financial data, analyzes news sentiment, identifies risks with evidence, and delivers a clear investment verdict — **INVEST**, **CONSIDER**, or **PASS** — with transparent, explainable reasoning behind every decision.

Every score is justified with a specific rationale. No black-box LLM verdicts.

---

## Live Demo

🔗 **[View Live →](https://your-vercel-url.vercel.app)**

---

## Features

- **7-Node Agent Pipeline** — Research → Financial → News → Risk → Scoring → Decision → Report
- **Real Financial Data** — Fetched live from Yahoo Finance (revenue, margins, P/E, debt, FCF)
- **Deterministic Scoring** — 6 weighted factors totaling 100 points, no LLM decides the score
- **Explainable Score** — Every factor shows why it got that score with benchmark comparisons
- **News Sentiment** — Per-article classification into positive, negative, or neutral
- **Evidence-Based Risks** — Each risk includes evidence, impact rating, and probability
- **Live Agent Workflow** — See each node complete in real time via SSE streaming
- **Confidence Score** — Derived from investment score, shown alongside the verdict
- **Auto Model Fallback** — If Groq rate limits, automatically retries across 4 models

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (App Router) |
| LLM | Groq — Llama 3.3 70B |
| Financial Data | Yahoo Finance public API |
| News | NewsAPI |
| Streaming | Server-Sent Events (SSE) |
| Deployment | Vercel |

---

## How to Run

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/Shivanshu0729/AI-Investment-Research-Agent.git
cd AI-Investment-Research-Agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
GROQ_API_KEY=your_groq_api_key
NEWS_API_KEY=your_newsapi_key
```

### 4. Run locally

```bash
npm run dev
```
---

## How It Works

### Architecture

```
User Input (Company Name)
        │
        ▼
┌─────────────────────────────────────────────────────┐
│                  Agent Pipeline                      │
│                                                      │
│  ResearchAgent → FinancialAgent → NewsAgent          │
│       → RiskAgent → ScoringAgent                     │
│            → DecisionAgent → ReportAgent             │
└─────────────────────────────────────────────────────┘
        │
        ▼
   SSE Stream → React Frontend → Live Dashboard
```

### Agent Nodes

| Node | Responsibility |
|------|---------------|
| **Research Agent** | Resolves company name to ticker via Yahoo Finance search, fetches company profile |
| **Financial Agent** | Fetches income statement, key ratios, and cash flow from Yahoo Finance |
| **News Agent** | Fetches recent articles via NewsAPI, filters irrelevant content, classifies per-article sentiment |
| **Risk Agent** | Identifies 4 risks via Groq LLM — each with evidence, impact, and probability |
| **Scoring Agent** | Deterministic scoring across 6 weighted factors — no LLM involved |
| **Decision Agent** | Generates objective third-person investment rationale |
| **Report Agent** | Generates a structured markdown equity research report |

### Scoring System

| Factor | Weight | What is measured |
|--------|--------|-----------------|
| Revenue Growth | 20pts | YoY revenue growth vs sector median |
| Profitability | 20pts | Net margin vs industry average |
| Debt Level | 15pts | Debt-to-equity ratio |
| News Sentiment | 20pts | Ratio of positive to negative articles |
| Market Position | 15pts | Market cap tier |
| Risk Exposure | 10pts | Severity of identified risks |

**Verdict thresholds:**

| Score | Verdict |
|-------|---------|
| ≥ 80 | INVEST |
| 60–79 | CONSIDER |
| < 60 | PASS |

---

## Key Decisions & Trade-offs

### Deterministic Scoring, Not LLM Scoring
The scoring engine in `utils/scoring.ts` is pure rule-based logic. LLM scores are inconsistent across runs and cannot be justified point by point. A deterministic system produces the same score for the same inputs every time — each point has a specific benchmark-based rationale.

**Trade-off:** Weights are manually calibrated and do not automatically adapt to sector-specific norms.

### Sequential Pipeline
Each node waits for the previous because later nodes depend on earlier outputs — the Risk Agent needs financial and news analysis, the Scoring Agent needs sentiment-tagged articles.

**Trade-off:** Total latency is 30–45 seconds. Parallel execution could reduce this to ~15 seconds.

### Yahoo Finance Direct API
FMP discontinued their free v3 API in August 2025. Alpha Vantage limits free users to 25 requests/day. Yahoo Finance's public `quoteSummary` endpoint provides real-time data for every publicly listed company worldwide with no rate limits and no API key.

**Trade-off:** Not an officially supported public API — could change without notice. In production, a paid provider like Polygon.io would be used.

### Groq over OpenAI
Groq's inference is significantly faster for the same model size, and the free tier is sufficient. The app implements automatic fallback across 4 models so rate limits on any single model never block a request.

**Trade-off:** Smaller context window than GPT-4.

### What Was Left Out
- Competitor benchmarking — would require multiple additional API calls
- Historical score tracking — storing past analyses over time
- PDF export — downloadable research report
- Full LangGraph `StateGraph` with conditional edges — currently uses a sequential loop that mimics the LangGraph node pattern

---

## Example Runs

### Apple (AAPL) — INVEST
```
Score: 84/100 | Confidence: 91% | Risk: Low

Revenue Growth:  14/20 — Grew 2% YoY, below sector median
Profitability:   20/20 — Net margin 24%, well above industry avg
Debt Level:       7/15 — Elevated D/E of 1.87
News Sentiment:  18/20 — 8/10 articles positive
Market Position: 15/15 — Mega-cap, dominant market leader
Risk Exposure:   10/10 — No significant risks identified
```

### Tesla (TSLA) — CONSIDER
```
Score: 58/100 | Confidence: 78% | Risk: High

Revenue Growth:   6/20 — Near-flat growth of 1% YoY
Profitability:    7/20 — Net margin 7.3%, thin
Debt Level:      15/15 — Very low D/E of 0.08
News Sentiment:  11/20 — Mixed, 4 positive / 3 negative
Market Position: 15/15 — Mega-cap, dominant EV leader
Risk Exposure:    4/10 — Multiple high-severity risks flagged
```

### NVIDIA (NVDA) — INVEST
```
Score: 91/100 | Confidence: 95% | Risk: Low

Revenue Growth:  20/20 — Grew 114% YoY
Profitability:   20/20 — Net margin 56%
Debt Level:      12/15 — Manageable D/E of 0.42
News Sentiment:  18/20 — Strongly positive AI demand coverage
Market Position: 15/15 — Mega-cap, AI chip leader
Risk Exposure:    6/10 — Export restriction and competition risks
```

---

## What I Would Improve With More Time

1. **Full LangGraph StateGraph** — conditional edges so the pipeline can skip or retry nodes based on data quality
2. **Competitor benchmarking** — automatically compare 2–3 competitors side by side
3. **Sector-aware scoring** — different margin benchmarks for SaaS vs retail vs manufacturing
4. **Historical score tracking** — store analyses and show how a company's score changes over time
5. **PDF export** — downloadable equity research note
6. **International calibration** — scoring benchmarks adjusted for Indian and European market norms

---

## Project Structure

```
AI-Investment-Research-Agent/
├── app/
│   ├── page.tsx                    # Main UI with SSE stream handling
│   ├── layout.tsx                  # Root layout
│   └── api/analyze/route.ts        # SSE streaming endpoint
├── agents/                         # Pipeline nodes
│   ├── researchAgent.ts
│   ├── financialAgent.ts
│   ├── newsAgent.ts
│   ├── riskAgent.ts
│   ├── scoringAgent.ts
│   ├── decisionAgent.ts
│   └── reportAgent.ts
├── components/                     # React UI components
├── graph/investmentGraph.ts        # Pipeline orchestration
├── services/                       # External API clients
│   ├── groq.ts                     # Groq LLM with model fallback
│   ├── financialApi.ts             # Yahoo Finance
│   └── newsApi.ts                  # NewsAPI
├── prompts/                        # LLM prompt templates
├── types/InvestmentState.ts        # TypeScript state interface
├── utils/
│   ├── scoring.ts                  # Deterministic scoring engine
│   └── tickerResolver.ts           # Company name to ticker resolver
└── docs/
    └── llm-conversations.md        # LLM chat logs used while building
```

---

## LLM Chat Logs

All AI conversations used while building this project are saved in `docs/llm-conversations.md` — including architecture decisions, code generation, debugging sessions, and UI refinements.

---

*Built by Shivanshu Gangwar*
