"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { teams } from "@/lib/data/teams";
import { getTeamByCode } from "@/lib/data/teams";
import {
  runMonteCarloV2Parallel,
  SimulationSummaryV2,
  TournamentSimulation,
  SimulatedMatch,
} from "@/lib/ml/simulator-v2";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dice5, Zap, Trophy, Activity, Clock, TrendingUp, Eye, Flame, Skull } from "lucide-react";
import { Flag } from "@/components/fifa/Flag";

const ITERATION_OPTIONS = [
  { value: 1000, label: "1,000" },
  { value: 10000, label: "10,000" },
  { value: 50000, label: "50,000" },
  { value: 100000, label: "100,000" },
];

const BAR_COLORS = ["#D4AF37", "#0066FF", "#00E1FF", "#22c55e", "#a855f7", "#ef4444", "#f97316", "#06b6d4"];

export function AdvancedSimulator() {
  const [iterations, setIterations] = useState(10000);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SimulationSummaryV2 | null>(null);
  const [useParallel, setUseParallel] = useState(true);

  const runSim = async () => {
    setRunning(true);
    setProgress(5);
    setResult(null);
    await new Promise((r) => setTimeout(r, 30));
    try {
      const summary = await runMonteCarloV2Parallel(
        2026,
        iterations,
        (pct) => setProgress(pct),
        useParallel ? undefined : 1,
        Date.now()
      );
      setResult(summary);
      setProgress(100);
    } catch (err) {
      console.error("Advanced simulation failed:", err);
    } finally {
      setRunning(false);
      setTimeout(() => setProgress(0), 600);
    }
  };

  const topChampions = result?.championProbabilities.slice(0, 8) ?? [];
  const sampleBracket = result?.sampleBracket;
  const sampleMatches = result?.sampleMatches ?? [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a14]" id="advanced-sim">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Dice5 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              v2 Monte Carlo · ET + Penalties + Parallel Web Workers
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Advanced <span className="text-blue-gradient">Simulator</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Production-grade simulation engine. Poisson-distributed exact scores from the calibrated Stacking Ensemble, Extra Time with reduced stamina, statistically accurate penalty shootouts, Dark Horse detection, Group of Death analysis, and tournament-wide covariance matrix.
          </p>
        </motion.div>

        {/* Control panel */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
                Simulations
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
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2 block">
                Execution Mode
              </label>
              <button
                onClick={() => setUseParallel(!useParallel)}
                className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  useParallel
                    ? "bg-[#0066FF]/20 text-[#00E1FF] border border-[#0066FF]/50"
                    : "bg-[#0B0B0B] text-[#9a9a9a] border border-[rgba(255,255,255,0.1)]"
                }`}
              >
                <Zap className="w-4 h-4" />
                {useParallel ? "Parallel (Web Workers)" : "Single-threaded"}
              </button>
            </div>
            <Button
              onClick={runSim}
              disabled={running}
              className="bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] text-[#0B0B0B] font-bold hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
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
                  Run {iterations.toLocaleString()} Sims
                </>
              )}
            </Button>
          </div>
          {progress > 0 && progress < 100 && (
            <div className="mt-4 h-1.5 bg-[#0B0B0B] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#00E1FF]"
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Dice5 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Simulations</span>
                </div>
                <div className="text-xl font-bold text-white">{result.iterations.toLocaleString()}</div>
              </Card>
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Champion</span>
                </div>
                <div className="text-xl font-bold text-[#D4AF37] flex items-center gap-2"><Flag code={topChampions[0]?.team.code || ''} size={22} /> {topChampions[0]?.team.code}</div>
                <div className="text-xs text-[#9a9a9a]">{topChampions[0]?.probability.toFixed(1)}%</div>
              </Card>
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3.5 h-3.5 text-[#00E1FF]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Goals/Match</span>
                </div>
                <div className="text-xl font-bold text-[#00E1FF]">{result.avgGoalsPerMatch.toFixed(2)}</div>
              </Card>
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-3.5 h-3.5 text-[#f97316]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Avg Upsets</span>
                </div>
                <div className="text-xl font-bold text-[#f97316]">{result.avgUpsetsPerTournament.toFixed(1)}</div>
              </Card>
              <Card className="glass p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Compute Time</span>
                </div>
                <div className="text-xl font-bold text-[#22c55e]">{result.executionTimeMs.toFixed(0)}ms</div>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Champion frequency */}
              <div className="lg:col-span-2 glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-1">Champion Frequency (Stacking Ensemble)</h3>
                <p className="text-xs text-[#9a9a9a] mb-4">
                  Win rate across {result.iterations.toLocaleString()} simulations · with ET + penalty shootouts
                </p>
                <div className="space-y-3">
                  {topChampions.map((c, i) => (
                    <div key={c.team.code}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#9a9a9a] w-4">{i + 1}.</span>
                          <Flag code={c.team.code} size={20} />
                          <span className="text-sm font-medium text-white">{c.team.name}</span>
                          <span className="text-[10px] text-[#9a9a9a]">({c.titles} wins)</span>
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

              {/* Dark Horse + Group of Death */}
              <div className="space-y-4">
                <div className="glass rounded-2xl p-5 border-l-2 border-l-[#f97316]">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-[#f97316]" />
                    <h3 className="text-base font-bold text-white">Dark Horse</h3>
                  </div>
                  <p className="text-[11px] text-[#9a9a9a] mb-3">Lowest-ranked team to reach QF</p>
                  {result.darkHorseStats.length > 0 ? (
                    <div className="space-y-2">
                      {result.darkHorseStats.map((dh, i) => (
                        <div key={i} className="flex items-center justify-between p-2 glass rounded-md">
                          <div className="flex items-center gap-2">
                            <Flag code={dh.team.code} size={20} />
                            <span className="text-sm text-white">{dh.team.name}</span>
                            <span className="text-[10px] text-[#9a9a9a]">#{dh.team.fifaRank}</span>
                          </div>
                          <span className="text-sm font-bold text-[#f97316]">{dh.frequency.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-[#9a9a9a]">No dark horse detected</div>
                  )}
                </div>

                <div className="glass rounded-2xl p-5 border-l-2 border-l-[#ef4444]">
                  <div className="flex items-center gap-2 mb-3">
                    <Skull className="w-4 h-4 text-[#ef4444]" />
                    <h3 className="text-base font-bold text-white">Group of Death</h3>
                  </div>
                  <p className="text-[11px] text-[#9a9a9a] mb-3">Toughest 4-team cluster by ELO</p>
                  {result.groupOfDeathFrequencies.length > 0 ? (
                    <div className="space-y-2">
                      {result.groupOfDeathFrequencies.map((god, i) => (
                        <div key={i} className="p-2 glass rounded-md">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {god.teams.map((code) => {
                              const team = getTeamByCode(code);
                              return team ? (
                                <span key={code} className="text-xs">
                                  <Flag code={team.code} size={18} /> {team.code}
                                </span>
                              ) : null;
                            })}
                          </div>
                          <div className="text-[10px] text-[#ef4444] font-bold">{god.frequency.toFixed(1)}% frequency</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-[#9a9a9a]">No Group of Death detected</div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Bracket */}
            {sampleBracket && (
              <BracketView bracket={sampleBracket} />
            )}

            {/* Covariance Matrix */}
            <CovarianceMatrixView covariance={result.covarianceMatrix} />
          </motion.div>
        )}

        {!result && !running && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-white mb-2">Ready to Run Advanced Simulation</h3>
            <p className="text-sm text-[#9a9a9a] max-w-md mx-auto mb-4">
              The v2 engine adds Extra Time, penalty shootouts, dark horse detection, Group of Death, and tournament-wide covariance. Default uses parallel Web Workers.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-2 py-1 glass-gold rounded text-[#D4AF37]">Poisson goals</span>
              <span className="px-2 py-1 glass-blue rounded text-[#00E1FF]">Extra Time</span>
              <span className="px-2 py-1 glass rounded text-[#22c55e]">Penalties</span>
              <span className="px-2 py-1 glass rounded text-[#a855f7]">Web Workers</span>
              <span className="px-2 py-1 glass rounded text-[#f97316]">Dark Horse</span>
              <span className="px-2 py-1 glass rounded text-[#ef4444]">Covariance</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Interactive Bracket Visualization
// ----------------------------------------------------------------------------

function BracketView({ bracket }: { bracket: TournamentSimulation }) {
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);
  // Group matches by round
  const rounds = useMemo(() => {
    const grouped: Record<string, SimulatedMatch[]> = {};
    bracket.matches.forEach((m) => {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    });
    return grouped;
  }, [bracket]);

  const roundOrder = ["Round of 16", "Quarter-final", "Semi-final", "Final"];
  const orderedRounds = roundOrder.filter((r) => rounds[r]);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="text-lg font-bold text-white">Sample Tournament Bracket</h3>
        <span className="text-[10px] text-[#9a9a9a]">(One simulated run)</span>
      </div>

      <div className="grid md:grid-cols-4 gap-3 overflow-x-auto">
        {orderedRounds.map((roundName, roundIdx) => (
          <div key={roundName}>
            <div className="text-xs uppercase tracking-wider text-[#D4AF37] mb-2 text-center">
              {roundName}
            </div>
            <div className="space-y-2">
              {rounds[roundName].map((match, mIdx) => {
                const flatIdx = roundIdx * 100 + mIdx;
                const teamA = getTeamByCode(match.teamA);
                const teamB = getTeamByCode(match.teamB);
                const isExpanded = expandedMatch === flatIdx;
                const aWon = match.winner === match.teamA;
                const bWon = match.winner === match.teamB;

                return (
                  <div
                    key={mIdx}
                    onClick={() => setExpandedMatch(isExpanded ? null : flatIdx)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isExpanded ? "glass-gold ring-1 ring-[#D4AF37]" : "glass hover:bg-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Flag code={teamA?.code || ''} size={20} />
                        <span className={`text-xs ${aWon ? "text-white font-bold" : "text-[#9a9a9a]"}`}>
                          {teamA?.code}
                        </span>
                      </div>
                      <span className={`text-sm font-mono ${aWon ? "text-[#D4AF37] font-bold" : "text-[#9a9a9a]"}`}>
                        {match.score90[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flag code={teamB?.code || ''} size={20} />
                        <span className={`text-xs ${bWon ? "text-white font-bold" : "text-[#9a9a9a]"}`}>
                          {teamB?.code}
                        </span>
                      </div>
                      <span className={`text-sm font-mono ${bWon ? "text-[#D4AF37] font-bold" : "text-[#9a9a9a]"}`}>
                        {match.score90[1]}
                      </span>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.1)] space-y-1 text-[10px]"
                      >
                        {match.scoreET && (
                          <div className="text-[#00E1FF]">
                            ET: {match.scoreET[0]} - {match.scoreET[1]}
                          </div>
                        )}
                        {match.penalties && (
                          <div className="text-[#D4AF37]">
                            Pens: {match.penalties[0]} - {match.penalties[1]}
                          </div>
                        )}
                        {match.isUpset && (
                          <div className="text-[#f97316] flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Upset ({match.upsetMagnitude.toFixed(0)} ELO diff)
                          </div>
                        )}
                        <div className="text-[#9a9a9a] flex items-center gap-1">Winner: <Flag code={match.winner} size={14} /> <span>{match.winner}</span></div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Champion callout */}
      <div className="mt-6 p-4 glass-gold rounded-xl flex items-center gap-4">
        <Trophy className="w-8 h-8 text-[#D4AF37]" />
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Tournament Champion</div>
          <div className="text-xl font-bold text-white">
            <Flag code={bracket.champion} size={32} /> {getTeamByCode(bracket.champion)?.name}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">Runner-up</div>
          <div className="text-sm font-semibold text-white">
            <Flag code={bracket.runnerUp} size={24} /> {getTeamByCode(bracket.runnerUp)?.name}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Covariance Matrix Heatmap
// ----------------------------------------------------------------------------

function CovarianceMatrixView({ covariance }: { covariance: { teamA: string; teamB: string; covariance: number }[] }) {
  // Get unique teams
  const teamCodes = Array.from(new Set([
    ...covariance.map((c) => c.teamA),
    ...covariance.map((c) => c.teamB),
  ]));

  // Build matrix
  const matrix: Record<string, Record<string, number>> = {};
  teamCodes.forEach((a) => {
    matrix[a] = {};
    teamCodes.forEach((b) => {
      if (a === b) {
        matrix[a][b] = 1; // self-covariance (variance)
      } else {
        const entry = covariance.find(
          (c) => (c.teamA === a && c.teamB === b) || (c.teamA === b && c.teamB === a)
        );
        matrix[a][b] = entry?.covariance ?? 0;
      }
    });
  });

  // Find max abs value for color scaling
  const maxAbs = Math.max(0.01, ...covariance.map((c) => Math.abs(c.covariance)));

  function getColor(value: number): string {
    if (value === 1) return "rgba(212, 175, 55, 0.3)"; // diagonal
    const intensity = Math.abs(value) / maxAbs;
    if (value > 0) return `rgba(34, 197, 94, ${intensity * 0.8})`; // green = positive cov
    return `rgba(239, 68, 68, ${intensity * 0.8})`; // red = negative cov
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-5 h-5 text-[#00E1FF]" />
        <h3 className="text-lg font-bold text-white">Tournament Covariance Matrix</h3>
      </div>
      <p className="text-xs text-[#9a9a9a] mb-4">
        Co-occurrence of QF appearances. Positive (green) = teams tend to advance together; Negative (red) = they eliminate each other.
      </p>

      <div className="overflow-x-auto">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-1"></th>
              {teamCodes.map((code) => (
                <th key={code} className="p-1 text-[#9a9a9a] font-medium">
                  <Flag code={code} size={20} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamCodes.map((rowCode) => (
              <tr key={rowCode}>
                <td className="p-1 text-[#9a9a9a] font-medium text-right pr-2">
                  <Flag code={rowCode} size={20} /> {rowCode}
                </td>
                {teamCodes.map((colCode) => {
                  const value = matrix[rowCode][colCode];
                  return (
                    <td
                      key={colCode}
                      className="p-1 text-center font-mono text-[10px] border border-[rgba(255,255,255,0.05)]"
                      style={{ background: getColor(value), color: Math.abs(value) > maxAbs * 0.5 ? "white" : "white" }}
                      title={`${rowCode} vs ${colCode}: ${value.toFixed(3)}`}
                    >
                      {value === 1 ? "—" : value.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-[10px] text-[#9a9a9a]">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[rgba(34,197,94,0.6)]" /> Positive cov
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[rgba(239,68,68,0.6)]" /> Negative cov
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[rgba(212,175,55,0.3)]" /> Self
        </div>
      </div>
    </div>
  );
}
