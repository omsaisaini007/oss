"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { runMonteCarloAsync, SimulationSummary } from "@/lib/simulator";
import { tournaments } from "@/lib/data/tournaments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dice5, Zap, Trophy, Activity, Clock, TrendingUp } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

const ITERATION_OPTIONS = [
  { value: 1000, label: "1,000" },
  { value: 10000, label: "10,000" },
  { value: 50000, label: "50,000" },
  { value: 100000, label: "100,000" },
];

const BAR_COLORS = ["#D4AF37", "#0066FF", "#00E1FF", "#22c55e", "#a855f7", "#ef4444", "#f97316", "#06b6d4"];

export function WorldCupSimulator() {
  const [year, setYear] = useState(2026);
  const [iterations, setIterations] = useState(10000);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationSummary | null>(null);
  const [progress, setProgress] = useState(0);

  const runSimulation = async () => {
    setRunning(true);
    setProgress(5);
    setResult(null);
    // Yield to UI before heavy computation
    await new Promise((r) => setTimeout(r, 30));
    try {
      const summary = await runMonteCarloAsync(year, iterations, (pct) => {
        setProgress(pct);
      });
      setResult(summary);
      setProgress(100);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setRunning(false);
      setTimeout(() => setProgress(0), 600);
    }
  };

  const topChampions = result?.championProbabilities.slice(0, 8) ?? [];
  const topFinal = result?.mostLikelyFinal;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a14]" id="simulator">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Dice5 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Monte Carlo Simulation Engine
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            World Cup <span className="text-blue-gradient">Simulator</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Run thousands of simulated World Cups using Poisson-distributed goal models and ELO-driven match outcomes. The aggregate winner frequencies reveal each team's true title odds.
          </p>
        </motion.div>

        {/* Control panel */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Year selector */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
                Tournament Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] text-white rounded-lg px-3 py-2.5 text-sm"
              >
                {tournaments.map((t) => (
                  <option key={t.year} value={t.year}>
                    {t.year} — {t.host} ({t.teams} teams)
                  </option>
                ))}
              </select>
            </div>

            {/* Iterations */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
                Number of Simulations
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ITERATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setIterations(opt.value)}
                    className={`text-xs font-medium px-2 py-2.5 rounded-lg transition-all ${
                      iterations === opt.value
                        ? "bg-[#D4AF37] text-[#0B0B0B] font-bold"
                        : "bg-[#0B0B0B] text-[#9a9a9a] hover:text-white border border-[rgba(255,255,255,0.1)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Run button */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
                Run Engine
              </label>
              <Button
                onClick={runSimulation}
                disabled={running}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] text-[#0B0B0B] font-bold hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all"
                size="lg"
              >
                {running ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-pulse" />
                    Simulating... {progress}%
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Run {iterations.toLocaleString()} Simulations
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="h-1.5 bg-[#0B0B0B] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#00E1FF]"
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Dice5 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                    Simulations Run
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {result.iterations.toLocaleString()}
                </div>
              </Card>
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                    Most Likely Champion
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#D4AF37]">
                  <Flag code={topChampions[0]?.team.code || ''} size={20} /> {topChampions[0]?.team.code}
                </div>
                <div className="text-xs text-[#9a9a9a]">
                  {topChampions[0]?.probability.toFixed(1)}% win rate
                </div>
              </Card>
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3.5 h-3.5 text-[#00E1FF]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                    Avg Goals / Match
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#00E1FF]">
                  {result.avgGoalsPerMatch.toFixed(2)}
                </div>
              </Card>
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                    Compute Time
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#22c55e]">
                  {result.executionTimeMs.toFixed(0)}ms
                </div>
              </Card>
            </div>

            {/* Champion probability bars */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-1">Champion Frequency</h3>
                <p className="text-xs text-[#9a9a9a] mb-4">
                  Title wins out of {result.iterations.toLocaleString()} simulations
                </p>
                <div className="space-y-3">
                  {topChampions.map((c, i) => (
                    <div key={c.team.code}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#9a9a9a] w-4">{i + 1}.</span>
                          <Flag code={c.team.code} size={20} />
                          <span className="text-sm font-medium text-white">{c.team.name}</span>
                          <span className="text-[10px] text-[#9a9a9a]">
                            ({c.titles} titles)
                          </span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: BAR_COLORS[i] }}>
                          {c.probability.toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-[#0B0B0B] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${BAR_COLORS[i]}80, ${BAR_COLORS[i]})`,
                            boxShadow: `0 0 8px ${BAR_COLORS[i]}80`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${c.probability}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most likely final */}
              <div className="glass-gold rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-lg font-bold text-white">Most Likely Final</h3>
                </div>
                {topFinal && topFinal.teamA && topFinal.teamB ? (
                  <>
                    <div className="flex items-center justify-between py-4">
                      <div className="text-center flex-1">
                        <div className="mb-1"><Flag code={topFinal.teamA.code} size={48} /></div>
                        <div className="text-sm font-semibold text-white">{topFinal.teamA.code}</div>
                        <div className="text-[10px] text-[#9a9a9a]">{topFinal.teamA.name}</div>
                      </div>
                      <div className="px-3">
                        <div className="text-xs text-[#D4AF37] font-bold">VS</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="mb-1"><Flag code={topFinal.teamB.code} size={48} /></div>
                        <div className="text-sm font-semibold text-white">{topFinal.teamB.code}</div>
                        <div className="text-[10px] text-[#9a9a9a]">{topFinal.teamB.name}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 glass rounded-lg text-center">
                      <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-1">
                        Final Probability
                      </div>
                      <div className="text-2xl font-bold text-[#D4AF37]">
                        {topFinal.probability.toFixed(2)}%
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-[#9a9a9a] text-sm py-6">
                    No final projection yet
                  </div>
                )}
              </div>
            </div>

            {/* Knockout bracket preview (sample) */}
            {result.sampleMatchLog && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#00E1FF]" />
                  <h3 className="text-lg font-bold text-white">Sample Tournament Path</h3>
                  <span className="text-[10px] text-[#9a9a9a]">(From one simulated run)</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                  {result.sampleMatchLog.slice(0, 16).map((m, i) => {
                    const teamA = topChampions.find((c) => c.team.code === m.teamA)?.team;
                    const teamB = topChampions.find((c) => c.team.code === m.teamB)?.team;
                    return (
                      <div key={i} className="glass rounded p-2 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white truncate">
                            {teamA && <Flag code={teamA.code} size={16} />} {m.goalsA}
                          </span>
                          <span className="text-[#9a9a9a]">–</span>
                          <span className="text-white truncate">
                            {m.goalsB} {teamB && <Flag code={teamB.code} size={16} />}
                          </span>
                        </div>
                        {m.winner && (
                          <div className="text-[10px] text-[#D4AF37] truncate flex items-center gap-1">
                            <Flag code={m.winner} size={12} />
                            <span>advances</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!result && !running && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🎲</div>
            <h3 className="text-lg font-bold text-white mb-2">Ready to Simulate</h3>
            <p className="text-sm text-[#9a9a9a] max-w-md mx-auto">
              Configure your simulation parameters above and click Run to begin. Results will display champion frequencies, projected finals, and a sample knockout bracket.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
