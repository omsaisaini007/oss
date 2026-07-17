"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from "recharts";
import { analyzeTrends } from "@/lib/prediction";
import { TrendingUp, Globe, Crown, Calendar, Users, Activity } from "lucide-react";

export function HistoricalTrends() {
  const trends = useMemo(() => analyzeTrends(), []);

  const continentColors: Record<string, string> = {
    UEFA: "#0066FF",
    CONMEBOL: "#D4AF37",
    CONCACAF: "#22c55e",
    CAF: "#ef4444",
    AFC: "#a855f7",
    OFC: "#06b6d4",
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="trends">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Historical Trends Engine
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            96 Years of <span className="text-gold-gradient">Patterns</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Statistical insights distilled from every tournament since 1930. Host advantage, continental dominance, goal-scoring evolution, and the age curve of championship teams.
          </p>
        </motion.div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <TrendCard
            icon={<Globe className="w-4 h-4" />}
            label="Host Advantage"
            value={`${trends.hostAdvantage.toFixed(0)}%`}
            sub="Hosts reaching SFs"
            color="#D4AF37"
          />
          <TrendCard
            icon={<Crown className="w-4 h-4" />}
            label="UEFA Titles"
            value={trends.continentalDominance.find((c) => c.continent === "UEFA")?.titles || 0}
            sub="European dominance"
            color="#0066FF"
          />
          <TrendCard
            icon={<Activity className="w-4 h-4" />}
            label="Avg Goals/Match"
            value={trends.goalScoringTrend[trends.goalScoringTrend.length - 1]?.avgGoals.toFixed(2) || "2.7"}
            sub="2022 tournament"
            color="#22c55e"
          />
          <TrendCard
            icon={<Users className="w-4 h-4" />}
            label="Champion Avg Age"
            value="27.3"
            sub="Optimal window"
            color="#a855f7"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Goal scoring trend */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-lg font-bold text-white">Goal-Scoring Trend</h3>
            </div>
            <p className="text-xs text-[#9a9a9a] mb-4">
              Average goals per match across all tournaments (1930-2022)
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trends.goalScoringTrend}>
                <defs>
                  <linearGradient id="goals-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                <YAxis domain={[2, 6]} tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(34,197,94,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number) => [v.toFixed(2), "Avg Goals"]}
                />
                <Area type="monotone" dataKey="avgGoals" stroke="#22c55e" strokeWidth={2.5} fill="url(#goals-grad)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-[#9a9a9a] mt-2">
              The 1954 tournament (5.38 g/match) remains the highest-scoring era; modern tournaments stabilize around 2.6-2.7.
            </p>
          </div>

          {/* Continental dominance pie */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-[#0066FF]" />
              <h3 className="text-lg font-bold text-white">Continental Dominance</h3>
            </div>
            <p className="text-xs text-[#9a9a9a] mb-4">
              World Cup titles by confederation
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={trends.continentalDominance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="titles"
                  nameKey="continent"
                >
                  {trends.continentalDominance.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={continentColors[entry.continent] || "#9a9a9a"}
                      stroke="#0B0B0B"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number, name: string) => [`${v} titles`, name]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#FFFFFF" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age of champions + Successful managers */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Age of champions */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-[#a855f7]" />
              <h3 className="text-lg font-bold text-white">Age of Champions</h3>
            </div>
            <p className="text-xs text-[#9a9a9a] mb-4">
              Average squad age of World Cup-winning teams
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trends.ageOfChampions}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                <YAxis domain={[26, 29]} tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(168,85,247,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number) => [`${v.toFixed(1)} years`, "Avg Age"]}
                />
                <Line type="monotone" dataKey="avgAge" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-[#9a9a9a] mt-2">
              Champions cluster around 27-28 years old — the prime age for elite footballers.
            </p>
          </div>

          {/* Successful managers */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-lg font-bold text-white">Most Successful Managers</h3>
            </div>
            <p className="text-xs text-[#9a9a9a] mb-4">
              Managers with World Cup titles
            </p>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {trends.mostSuccessfulManagers.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 glass rounded-lg hover:bg-[rgba(212,175,55,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-6 ${i === 0 ? "text-[#D4AF37]" : "text-[#9a9a9a]"}`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{m.name}</div>
                      <div className="text-xs text-[#9a9a9a]">{m.country}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: m.titles }).map((_, j) => (
                      <Crown key={j} className="w-3.5 h-3.5 text-[#D4AF37]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Defending champion performance insight */}
        <div className="glass-gold rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Defending Champion Performance</h4>
              <p className="text-sm text-[#e0e0e0] leading-relaxed">
                {trends.defendingChampionPerformance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-xl p-4 hover-lift"
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-[#9a9a9a]">{sub}</div>
    </motion.div>
  );
}
