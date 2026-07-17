"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, BubbleChart, Bubble,
  AreaChart, Area, BarChart, Bar,
} from "recharts";
import { teams } from "@/lib/data/teams";
import { generatePredictions } from "@/lib/prediction";
import { LayoutDashboard, Activity, Zap, Shield, TrendingUp, Brain } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

export function PredictionDashboard() {
  const predictions = useMemo(() => generatePredictions(), []);
  const sortedTeams = useMemo(() => [...teams].sort((a, b) => a.fifaRank - b.fifaRank), []);
  const [selectedCode, setSelectedCode] = useState("AR");

  const team = teams.find((t) => t.code === selectedCode)!;
  const prediction = predictions.find((p) => p.team.code === selectedCode)!;

  // Radar: squad ratings
  const radarData = [
    { axis: "Attack", value: team.attackRating },
    { axis: "Midfield", value: team.midfieldRating },
    { axis: "Defense", value: team.defenseRating },
    { axis: "Form", value: team.formRating },
    { axis: "Player", value: team.avgPlayerRating },
    { axis: "Value", value: Math.min(100, team.squadValue / 12) },
  ];

  // ELO trend (synthetic 12-month series ending at current rating)
  const eloTrend = useMemo(() => {
    const base = team.eloRating - 60;
    return Array.from({ length: 12 }).map((_, i) => ({
      month: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i],
      elo: Math.round(base + (team.eloRating - base) * (i / 11) + (Math.random() - 0.5) * 20),
    }));
  }, [team]);

  // Scatter: attack vs defense across all teams (with selected highlighted)
  const scatterData = teams.map((t) => ({
    name: t.name,
    attack: t.attackRating,
    defense: t.defenseRating,
    value: t.squadValue,
    code: t.code,
    isSelected: t.code === selectedCode,
  }));

  // KPIs
  const kpis = [
    { label: "Championship Probability", value: `${prediction.winProbability.toFixed(1)}%`, color: "#D4AF37", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "ELO Rating", value: team.eloRating, color: "#00E1FF", icon: <Activity className="w-4 h-4" /> },
    { label: "Form Rating", value: `${team.formRating}/100`, color: "#22c55e", icon: <Zap className="w-4 h-4" /> },
    { label: "Squad Strength", value: `${Math.round((team.attackRating + team.defenseRating + team.midfieldRating) / 3)}/100`, color: "#a855f7", icon: <Shield className="w-4 h-4" /> },
    { label: "Attack Rating", value: `${team.attackRating}/100`, color: "#ef4444", icon: <Zap className="w-4 h-4" /> },
    { label: "Defense Rating", value: `${team.defenseRating}/100`, color: "#06b6d4", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a14]" id="dashboard">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Prediction Dashboard
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Advanced <span className="text-gold-gradient">Analytics</span> Dashboard
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            KPIs, radar plots, ELO trends, and bubble charts — combining multiple visualization layers for the deepest possible view into each team's championship credentials.
          </p>
        </motion.div>

        {/* Team selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {sortedTeams.map((t) => (
            <button
              key={t.code}
              onClick={() => setSelectedCode(t.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCode === t.code
                  ? "glass-gold ring-1 ring-[#D4AF37]"
                  : "glass hover:bg-[rgba(255,255,255,0.05)]"
              }`}
            >
              <Flag code={t.code} size={20} />
              <span className={`text-xs font-medium ${selectedCode === t.code ? "text-[#D4AF37]" : "text-white"}`}>
                {t.code}
              </span>
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: kpi.color }}>{kpi.icon}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#9a9a9a]">
                  {kpi.label.split(" ")[0]}
                </span>
              </div>
              <div className="text-xl font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-[9px] text-[#9a9a9a] mt-0.5">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Radar */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">Squad Strength Radar</h3>
              <Brain className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#FFFFFF", fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: "#FFFFFF", fontSize: 9 }} angle={90} domain={[0, 100]} />
                <Radar dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(212,175,55,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* ELO Trend */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">ELO Rating Trend</h3>
                <p className="text-xs text-[#9a9a9a]">12-month rolling average</p>
              </div>
              <Activity className="w-5 h-5 text-[#00E1FF]" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={eloTrend}>
                <defs>
                  <linearGradient id="elo-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E1FF" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#00E1FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#FFFFFF", fontSize: 11 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(0,225,255,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number) => [v, "ELO"]}
                />
                <Area type="monotone" dataKey="elo" stroke="#00E1FF" strokeWidth={2.5} fill="url(#elo-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Attack vs Defense scatter (bubble by value) */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Attack vs Defense Bubble</h3>
                <p className="text-xs text-[#9a9a9a]">Bubble size = squad value · Selected team highlighted</p>
              </div>
              <TrendingUp className="w-5 h-5 text-[#a855f7]" />
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  type="number"
                  dataKey="attack"
                  name="Attack"
                  domain={[60, 100]}
                  tick={{ fill: "#FFFFFF", fontSize: 10 }}
                  label={{ value: "Attack Rating", position: "insideBottom", offset: -5, fill: "#FFFFFF", fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="defense"
                  name="Defense"
                  domain={[60, 100]}
                  tick={{ fill: "#FFFFFF", fontSize: 10 }}
                  label={{ value: "Defense Rating", angle: -90, position: "insideLeft", fill: "#FFFFFF", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="value" range={[100, 1200]} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number, n: string) => [v, n]}
                  labelFormatter={() => ""}
                />
                <Scatter
                  data={scatterData}
                  fill="#a855f7"
                  fillOpacity={0.5}
                >
                  {scatterData.map((d, i) => (
                    <circle
                      key={i}
                      fill={d.isSelected ? "#D4AF37" : "#a855f7"}
                      fillOpacity={d.isSelected ? 1 : 0.5}
                      stroke={d.isSelected ? "#FFF5C8" : "none"}
                      strokeWidth={d.isSelected ? 2 : 0}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Heatmap-style bar chart: team strengths comparison */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Top 10 Teams · Composite Score</h3>
                <p className="text-xs text-[#9a9a9a]">Combined ELO + form + strength metrics</p>
              </div>
              <Shield className="w-5 h-5 text-[#22c55e]" />
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={[...predictions]
                  .sort((a, b) => b.winProbability - a.winProbability)
                  .slice(0, 10)
                  .map((p) => ({
                    name: p.team.code,
                    score: Math.round(
                      (p.team.eloRating / 20) +
                      p.team.formRating * 0.5 +
                      p.team.attackRating * 0.3 +
                      p.team.defenseRating * 0.3 +
                      p.team.titles * 2
                    ),
                    prob: p.winProbability,
                  }))}
                layout="vertical"
                margin={{ left: 30 }}
                cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "white", fontSize: 12, fontWeight: 600 }} width={40} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(34,197,94,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number) => [v, "Score"]}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {predictions.slice(0, 10).map((p, i) => (
                    <cell key={i} fill={`hsl(${45 - i * 4}, 70%, ${60 - i * 2}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
