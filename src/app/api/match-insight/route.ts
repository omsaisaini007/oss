/**
 * POST /api/match-insight
 *
 * Calls the LLM to generate a real tactical insight for a matchup.
 * Request body: MatchInsightRequest (team A, team B, probabilities, expected score).
 * Returns: { insight: string, generatedAt: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { generateMatchInsight, MatchInsightRequest } from "@/lib/ai/insight";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MatchInsightRequest;

    if (!body.teamA?.name || !body.teamB?.name) {
      return NextResponse.json(
        { error: "teamA.name and teamB.name are required" },
        { status: 400 }
      );
    }

    const insight = await generateMatchInsight(body);

    return NextResponse.json({
      insight,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[/api/match-insight] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Match insight generation failed" },
      { status: 500 }
    );
  }
}
