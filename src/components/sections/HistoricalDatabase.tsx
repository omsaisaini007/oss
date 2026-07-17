"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { tournaments } from "@/lib/data/tournaments";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, MapPin, Users, Goal, Calendar } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

export function HistoricalDatabase() {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filtered = tournaments.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.year.toString().includes(q) ||
      t.host.toLowerCase().includes(q) ||
      t.winner.toLowerCase().includes(q) ||
      t.runnerUp.toLowerCase().includes(q)
    );
  });

  const selected = tournaments.find((t) => t.year === selectedYear);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="history">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Historical Database
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Every <span className="text-gold-gradient">World Cup</span>, 1930 → 2030
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            A complete archive of every FIFA World Cup tournament. Click any year for full details — hosts, finalists, golden ball, golden boot, attendance, and more.
          </p>
        </motion.div>

        {/* Search bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search year, host, winner..."
            className="pl-10 bg-[#141414] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[#9a9a9a]"
          />
        </div>

        {/* Tournament grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {filtered.map((t, i) => (
            <motion.button
              key={t.year}
              onClick={() => setSelectedYear(t.year)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              className={`relative glass rounded-xl p-4 hover-lift text-left transition-all ${
                selectedYear === t.year ? "ring-2 ring-[#D4AF37] glow-gold" : ""
              } ${t.year === 2026 ? "glass-blue" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-white">{t.year}</span>
                {t.year === 2026 && (
                  <Badge className="bg-[#ef4444] text-white text-[10px] animate-pulse">LIVE NOW</Badge>
                )}
                {t.year === 2030 && (
                  <Badge className="bg-[#0066FF] text-white text-[10px]">UPCOMING</Badge>
                )}
              </div>
              <div className="text-xs text-[#9a9a9a] mb-1 flex items-center gap-1.5">
                <Flag code={t.hostCode} size={14} />
                <span className="truncate">{t.host}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flag code={t.winnerCode} size={16} />
                <span className="text-sm font-semibold text-[#D4AF37] truncate">
                  {t.winner}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 md:p-8 border border-[rgba(212,175,55,0.2)]"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left: Tournament header */}
              <div className="md:col-span-1">
                <div className="text-6xl font-black text-gold-gradient mb-2">
                  {selected.year}
                </div>
                <div className="flex items-center gap-2 text-[#9a9a9a] mb-4">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>{selected.host}</span>
                </div>
                <div className="flex items-center gap-2 text-[#9a9a9a] mb-4">
                  <Users className="w-4 h-4 text-[#00E1FF]" />
                  <span>{selected.teams} teams · {selected.matches} matches</span>
                </div>
                <div className="flex items-center gap-2 text-[#9a9a9a]">
                  <Goal className="w-4 h-4 text-[#22c55e]" />
                  <span>{selected.goals} goals · {selected.avgGoals} avg/match</span>
                </div>
                {selected.year !== 2026 && selected.year !== 2030 && (
                  <div className="mt-4 text-xs text-[#9a9a9a]">
                    Final: {selected.finalCity} · {selected.finalStadium}
                  </div>
                )}
                {selected.year === 2026 && (
                  <div className="mt-4 text-xs text-[#ef4444] font-semibold">
                    ● Live now — knockout stage in progress
                  </div>
                )}
              </div>

              {/* Middle: Podium */}
              <div className="md:col-span-1">
                <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-3">
                  Final Standings
                </h4>
                <div className="space-y-2">
                  <PodiumRow position="1st" country={selected.winner} code={selected.winnerCode} medal="🥇" />
                  <PodiumRow position="2nd" country={selected.runnerUp} code={selected.runnerUpCode} medal="🥈" />
                  <PodiumRow position="3rd" country={selected.thirdPlace} code="" medal="🥉" />
                  <PodiumRow position="4th" country={selected.fourthPlace} code="" medal="4" />
                </div>
                {selected.year !== 2026 && selected.year !== 2030 && (
                  <div className="mt-4 p-3 glass-blue rounded-lg">
                    <div className="text-xs text-[#9a9a9a] mb-1">Final Score</div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <Flag code={selected.winnerCode} size={20} />
                      <span>{selected.winner} {selected.finalScore} {selected.runnerUp}</span>
                      <Flag code={selected.runnerUpCode} size={20} />
                    </div>
                  </div>
                )}
                {selected.year === 2026 && (
                  <div className="mt-4 p-3 glass rounded-lg border border-[#ef4444]/30">
                    <div className="text-xs text-[#9a9a9a] mb-1">Status</div>
                    <div className="text-lg font-bold text-[#ef4444]">● Tournament Ongoing</div>
                  </div>
                )}
              </div>

              {/* Right: Awards */}
              <div className="md:col-span-1">
                <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-3">
                  Individual Awards
                </h4>
                <div className="space-y-3">
                  <AwardRow label="Golden Ball" value={selected.goldenBall} icon="⚽" color="#D4AF37" />
                  <AwardRow
                    label="Golden Boot"
                    value={selected.year >= 2026 ? "—" : `${selected.goldenBoot} (${selected.goldenBootGoals})`}
                    icon="👟"
                    color="#00E1FF"
                  />
                  <AwardRow label="Best Goalkeeper" value={selected.bestGoalkeeper} icon="🧤" color="#22c55e" />
                  <AwardRow
                    label="Top Attendance"
                    value={selected.year >= 2026 ? "—" : selected.topAttendance.toLocaleString()}
                    icon="🏟️"
                    color="#a855f7"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Aggregate stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { label: "Total Tournaments", value: 22, color: "#D4AF37" },
            { label: "Total Matches Played", value: tournaments.reduce((s, t) => s + (t.year >= 2026 ? 0 : t.matches), 0), color: "#0066FF" },
            { label: "Total Goals Scored", value: tournaments.reduce((s, t) => s + t.goals, 0), color: "#22c55e" },
            { label: "All-Time Attendance", value: "38.5M", color: "#a855f7" },
          ].map((stat, i) => (
            <Card key={i} className="glass p-4 text-center hover-lift">
              <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs uppercase tracking-wider text-[#9a9a9a]">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PodiumRow({ position, country, code, medal }: { position: string; country: string; code: string; medal: string }) {
  const colors: Record<string, string> = {
    "1st": "#D4AF37",
    "2nd": "#C0C0C0",
    "3rd": "#CD7F32",
    "4th": "#9a9a9a",
  };
  return (
    <div className="flex items-center justify-between p-2 glass rounded-md">
      <div className="flex items-center gap-2">
        <span className="text-lg">{medal}</span>
        <span className="text-xs uppercase tracking-wider" style={{ color: colors[position] }}>
          {position}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {code && <Flag code={code} size={18} />}
        <span className="text-sm font-medium text-white">{country}</span>
      </div>
    </div>
  );
}

function AwardRow({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-2 glass rounded-md">
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">{label}</div>
        <div className="text-sm font-medium text-white truncate" style={{ color }}>
          {value}
        </div>
      </div>
    </div>
  );
}
