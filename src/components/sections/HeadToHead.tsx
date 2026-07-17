"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { predictHeadToHead } from "@/lib/prediction";
import { teams } from "@/lib/data/teams";
import { Swords, Brain, History, Shield, Zap, RefreshCw } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

// Pre-sort once at module load — no need to re-sort on every render
const SORTED_TEAMS = [...teams].sort((a, b) => a.fifaRank - b.fifaRank);

export function HeadToHead() {
  const [codeA, setCodeA] = useState("AR");
  const [codeB, setCodeB] = useState("FR");

  const teamA = useMemo(() => teams.find((t) => t.code === codeA)!, [codeA]);
  const teamB = useMemo(() => teams.find((t) => t.code === codeB)!, [codeB]);
  const result = useMemo(() => predictHeadToHead(teamA, teamB), [teamA, teamB]);

  // Live LLM-powered insight state
  const [aiInsight, setAiInsight] = useState<string>("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [insightKey, setInsightKey] = useState(0); // force refetch

      useEffect(() => {
    let cancelled = false;
    const fetchInsight = async () => {
      setInsightLoading(true);
      setInsightError(null);
      try {
        const res = await fetch("/api/match-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamA,
            teamB,
            probA: result.winProbA,
            probB: result.winProbB,
            drawProb: result.drawProb,
            expScoreA: result.expectedScoreA,
            expScoreB: result.expectedScoreB,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setAiInsight(data.insight || "No insight returned.");
        }
      } catch (e: any) {
        if (!cancelled) {
          setInsightError(e?.message || "Failed to generate insight");
          setAiInsight(result.aiInsight); // fallback to local templated insight
        }
      } finally {
        if (!cancelled) setInsightLoading(false);
      }
    };
    fetchInsight();
    return () => { cancelled = true; };
  }, [teamA, teamB, insightKey]);

  const swap = () => {
    setCodeA(codeB);
    setCodeB(codeA);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a14]" id="h2h">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Swords className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Head-to-Head Predictor
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Match <span className="text-blue-gradient">Predictor</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Pick two teams and get a head-to-head forecast based on ELO ratings, attack vs defense differentials, recent form, and historical pedigree. Includes tactical strengths and live match insight.
          </p>
        </motion.div>

        {/* Selector */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
                Team A
              </label>
              <select
                value={codeA}
                onChange={(e) => setCodeA(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-3 py-2.5 text-sm"
              >
                {SORTED_TEAMS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name} (#{t.fifaRank})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swap}
              className="self-end mb-0.5 mx-auto p-3 rounded-full glass hover:bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] transition-all"
              title="Swap teams"
            >
              <Swords className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
                Team B
              </label>
              <select
                value={codeB}
                onChange={(e) => setCodeB(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-3 py-2.5 text-sm"
              >
                {SORTED_TEAMS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name} (#{t.fifaRank})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${codeA}-${codeB}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Match preview */}
            <div className="lg:col-span-2 glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                {/* Team A */}
                <div className="text-center flex-1">
                  <div className="mb-3"><Flag code={teamA.code} size={64} /></div>
                  <div className="text-xl font-bold text-white mb-1">{teamA.name}</div>
                  <div className="text-xs text-[#9a9a9a]">
                    ELO {teamA.eloRating} · FIFA #{teamA.fifaRank}
                  </div>
                  <div className="mt-3 text-3xl font-black text-[#D4AF37]">
                    {result.winProbA.toFixed(1)}%
                  </div>
                </div>

                {/* VS */}
                <div className="px-4">
                  <div className="text-3xl font-black text-[#9a9a9a] mb-2">VS</div>
                  <div className="text-center glass rounded-lg px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                      Predicted Score
                    </div>
                    <div className="text-xl font-bold text-white">
                      {result.expectedScoreA.toFixed(1)} – {result.expectedScoreB.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Team B */}
                <div className="text-center flex-1">
                  <div className="mb-3"><Flag code={teamB.code} size={64} /></div>
                  <div className="text-xl font-bold text-white mb-1">{teamB.name}</div>
                  <div className="text-xs text-[#9a9a9a]">
                    ELO {teamB.eloRating} · FIFA #{teamB.fifaRank}
                  </div>
                  <div className="mt-3 text-3xl font-black text-[#00E1FF]">
                    {result.winProbB.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Probability bar */}
              <div className="mb-4">
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] flex items-center justify-center text-xs font-bold text-[#0B0B0B]"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.winProbA}%` }}
                    transition={{ duration: 0.8 }}
                  >
                    {result.winProbA > 10 ? `W ${result.winProbA.toFixed(0)}%` : ""}
                  </motion.div>
                  <motion.div
                    className="bg-[#3a3a3a] flex items-center justify-center text-xs font-bold text-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.drawProb}%` }}
                    transition={{ duration: 0.8 }}
                  >
                    {result.drawProb > 8 ? `D ${result.drawProb.toFixed(0)}%` : ""}
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-[#0066FF] to-[#00E1FF] flex items-center justify-center text-xs font-bold text-[#0B0B0B]"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.winProbB}%` }}
                    transition={{ duration: 0.8 }}
                  >
                    {result.winProbB > 10 ? `W ${result.winProbB.toFixed(0)}%` : ""}
                  </motion.div>
                </div>
              </div>

              {/* Match Insight — powered by live LLM via /api/ai-insight */}
              <div className="p-4 glass-blue rounded-lg">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-[#00E1FF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                        Match Insight
                        <span className="ml-2 text-[#00E1FF] normal-case tracking-normal">
                          · live analysis
                        </span>
                      </div>
                      <button
                        onClick={() => setInsightKey((k) => k + 1)}
                        disabled={insightLoading}
                        className="text-[#9a9a9a] hover:text-[#00E1FF] disabled:opacity-50"
                        title="Regenerate insight"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${insightLoading ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                    {insightLoading ? (
                      <div className="space-y-2">
                        <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded animate-pulse" />
                        <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-5/6" />
                        <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-4/6" />
                      </div>
                    ) : insightError ? (
                      <p className="text-sm text-[#f97316] leading-relaxed">
                        {insightError}. Showing fallback analysis:
                      </p>
                    ) : null}
                    {!insightLoading && (
                      <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                        {aiInsight}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Historical context */}
              <div className="mt-4 p-4 glass rounded-lg flex gap-3">
                <History className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-1">
                    Historical Context
                  </div>
                  <p className="text-sm text-white">{result.historicalSummary}</p>
                  <p className="text-xs text-[#9a9a9a] mt-1">
                    Estimated WC meetings: {result.historicalMeetings}
                  </p>
                </div>
              </div>
            </div>

            {/* Tactical analysis */}
            <div className="space-y-4">
              {result.tacticalStrengths.map((tactical) => {
                const isA = tactical.team === teamA.name;
                return (
                  <div
                    key={tactical.team}
                    className={`glass rounded-2xl p-5 ${isA ? "border-l-2 border-l-[#D4AF37]" : "border-l-2 border-l-[#0066FF]"}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Flag code={isA ? teamA.code : teamB.code} size={24} />
                      <h4 className="font-bold text-white">{tactical.team}</h4>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Zap className="w-3 h-3 text-[#22c55e]" />
                        <span className="text-[10px] uppercase tracking-wider text-[#22c55e]">
                          Strengths
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {tactical.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-white flex items-start gap-1.5">
                            <span className="text-[#22c55e] mt-0.5">▸</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Shield className="w-3 h-3 text-[#ef4444]" />
                        <span className="text-[10px] uppercase tracking-wider text-[#ef4444]">
                          Vulnerabilities
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {tactical.weaknesses.map((w, i) => (
                          <li key={i} className="text-xs text-white flex items-start gap-1.5">
                            <span className="text-[#ef4444] mt-0.5">▸</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
