"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy, Target, Goal, Users, Clock, Award, Flame, TrendingUp } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

interface Record {
  category: string;
  holder: string;
  value: string;
  detail: string;
  year?: string;
  icon: React.ReactNode;
  color: string;
}

const RECORDS: Record[] = [
  { category: "Most World Cup Titles", holder: "Brazil", value: "5", detail: "1958, 1962, 1970, 1994, 2002", icon: <Trophy className="w-4 h-4" />, color: "#D4AF37" },
  { category: "Most WC Appearances", holder: "Germany", value: "20", detail: "Tied with Brazil — most tournaments played", icon: <Users className="w-4 h-4" />, color: "#0066FF" },
  { category: "Most WC Matches Played", holder: "Germany", value: "109", detail: "Across 20 tournaments", icon: <Clock className="w-4 h-4" />, color: "#00E1FF" },
  { category: "All-Time Top Scorer", holder: "Lionel Messi", value: "21 goals", detail: "Argentina — across 2006, 2010, 2014, 2018, 2022 (goals + assists)", icon: <Target className="w-4 h-4" />, color: "#22c55e" },
  { category: "Most Goals in One Tournament", holder: "Just Fontaine", value: "13 goals", detail: "France, 1958 — record still stands after 68 years", icon: <Goal className="w-4 h-4" />, color: "#ef4444" },
  { category: "Most Goals in a Final", holder: "Geoff Hurst", value: "3 goals", detail: "England vs West Germany, 1966 Final (hat-trick)", icon: <Trophy className="w-4 h-4" />, color: "#a855f7" },
  { category: "Youngest Goalscorer", holder: "Pelé", value: "17y 239d", detail: "Brazil vs Wales, 1958 Quarter-final", icon: <Flame className="w-4 h-4" />, color: "#f97316" },
  { category: "Oldest Goalscorer", holder: "Roger Milla", value: "42y 39d", detail: "Cameroon vs Russia, 1994", icon: <Clock className="w-4 h-4" />, color: "#06b6d4" },
  { category: "Most WC Appearances (Player)", holder: "Lionel Messi", value: "26 matches", detail: "Argentina — 2006, 2010, 2014, 2018, 2022", icon: <Users className="w-4 h-4" />, color: "#D4AF37" },
  { category: "Fastest Goal", holder: "Hakan Şükür", value: "11 sec", detail: "Turkey vs South Korea, 2002 3rd-place playoff", icon: <Clock className="w-4 h-4" />, color: "#00E1FF" },
  { category: "Most Clean Sheets", holder: "Peter Shilton & Fabien Barthez", value: "10 each", detail: "England & France — tied record", icon: <Award className="w-4 h-4" />, color: "#22c55e" },
  { category: "Most Penalties Saved", holder: "Dominik Livaković", value: "4 saves", detail: "Croatia — 2018 & 2022 shootouts", icon: <Award className="w-4 h-4" />, color: "#ef4444" },
  { category: "Biggest Win Margin", holder: "Hungary 10–1 El Salvador", value: "9 goals", detail: "1982 Group Stage", icon: <TrendingUp className="w-4 h-4" />, color: "#a855f7" },
  { category: "Highest Scoring Match", holder: "Austria 7–5 Switzerland", value: "12 goals", detail: "1954 Quarter-final — 7-5 thriller", icon: <Goal className="w-4 h-4" />, color: "#f97316" },
  { category: "Most Tournament Goals", holder: "2018 & 2022 (tied)", value: "172 goals", detail: "2018 Russia & 2022 Qatar — 32-team format peak", icon: <Target className="w-4 h-4" />, color: "#D4AF37" },
  { category: "Highest Attendance", holder: "1950 Final", value: "173,850", detail: "Uruguay vs Brazil — Maracanã, Rio de Janeiro", icon: <Users className="w-4 h-4" />, color: "#0066FF" },
];

// All-time WC top scorers (goals + key contributions — real-life data)
const TOP_SCORERS = [
  { name: "Lionel Messi", country: "Argentina", code: "AR", goals: 21, tournaments: 5 },
  { name: "Kylian Mbappé", country: "France", code: "FR", goals: 20, tournaments: 2 },
  { name: "Miroslav Klose", country: "Germany", code: "DE", goals: 16, tournaments: 4 },
  { name: "Ronaldo Nazário", country: "Brazil", code: "BR", goals: 15, tournaments: 4 },
  { name: "Gerd Müller", country: "Germany", code: "DE", goals: 14, tournaments: 2 },
  { name: "Harry Kane", country: "England", code: "GB", goals: 14, tournaments: 2 },
  { name: "Just Fontaine", country: "France", code: "FR", goals: 13, tournaments: 1 },
  { name: "Pelé", country: "Brazil", code: "BR", goals: 12, tournaments: 4 },
  { name: "Jürgen Klinsmann", country: "Germany", code: "DE", goals: 11, tournaments: 3 },
  { name: "Sándor Kocsis", country: "Hungary", code: "HU", goals: 11, tournaments: 1 },
  { name: "Cristiano Ronaldo", country: "Portugal", code: "PT", goals: 11, tournaments: 5 },
];

const SCORER_COLORS = ["#D4AF37", "#C0C0C0", "#CD7F32", "#0066FF", "#00E1FF", "#22c55e", "#a855f7", "#ef4444", "#f97316", "#06b6d4", "#ec4899", "#14b8a6"];

const FLAGS: Record<string, string> = {
  DE: "🇩🇪", BR: "🇧🇷", FR: "🇫🇷", AR: "🇦🇷", HU: "🇭🇺", PE: "🇵🇪", GB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", PT: "🇵🇹",
};

export function RecordsMilestones() {
  const [filter, setFilter] = useState<"all" | "scorers" | "goals" | "appearances" | "misc">("all");

  const filteredRecords = useMemo(() => {
    if (filter === "all") return RECORDS;
    if (filter === "scorers") return RECORDS.filter((r) => r.category.toLowerCase().includes("scor") || r.category.toLowerCase().includes("goal"));
    if (filter === "goals") return RECORDS.filter((r) => r.category.toLowerCase().includes("goal") || r.category.toLowerCase().includes("match") || r.category.toLowerCase().includes("win"));
    if (filter === "appearances") return RECORDS.filter((r) => r.category.toLowerCase().includes("appear") || r.category.toLowerCase().includes("attendance") || r.category.toLowerCase().includes("most"));
    return RECORDS;
  }, [filter]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a14]" id="records">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Records & Milestones
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            All-Time <span className="text-gold-gradient">Records</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            The greatest individual and team achievements in 96 years of World Cup history. From Pelé's teenage brilliance to Messi's 21 goal contributions, every record that has defined football's biggest stage.
          </p>
        </motion.div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "all" as const, label: "All Records" },
            { id: "scorers" as const, label: "Goal Records" },
            { id: "goals" as const, label: "Match Records" },
            { id: "appearances" as const, label: "Appearance Records" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.id
                  ? "glass-gold text-[#D4AF37] ring-1 ring-[#D4AF37]"
                  : "glass text-[#9a9a9a] hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Records grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {filteredRecords.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-xl p-4 hover-lift"
              style={{ borderTop: `2px solid ${r.color}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: r.color }}>{r.icon}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#9a9a9a]">
                  {r.category}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: r.color }}>
                {r.value}
              </div>
              <div className="text-sm font-semibold text-white mb-1">{r.holder}</div>
              <div className="text-xs text-[#9a9a9a] leading-relaxed">{r.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* Top scorers chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white">All-Time Top Scorers</h3>
          </div>
          <p className="text-xs text-[#9a9a9a] mb-5">Players with the most goals in World Cup history</p>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={TOP_SCORERS} layout="vertical" margin={{ left: 110, right: 20 }} cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#FFFFFF", fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "white", fontSize: 11 }}
                width={110}
              />
              <Tooltip
                contentStyle={{ background: "#141414", border: "1px solid rgba(212,175,55,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                formatter={(v: number) => [`${v} goals`, "Goals"]}
              />
              <Bar dataKey="goals" radius={[0, 4, 4, 0]}>
                {TOP_SCORERS.map((_, i) => (
                  <Cell key={i} fill={SCORER_COLORS[i % SCORER_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
            {TOP_SCORERS.slice(0, 6).map((s, i) => (
              <div key={i} className="glass rounded-lg p-2">
                <div className="mb-0.5"><Flag code={s.code} size={28} /></div>
                <div className="text-xs font-bold text-[#D4AF37]">{s.goals}</div>
                <div className="text-[9px] text-[#9a9a9a] truncate">{s.name.split(" ").slice(-1)[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
