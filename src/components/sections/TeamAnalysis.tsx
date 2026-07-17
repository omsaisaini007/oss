"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { teams, TeamProfile } from "@/lib/data/teams";
import { tournaments } from "@/lib/data/tournaments";
import { Users, Award, Flag as FlagIcon, TrendingUp, Shield, Swords, Crown } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

export function TeamAnalysis() {
  const sortedTeams = useMemo(() => [...teams].sort((a, b) => a.fifaRank - b.fifaRank), []);
  const [selectedCode, setSelectedCode] = useState(sortedTeams[0].code);
  const team = teams.find((t) => t.code === selectedCode)!;

  // Tournament history for this team
  const history = useMemo(() => {
    return tournaments
      .filter((t) => t.year !== 2026)
      .map((t) => {
        let result = "DNQ";
        let stage = 0;
        if (t.winner === team.name) { result = "Champion"; stage = 7; }
        else if (t.runnerUp === team.name) { result = "Runner-up"; stage = 6; }
        else if (t.thirdPlace === team.name) { result = "3rd"; stage = 5; }
        else if (t.fourthPlace === team.name) { result = "4th"; stage = 4; }
        // Note: more granular data would require match DB; here we approximate
        else if (team.worldCupAppearances > 0) {
          result = "Participated";
          stage = 2;
        }
        return { year: t.year, stage, result };
      });
  }, [team]);

  // W-D-L pie data
  const wdlData = [
    { name: "Wins", value: team.wins, color: "#22c55e" },
    { name: "Draws", value: team.draws, color: "#9a9a9a" },
    { name: "Losses", value: team.losses, color: "#ef4444" },
  ];

  const radarData = [
    { axis: "Attack", value: team.attackRating },
    { axis: "Midfield", value: team.midfieldRating },
    { axis: "Defense", value: team.defenseRating },
    { axis: "Form", value: team.formRating },
    { axis: "Titles", value: team.titles * 18 },
    { axis: "ELO/20", value: (team.eloRating - 1500) / 30 },
  ];

  // Form chart (synthetic last 10 matches)
  const formChartData = useMemo(() => {
    const base = team.formRating;
    return Array.from({ length: 10 }).map((_, i) => ({
      match: `M${i + 1}`,
      rating: Math.max(40, Math.min(100, base + (Math.random() - 0.5) * 25)),
    }));
  }, [team]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="teams">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <FlagIcon className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Team Analysis · 16 Nations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            National Team <span className="text-gold-gradient">Profiles</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Deep-dive analytics for every major football nation — World Cup pedigree, squad strength, form, legendary players, and historical performance timeline.
          </p>
        </motion.div>

        {/* Team selector pills */}
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
              <Flag code={t.code} size={22} />
              <span className={`text-sm font-medium ${selectedCode === t.code ? "text-[#D4AF37]" : "text-white"}`}>
                {t.name}
              </span>
              <span className="text-[10px] text-[#9a9a9a]">#{t.fifaRank}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={team.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Profile card */}
            <div className="glass-gold rounded-2xl p-6">
              <div className="mb-3"><Flag code={team.code} size={64} /></div>
              <h3 className="text-3xl font-black text-white mb-1">{team.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(0,102,255,0.2)] text-[#00E1FF] border border-[rgba(0,102,255,0.3)]">
                  {team.confederation}
                </span>
                <span className="text-xs text-[#9a9a9a]">FIFA Rank #{team.fifaRank}</span>
              </div>

              <div className="space-y-3">
                <StatRow icon={<Crown className="w-3.5 h-3.5" />} label="WC Titles" value={team.titles} color="#D4AF37" big />
                <StatRow icon={<Award className="w-3.5 h-3.5" />} label="Runner-ups" value={team.runnerUps} color="#C0C0C0" />
                <StatRow icon={<TrendingUp className="w-3.5 h-3.5" />} label="3rd Places" value={team.thirdPlaces} color="#CD7F32" />
                <StatRow icon={<Users className="w-3.5 h-3.5" />} label="WC Appearances" value={team.worldCupAppearances} color="#00E1FF" />
              </div>

              {team.titleYears.length > 0 && (
                <div className="mt-4 p-3 glass rounded-lg">
                  <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-1">
                    Championship Years
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.titleYears.map((y) => (
                      <span
                        key={y}
                        className="text-xs px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#0B0B0B] font-bold"
                      >
                        {y}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-2">
                  Manager
                </div>
                <div className="text-sm text-white">{team.manager}</div>
              </div>
            </div>

            {/* Performance metrics */}
            <div className="glass rounded-2xl p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-3">All-Time WC Record</h4>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center glass rounded p-2">
                    <div className="text-xl font-bold text-[#22c55e]">{team.wins}</div>
                    <div className="text-[10px] uppercase text-[#9a9a9a]">Wins</div>
                  </div>
                  <div className="text-center glass rounded p-2">
                    <div className="text-xl font-bold text-[#9a9a9a]">{team.draws}</div>
                    <div className="text-[10px] uppercase text-[#9a9a9a]">Draws</div>
                  </div>
                  <div className="text-center glass rounded p-2">
                    <div className="text-xl font-bold text-[#ef4444]">{team.losses}</div>
                    <div className="text-[10px] uppercase text-[#9a9a9a]">Losses</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-3">Goal Statistics</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center glass rounded p-2">
                    <div className="text-lg font-bold text-[#22c55e]">{team.goalsFor}</div>
                    <div className="text-[10px] uppercase text-[#9a9a9a]">Scored</div>
                  </div>
                  <div className="text-center glass rounded p-2">
                    <div className="text-lg font-bold text-[#ef4444]">{team.goalsAgainst}</div>
                    <div className="text-[10px] uppercase text-[#9a9a9a]">Conceded</div>
                  </div>
                  <div className="text-center glass rounded p-2">
                    <div className="text-lg font-bold text-[#00E1FF]">{team.cleanSheets}</div>
                    <div className="text-[10px] uppercase text-[#9a9a9a]">Clean Sheets</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-3">Squad Quality</h4>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: "#FFFFFF", fontSize: 10 }} />
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
            </div>

            {/* Form + Legend + History */}
            <div className="space-y-6">
              {/* Form chart */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white">Form (Last 10 Matches)</h4>
                  <span className="text-xs text-[#9a9a9a]">Rating: {team.formRating}/100</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={formChartData}>
                    <defs>
                      <linearGradient id="form-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E1FF" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#00E1FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="match" tick={{ fill: "#FFFFFF", fontSize: 9 }} />
                    <YAxis domain={[40, 100]} tick={{ fill: "#FFFFFF", fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{ background: "#141414", border: "1px solid rgba(0,225,255,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                    />
                    <Area type="monotone" dataKey="rating" stroke="#00E1FF" strokeWidth={2} fill="url(#form-grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legendary players */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="text-sm font-bold text-white">Legendary Players</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.legendaryPlayers.map((p, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full glass-gold text-white"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical performance */}
              <div className="glass rounded-2xl p-6">
                <h4 className="text-sm font-bold text-white mb-3">Historical Performance</h4>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: "#FFFFFF", fontSize: 9 }} />
                    <YAxis domain={[0, 7]} tick={{ fill: "#FFFFFF", fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{ background: "#141414", border: "1px solid rgba(212,175,55,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                      labelFormatter={(l) => `${l}`}
                      formatter={(v: number) => {
                        const stages = ["DNQ", "Group", "R16", "QF", "4th", "3rd", "RU", "Champ"];
                        return [stages[v] || "DNQ", "Result"];
                      }}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="stage"
                      stroke="#D4AF37"
                      strokeWidth={2.5}
                      dot={{ fill: "#D4AF37", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="text-[10px] text-[#9a9a9a] mt-2">
                  Champion=7 · Runner-up=6 · 3rd=5 · 4th=4 · Group=2
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function StatRow({ icon, label, value, color, big = false }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs text-[#9a9a9a]">{label}</span>
      </div>
      <span className={`font-bold ${big ? "text-xl" : "text-base"}`} style={{ color }}>
        {value}
      </span>
    </div>
  );
}
