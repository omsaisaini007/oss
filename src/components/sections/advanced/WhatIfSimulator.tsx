"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts";
import { teams } from "@/lib/data/teams";
import { computeWhatIf, WhatIfOverrides } from "@/lib/ml/what-if";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Sliders, TrendingUp, TrendingDown, Wand2, Trophy } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

const SORTED_TEAMS = [...teams].sort((a, b) => a.fifaRank - b.fifaRank);

export function WhatIfSimulator() {
  const [selectedCode, setSelectedCode] = useState("BR");
  const [overrides, setOverrides] = useState<WhatIfOverrides>({});
  const [opponentCode, setOpponentCode] = useState("AR");

  const team = teams.find((t) => t.code === selectedCode)!;
  const result = useMemo(
    () => computeWhatIf(team, overrides, opponentCode),
    [team, overrides, opponentCode]
  );

  const updateOverride = (key: keyof WhatIfOverrides, value: number) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setOverrides({});

  // Factor breakdown chart data
  const factorData = result.factorBreakdown.map((f) => ({
    name: f.factor,
    baseline: Math.round(f.baseline * 100),
    modified: Math.round(f.modified * 100),
  }));

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="whatif">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              What-If Simulator · Advanced Analytics
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            What-If <span className="text-gold-gradient">Scenario Engine</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Override any team's form, squad value, attack, defense, midfield, or ELO rating to instantly see how the change ripples through the ensemble's World Cup predictions. Powered by the Strategy-pattern ML ensemble with calibrated probabilities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls panel */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                Modify Team
              </h3>
              <button
                onClick={reset}
                className="text-xs px-3 py-1.5 rounded-md glass text-[#9a9a9a] hover:text-white"
              >
                Reset
              </button>
            </div>

            {/* Team selector */}
            <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
              Select Team
            </label>
            <select
              value={selectedCode}
              onChange={(e) => {
                setSelectedCode(e.target.value);
                setOverrides({});
              }}
              className="w-full bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-3 py-2.5 text-sm mb-5"
            >
              {SORTED_TEAMS.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name} (#{t.fifaRank})
                </option>
              ))}
            </select>

            {/* Sliders */}
            <SliderRow
              label="Form Rating"
              value={overrides.formRating ?? team.formRating}
              min={30} max={100} step={1}
              onChange={(v) => updateOverride("formRating", v)}
              color="#22c55e"
              suffix="/100"
            />
            <SliderRow
              label="Attack Rating"
              value={overrides.attackRating ?? team.attackRating}
              min={50} max={100} step={1}
              onChange={(v) => updateOverride("attackRating", v)}
              color="#ef4444"
              suffix="/100"
            />
            <SliderRow
              label="Defense Rating"
              value={overrides.defenseRating ?? team.defenseRating}
              min={50} max={100} step={1}
              onChange={(v) => updateOverride("defenseRating", v)}
              color="#06b6d4"
              suffix="/100"
            />
            <SliderRow
              label="Midfield Rating"
              value={overrides.midfieldRating ?? team.midfieldRating}
              min={50} max={100} step={1}
              onChange={(v) => updateOverride("midfieldRating", v)}
              color="#a855f7"
              suffix="/100"
            />
            <SliderRow
              label="Squad Value"
              value={overrides.squadValue ?? team.squadValue}
              min={50} max={1500} step={10}
              onChange={(v) => updateOverride("squadValue", v)}
              color="#D4AF37"
              suffix="M €"
            />
            <SliderRow
              label="ELO Adjustment"
              value={overrides.eloAdjust ?? 0}
              min={-200} max={200} step={5}
              onChange={(v) => updateOverride("eloAdjust", v)}
              color="#00E1FF"
              suffix=" pts"
            />

            {/* Opponent selector for H2H preview */}
            <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 mt-5 block">
              Sample Opponent
            </label>
            <select
              value={opponentCode}
              onChange={(e) => setOpponentCode(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-3 py-2.5 text-sm"
            >
              {SORTED_TEAMS.filter((t) => t.code !== selectedCode).map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name} (#{t.fifaRank})
                </option>
              ))}
            </select>
          </div>

          {/* Outcome panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-4">
              <KpiCard
                label="Baseline Win %"
                value={`${result.baselineWinProb.toFixed(1)}%`}
                sub={`Rank #${result.baselineRank}`}
                color="#9a9a9a"
              />
              <KpiCard
                label="Modified Win %"
                value={`${result.modifiedWinProb.toFixed(1)}%`}
                sub={`Rank #${result.modifiedRank}`}
                color="#D4AF37"
              />
              <KpiCard
                label="Delta"
                value={`${result.delta >= 0 ? "+" : ""}${result.delta.toFixed(2)}%`}
                sub={result.delta > 0.5 ? "Stronger" : result.delta < -0.5 ? "Weaker" : "Neutral"}
                color={result.delta >= 0 ? "#22c55e" : "#ef4444"}
                icon={result.delta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              />
            </div>

            {/* Factor breakdown bar chart */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-1">Factor Breakdown</h3>
              <p className="text-xs text-[#9a9a9a] mb-4">Baseline vs. modified normalized scores (0-100)</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={factorData} cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#FFFFFF", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#141414", border: "1px solid rgba(212,175,55,0.3)", color: "white" }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                  />
                  <Bar dataKey="baseline" fill="#9a9a9a" radius={[3, 3, 0, 0]} name="Baseline" />
                  <Bar dataKey="modified" fill="#D4AF37" radius={[3, 3, 0, 0]} name="Modified" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* H2H preview */}
            {result.sampleOpponentPrediction && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#00E1FF]" />
                  <h3 className="text-lg font-bold text-white">
                    Match Prediction vs <Flag code={opponentCode} size={20} /> {teams.find((t) => t.code === opponentCode)?.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <PredictionBlock
                    label="Baseline"
                    pA={result.sampleOpponentPrediction.baseline.pA}
                    pB={result.sampleOpponentPrediction.baseline.pB}
                    pD={result.sampleOpponentPrediction.baseline.pD}
                    expA={result.sampleOpponentPrediction.baseline.expA}
                    expB={result.sampleOpponentPrediction.baseline.expB}
                    color="#9a9a9a"
                  />
                  <PredictionBlock
                    label="Modified"
                    pA={result.sampleOpponentPrediction.modified.pA}
                    pB={result.sampleOpponentPrediction.modified.pB}
                    pD={result.sampleOpponentPrediction.modified.pD}
                    expA={result.sampleOpponentPrediction.modified.expA}
                    expB={result.sampleOpponentPrediction.modified.expB}
                    color="#D4AF37"
                  />
                </div>
              </div>
            )}

            {/* Modified team summary */}
            <div className="glass-gold rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-white">Modified Team Profile</h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
                <ProfileMetric label="ELO" value={result.modified.eloRating} color="#D4AF37" />
                <ProfileMetric label="Form" value={result.modified.formRating} color="#22c55e" />
                <ProfileMetric label="Attack" value={result.modified.attackRating} color="#ef4444" />
                <ProfileMetric label="Defense" value={result.modified.defenseRating} color="#06b6d4" />
                <ProfileMetric label="Midfield" value={result.modified.midfieldRating} color="#a855f7" />
                <ProfileMetric label="Value (M€)" value={result.modified.squadValue} color="#00E1FF" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

function SliderRow({
  label, value, min, max, step, onChange, color, suffix,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; color: string; suffix: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-[#9a9a9a]">{label}</label>
        <span className="text-sm font-semibold" style={{ color }}>
          {value} {suffix}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        style={{ ["--slider-color" as any]: color }}
        className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-[#D4AF37] [&_.bg-primary]:to-[#00E1FF]"
      />
    </div>
  );
}

function KpiCard({
  label, value, sub, color, icon,
}: {
  label: string; value: string; sub: string; color: string; icon?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">{label}</span>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-[#9a9a9a] mt-0.5">{sub}</div>
    </div>
  );
}

function PredictionBlock({
  label, pA, pB, pD, expA, expB, color,
}: {
  label: string; pA: number; pB: number; pD: number;
  expA: number; expB: number; color: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color }}>{label}</div>
      <div className="flex h-6 rounded-md overflow-hidden mb-3">
        <div className="bg-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#0B0B0B]" style={{ width: `${pA * 100}%` }}>
          {(pA * 100).toFixed(0)}%
        </div>
        <div className="bg-[#3a3a3a] flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${pD * 100}%` }}>
          {(pD * 100).toFixed(0)}%
        </div>
        <div className="bg-[#0066FF] flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${pB * 100}%` }}>
          {(pB * 100).toFixed(0)}%
        </div>
      </div>
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Expected Score</div>
        <div className="text-lg font-bold text-white">{expA.toFixed(1)} – {expB.toFixed(1)}</div>
      </div>
    </div>
  );
}

function ProfileMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mt-0.5">{label}</div>
    </div>
  );
}
