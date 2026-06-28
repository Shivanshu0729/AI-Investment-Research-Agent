import Groq from "groq-sdk";

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  }
  return client;
}

export async function callGroq(prompt: string): Promise<string> {
  const groq = getClient();
  
  const models = [
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
  ];

  for (const model of models) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      });
      return response.choices[0]?.message?.content || "";
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("rate_limit")) {
        continue;
      }
      throw err;
    }
  }
  
  throw new Error("All models rate limited. Please wait a few minutes and try again.");
}