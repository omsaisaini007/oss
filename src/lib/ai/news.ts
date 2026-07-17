/**
 * Live News Service — wraps z-ai-web-dev-sdk's web_search function.
 *
 * Backend-only. Searches the web for the latest FIFA World Cup news and
 * returns structured results for the frontend's news banner.
 *
 * @module lib/ai/news
 */

import ZAI from "z-ai-web-dev-sdk";

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create();
  return zaiInstance;
}

export interface NewsItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
}

/**
 * Search the web for the latest FIFA World Cup news.
 * Returns up to `num` items, sorted by date (most recent first).
 */
export async function fetchWorldCupNews(num: number = 8): Promise<NewsItem[]> {
  const zai = await getZAI();

  try {
    const results = await zai.functions.invoke("web_search", {
      query: "FIFA World Cup 2026 2030 news football",
      num,
      recency_days: 30,
    });

    if (!Array.isArray(results)) return [];

    const items: NewsItem[] = results.map((r: any) => ({
      title: r.name ?? "Untitled",
      url: r.url ?? "#",
      snippet: r.snippet ?? "",
      source: r.host_name ?? "unknown",
      date: r.date ?? "",
    }));

    // Sort by date (most recent first); undated items go last
    return items.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (isNaN(da) && isNaN(db)) return 0;
      if (isNaN(da)) return 1;
      if (isNaN(db)) return -1;
      return db - da;
    });
  } catch (err) {
    console.error("[LiveNews] search failed:", err);
    throw new Error("Live news fetch failed");
  }
}

/**
 * Fetch news for a specific team (used by team profile pages).
 */
export async function fetchTeamNews(teamName: string, num: number = 5): Promise<NewsItem[]> {
  const zai = await getZAI();

  try {
    const results = await zai.functions.invoke("web_search", {
      query: `${teamName} national football team news`,
      num,
      recency_days: 30,
    });

    if (!Array.isArray(results)) return [];

    return results.map((r: any) => ({
      title: r.name ?? "Untitled",
      url: r.url ?? "#",
      snippet: r.snippet ?? "",
      source: r.host_name ?? "unknown",
      date: r.date ?? "",
    }));
  } catch (err) {
    console.error("[LiveNews] team news failed:", err);
    return [];
  }
}
