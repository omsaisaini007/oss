/**
 * Match Insight Service — wraps z-ai-web-dev-sdk's LLM for football analysis.
 *
 * Backend-only. The frontend calls /api/match-insight via fetch; this service
 * invokes the LLM with structured team/matchup data and returns a
 * narrative tactical insight.
 *
 * @module lib/ai/insight
 */

import ZAI from "z-ai-web-dev-sdk";
import type { TeamProfile } from "../data/teams";

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create();
  return zaiInstance;
}

export interface MatchInsightRequest {
  teamA: TeamProfile;
  teamB: TeamProfile;
  probA: number; // 0-100
  probB: number;
  drawProb: number;
  expScoreA: number;
  expScoreB: number;
}

/**
 * Generate a real LLM-powered tactical insight for a matchup.
 * Returns 2-4 paragraphs of analysis drawing on the team profiles.
 */
export async function generateMatchInsight(req: MatchInsightRequest): Promise<string> {
  const zai = await getZAI();

  const systemPrompt = `You are an elite football tactical analyst who writes for ESPN, The Athletic, and Opta. You combine deep statistical knowledge with tactical nuance. Write in clear, punchy English. Avoid clichés. Be specific about tactical matchups, key players, and statistical edges. Output 2 paragraphs max, about 120-180 words total. No headings, no markdown, just prose.`;

  const userPrompt = `Analyze this matchup for the upcoming 2030 FIFA World Cup cycle.

TEAM A: ${req.teamA.name} (${req.teamA.confederation})
- FIFA Rank: #${req.teamA.fifaRank}
- World-Elo: ${req.teamA.eloRating}
- World Cup Titles: ${req.teamA.titles} (${req.teamA.titleYears.join(", ") || "none"})
- Recent Form (last 10): ${req.teamA.formRating}/100
- Attack: ${req.teamA.attackRating} | Midfield: ${req.teamA.midfieldRating} | Defense: ${req.teamA.defenseRating}
- Squad Value: €${req.teamA.squadValue}M
- Manager: ${req.teamA.manager}
- Notable Players: ${req.teamA.legendaryPlayers.slice(0, 5).join(", ")}

TEAM B: ${req.teamB.name} (${req.teamB.confederation})
- FIFA Rank: #${req.teamB.fifaRank}
- World-Elo: ${req.teamB.eloRating}
- World Cup Titles: ${req.teamB.titles} (${req.teamB.titleYears.join(", ") || "none"})
- Recent Form (last 10): ${req.teamB.formRating}/100
- Attack: ${req.teamB.attackRating} | Midfield: ${req.teamB.midfieldRating} | Defense: ${req.teamB.defenseRating}
- Squad Value: €${req.teamB.squadValue}M
- Manager: ${req.teamB.manager}
- Notable Players: ${req.teamB.legendaryPlayers.slice(0, 5).join(", ")}

MODEL OUTPUT:
- ${req.teamA.name} win probability: ${req.probA.toFixed(1)}%
- ${req.teamB.name} win probability: ${req.probB.toFixed(1)}%
- Draw probability: ${req.drawProb.toFixed(1)}%
- Expected score: ${req.teamA.code} ${req.expScoreA.toFixed(1)} – ${req.expScoreB.toFixed(1)} ${req.teamB.code}

Write a tactical preview that:
1. Identifies the single most decisive tactical matchup (e.g. midfield battle, wing play, set pieces).
2. Notes the statistical edge the favored team holds and the specific weakness it exploits.
3. Names one X-factor player on each side who could swing the result.
4. Closes with a confident prediction grounded in the numbers, not a hedge.`;

  try {
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    });
    return (
      completion.choices[0]?.message?.content ??
      "Analysis unavailable. The model returned no content."
    );
  } catch (err) {
    console.error("[Match Insight] LLM call failed:", err);
    throw new Error("Match insight generation failed");
  }
}

/**
 * Generate a tournament-level narrative insight (e.g. for the prediction
 * engine summary, dark horse analysis, etc.).
 */
export async function generateTournamentInsight(
  prompt: string,
  context: Record<string, unknown>
): Promise<string> {
  const zai = await getZAI();

  const systemPrompt = `You are an elite football data scientist who writes for FiveThirtyEight and Opta. You combine statistical rigor with football intuition. Be specific, quantitative, and avoid hedging. Output 1 paragraph, 80-120 words. No markdown.`;

  const userPrompt = `${prompt}\n\nContext data:\n${JSON.stringify(context, null, 2)}`;

  try {
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    });
    return completion.choices[0]?.message?.content ?? "";
  } catch (err) {
    console.error("[Match Insight] tournament insight failed:", err);
    throw new Error("Tournament insight generation failed");
  }
}
