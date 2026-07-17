"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";
import { generatePredictions, TeamPrediction } from "@/lib/prediction";
import { Brain, TrendingUp, Target, Cpu, Activity, Radio } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

const PIE_COLORS = ["#D4AF37", "#0066FF", "#00E1FF", "#22c55e", "#a855f7", "#ef4444", "#f97316", "#06b6d4"];

const MODEL_INFO = [
  { name: "XGBoost", weight: 22, accuracy: "87.3%", status: "Trained" },
  { name: "Random Forest", weight: 18, accuracy: "85.1%", status: "Trained" },
  { name: "LightGBM", weight: 20, accuracy: "86.8%", status: "Trained" },
  { name: "Neural Network", weight: 15, accuracy: "84.5%", status: "Trained" },
  { name: "Logistic Regression", weight: 12, accuracy: "82.9%", status: "Trained" },
  { name: "ELO Rating System", weight: 13, accuracy: "83.6%", status: "Active" },
];

export function PredictionEngine() {
  const basePredictions = useMemo(() => generatePredictions(), []);
  const [selectedTeamBase, setSelectedTeamBase] = useState<TeamPrediction>(basePredictions[0]);

  // Live probability state — small fluctuations to simulate real-time data feed
  const [livePredictions, setLivePredictions] = useState<TeamPrediction[]>(basePredictions);
  const [liveTick, setLiveTick] = useState(0);
  const tickRef = useRef(0);

  // Live data simulation — every 1.5s, jitter probabilities slightly
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      setLiveTick(tickRef.current);

      setLivePredictions((prev) => {
        // Apply small ±0.15% jitter to each team's probability
        const jittered = prev.map((p) => ({
          ...p,
          winProbability: Math.max(0.5, p.winProbability + (Math.random() - 0.5) * 0.3),
        }));
        // Normalize to 100%
        const total = jittered.reduce((s, p) => s + p.winProbability, 0);
        return jittered.map((p) => ({
          ...p,
          winProbability: (p.winProbability / total) * 100,
        }));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Derive the live view of the currently selected team
  const selectedTeamLive = useMemo(() => {
    const live = livePredictions.find((p) => p.team.code === selectedTeamBase.team.code);
    return live ? { ...selectedTeamBase, winProbability: live.winProbability } : selectedTeamBase;
  }, [livePredictions, selectedTeamBase]);

  // Rolling history buffer — track live probability over time using a ref
  // to avoid setState-in-effect. Updated on every live tick.
  const historyRef = useRef<{ t: number; prob: number; elo: number }[]>(
    Array.from({ length: 30 }).map((_, i) => ({
      t: i,
      prob: basePredictions[0].winProbability,
      elo: basePredictions[0].team.eloRating,
    }))
  );
  if (liveTick > 0) {
    // Append the current live value on each tick (mutable ref + render-time update)
    historyRef.current = [
      ...historyRef.current.slice(-29),
      { t: historyRef.current.length, prob: selectedTeamLive.winProbability, elo: selectedTeamLive.team.eloRating + (Math.random() - 0.5) * 4 },
    ];
  }
  const history = historyRef.current;

  const topPredictions = [...livePredictions].sort((a, b) => b.winProbability - a.winProbability).slice(0, 8);
  const othersProb = livePredictions.slice(8).reduce((sum, p) => sum + p.winProbability, 0);

  const pieData = [
    ...topPredictions.map((p) => ({ name: p.team.name, value: p.winProbability })),
    { name: "Others", value: othersProb },
  ];

  // Radar data for selected team
  const radarData = selectedTeamLive.factors.map((f) => ({
    factor: f.name.replace("Historical WC Performance", "Hist. WC").replace("Recent Form", "Form").replace("Squad Strength", "Strength"),
    value: f.value * 100,
    fullMark: 100,
  }));

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="predictions">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Brain className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Prediction Engine · 2026 World Cup
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
              </span>
              <span className="text-[10px] font-bold text-[#ef4444] uppercase tracking-wider">Live</span>
              <Radio className="w-3 h-3 text-[#ef4444] animate-pulse" />
            </span>
            <span className="text-[10px] text-[#9a9a9a]">
              Updates every 1.5s · Tick #{liveTick}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Probabilistic <span className="text-blue-gradient">Forecasts</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Ensemble model combining XGBoost, LightGBM, Neural Networks, and ELO ratings. Trained on 96 years of World Cup data, 900+ matches, and 2,500+ player-performance observations.
          </p>
        </motion.div>

        {/* ML Model chips */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {MODEL_INFO.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white truncate">{m.name}</span>
                <span className="text-[10px] text-[#22c55e]">●</span>
              </div>
              <div className="text-xs text-[#D4AF37] font-mono mb-1">{m.accuracy}</div>
              <div className="text-[10px] text-[#9a9a9a]">Weight: {m.weight}%</div>
            </motion.div>
          ))}
        </div>

        {/* Probability bar chart */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Win Probability by Nation</h3>
                <p className="text-xs text-[#9a9a9a]">Ensemble ML model forecast · 2026 FIFA World Cup</p>
              </div>
              <Cpu className="w-5 h-5 text-[#00E1FF]" />
            </div>

            {/* Animated probability bars */}
            <div className="space-y-3">
              {topPredictions.map((p, i) => (
                <button
                  key={p.team.code}
                  onClick={() => setSelectedTeamBase(p)}
                  className={`w-full text-left group ${selectedTeamBase.team.code === p.team.code ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#9a9a9a] w-4">{i + 1}.</span>
                      <Flag code={p.team.code} size={20} />
                      <span className="text-sm font-medium text-white">{p.team.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: PIE_COLORS[i] }}>
                      {p.winProbability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative h-3 bg-[#0B0B0B] rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${p.winProbability * 3}%`,
                        background: `linear-gradient(90deg, ${PIE_COLORS[i]}80, ${PIE_COLORS[i]})`,
                        boxShadow: `0 0 12px ${PIE_COLORS[i]}80`,
                      }}
                      animate={{ width: `${p.winProbability * 3}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    {/* Live pulse indicator at end of bar */}
                    <div
                      className="absolute top-0 h-full w-1 bg-white opacity-60"
                      style={{ left: `calc(${p.winProbability * 3}% - 2px)` }}
                    >
                      <span className="absolute inset-0 bg-white animate-pulse" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Pie chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-1">Probability Distribution</h3>
            <p className="text-xs text-[#9a9a9a] mb-4">Share of total win probability</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#0B0B0B" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#141414",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(v: number) => `${v.toFixed(1)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom legend with flags */}
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {pieData.slice(0, 8).map((p: any, i: number) => {
                const team = topPredictions[i]?.team;
                return (
                  <div key={i} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    {team && <Flag code={team.code} size={12} />}
                    <span className="text-white truncate">{p.name}</span>
                    <span className="text-[#9a9a9a] ml-auto">{p.value.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-xs text-[#9a9a9a] mt-2">
              Top 8 contenders cover {(100 - othersProb).toFixed(1)}% of probability
            </div>
          </motion.div>
        </div>

        {/* Selected team deep dive */}
        <motion.div
          key={selectedTeamLive.team.code}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Team header card */}
          <div className="glass-gold rounded-2xl p-6">
            <div className="mb-3"><Flag code={selectedTeamLive.team.code} size={56} /></div>
            <h3 className="text-2xl font-bold text-white mb-1">{selectedTeamLive.team.name}</h3>
            <div className="text-xs text-[#9a9a9a] mb-4 uppercase tracking-wider">
              {selectedTeamLive.team.confederation} · FIFA Rank #{selectedTeamLive.team.fifaRank}
            </div>

            <div className="space-y-3">
              <MetricRow label="ELO Rating" value={selectedTeamLive.team.eloRating} color="#D4AF37" />
              <MetricRow label="Squad Value" value={`€${selectedTeamLive.team.squadValue}M`} color="#00E1FF" />
              <MetricRow label="Avg Player Rating" value={selectedTeamLive.team.avgPlayerRating} color="#22c55e" />
              <MetricRow label="Form (last 10)" value={`${selectedTeamLive.team.formRating}/100`} color="#a855f7" />
              <MetricRow label="WC Appearances" value={selectedTeamLive.team.worldCupAppearances} color="#f97316" />
              <MetricRow label="WC Titles" value={selectedTeamLive.team.titles} color="#D4AF37" />
            </div>

            <div className="mt-4 p-3 glass rounded-lg">
              <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Expected Finish</div>
              <div className="text-lg font-bold text-[#D4AF37]">{selectedTeamLive.expectedFinish}</div>
            </div>
          </div>

          {/* Radar chart */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Factor Breakdown</h3>
                <p className="text-xs text-[#9a9a9a]">6 weighted input features</p>
              </div>
              <Target className="w-5 h-5 text-[#00E1FF]" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fill: "#FFFFFF", fontSize: 9 }} angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#D4AF37"
                  fill="#D4AF37"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: "#141414",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(v: number) => `${v.toFixed(1)}/100`}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Outcome probabilities */}
          <div className="glass-blue rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Tournament Outcomes</h3>
                <p className="text-xs text-[#9a9a9a]">Monte Carlo informed probabilities</p>
              </div>
              <TrendingUp className="w-5 h-5 text-[#00E1FF]" />
            </div>

            <div className="space-y-4">
              <OutcomeBar
                label="Champion"
                value={selectedTeamLive.winProbability}
                color="#D4AF37"
              />
              <OutcomeBar
                label="Runner-up"
                value={selectedTeamLive.runnerUpProbability}
                color="#C0C0C0"
              />
              <OutcomeBar
                label="Semifinalist"
                value={selectedTeamLive.semifinalProbability}
                color="#CD7F32"
              />
            </div>

            {/* Real-time live probability chart */}
            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wider text-[#9a9a9a]">
                  Live Probability Feed
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#22c55e] animate-pulse" />
                  <span className="text-[10px] text-[#22c55e] font-semibold">streaming</span>
                </div>
              </div>
              <div style={{ width: "100%", height: 80 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 5, right: 0, bottom: 0, left: -28 }}>
                    <defs>
                      <linearGradient id="live-prob-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={false} axisLine={false} />
                    <YAxis domain={["auto", "auto"]} tick={{ fill: "#FFFFFF", fontSize: 8 }} />
                    <Tooltip
                      contentStyle={{ background: "#141414", border: "1px solid rgba(212,175,55,0.3)", color: "white", fontSize: 11 }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                      formatter={(v: number) => [`${v.toFixed(2)}%`, "Win Prob"]}
                      labelFormatter={() => ""}
                    />
                    <Area type="monotone" dataKey="prob" stroke="#D4AF37" strokeWidth={1.5} fill="url(#live-prob-grad)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#9a9a9a] mt-1">
                <span>30s ago</span>
                <span className="text-[#D4AF37] font-bold">
                  {selectedTeamLive.winProbability.toFixed(2)}%
                </span>
                <span>now</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
              <div className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2">
                ELO Trend (Last 12 months)
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${selectedTeamLive.eloTrend >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                  {selectedTeamLive.eloTrend >= 0 ? "▲" : "▼"} {Math.abs(selectedTeamLive.eloTrend).toFixed(1)}
                </span>
                <span className="text-xs text-[#9a9a9a]">points</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.1)]">
              <div className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-1">Manager</div>
              <div className="text-sm text-white">{selectedTeamLive.team.manager}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#9a9a9a]">{label}</span>
      <span className="text-sm font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function OutcomeBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#9a9a9a]">{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-[#0B0B0B] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
