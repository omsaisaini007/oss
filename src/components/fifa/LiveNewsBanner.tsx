"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

interface NewsItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
}

export function LiveNewsBanner() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/live-news?num=8", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        setItems(data.items);
        setIdx(0);
      } else {
        setError("No news returned");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Rotate headline every 5 seconds
  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [items.length]);

  if (loading) {
    return (
      <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs">
        <RefreshCw className="w-3 h-3 text-[#D4AF37] animate-spin" />
        <span className="text-[#9a9a9a]">Fetching live FIFA news…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs">
        <AlertCircle className="w-3 h-3 text-[#f97316]" />
        <span className="text-[#9a9a9a]">Live news unavailable</span>
        <button
          onClick={fetchNews}
          className="text-[#D4AF37] hover:underline ml-1"
        >
          retry
        </button>
      </div>
    );
  }

  if (items.length === 0) return null;

  const current = items[idx];

  return (
    <div className="flex items-center gap-3">
      <div className="glass rounded-full px-4 py-2 flex items-center gap-3 max-w-2xl">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
          </span>
          <Newspaper className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
            Live
          </span>
        </div>
        <motion.a
          key={idx}
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-white hover:text-[#D4AF37] transition-colors truncate flex items-center gap-1.5"
        >
          <span className="truncate max-w-md">{current.title}</span>
          <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
        </motion.a>
        <span className="text-[10px] text-[#9a9a9a] flex-shrink-0">
          {current.source}
        </span>
      </div>
      <button
        onClick={fetchNews}
        className="glass rounded-full p-2 hover:bg-[rgba(212,175,55,0.1)] transition-colors"
        title="Refresh news"
      >
        <RefreshCw className="w-3 h-3 text-[#9a9a9a]" />
      </button>
    </div>
  );
}
