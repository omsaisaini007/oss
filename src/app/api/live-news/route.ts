/**
 * GET /api/live-news
 *
 * Returns the latest FIFA World Cup news from the web.
 * Optional query params:
 *   ?team=Brazil  → restrict to a specific team
 *   ?num=8        → max items (default 8, max 20)
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchWorldCupNews, fetchTeamNews } from "@/lib/ai/news";

export const runtime = "nodejs";
export const maxDuration = 20;
// Cache news for 10 minutes on the client + CDN
export const revalidate = 600;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const team = url.searchParams.get("team");
    const numParam = url.searchParams.get("num");
    const num = Math.min(20, Math.max(1, parseInt(numParam || "8", 10) || 8));

    const items = team
      ? await fetchTeamNews(team, num)
      : await fetchWorldCupNews(num);

    return NextResponse.json({
      items,
      count: items.length,
      fetchedAt: new Date().toISOString(),
      source: "z-ai-web-dev-sdk:web_search",
    });
  } catch (err: any) {
    console.error("[/api/live-news] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Live news fetch failed" },
      { status: 500 }
    );
  }
}
