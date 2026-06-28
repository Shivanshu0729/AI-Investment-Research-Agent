import { NextRequest } from "next/server";
import { runInvestmentGraph } from "@/graph/investmentGraph";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { companyName } = await req.json();

  if (!companyName || typeof companyName !== "string") {
    return new Response(JSON.stringify({ error: "Company name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        const result = await runInvestmentGraph(
          companyName.trim(),
          (message: string) => {
            send({ type: "progress", message });
          }
        );

        send({ type: "result", data: result });
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : "Analysis failed",
        });
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}