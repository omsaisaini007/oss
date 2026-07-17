/**
 * POST /api/analyst-chat
 *
 * Conversational football analyst backend.
 * Maintains short-term conversation history per request.
 * Returns: { reply: string, generatedAt: string }
 */

import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create();
  return zaiInstance;
}

const SYSTEM_PROMPT = `You are the "Predictor Analyst", the in-house football analyst built into the FIFA Predictor platform. You answer questions about:
- World Cup history (1930-2026)
- Team tactics, strengths, and weaknesses
- Match predictions and probability reasoning
- Player comparisons and legendary careers
- Tournament formats and qualification
- Live tournament status (the 2026 World Cup, hosted by USA/Canada/Mexico, is currently in the knockout stage as of July 2026)

Style guidelines:
- Be specific and quantitative. Use real numbers (ELO, FIFA rank, goals, xG).
- Keep responses under 200 words unless asked for depth.
- When unsure, say "I don't have that data" rather than fabricating.
- Be opinionated when asked — don't hedge. Cite the metric that drives your view.
- Use natural prose, not bullet lists, unless explicitly asked.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    // Prepend system prompt + cap history at last 8 messages to control cost
    const trimmed = messages.slice(-8);
    const fullMessages = [
      { role: "assistant", content: SYSTEM_PROMPT },
      ...trimmed,
    ];

    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: fullMessages,
      thinking: { type: "disabled" },
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({
      reply,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[/api/analyst-chat] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Analyst chat failed" },
      { status: 500 }
    );
  }
}
