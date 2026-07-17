"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { players, PlayerProfile } from "@/lib/data/players";
import { Swords, Award, Target, Activity, Clock, Star, Trophy } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

const SORTED_PLAYERS = [...players].sort((a, b) => b.goals - a.goals);

export function PlayerCompare() {
  const [idA, setIdA] = useState("messi");
  const [idB, setIdB] = useState("ronaldo_cr7");

  const playerA = useMemo(() => players.find((p) => p.id === idA)!, [idA]);
  const playerB = useMemo(() => players.find((p) => p.id === idB)!, [idB]);

  // Radar data: normalize all metrics to 0-100
  const radarData = useMemo(() => {
    const maxGoals = Math.max(playerA.goals, playerB.goals, 15);
    const maxAssists = Math.max(playerA.assists, playerB.assists, 10);
    const maxMinutes = Math.max(playerA.minutesPlayed, playerB.minutesPlayed, 2500);
    const maxAppearances = Math.max(playerA.appearances, playerB.appearances, 25);
    return [
      { metric: "Goals", a: (playerA.goals / maxGoals) * 100, b: (playerB.goals / maxGoals) * 100 },
      { metric: "Assists", a: (playerA.assists / maxAssists) * 100, b: (playerB.assists / maxAssists) * 100 },
      { metric: "xG", a: (playerA.xG / maxGoals) * 100, b: (playerB.xG / maxGoals) * 100 },
      { metric: "xA", a: (playerA.xA / maxAssists) * 100, b: (playerB.xA / maxAssists) * 100 },
      { metric: "Minutes", a: (playerA.minutesPlayed / maxMinutes) * 100, b: (playerB.minutesPlayed / maxMinutes) * 100 },
      { metric: "Matches", a: (playerA.appearances / maxAppearances) * 100, b: (playerB.appearances / maxAppearances) * 100 },
      { metric: "Rating", a: (playerA.avgRating / 10) * 100, b: (playerB.avgRating / 10) * 100 },
    ];
  }, [playerA, playerB]);

  // Head-to-head metric comparison
  const metrics: { label: string; a: string | number; b: string | number; winner: "a" | "b" | "tie"; icon: React.ReactNode }[] = [
    { label: "World Cup Goals", a: playerA.goals, b: playerB.goals, winner: playerA.goals > playerB.goals ? "a" : playerB.goals > playerA.goals ? "b" : "tie", icon: <Target className="w-3.5 h-3.5" /> },
    { label: "Assists", a: playerA.assists, b: playerB.assists, winner: playerA.assists > playerB.assists ? "a" : playerB.assists > playerA.assists ? "b" : "tie", icon: <Award className="w-3.5 h-3.5" /> },
    { label: "Expected Goals (xG)", a: playerA.xG.toFixed(1), b: playerB.xG.toFixed(1), winner: playerA.xG > playerB.xG ? "a" : playerB.xG > playerA.xG ? "b" : "tie", icon: <Target className="w-3.5 h-3.5" /> },
    { label: "Expected Assists (xA)", a: playerA.xA.toFixed(1), b: playerB.xA.toFixed(1), winner: playerA.xA > playerB.xA ? "a" : playerB.xA > playerA.xA ? "b" : "tie", icon: <Award className="w-3.5 h-3.5" /> },
    { label: "WC Appearances", a: playerA.appearances, b: playerB.appearances, winner: playerA.appearances > playerB.appearances ? "a" : playerB.appearances > playerA.appearances ? "b" : "tie", icon: <Activity className="w-3.5 h-3.5" /> },
    { label: "Minutes Played", a: playerA.minutesPlayed.toLocaleString(), b: playerB.minutesPlayed.toLocaleString(), winner: playerA.minutesPlayed > playerB.minutesPlayed ? "a" : playerB.minutesPlayed > playerA.minutesPlayed ? "b" : "tie", icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "Avg Rating", a: playerA.avgRating.toFixed(1), b: playerB.avgRating.toFixed(1), winner: playerA.avgRating > playerB.avgRating ? "a" : playerB.avgRating > playerA.avgRating ? "b" : "tie", icon: <Star className="w-3.5 h-3.5" /> },
    { label: "World Cups", a: playerA.worldCups, b: playerB.worldCups, winner: playerA.worldCups > playerB.worldCups ? "a" : playerB.worldCups > playerA.worldCups ? "b" : "tie", icon: <Trophy className="w-3.5 h-3.5" /> },
    { label: "Golden Balls", a: playerA.goldenBalls, b: playerB.goldenBalls, winner: playerA.goldenBalls > playerB.goldenBalls ? "a" : playerB.goldenBalls > playerA.goldenBalls ? "b" : "tie", icon: <Award className="w-3.5 h-3.5" /> },
    { label: "Golden Boots", a: playerA.goldenBoots, b: playerB.goldenBoots, winner: playerA.goldenBoots > playerB.goldenBoots ? "a" : playerB.goldenBoots > playerA.goldenBoots ? "b" : "tie", icon: <Award className="w-3.5 h-3.5" /> },
  ];

  // Count wins
  const aWins = metrics.filter((m) => m.winner === "a").length;
  const bWins = metrics.filter((m) => m.winner === "b").length;

  const swap = () => { setIdA(idB); setIdB(idA); };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="compare">
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
              Player Comparison Tool
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Head-to-Head <span className="text-blue-gradient">Player Compare</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Pick any two World Cup legends or active stars and compare them across 10 metrics — goals, assists, xG, xA, appearances, minutes, ratings, and individual awards. The radar chart reveals each player's profile at a glance.
          </p>
        </motion.div>

        {/* Player selectors */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">Player A</label>
            <select
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-3 py-2.5 text-sm"
            >
              {SORTED_PLAYERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.country}) — {p.goals} goals
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={swap}
            className="self-end mb-0.5 mx-auto p-3 rounded-full glass hover:bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] transition-all"
            title="Swap players"
          >
            <Swords className="w-4 h-4 text-[#D4AF37]" />
          </button>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">Player B</label>
            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-3 py-2.5 text-sm"
            >
              {SORTED_PLAYERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.country}) — {p.goals} goals
                </option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${idA}-${idB}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Player A card */}
            <PlayerCard player={playerA} color="#D4AF37" wins={aWins} total={metrics.length} side="A" />

            {/* Radar + comparison table */}
            <div className="space-y-4">
              {/* Radar chart */}
              <div className="glass rounded-2xl p-4">
                <h4 className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 text-center">Performance Profile</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#FFFFFF", fontSize: 9 }} />
                    <PolarRadiusAxis tick={{ fill: "#FFFFFF", fontSize: 8 }} angle={90} domain={[0, 100]} />
                    <Radar name={playerA.name} dataKey="a" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.35} strokeWidth={2} />
                    <Radar name={playerB.name} dataKey="b" stroke="#00E1FF" fill="#00E1FF" fillOpacity={0.25} strokeWidth={2} />
                    <Tooltip
                      contentStyle={{ background: "#141414", border: "1px solid rgba(212,175,55,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Metric comparison table */}
              <div className="glass rounded-2xl p-4">
                <h4 className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-3 text-center">Metric Breakdown</h4>
                <div className="space-y-1.5">
                  {metrics.map((m, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                      <div className={`text-sm font-semibold text-right ${m.winner === "a" ? "text-[#D4AF37]" : "text-[#9a9a9a]"}`}>
                        {m.a}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#9a9a9a] px-2 text-center min-w-[80px]">
                        {m.icon}
                        <span>{m.label}</span>
                      </div>
                      <div className={`text-sm font-semibold ${m.winner === "b" ? "text-[#00E1FF]" : "text-[#9a9a9a]"}`}>
                        {m.b}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Player B card */}
            <PlayerCard player={playerB} color="#00E1FF" wins={bWins} total={metrics.length} side="B" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function PlayerCard({ player, color, wins, total, side }: {
  player: PlayerProfile;
  color: string;
  wins: number;
  total: number;
  side: "A" | "B";
}) {
  return (
    <div
      className="glass rounded-2xl p-6"
      style={{ borderLeft: side === "A" ? `3px solid ${color}` : undefined, borderRight: side === "B" ? `3px solid ${color}` : undefined }}
    >
      <div className="text-center mb-4">
        <div className="text-5xl mb-2">{player.isLegend ? "👑" : "⭐"}</div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Flag code={player.countryCode} size={28} />
          <h3 className="text-xl font-bold text-white">{player.name}</h3>
        </div>
        <div className="text-xs text-[#9a9a9a]">{player.country} · {player.position}</div>
        <div className="text-[10px] text-[#9a9a9a] mt-1">{player.era}</div>
      </div>

      {/* Win indicator */}
      <div className="text-center mb-4 p-3 glass rounded-lg" style={{ background: `${color}10` }}>
        <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Wins {wins} / {total}</div>
        <div className="text-2xl font-bold" style={{ color }}>
          {((wins / total) * 100).toFixed(0)}%
        </div>
        <div className="text-[10px] text-[#9a9a9a]">of metrics</div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Stat label="Goals" value={player.goals} color={color} />
        <Stat label="Assists" value={player.assists} color={color} />
        <Stat label="xG" value={player.xG.toFixed(1)} color={color} />
        <Stat label="xA" value={player.xA.toFixed(1)} color={color} />
        <Stat label="Appearances" value={player.appearances} color={color} />
        <Stat label="WCs" value={player.worldCups} color={color} />
      </div>

      {/* Accolades */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-2">Accolades</div>
        <ul className="space-y-1.5">
          {player.accolades.map((a, i) => (
            <li key={i} className="text-xs text-white flex items-start gap-1.5">
              <span style={{ color }}>▸</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="glass rounded-lg p-2.5 text-center">
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-[#9a9a9a]">{label}</div>
    </div>
  );
}
