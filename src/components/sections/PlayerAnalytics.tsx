"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell,
} from "recharts";
import { players, PlayerProfile, getTopScorers } from "@/lib/data/players";
import { Star, Award, Target, Activity, Clock } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

const POSITION_COLORS: Record<string, string> = {
  Forward: "#D4AF37",
  "Attacking Midfielder": "#00E1FF",
  Midfielder: "#0066FF",
  "Right-back": "#22c55e",
  Defender: "#22c55e",
  Sweeper: "#a855f7",
  Goalkeeper: "#ef4444",
};

type View = "all" | "legends" | "current";

const COUNTRY_FLAGS: Record<string, string> = {
  AR: "🇦🇷", BR: "🇧🇷", FR: "🇫🇷", DE: "🇩🇪", GB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  HU: "🇭🇺", PT: "🇵🇹", NL: "🇳🇱", HR: "🇭🇷", CO: "🇨🇴",
  MA: "🇲🇦", ES: "🇪🇸", IT: "🇮🇹",
};

export function PlayerAnalytics() {
  const [view, setView] = useState<View>("all");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile>(players[0]); // Messi default

  const filteredPlayers = useMemo(() => {
    if (view === "legends") return players.filter((p) => p.isLegend);
    if (view === "current") return players.filter((p) => p.isCurrent);
    return players;
  }, [view]);

  // Top scorers — always uses the full getTopScorers list (real-life ranking),
  // regardless of view filter, so the chart is consistent.
  const topScorers = useMemo(() => getTopScorers(11), []);

  // Bar chart data: rankingValue (user-provided real-life ranking)
  const chartData = useMemo(
    () => topScorers.map((p) => ({
      name: p.name,
      shortName: p.name.split(" ").slice(-1)[0],
      value: p.rankingValue!,
      goals: p.goals,
      assists: p.assists,
      country: p.country,
      countryCode: p.countryCode,
      flag: COUNTRY_FLAGS[p.countryCode] || "⚽",
      position: p.position,
    })),
    [topScorers]
  );

  // xG vs goals scatter
  const scatterData = useMemo(
    () =>
      filteredPlayers
        .filter((p) => p.goals > 0 || p.xG > 0)
        .map((p) => ({
          name: p.name,
          xG: p.xG,
          goals: p.goals,
          minutes: p.minutesPlayed,
          position: p.position,
          country: p.country,
          color: POSITION_COLORS[p.position] || "#9a9a9a",
        })),
    [filteredPlayers]
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a14]" id="players">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Player Analytics · All-Time World Cup Top Scorers
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            World Cup <span className="text-gold-gradient">Legends &amp; Stars</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Real-life ranking of the all-time World Cup top scorers by total goal contributions (goals + assists). From Messi's 21 to Cristiano Ronaldo's 11 — the players who defined football's biggest stage.
          </p>
        </motion.div>

        {/* View tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "all" as View, label: "All Players" },
            { id: "legends" as View, label: "Hall of Fame" },
            { id: "current" as View, label: "Active Stars" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === tab.id
                  ? "glass-gold text-[#D4AF37] ring-1 ring-[#D4AF37]"
                  : "glass text-[#9a9a9a] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* === Top scorers bar chart — REAL-LIFE RANKING === */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">All-Time World Cup Top Scorers</h3>
                <p className="text-xs text-[#9a9a9a]">Real-life ranking · goals + key contributions</p>
              </div>
              <Target className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 30, right: 60, top: 0, bottom: 0 }}
                cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 22]}
                  tick={{ fill: "#FFFFFF", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  tick={{ fill: "white", fontSize: 11 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(212,175,55,0.3)", color: "white", borderRadius: 8 }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number, name: string, props: any) => {
                    if (name === "value") {
                      const p = props.payload;
                      return [`${v}  (${p.goals}G + ${p.assists}A)`, `${p.name} (${p.country})`];
                    }
                    return [v, name];
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={POSITION_COLORS[d.position] || "#D4AF37"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Player ranking list */}
            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <div className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-3">Full Ranking</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {chartData.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-[rgba(212,175,55,0.08)] transition-colors cursor-pointer overflow-hidden"
                    onClick={() => {
                      const player = topScorers[i];
                      if (player) setSelectedPlayer(player);
                    }}
                  >
                    <span className={`text-xs font-bold w-6 ${i < 3 ? "text-[#D4AF37]" : "text-[#9a9a9a]"}`}>
                      {i + 1}
                    </span>
                    <span className="text-lg"><Flag code={p.countryCode} size={20} /></span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-[#9a9a9a]">{p.country}</div>
                    </div>
                    <span className="text-sm font-bold text-[#D4AF37] tabular-nums">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* xG vs Goals scatter */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">xG vs Goals</h3>
                <p className="text-xs text-[#9a9a9a]">Finishing efficiency</p>
              </div>
              <Activity className="w-5 h-5 text-[#00E1FF]" />
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  type="number"
                  dataKey="xG"
                  name="xG"
                  tick={{ fill: "#FFFFFF", fontSize: 10 }}
                  label={{ value: "xG", position: "insideBottom", offset: -5, fill: "#FFFFFF", fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="goals"
                  name="Goals"
                  tick={{ fill: "#FFFFFF", fontSize: 10 }}
                  label={{ value: "Goals", angle: -90, position: "insideLeft", fill: "#FFFFFF", fontSize: 10 }}
                />
                <ZAxis type="number" dataKey="minutes" range={[40, 400]} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid rgba(0,225,255,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  formatter={(v: number, name: string) => [v.toFixed(1), name]}
                  labelFormatter={() => ""}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-[#9a9a9a] mt-2">
              Bubble size = minutes played. Players above the diagonal outperform their xG.
            </p>
          </div>
        </div>

        {/* Player cards grid — hover background constrained to card width */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlayers.slice(0, 12).map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => setSelectedPlayer(p)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl p-4 text-left transition-all duration-300 overflow-hidden ${
                selectedPlayer.id === p.id ? "ring-1 ring-[#D4AF37] ring-opacity-100" : ""
              }`}
              style={{
                // Constrain hover background to card width only — not extending beyond
                borderRadius: "0.75rem",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(212, 175, 55, 0.12)";
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `${POSITION_COLORS[p.position] || "#9a9a9a"}20`,
                    color: POSITION_COLORS[p.position] || "#9a9a9a",
                  }}
                >
                  {p.position.split(" ")[0]}
                </span>
                {p.isLegend && <Star className="w-3 h-3 text-[#D4AF37]" />}
              </div>
              <h4 className="font-bold text-white text-sm mb-1 truncate">{p.name}</h4>
              <p className="text-xs text-[#9a9a9a] mb-3 flex items-center gap-1.5">
                <Flag code={p.countryCode} size={16} />
                <span>{p.country} · {p.era}</span>
              </p>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div>
                  <div className="text-sm font-bold text-[#D4AF37]">{p.goals}</div>
                  <div className="text-[9px] uppercase text-[#9a9a9a]">Goals</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#00E1FF]">{p.assists}</div>
                  <div className="text-[9px] uppercase text-[#9a9a9a]">Assists</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#22c55e]">{p.worldCups}</div>
                  <div className="text-[9px] uppercase text-[#9a9a9a]">WCs</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected player detail */}
        <motion.div
          key={selectedPlayer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-gold rounded-2xl p-6"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{selectedPlayer.isLegend ? "👑" : "⭐"}</div>
                <Flag code={selectedPlayer.countryCode} size={36} />
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedPlayer.name}</h3>
                  <p className="text-xs text-[#9a9a9a]">
                    {selectedPlayer.country} · {selectedPlayer.position} · {selectedPlayer.era}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#9a9a9a]">World Cups:</span>
                  <span className="text-white font-semibold">{selectedPlayer.worldCups}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#9a9a9a]">Golden Balls:</span>
                  <span className="text-white font-semibold">{selectedPlayer.goldenBalls}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#9a9a9a]">Golden Boots:</span>
                  <span className="text-white font-semibold">{selectedPlayer.goldenBoots}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[#00E1FF]" />
                  <span className="text-[#9a9a9a]">Minutes:</span>
                  <span className="text-white font-semibold">{selectedPlayer.minutesPlayed.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Performance metrics */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-[#D4AF37] mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Goals" value={selectedPlayer.goals} color="#D4AF37" />
                <Metric label="Assists" value={selectedPlayer.assists} color="#00E1FF" />
                <Metric label="xG" value={selectedPlayer.xG.toFixed(1)} color="#22c55e" />
                <Metric label="xA" value={selectedPlayer.xA.toFixed(1)} color="#a855f7" />
                <Metric label="Appearances" value={selectedPlayer.appearances} color="#f97316" />
                <Metric label="Avg Rating" value={selectedPlayer.avgRating.toFixed(1)} color="#D4AF37" />
              </div>
            </div>

            {/* Accolades */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-[#D4AF37] mb-3">Notable Accolades</h4>
              <ul className="space-y-2">
                {selectedPlayer.accolades.map((a, i) => (
                  <li key={i} className="text-sm text-white flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-0.5">🏆</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Metric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="glass rounded-lg p-3 text-center">
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mt-0.5">
        {label}
      </div>
    </div>
  );
}
